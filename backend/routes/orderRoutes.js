import express from 'express';
import {
  createOrder,
  getCustomerOrders,
  getVendorOrders,
  getOrderById,
  updateShipmentStatus,
  requestReturn,
  resolveReturn,
  createProductSupportTicket,
  seedOrdersCatalog
} from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Order creation & lookup
router.post('/', requireAuth, createOrder);
router.get('/customer/:customerId', requireAuth, getCustomerOrders);
router.get('/vendor/:vendorId', requireAuth, getVendorOrders);
router.get('/:id', requireAuth, getOrderById);

// Fulfillment & Post-purchase lifecycle
router.put('/:id/status', requireAuth, updateShipmentStatus);
router.patch('/:id/status', requireAuth, updateShipmentStatus);
router.post('/:id/return', requireAuth, requestReturn);
router.patch('/:id/return', requireAuth, resolveReturn);
router.post('/:id/support-tickets', requireAuth, createProductSupportTicket);

// Seeding
router.post('/seed', seedOrdersCatalog);

export default router;
