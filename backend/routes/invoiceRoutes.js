import express from 'express';
import {
  getInvoices,
  getInvoiceById,
  generateInvoice,
  sendInvoiceDelivery,
  getTwilioStatus
} from '../controllers/invoiceController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Twilio Gateway Operational Status (Admin Only)
router.get('/twilio-status', requireAuth, authorizeRoles('admin'), getTwilioStatus);

// List invoices (Role-scoped: Customer, Vendor, Admin)
router.get('/', requireAuth, getInvoices);

// Retrieve single invoice by ID, Invoice Number, or Order ID
router.get('/:id', requireAuth, getInvoiceById);

// Generate invoice explicitly for an order
router.post('/generate/:orderId', requireAuth, generateInvoice);

// Dispatch Twilio SMS / WhatsApp for an invoice
router.post('/:id/send-delivery', requireAuth, sendInvoiceDelivery);

export default router;
