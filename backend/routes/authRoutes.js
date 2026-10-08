import express from 'express';
import {
  login,
  oauthLogin,
  getCurrentUser,
  registerCustomer,
  registerVendor,
  getVendors,
  getVendorByIdOrSlug,
  checkSlugAvailability,
  updateCustomer,
  updateVendorStore,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getFollowedVendors,
  followVendor,
  unfollowVendor,
  seedAuth,
  verifyRegistration,
  resendVerificationCode
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Authentication & OAuth
router.post('/login', login);
router.post('/oauth/google', oauthLogin);
router.post('/oauth', oauthLogin);
router.get('/me', requireAuth, getCurrentUser);
router.post('/register-customer', registerCustomer);
router.post('/register-vendor', registerVendor);
router.post('/verify-registration', verifyRegistration);
router.post('/resend-verification-code', resendVerificationCode);

// Directory & Stores
router.get('/vendors', getVendors);
router.get('/vendors/:idOrSlug', getVendorByIdOrSlug);
router.get('/check-slug/:slug', checkSlugAvailability);

// Updates
router.put('/customer/:id', requireAuth, updateCustomer);
router.put('/vendor/:id/store', requireAuth, updateVendorStore);

// Wishlist (Customer)
router.get('/wishlist', requireAuth, getWishlist);
router.post('/wishlist/:productId', requireAuth, addToWishlist);
router.delete('/wishlist/:productId', requireAuth, removeFromWishlist);

// Follow / Unfollow Vendors (Customer)
router.get('/following', requireAuth, getFollowedVendors);
router.post('/follow/:vendorId', requireAuth, followVendor);
router.delete('/follow/:vendorId', requireAuth, unfollowVendor);

// Seed
router.post('/seed', seedAuth);

export default router;
