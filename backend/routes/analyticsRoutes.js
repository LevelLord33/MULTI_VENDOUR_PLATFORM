import express from 'express';
import {
  getVendorAnalytics,
  recordStoreVisit,
  exportVendorAnalyticsReport
} from '../controllers/analyticsController.js';

const router = express.Router();

// Retrieve vendor growth & analytics metrics
router.get('/vendor/:vendorId', getVendorAnalytics);

// Record storefront visits & impressions
router.post('/store-visit/:vendorId', recordStoreVisit);

// Export CSV report
router.get('/vendor/:vendorId/export', exportVendorAnalyticsReport);

export default router;
