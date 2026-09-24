import express from 'express';
import {
  raiseDispute,
  getCustomerDisputes,
  getVendorDisputes,
  submitVendorResponse,
  getAllDisputesAdmin,
  updateDisputeStatusAdmin,
  getDisputeById
} from '../controllers/disputeController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Customer endpoints
router.post('/', requireAuth, authorizeRoles('customer'), raiseDispute);
router.get('/my-disputes', requireAuth, authorizeRoles('customer'), getCustomerDisputes);

// Vendor endpoints
router.get('/vendor', requireAuth, authorizeRoles('vendor'), getVendorDisputes);
router.post('/:id/vendor-response', requireAuth, authorizeRoles('vendor', 'admin'), submitVendorResponse);

// Admin endpoints
router.get('/admin', requireAuth, authorizeRoles('admin'), getAllDisputesAdmin);
router.patch('/:id/status', requireAuth, authorizeRoles('admin'), updateDisputeStatusAdmin);

// Detailed dispute lookup (Authorized party)
router.get('/:id', requireAuth, getDisputeById);

export default router;
