import express from 'express';
import {
  getStores,
  getFeaturedStores,
  getEmergingStores,
  getStoreCategories,
  getStoreSeoMetadata,
  submitVendorStorefront,
  getVendorStorefront,
  getAdminStorefronts,
  updateStorefrontApproval
} from '../controllers/storeController.js';

const router = express.Router();

// Public store discovery & search (Approved storefronts only)
router.get('/', getStores);
router.get('/featured', getFeaturedStores);
router.get('/emerging', getEmergingStores);
router.get('/categories', getStoreCategories);
router.get('/:slug/seo', getStoreSeoMetadata);

// Vendor Storefront Creation & Upload for Admin Permission
router.post('/vendor/:id/storefront', submitVendorStorefront);
router.get('/vendor/:id/storefront', getVendorStorefront);

// Admin Storefront Approvals & Permission Management
router.get('/admin/storefronts', getAdminStorefronts);
router.patch('/admin/:id/approval', updateStorefrontApproval);

export default router;
