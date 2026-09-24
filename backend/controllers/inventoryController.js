import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import StockMovement from '../models/StockMovement.js';
import User from '../models/User.js';
import { seedProducts, seedOrders, seedVendors } from '../data/seedData.js';
import { emitInventoryUpdate, emitLowStockAlert } from '../socket/socketService.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback cache
let memStockMovements = [];
let memProductOverrides = new Map();

/**
 * Generate standard EAN-13 barcode based on product ID
 */
const generateBarcode = (productId = 'p1') => {
  const numPart = productId.replace(/\D/g, '') || '1';
  const padded = numPart.padStart(9, '0');
  const base12 = `890${padded}`; // 890 is India GS1 country code prefix
  // Compute checksum digit
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base12[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const checksum = (10 - (sum % 10)) % 10;
  return `${base12}${checksum}`;
};

/**
 * Seed initial stock movement history for demo
 */
const getInitialMovements = (vendorId) => {
  const vProducts = seedProducts.filter((p) => p.vendorId === vendorId);
  const sampleProds = vProducts.length > 0 ? vProducts : seedProducts.slice(0, 4);

  return sampleProds.flatMap((p, idx) => {
    const pStock = p.stock != null ? p.stock : 25;
    const pName = p.name || p.title;
    const pSku = p.sku || `SKU-${p.id.toUpperCase()}`;
    const pBarcode = generateBarcode(p.id);

    return [
      {
        id: `mov-init-${p.id}-1`,
        productId: p.id,
        productName: pName,
        sku: pSku,
        barcode: pBarcode,
        vendorId,
        type: 'restock',
        quantityDelta: pStock + 15,
        previousStock: 0,
        newStock: pStock + 15,
        reason: 'Initial Supplier Batch Received (PO-2024-849)',
        referenceId: 'PO-2024-849',
        performedBy: 'Rajesh Kumar (Warehouse Lead)',
        warehouseLocation: `Bin A-${(idx % 8) + 1}, Shelf ${(idx % 4) + 1}`,
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
      },
      {
        id: `mov-init-${p.id}-2`,
        productId: p.id,
        productName: pName,
        sku: pSku,
        barcode: pBarcode,
        vendorId,
        type: 'order_reservation',
        quantityDelta: -5,
        previousStock: pStock + 15,
        newStock: pStock + 10,
        reason: 'Committed for Marketplace Orders Fulfillment',
        referenceId: 'ORD-MULTI-901',
        performedBy: 'System Automation',
        warehouseLocation: `Bin A-${(idx % 8) + 1}, Shelf ${(idx % 4) + 1}`,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        id: `mov-init-${p.id}-3`,
        productId: p.id,
        productName: pName,
        sku: pSku,
        barcode: pBarcode,
        vendorId,
        type: 'adjustment',
        quantityDelta: pStock - (pStock + 10),
        previousStock: pStock + 10,
        newStock: pStock,
        reason: 'Cycle Count Audit & Dispatched Orders Reconciliation',
        referenceId: 'AUDIT-WK-38',
        performedBy: 'Warehouse Inventory Team',
        warehouseLocation: `Bin A-${(idx % 8) + 1}, Shelf ${(idx % 4) + 1}`,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ];
  });
};

/**
 * GET /api/inventory/summary/:vendorId
 * Retrieve executive inventory statistics, low-stock metrics & product inventory table
 */
export const getVendorInventorySummary = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search = '', status = 'all', category = 'All' } = req.query;

    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required' });
    }

    // 1. Fetch Vendor Products
    let products = [];
    if (isDbConnected()) {
      try {
        products = await Product.find({ vendorId }).lean();
      } catch (e) {
        console.warn('MongoDB inventory products fetch fallback:', e.message);
      }
    }
    if (!products || products.length === 0) {
      products = seedProducts.filter((p) => p.vendorId === vendorId);
      if (products.length === 0) products = seedProducts.slice(0, 8);
    }

    // Apply any in-memory overrides
    products = products.map((p) => {
      const overrides = memProductOverrides.get(p.id) || {};
      const stockVal = overrides.stock !== undefined ? overrides.stock : (p.stock != null ? p.stock : (p.quantity || 0));
      const lowThresh = overrides.lowStockThreshold !== undefined ? overrides.lowStockThreshold : (p.lowStockThreshold || 5);
      const barcodeVal = overrides.barcode !== undefined ? overrides.barcode : (p.barcode || generateBarcode(p.id));
      const binLoc = overrides.warehouseLocation !== undefined ? overrides.warehouseLocation : (p.warehouseLocation || `Bin A-${((p.id.charCodeAt(0) || 1) % 12) + 1}, Shelf 2`);
      const resStock = overrides.reservedStock !== undefined ? overrides.reservedStock : (p.reservedStock || Math.min(3, Math.max(0, Math.floor(stockVal * 0.15))));

      return {
        ...p,
        stock: stockVal,
        quantity: stockVal,
        lowStockThreshold: lowThresh,
        barcode: barcodeVal,
        warehouseLocation: binLoc,
        reservedStock: resStock,
        availableStock: Math.max(0, stockVal - resStock),
        stockHealth: stockVal === 0 ? 'Out of Stock' : stockVal <= lowThresh ? 'Low Stock' : 'Healthy'
      };
    });

    // 2. Compute Executive KPIs
    const totalSkus = products.length;
    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const totalValuation = products.reduce((sum, p) => sum + (p.price || 0) * (p.stock || 0), 0);
    const totalReservedUnits = products.reduce((sum, p) => sum + (p.reservedStock || 0), 0);
    const lowStockCount = products.filter((p) => p.stockHealth === 'Low Stock').length;
    const outOfStockCount = products.filter((p) => p.stockHealth === 'Out of Stock').length;
    const healthyStockCount = products.filter((p) => p.stockHealth === 'Healthy').length;

    // 3. Filter Table Items
    let filteredInventory = [...products];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      filteredInventory = filteredInventory.filter((p) =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.sku || '').toLowerCase().includes(q) ||
        (p.barcode || '').toLowerCase().includes(q) ||
        (p.warehouseLocation || '').toLowerCase().includes(q)
      );
    }

    if (status && status !== 'all') {
      if (status === 'low_stock') {
        filteredInventory = filteredInventory.filter((p) => p.stockHealth === 'Low Stock');
      } else if (status === 'out_of_stock') {
        filteredInventory = filteredInventory.filter((p) => p.stockHealth === 'Out of Stock');
      } else if (status === 'healthy') {
        filteredInventory = filteredInventory.filter((p) => p.stockHealth === 'Healthy');
      }
    }

    if (category && category !== 'All') {
      filteredInventory = filteredInventory.filter((p) =>
        (p.category || '').toLowerCase() === category.toLowerCase()
      );
    }

    const kpis = {
      totalSkus,
      totalStockUnits,
      totalInventoryUnits: totalStockUnits,
      totalValuation,
      totalAssetValuation: totalValuation,
      totalReservedUnits,
      lowStockCount,
      outOfStockCount,
      healthyStockCount
    };

    return res.json({
      success: true,
      kpis,
      kpi: kpis,
      data: {
        kpi: kpis,
        inventory: filteredInventory
      },
      inventory: filteredInventory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('getVendorInventorySummary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inventory summary',
      error: error.message
    });
  }
};

