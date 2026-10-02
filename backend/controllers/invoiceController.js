import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { generateGstInvoice } from '../utils/invoiceGenerator.js';
import { sendInvoiceCommunication, getTwilioOperationalStatus } from '../utils/twilioService.js';
import { logActivity } from '../utils/activityLogger.js';
import { seedOrders, seedVendors, seedCustomers } from '../data/seedData.js';

const isDbReady = () => mongoose.connection.readyState === 1;

// In-memory fallback cache
const memInvoices = [];

/**
 * Helper: ensure an Invoice document exists for an order
 */
export const buildOrGetInvoiceForOrder = async (orderId) => {
  if (isDbReady()) {
    try {
      const existing = await Invoice.findOne({ orderId }).lean();
      if (existing) return existing;
    } catch (e) {}
  }

  const inMemExisting = memInvoices.find((inv) => inv.orderId === orderId);
  if (inMemExisting) return inMemExisting;

  // Find order
  let order = null;
  if (isDbReady()) {
    try {
      order = await Order.findOne({ id: orderId }).lean();
    } catch (e) {}
  }
  if (!order) {
    order = seedOrders.find((o) => o.id === orderId);
  }
  if (!order) return null;

  // Resolve Vendor
  const vendorId = order.vendorId || order.items?.[0]?.vendorId;
  let vendor = null;
  if (isDbReady() && vendorId) {
    try {
      vendor = await User.findOne({ id: vendorId, type: 'vendor' }).lean();
    } catch (e) {}
  }
  if (!vendor) {
    vendor = seedVendors.find((v) => v.id === vendorId) || {
      id: vendorId || 'v1',
      businessName: order.items?.[0]?.vendorName || 'Verified Merchant Store',
      gstin: '07AABCT1234F1Z8',
      location: 'New Delhi, Delhi'
    };
  }

  // Resolve Customer
  let customer = null;
  if (isDbReady() && order.customerId) {
    try {
      customer = await User.findOne({ id: order.customerId }).lean();
    } catch (e) {}
  }
  if (!customer) {
    customer = seedCustomers.find((c) => c.id === order.customerId) || {
      id: order.customerId || 'c1',
      fullName: order.shippingAddress?.fullName || 'Customer',
      mobile: order.shippingAddress?.phone || '+91 98765 43210',
      email: 'customer@vendorhub.in'
    };
  }

  // Generate structured GST invoice
  const gstData = generateGstInvoice(order, vendor, customer);
  if (!gstData) return null;

  const invoiceDoc = {
    id: `inv_${order.id}`,
    invoiceNumber: gstData.invoiceNumber,
    orderId: order.id,
    customerId: order.customerId,
    vendorId: vendor.id || vendorId,

    vendorBusinessName: gstData.vendor.name,
    vendorGstin: gstData.vendor.gstin,
    vendorAddress: gstData.vendor.address,
    vendorCity: gstData.vendor.city,
    vendorState: gstData.vendor.state,
    vendorPhone: gstData.vendor.phone,
    vendorEmail: gstData.vendor.email,

    customerName: gstData.customer.name,
    customerEmail: gstData.customer.email,
    customerPhone: gstData.customer.phone,
    customerAddress: gstData.customer.address,
    customerCity: gstData.customer.city,
    customerState: gstData.customer.state,
    customerPincode: gstData.customer.pincode,

    items: gstData.items,
    subtotal: gstData.totals.subtotalTaxable,
    discount: 0,
    tax: gstData.totals.totalGst,
    shipping: gstData.totals.shippingCharges,
    grandTotal: gstData.totals.grandTotal,
    amountInWords: gstData.totals.amountInWords,

    paymentMethod: gstData.payment.method,
    paymentStatus: gstData.payment.status,
    orderReference: gstData.payment.transactionRef,
    invoiceDate: gstData.invoiceDate,
    deliveryStatus: 'pending',
    deliveryLog: []
  };

  if (isDbReady()) {
    try {
      const created = await Invoice.create(invoiceDoc);
      await logActivity({
        action: 'invoice_generated',
        actorId: customer.id || 'system',
        actorRole: 'system',
        targetType: 'invoice',
        targetId: invoiceDoc.invoiceNumber,
        title: `Digital Tax Invoice #${invoiceDoc.invoiceNumber} created`,
        details: {
          orderId: order.id,
          amount: invoiceDoc.grandTotal,
          vendor: invoiceDoc.vendorBusinessName
        }
      });
      return created.toJSON();
    } catch (e) {
      console.warn('MongoDB Invoice insert fallback:', e.message);
    }
  }

  memInvoices.unshift(invoiceDoc);
  return invoiceDoc;
};

/**
 * 1. Get Invoices List (Scoped by role)
 * GET /api/invoices
 */
