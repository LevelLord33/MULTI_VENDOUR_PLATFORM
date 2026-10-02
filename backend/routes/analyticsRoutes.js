import express from 'express';
import {
  getVendorAnalytics,
  recordStoreVisit,
  exportVendorAnalyticsReport,
  recordExposure,
  getPlatformAnalytics,
  getVendorMonitoring,
  getVendorDeepDive,
  getCustomerUsage,
  getFairExposureMonitoring,
  getSubscriptionAnalytics,
  getCommunicationMonitoring,
  getActivityLogs
} from '../controllers/analyticsController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// ── Admin Platform Monitoring & Analytics (Role Guard: Admin) ──
router.get('/platform', requireAuth, authorizeRoles('admin'), getPlatformAnalytics);
router.get('/vendor-monitoring', requireAuth, authorizeRoles('admin'), getVendorMonitoring);
router.get('/vendor-monitoring/:vendorId', requireAuth, authorizeRoles('admin'), getVendorDeepDive);
router.get('/customer-usage', requireAuth, authorizeRoles('admin'), getCustomerUsage);
router.get('/fair-exposure', requireAuth, authorizeRoles('admin'), getFairExposureMonitoring);
router.get('/subscriptions', requireAuth, authorizeRoles('admin'), getSubscriptionAnalytics);
router.get('/communication-monitoring', requireAuth, authorizeRoles('admin'), getCommunicationMonitoring);
router.get('/activity-logs', requireAuth, authorizeRoles('admin'), getActivityLogs);

// ── Vendor Analytics & Exposure ──
router.get('/vendor/:vendorId', getVendorAnalytics);
router.post('/store-visit/:vendorId', recordStoreVisit);
router.post('/exposure', recordExposure);
router.get('/vendor/:vendorId/export', exportVendorAnalyticsReport);

export default router;
