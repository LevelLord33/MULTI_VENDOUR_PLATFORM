import express from 'express';
import {
  getVendorConversations,
  getCustomerConversations,
  getConversationById,
  createOrGetConversation,
  sendMessage,
  markAsRead,
  updateConversationStatus,
  getVendorMessageStats
} from '../controllers/messageController.js';

const router = express.Router();

// Vendor Endpoints
router.get('/vendor/:vendorId', getVendorConversations);
router.get('/vendor/:vendorId/stats', getVendorMessageStats);

// Customer Endpoints
router.get('/customer/:customerId', getCustomerConversations);

// Conversation & Message Lifecycle
router.get('/conversation/:id', getConversationById);
router.post('/conversations', createOrGetConversation);
router.post('/conversations/:id/messages', sendMessage);
router.patch('/conversations/:id/read', markAsRead);
router.patch('/conversations/:id/status', updateConversationStatus);

export default router;
