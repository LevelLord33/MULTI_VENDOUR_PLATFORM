import express from 'express';
import {
  login,
  registerCustomer,
  registerVendor,
  getVendors,
  getVendorByIdOrSlug,
  checkSlugAvailability,
  updateCustomer,
  updateVendorStore,
  seedAuth
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Authentication
router.post('/login', login);
router.post('/register-customer', registerCustomer);
router.post('/register-vendor', registerVendor);

// Directory & Stores
router.get('/vendors', getVendors);
router.get('/vendors/:idOrSlug', getVendorByIdOrSlug);
router.get('/check-slug/:slug', checkSlugAvailability);

// Updates
router.put('/customer/:id', requireAuth, updateCustomer);
router.put('/vendor/:id/store', requireAuth, updateVendorStore);

// Seed
router.post('/seed', seedAuth);

export default router;
