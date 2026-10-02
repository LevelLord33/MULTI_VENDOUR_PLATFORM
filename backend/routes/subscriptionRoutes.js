import express from 'express';
import {
  subscribeToVendor,
  unsubscribeFromVendor,
  getMySubscriptions,
  updateNotificationPreferences,
  getVendorSubscribers,
  sendVendorUpdateToSubscribers
} from '../controllers/subscriptionController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Customer actions
router.post('/subscribe', requireAuth, subscribeToVendor);
router.post('/unsubscribe', requireAuth, unsubscribeFromVendor);
router.get('/my-subscriptions', requireAuth, getMySubscriptions);
router.patch('/:vendorId/preferences', requireAuth, updateNotificationPreferences);

// Vendor actions
router.get('/vendor/:vendorId/subscribers', requireAuth, getVendorSubscribers);
router.post('/vendor/:vendorId/send-update', requireAuth, sendVendorUpdateToSubscribers);

export default router;
