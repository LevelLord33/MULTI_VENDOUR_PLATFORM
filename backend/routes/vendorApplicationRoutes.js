import express from 'express';
import {
  submitApplication,
  getApplications,
  getMyApplicationStatus,
  updateApplicationStatus
} from '../controllers/vendorApplicationController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitApplication);
router.get('/my-status', requireAuth, getMyApplicationStatus);
router.get('/', requireAuth, authorizeRoles('admin'), getApplications);
router.patch('/:id/status', requireAuth, authorizeRoles('admin'), updateApplicationStatus);

export default router;
