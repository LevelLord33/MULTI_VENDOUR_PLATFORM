import express from 'express';
import {
  getBundles,
  getBundleById,
  createBundle,
  updateBundle,
  deleteBundle
} from '../controllers/bundleController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBundles);
router.get('/:id', getBundleById);
router.post('/', requireAuth, createBundle);
router.put('/:id', requireAuth, updateBundle);
router.delete('/:id', requireAuth, deleteBundle);

export default router;
