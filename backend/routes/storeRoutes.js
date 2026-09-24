import express from 'express';
import {
  getStores,
  getFeaturedStores,
  getEmergingStores,
  getStoreCategories,
  getStoreSeoMetadata
} from '../controllers/storeController.js';

const router = express.Router();

// Public store discovery & search
router.get('/', getStores);
router.get('/featured', getFeaturedStores);
router.get('/emerging', getEmergingStores);
router.get('/categories', getStoreCategories);
router.get('/:slug/seo', getStoreSeoMetadata);

export default router;
