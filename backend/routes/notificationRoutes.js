import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  createNotification
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, getNotifications);
router.patch('/:id/read', requireAuth, markNotificationRead);
router.patch('/read-all', requireAuth, markAllNotificationsRead);
router.post('/', requireAuth, createNotification);

export default router;
