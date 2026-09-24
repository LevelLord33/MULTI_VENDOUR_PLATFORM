import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { seedOrders } from '../data/seedData.js';
import { emitOrderStatusUpdate, emitNewOrderPlaced } from '../socket/socketService.js';

// Hybrid in-memory order store for offline / development resilience
let memOrders = [...seedOrders];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * 1. Place a new order with stock reservation
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const customerId = req.user?.id || orderData.customerId || 'c1';

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required.'
      });
    }

    const orderId = orderData.id || ('ord' + Date.now());
    const trackingNo = orderData.trackingNumber || `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`;

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const timestampStr = now.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isCOD = orderData.paymentMethod === 'COD';
    const codOtp = isCOD
      ? (orderData.paymentDetails?.codOtp || String(Math.floor(1000 + Math.random() * 9000)))
      : null;

    const initialTimeline = orderData.shipmentTimeline && orderData.shipmentTimeline.length > 0
      ? orderData.shipmentTimeline
      : [
          {
            status: 'Order Placed',
            timestamp: timestampStr,
            location: 'Customer Checkout',
            note: isCOD
              ? `Physical order placed with Cash on Delivery. ₹${orderData.total} due upon delivery. Tamper-evident OTP: ${codOtp}.`
              : `Physical order placed & authorized via ${orderData.paymentMethod || 'Prepaid'}. Stock reserved.`
          },
          {
            status: 'Order Confirmed',
            timestamp: timestampStr,
            location: 'Vendor Store Dispatch Hub',
            note: isCOD
              ? 'Vendor confirmed physical items for packaging. COD collection note attached to courier waybill.'
              : 'Vendor confirmed physical items for packaging & barcode generation.'
          }
        ];

    const newOrder = {
      ...orderData,
      id: orderId,
      customerId,
      trackingNumber: trackingNo,
      status: orderData.status || 'Placed',
      shipmentTimeline: initialTimeline,
      paymentDetails: {
        ...orderData.paymentDetails,
        codOtp
      },
      createdAt: formattedDate
    };

    if (isDbReady()) {
      try {
        const doc = new Order(newOrder);
        await doc.save();

        // Deduct physical inventory in MongoDB
        for (const item of orderData.items) {
          const qty = item.quantity || 1;
          await Product.findOneAndUpdate(
            { id: item.productId },
            { $inc: { stock: -qty, quantity: -qty } }
          );
        }
      } catch (dbErr) {
        console.warn('DB order save note:', dbErr.message);
      }
    }

    memOrders.unshift(newOrder);

    // Real-time broadcast to vendor
    const targetVendorId = newOrder.vendorId || newOrder.items?.[0]?.vendorId;
    emitNewOrderPlaced(newOrder, targetVendorId);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully. Inventory reserved.',
      order: newOrder
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to place order.',
      error: error.message
    });
  }
};

/**
 * 2. Get Customer's Orders
 * GET /api/orders/customer/:customerId
 */
export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.params.customerId || req.user?.id;
    let orders = [];

    if (isDbReady()) {
      try {
        orders = await Order.find({ customerId }).sort({ createdAt: -1 });
        orders = orders.map((o) => (o.toJSON ? o.toJSON() : o));
      } catch {
        orders = [];
      }
    }

    if (!orders || orders.length === 0) {
      orders = memOrders.filter((o) => o.customerId === customerId);
    }

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer orders.',
      error: error.message
    });
  }
};

/**
 * 3. Get Vendor's Orders
 * GET /api/orders/vendor/:vendorId
 */
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.params.vendorId || req.user?.id;
    let orders = [];

    if (isDbReady()) {
      try {
        orders = await Order.find({ 'items.vendorId': vendorId }).sort({ createdAt: -1 });
        orders = orders.map((o) => (o.toJSON ? o.toJSON() : o));
      } catch {
        orders = [];
      }
    }

    if (!orders || orders.length === 0) {
      orders = memOrders.filter(
        (o) => o.items && o.items.some((item) => item.vendorId === vendorId)
      );
    }

    return res.json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch vendor orders.',
      error: error.message
    });
  }
};

/**
 * 4. Get Order By ID
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (isDbReady()) {
      try {
        order = await Order.findOne({ id });
        if (order) order = order.toJSON();
      } catch {
        order = null;
      }
    }

    if (!order) {
      order = memOrders.find((o) => o.id === id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    return res.json({
      success: true,
      order
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order.',
      error: error.message
    });
  }
};

/**
 * 5. Update Shipment Status
 * PATCH /api/orders/:id/status
 */