export const getInvoices = async (req, res) => {
  try {
    const userRole = req.user?.role || 'customer';
    const userId = req.user?.id;
    const { search, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'vendor') {
      query.vendorId = userId;
    }
    // Admin has access to all platform invoices

    if (status && status !== 'all') {
      query.deliveryStatus = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { vendorBusinessName: { $regex: search, $options: 'i' } }
      ];
    }

    let invoices = [];
    let totalCount = 0;

    if (isDbReady()) {
      try {
        totalCount = await Invoice.countDocuments(query);
        invoices = await Invoice.find(query)
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .lean();
      } catch (e) {
        console.warn('MongoDB invoices fetch fallback:', e.message);
      }
    }

    // Fallback / seed if empty
    if (!invoices || invoices.length === 0) {
      // Ensure seed orders have generated invoices
      for (const ord of seedOrders.slice(0, 10)) {
        if (!memInvoices.some((inv) => inv.orderId === ord.id)) {
          await buildOrGetInvoiceForOrder(ord.id);
        }
      }
      let filtered = [...memInvoices];
      if (userRole === 'customer') filtered = filtered.filter((i) => i.customerId === userId);
      if (userRole === 'vendor') filtered = filtered.filter((i) => i.vendorId === userId);
      if (status && status !== 'all') filtered = filtered.filter((i) => i.deliveryStatus === status);
      totalCount = filtered.length;
      invoices = filtered.slice((page - 1) * limit, page * limit);
    }

    return res.json({
      success: true,
      invoices,
      totalCount,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Get Single Invoice by ID, OrderID, or InvoiceNumber
 * GET /api/invoices/:id
 */
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user?.role || 'customer';
    const userId = req.user?.id;

    let invoice = null;

    if (isDbReady()) {
      try {
        invoice = await Invoice.findOne({
          $or: [{ id }, { invoiceNumber: id }, { orderId: id }]
        }).lean();
      } catch (e) {}
    }

    if (!invoice) {
      invoice = memInvoices.find(
        (i) => i.id === id || i.invoiceNumber === id || i.orderId === id
      );
    }

    // Auto-generate if not yet existing for this order
    if (!invoice) {
      invoice = await buildOrGetInvoiceForOrder(id);
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    // Verify Access Permissions
    if (userRole === 'customer' && invoice.customerId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied to this invoice.' });
    }
    if (userRole === 'vendor' && invoice.vendorId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied to this invoice.' });
    }

    return res.json({
      success: true,
      invoice
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Generate or Regulate Invoice for Order
 * POST /api/invoices/generate/:orderId
 */
export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const invoice = await buildOrGetInvoiceForOrder(orderId);

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Could not generate invoice for order.' });
    }

    return res.status(201).json({
      success: true,
      message: 'Digital Tax Invoice generated successfully.',
      invoice
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Dispatch Invoice via Twilio (SMS / WhatsApp)
 * POST /api/invoices/:id/send-delivery
 */
export const sendInvoiceDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { channel = 'both', recipientPhone } = req.body;
    const userRole = req.user?.role || 'customer';
    const userId = req.user?.id;

    let invoice = null;
    if (isDbReady()) {
      invoice = await Invoice.findOne({
        $or: [{ id }, { invoiceNumber: id }, { orderId: id }]
      });
    }

    if (!invoice) {
      const inMem = memInvoices.find(
        (i) => i.id === id || i.invoiceNumber === id || i.orderId === id
      );
      if (inMem) invoice = inMem;
    }

    if (!invoice) {
      invoice = await buildOrGetInvoiceForOrder(id);
    }

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found.' });
    }

    // Role check
    if (userRole === 'customer' && invoice.customerId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }
    if (userRole === 'vendor' && invoice.vendorId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Send via Twilio
    const deliveryResult = await sendInvoiceCommunication({
      invoice,
      recipientPhone: recipientPhone || invoice.customerPhone,
      channel
    });

    // Update Invoice record
    invoice.deliveryStatus = deliveryResult.overallStatus;
    if (!invoice.deliveryLog) invoice.deliveryLog = [];
    invoice.deliveryLog.push(...deliveryResult.results);

    if (isDbReady() && typeof invoice.save === 'function') {
      await invoice.save();
    } else {
      const idx = memInvoices.findIndex((i) => i.id === invoice.id || i.invoiceNumber === invoice.invoiceNumber);
      if (idx !== -1) memInvoices[idx] = { ...invoice };
      else memInvoices.unshift({ ...invoice });
    }

    return res.json({
      success: true,
      message: `Invoice notification dispatched via ${channel.toUpperCase()}.`,
      deliveryStatus: invoice.deliveryStatus,
      results: deliveryResult.results
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Get Twilio Gateway Operational Status (Admin Only)
 * GET /api/invoices/twilio-status
 */
export const getTwilioStatus = async (req, res) => {
  try {
    const status = getTwilioOperationalStatus();
    return res.json({
      success: true,
      twilio: status
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
