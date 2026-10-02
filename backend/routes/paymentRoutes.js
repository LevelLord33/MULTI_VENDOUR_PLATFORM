import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentConfig
} from '../controllers/paymentController.js';

const router = express.Router();

// Optional user context extractor without blocking guest checkouts
const optionalAuth = (req, res, next) => {
  const headerUserId = req.headers['x-user-id'];
  const headerUserRole = req.headers['x-user-role'];
  const headerUserName = req.headers['x-user-name'];

  if (headerUserId) {
    req.user = {
      id: headerUserId,
      role: (headerUserRole || 'customer').toLowerCase(),
      name: headerUserName || 'Customer'
    };
  }
  next();
};

// 1. Create Razorpay order
router.post('/razorpay/create-order', optionalAuth, createOrder);

// 2. Verify payment signature & finalize order
router.post('/razorpay/verify', optionalAuth, verifyPayment);

// 3. Get Razorpay key & configuration
router.get('/razorpay/config', getPaymentConfig);

export default router;
