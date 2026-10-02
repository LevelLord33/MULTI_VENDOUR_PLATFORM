import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Notification from '../models/Notification.js';
import { seedOrders } from '../data/seedData.js';
import {
  emitNewOrderPlaced,
  emitLowStockAlert
} from '../socket/socketService.js';
import {
  createRazorpayGatewayOrder,
  verifyRazorpaySignature,
  isRazorpayConfigured
} from '../utils/razorpay.js';

// Hybrid in-memory order store fallback
let memOrders = [...seedOrders];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * 1. Create a Razorpay Order
 * POST /api/payment/razorpay/create-order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'A valid order amount greater than 0 is required.'
      });
    }

    const order = await createRazorpayGatewayOrder({
      amount: Number(amount),
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
      notes
    });

    return res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully.',
      orderId: order.orderId,
      amount: order.amount, // in paise
      currency: order.currency,
      receipt: order.receipt,
      keyId: order.keyId,
      isDemo: order.isDemo
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay payment order.',
      error: error.message
    });
  }
};

/**
 * 2. Verify Razorpay Payment Signature & finalize Order
 * POST /api/payment/razorpay/verify
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({
        success: false,
        message: 'razorpay_order_id and razorpay_payment_id are required for verification.'
      });
    }

    const isValid = verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.'
      });
    }

    const paymentDetails = {
      method: 'RAZORPAY',
      status: 'Paid',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || 'verified_sandbox_sig',
      amountToCollect: 0,
      paidAt: new Date().toISOString()
    };

    // If orderData is provided, construct and persist the order record
    if (orderData && Array.isArray(orderData.items) && orderData.items.length > 0) {
      const customerId = req.user?.id || orderData.customerId || 'c1';
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

      const initialTimeline = orderData.shipmentTimeline && orderData.shipmentTimeline.length > 0
        ? orderData.shipmentTimeline
        : [
            {
              status: 'Order Placed',
              timestamp: timestampStr,
              location: 'Customer Checkout',
              note: `Physical order placed & authorized via Razorpay Gateway (Txn ID: ${razorpay_payment_id}). Stock reserved.`
            },
            {
              status: 'Order Confirmed',
              timestamp: timestampStr,
              location: 'Vendor Store Dispatch Hub',
              note: 'Vendor confirmed physical items for packaging & barcode generation.'
            }
          ];

      const newOrder = {
        ...orderData,
        id: orderId,
        customerId,
        trackingNumber: trackingNo,
        status: 'Placed',
        paymentMethod: 'RAZORPAY',
        paymentStatus: 'Paid',
        shipmentTimeline: initialTimeline,
        paymentDetails,
        createdAt: formattedDate
      };

      if (isDbReady()) {
        try {
          const doc = new Order(newOrder);
          await doc.save();

          // Deduct inventory in MongoDB
          for (const item of orderData.items) {
            const qty = item.quantity || 1;
            const updatedProd = await Product.findOneAndUpdate(
              { id: item.productId },
              { $inc: { stock: -qty, quantity: -qty } },
              { new: true }
            );

            if (updatedProd && updatedProd.stock <= (updatedProd.lowStockThreshold || 5)) {
              emitLowStockAlert(item.vendorId, {
                productId: updatedProd.id,
                title: updatedProd.name,
                sku: updatedProd.sku,
                stock: updatedProd.stock,
                threshold: updatedProd.lowStockThreshold || 5
              });

              try {
                const lowStockNotif = new Notification({
                  id: `notif-stock-${Date.now()}-${updatedProd.id}`,
                  userId: item.vendorId,
                  type: 'low_stock',
                  title: `⚠️ Low Stock Alert: ${updatedProd.name}`,
                  message: `Inventory dropped to ${updatedProd.stock} units. Restock recommended.`,
                  link: '/vendor/inventory',
                  data: { productId: updatedProd.id, stock: updatedProd.stock }
                });
                await lowStockNotif.save();
              } catch (e) {}
            }
          }
        } catch (dbErr) {
          console.warn('DB order save note (Razorpay):', dbErr.message);
        }
      }

      memOrders.unshift(newOrder);

      // Real-time broadcast to vendor
      const targetVendorId = newOrder.vendorId || newOrder.items?.[0]?.vendorId;
      emitNewOrderPlaced(newOrder, targetVendorId);

      // Save persistent notifications to MongoDB
      if (isDbReady()) {
        try {
          if (targetVendorId) {
            const vendorNotif = new Notification({
              id: `notif-ord-${Date.now()}-v`,
              userId: targetVendorId,
              type: 'order_new',
              title: `🎉 Razorpay Order Received! #${orderId}`,
              message: `${orderData.items.length} item(s) totaling ₹${newOrder.total?.toLocaleString('en-IN')} paid online. Prepare dispatch.`,
              link: '/vendor/orders',
              data: { orderId }
            });
            await vendorNotif.save();
          }

          const customerNotif = new Notification({
            id: `notif-ord-${Date.now()}-c`,
            userId: customerId,
            type: 'order',
            title: `📦 Order #${orderId} Paid via Razorpay!`,
            message: `Your payment was captured successfully (Ref: ${razorpay_payment_id}). Merchant is packing your items.`,
            link: '/shop/orders',
            data: { orderId }
          });
          await customerNotif.save();
        } catch (e) {}
      }

      return res.status(200).json({
        success: true,
        message: 'Payment verified and order confirmed successfully.',
        order: newOrder,
        paymentDetails
      });
    }

    // If only verifying payment details
    return res.status(200).json({
      success: true,
      message: 'Payment signature verified successfully.',
      paymentDetails
    });
  } catch (error) {
    console.error('Error verifying Razorpay payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify Razorpay payment.',
      error: error.message
    });
  }
};

/**
 * 3. Retrieve Razorpay Public Configuration
 * GET /api/payment/razorpay/config
 */
export const getPaymentConfig = async (req, res) => {
  try {
    const isConfigured = isRazorpayConfigured();
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_demo_key';

    return res.status(200).json({
      success: true,
      keyId,
      isConfigured,
      currency: 'INR'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment configuration.',
      error: error.message
    });
  }
};

export default {
  createOrder,
  verifyPayment,
  getPaymentConfig
};
