import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { getIO } from '../socket/socketService.js';

let memNotifications = [];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * GET /api/notifications
 * Get authenticated user notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const queryIds = [userId];
    if (userRole === 'admin') queryIds.push('admin');

    let notifications = [];
    if (isDbReady()) {
      try {
        notifications = await Notification.find({ userId: { $in: queryIds } })
          .sort({ createdAt: -1 })
          .limit(50);
        notifications = notifications.map((n) => (n.toJSON ? n.toJSON() : n));
      } catch (e) {
        notifications = [];
      }
    }

    if (!notifications || notifications.length === 0) {
      notifications = memNotifications.filter((n) => queryIds.includes(n.userId));
    }

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.json({
      success: true,
      unreadCount,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/notifications/:id/read
 * Mark notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    let updated = null;

    if (isDbReady()) {
      try {
        updated = await Notification.findOneAndUpdate({ id }, { $set: { isRead: true } }, { new: true });
        if (updated) updated = updated.toJSON();
      } catch (e) {}
    }

    const idx = memNotifications.findIndex((n) => n.id === id);
    if (idx > -1) {
      memNotifications[idx].isRead = true;
      if (!updated) updated = memNotifications[idx];
    }

    return res.json({
      success: true,
      notification: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/notifications/read-all
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?.id;
    const queryIds = [userId];
    if (req.user?.role === 'admin') queryIds.push('admin');

    if (isDbReady()) {
      try {
        await Notification.updateMany({ userId: { $in: queryIds } }, { $set: { isRead: true } });
      } catch (e) {}
    }

    memNotifications.forEach((n) => {
      if (queryIds.includes(n.userId)) n.isRead = true;
    });

    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/notifications
 * Dispatch a notification to a user & broadcast via Socket.IO
 */
export const createNotification = async (req, res) => {
  try {
    const { userId, type, title, message, link, data } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ success: false, message: 'userId, title, and message are required' });
    }

    const notifId = 'notif-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newNotif = {
      id: notifId,
      userId,
      type: type || 'system',
      title,
      message,
      link: link || '',
      data: data || {},
      isRead: false,
      createdAt: new Date().toISOString()
    };

    if (isDbReady()) {
      try {
        const doc = new Notification(newNotif);
        await doc.save();
      } catch (e) {
        console.warn('DB notification save fallback:', e.message);
      }
    }

    memNotifications.unshift(newNotif);

    // Socket.IO Real-time broadcast
    const io = getIO();
    if (io) {
      io.to(`user_${userId}`).emit('new_notification', newNotif);
      if (userId === 'admin') {
        io.to('role_admin').emit('new_notification', newNotif);
      }
    }

    return res.status(201).json({ success: true, notification: newNotif });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
