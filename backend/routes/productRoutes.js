import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  updateProductStock,
  addProductReview,
  addProductInquiry,
  answerProductInquiry,
  seedProductsCatalog,
  compareProducts
} from '../controllers/productController.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Catalog query & comparison
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/compare', compareProducts);

// Product creation & modification (Vendor)
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

// Warehouse inventory updates
router.patch('/:id/stock', requireAuth, updateProductStock);

// Administrative Verification (Admin)
router.patch('/:id/status', requireAuth, authorizeRoles('admin'), updateProductStatus);

// Customer engagement (Reviews & Inquiries)
router.post('/:id/reviews', requireAuth, addProductReview);
router.post('/:id/inquiries', requireAuth, addProductInquiry);
router.patch('/:id/inquiries/:inquiryId', requireAuth, answerProductInquiry);

// Seeding
router.post('/seed', seedProductsCatalog);

export default router;
