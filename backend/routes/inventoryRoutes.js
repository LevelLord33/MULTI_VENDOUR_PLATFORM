import express from 'express';
import {
  getVendorInventorySummary,
  adjustInventoryStock,
  getStockMovementHistory,
  getLowStockAlerts,
  updateSkuBarcode
} from '../controllers/inventoryController.js';

const router = express.Router();

// Inventory KPI summary & SKU table
router.get('/summary/:vendorId', getVendorInventorySummary);

// Stock adjustments (restock, damage, audit)
router.post('/adjust', adjustInventoryStock);

// Stock movement audit history log
router.get('/movements/:vendorId', getStockMovementHistory);

// Urgent low-stock alerts
router.get('/alerts/:vendorId', getLowStockAlerts);

// Update SKU, barcode & warehouse location (supports both PUT and PATCH)
router.put('/sku-barcode/:productId', updateSkuBarcode);
router.patch('/sku-barcode/:productId', updateSkuBarcode);

export default router;