export const updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const nextStatus = req.body.nextStatus || req.body.status;
    const { location, note, courierPartner, trackingNumber } = req.body;

    const timestampStr = new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const timelineEvent = {
      status: nextStatus,
      timestamp: timestampStr,
      location: location || 'Hub / Logistics Delivery Facility',
      note: note || `Shipment advanced to ${nextStatus}.`
    };

    let updated = null;

    if (isDbReady()) {
      try {
        const order = await Order.findOne({ id });
        if (order) {
          order.status = nextStatus;
          if (courierPartner) order.courierPartner = courierPartner;
          if (trackingNumber) order.trackingNumber = trackingNumber;
          order.shipmentTimeline.push(timelineEvent);
          await order.save();
          updated = order.toJSON();
        }
      } catch {}
    }

    const idx = memOrders.findIndex((o) => o.id === id);
    if (idx > -1) {
      const o = memOrders[idx];
      o.status = nextStatus;
      if (courierPartner) o.courierPartner = courierPartner;
      if (trackingNumber) o.trackingNumber = trackingNumber;
      o.shipmentTimeline = [...(o.shipmentTimeline || []), timelineEvent];
      if (!updated) updated = o;
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Real-time broadcast to customer & vendor
    emitOrderStatusUpdate(id, updated, updated.customerId, updated.vendorId);

    return res.json({
      success: true,
      message: `Shipment advanced to ${nextStatus}.`,
      order: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update shipment status.',
      error: error.message
    });
  }
};

/**
 * 6. Request Return / Replacement (Customer)
 * POST /api/orders/:id/return
 */
export const requestReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, requestedAction, note } = req.body;

    const returnReq = {
      status: 'pending',
      reason,
      requestedAction: requestedAction || 'replacement',
      note: note || '',
      requestedAt: new Date().toISOString().split('T')[0],
      vendorNote: null,
      resolvedAt: null
    };

    let updated = null;

    if (isDbReady()) {
      try {
        const order = await Order.findOne({ id });
        if (order) {
          order.returnRequest = returnReq;
          await order.save();
          updated = order.toJSON();
        }
      } catch {}
    }

    const idx = memOrders.findIndex((o) => o.id === id);
    if (idx > -1) {
      memOrders[idx].returnRequest = returnReq;
      if (!updated) updated = memOrders[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: 'Return request submitted to merchant.',
      order: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to submit return request.',
      error: error.message
    });
  }
};

/**
 * 7. Resolve Return / Replacement (Vendor)
 * PATCH /api/orders/:id/return
 */
export const resolveReturn = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution, vendorNote } = req.body;

    let updated = null;

    if (isDbReady()) {
      try {
        const order = await Order.findOne({ id });
        if (order && order.returnRequest) {
          order.returnRequest.status = resolution;
          order.returnRequest.vendorNote = vendorNote || '';
          order.returnRequest.resolvedAt = new Date().toISOString().split('T')[0];
          await order.save();
          updated = order.toJSON();
        }
      } catch {}
    }

    const idx = memOrders.findIndex((o) => o.id === id);
    if (idx > -1 && memOrders[idx].returnRequest) {
      memOrders[idx].returnRequest.status = resolution;
      memOrders[idx].returnRequest.vendorNote = vendorNote || '';
      memOrders[idx].returnRequest.resolvedAt = new Date().toISOString().split('T')[0];
      if (!updated) updated = memOrders[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order or return request not found.' });
    }

    return res.json({
      success: true,
      message: `Return request ${resolution}.`,
      order: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to resolve return request.',
      error: error.message
    });
  }
};

/**
 * 8. Create Product Support Ticket
 * POST /api/orders/:id/support-tickets
 */
export const createProductSupportTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId, productName, issueType, message } = req.body;

    const newTicket = {
      id: `tkt-${Date.now()}`,
      productId,
      productName: productName || 'Product',
      issueType: issueType || 'General Product Inquiry',
      message: message || '',
      status: 'Open',
      date: new Date().toISOString().split('T')[0]
    };

    let updated = null;

    if (isDbReady()) {
      try {
        const order = await Order.findOne({ id });
        if (order) {
          order.supportTickets.push(newTicket);
          await order.save();
          updated = order.toJSON();
        }
      } catch {}
    }

    const idx = memOrders.findIndex((o) => o.id === id);
    if (idx > -1) {
      memOrders[idx].supportTickets = [...(memOrders[idx].supportTickets || []), newTicket];
      if (!updated) updated = memOrders[idx];
    }

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.status(201).json({
      success: true,
      message: 'Support ticket logged.',
      ticket: newTicket,
      order: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create support ticket.',
      error: error.message
    });
  }
};

/**
 * 9. Seed Orders
 * POST /api/orders/seed
 */
export const seedOrdersCatalog = async (req, res) => {
  try {
    if (!isDbReady()) {
      return res.json({
        success: true,
        message: `Running in hybrid mode. (${memOrders.length} orders in memory).`,
        count: memOrders.length
      });
    }

    const count = await Order.countDocuments();
    if (count > 0 && req.query.force !== 'true') {
      return res.json({
        success: true,
        message: `Orders already seeded (${count} orders found).`,
        count
      });
    }

    if (req.query.force === 'true') {
      await Order.deleteMany({});
    }

    await Order.insertMany(seedOrders);
    const total = await Order.countDocuments();

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${total} orders into MongoDB Atlas.`,
      count: total
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed orders.',
      error: error.message
    });
  }
};
