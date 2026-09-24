import express from 'express';
import {
  getVendorPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
  validateCoupon,
  getPublicPromotions,
  updateFeaturedProducts
} from '../controllers/marketingController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/public', getPublicPromotions);
router.post('/validate-coupon', validateCoupon);

// Vendor & Admin protected routes
router.get('/vendor/:vendorId', getVendorPromotions);
router.post('/promotions', requireAuth, authorizeRoles('vendor', 'admin'), createPromotion);
router.put('/promotions/:id', requireAuth, authorizeRoles('vendor', 'admin'), updatePromotion);
router.delete('/promotions/:id', requireAuth, authorizeRoles('vendor', 'admin'), deletePromotion);
router.patch('/promotions/:id/toggle', requireAuth, authorizeRoles('vendor', 'admin'), togglePromotionStatus);
router.put('/featured-products', requireAuth, authorizeRoles('vendor', 'admin'), updateFeaturedProducts);

export default router;