/**
 * POST /api/inventory/adjust
 * Adjust stock count (restock, damage, audit) & record immutable StockMovement audit log
 */
export const adjustInventoryStock = async (req, res) => {
  try {
    const {
      productId,
      vendorId,
      adjustmentType = 'restock', // 'restock' | 'damage_writeoff' | 'adjustment' | 'return_restock'
      quantityDelta,
      targetStock,
      reason,
      referenceId,
      performedBy = 'Vendor Operator',
      warehouseLocation
    } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'productId is required' });
    }

    // 1. Locate Product
    let product = null;
    if (isDbConnected()) {
      try {
        const isObjId = mongoose.isValidObjectId(productId);
        const query = isObjId ? { $or: [{ id: productId }, { _id: productId }] } : { id: productId };
        product = await Product.findOne(query);
      } catch (e) {
        console.warn('MongoDB adjust product fetch fallback:', e.message);
      }
    }
    if (!product) {
      product = seedProducts.find((p) => p.id === productId || String(p._id) === String(productId));
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product SKU not found' });
    }

    const previousStock = product.stock != null ? product.stock : (product.quantity || 0);
    let finalStock = previousStock;
    let delta = 0;

    if (targetStock !== undefined && targetStock !== null) {
      finalStock = Math.max(0, parseInt(targetStock, 10));
      delta = finalStock - previousStock;
    } else if (quantityDelta !== undefined && quantityDelta !== null) {
      delta = parseInt(quantityDelta, 10);
      finalStock = Math.max(0, previousStock + delta);
    } else {
      return res.status(400).json({ success: false, message: 'quantityDelta or targetStock must be provided' });
    }

    // 2. Persist to MongoDB or In-Memory
    if (isDbConnected() && product.save) {
      product.stock = finalStock;
      product.quantity = finalStock;
      if (warehouseLocation) product.warehouseLocation = warehouseLocation;
      await product.save();
    }

    // In-memory override map
    const existing = memProductOverrides.get(productId) || {};
    memProductOverrides.set(productId, {
      ...existing,
      stock: finalStock,
      quantity: finalStock,
      warehouseLocation: warehouseLocation || existing.warehouseLocation || product.warehouseLocation
    });

    // 3. Create StockMovement Audit Record
    const movementId = `mov-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const movementRecord = {
      id: movementId,
      productId,
      productName: product.name || product.title,
      sku: product.sku || `SKU-${productId.toUpperCase()}`,
      barcode: product.barcode || generateBarcode(productId),
      vendorId: vendorId || product.vendorId,
      type: adjustmentType,
      quantityDelta: delta,
      previousStock,
      newStock: finalStock,
      reason: reason || `${adjustmentType.replace('_', ' ').toUpperCase()} recorded by ${performedBy}`,
      referenceId: referenceId || `REF-${Date.now().toString().slice(-6)}`,
      performedBy,
      warehouseLocation: warehouseLocation || product.warehouseLocation || 'Warehouse Main',
      createdAt: new Date().toISOString()
    };

    if (isDbConnected()) {
      try {
        await StockMovement.create(movementRecord);
      } catch (dbErr) {
        console.warn('StockMovement DB create fallback:', dbErr.message);
      }
    }
    memStockMovements.unshift(movementRecord);

    const lowThresh = product.lowStockThreshold || 5;
    const isLowStock = finalStock > 0 && finalStock <= lowThresh;
    const isOutOfStock = finalStock === 0;

    // Real-time broadcast
    const targetVendorId = vendorId || product.vendorId;
    emitInventoryUpdate(targetVendorId, productId, finalStock, delta, movementRecord);
    if (isLowStock || isOutOfStock) {
      emitLowStockAlert(targetVendorId, {
        productId,
        title: product.title || product.name,
        sku: product.sku,
        stock: finalStock,
        currentStock: finalStock,
        threshold: lowThresh
      });
    }

    return res.json({
      success: true,
      message: `Stock updated successfully from ${previousStock} to ${finalStock} units`,
      updatedStock: finalStock,
      delta,
      movement: movementRecord,
      stockHealth: isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'Healthy'
    });
  } catch (error) {
    console.error('adjustInventoryStock Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to adjust inventory stock',
      error: error.message
    });
  }
};

/**
 * GET /api/inventory/movements/:vendorId
 * Retrieve chronological stock movement audit log
 */
export const getStockMovementHistory = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { productId, type, limit = 50, page = 1 } = req.query;

    let movements = [];
    if (isDbConnected()) {
      try {
        const filter = { vendorId };
        if (productId) filter.productId = productId;
        if (type) filter.type = type;

        movements = await StockMovement.find(filter)
          .sort({ createdAt: -1 })
          .limit(parseInt(limit, 10))
          .lean();
      } catch (e) {
        console.warn('MongoDB stock movement fetch fallback:', e.message);
      }
    }

    if (!movements || movements.length === 0) {
      // Merge memory and initial seeds
      const initial = getInitialMovements(vendorId);
      const combined = [...memStockMovements.filter((m) => m.vendorId === vendorId), ...initial];

      movements = combined.filter((m) => {
        if (productId && m.productId !== productId) return false;
        if (type && m.type !== type) return false;
        return true;
      });
    }

    return res.json({
      success: true,
      count: movements.length,
      movements
    });
  } catch (error) {
    console.error('getStockMovementHistory Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stock movement history',
      error: error.message
    });
  }
};

/**
 * GET /api/inventory/alerts/:vendorId
 * Retrieve urgent low-stock and out-of-stock items requiring replenishment
 */
export const getLowStockAlerts = async (req, res) => {
  try {
    const { vendorId } = req.params;

    // Use getVendorInventorySummary internally
    let summaryData = null;
    const mockRes = {
      json: (d) => { summaryData = d; return mockRes; },
      status: () => mockRes
    };

    await getVendorInventorySummary({ params: { vendorId }, query: {} }, mockRes);
    const inventory = summaryData?.inventory || [];

    const criticalItems = inventory
      .filter((p) => p.stockHealth === 'Low Stock' || p.stockHealth === 'Out of Stock')
      .map((p) => {
        const unitsSold = p.unitsSold || Math.max(1, (p.id.charCodeAt(0) % 10) + 2);
        const dailyVelocity = Number((unitsSold / 14).toFixed(1)) || 0.8;
        const daysLeft = dailyVelocity > 0 ? Math.round(p.availableStock / dailyVelocity) : 3;

        return {
          id: p.id,
          name: p.name || p.title,
          sku: p.sku,
          barcode: p.barcode,
          stock: p.stock,
          reservedStock: p.reservedStock,
          availableStock: p.availableStock,
          lowStockThreshold: p.lowStockThreshold,
          stockHealth: p.stockHealth,
          dailyVelocity,
          estimatedDaysRemaining: Math.max(0, daysLeft),
          recommendedRestockQuantity: Math.max(25, (p.lowStockThreshold || 5) * 4),
          warehouseLocation: p.warehouseLocation,
          image: p.image || p.images?.[0] || ''
        };
      });

    return res.json({
      success: true,
      alertsCount: criticalItems.length,
      alerts: criticalItems
    });
  } catch (error) {
    console.error('getLowStockAlerts Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock alerts',
      error: error.message
    });
  }
};

/**
 * PATCH /api/inventory/sku-barcode/:productId
 * Update barcode, SKU, warehouse bin location, and safety threshold
 */
export const updateSkuBarcode = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sku, barcode, warehouseLocation, lowStockThreshold, restockLeadDays } = req.body;

    let product = null;
    if (isDbConnected()) {
      try {
        const isObjId = mongoose.isValidObjectId(productId);
        const query = isObjId ? { $or: [{ id: productId }, { _id: productId }] } : { id: productId };
        product = await Product.findOne(query);
      } catch (e) {
        console.warn('MongoDB updateSkuBarcode fetch fallback:', e.message);
      }
    }
    if (!product) {
      product = seedProducts.find((p) => p.id === productId || String(p._id) === String(productId));
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product SKU not found' });
    }

    const updatedSku = sku ? sku.trim().toUpperCase() : (product.sku || `SKU-${productId.toUpperCase()}`);
    const updatedBarcode = barcode ? barcode.trim() : (product.barcode || generateBarcode(productId));
    const updatedLocation = warehouseLocation ? warehouseLocation.trim() : (product.warehouseLocation || 'Warehouse Main');
    const updatedThreshold = lowStockThreshold !== undefined ? parseInt(lowStockThreshold, 10) : (product.lowStockThreshold || 5);
    const updatedLead = restockLeadDays !== undefined ? parseInt(restockLeadDays, 10) : (product.restockLeadDays || 3);

    if (isDbConnected() && product.save) {
      product.sku = updatedSku;
      product.barcode = updatedBarcode;
      product.warehouseLocation = updatedLocation;
      product.lowStockThreshold = updatedThreshold;
      product.restockLeadDays = updatedLead;
      await product.save();
    }

    const existing = memProductOverrides.get(productId) || {};
    memProductOverrides.set(productId, {
      ...existing,
      sku: updatedSku,
      barcode: updatedBarcode,
      warehouseLocation: updatedLocation,
      lowStockThreshold: updatedThreshold,
      restockLeadDays: updatedLead
    });

    // Real-time broadcast
    emitInventoryUpdate(product.vendorId, productId, product.stock, 0, null);

    return res.json({
      success: true,
      message: 'Product SKU, Barcode, and Warehouse Bin updated',
      product: {
        id: productId,
        sku: updatedSku,
        barcode: updatedBarcode,
        warehouseLocation: updatedLocation,
        lowStockThreshold: updatedThreshold,
        restockLeadDays: updatedLead
      }
    });
  } catch (error) {
    console.error('updateSkuBarcode Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update barcode and SKU',
      error: error.message
    });
  }
};
