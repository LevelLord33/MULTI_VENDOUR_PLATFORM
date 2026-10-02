import mongoose from 'mongoose';
import Bundle from '../models/Bundle.js';
import Product from '../models/Product.js';
import { seedProducts, seedVendors } from '../data/seedData.js';

let memBundles = [
  {
    id: 'bnd-101',
    vendorId: 'v1',
    vendorName: 'TechZone Electronics',
    title: 'Ultimate Pro Audio & Studio Combo',
    description: 'Get the flagship Sony WH-1000XM5 headphones paired with ergonomic desktop headphone stand and fast wireless charger.',
    badgeText: 'BESTSELLER COMBO',
    items: [
      {
        productId: 'p3',
        quantity: 1,
        name: 'Sony WH-1000XM5 Headphones',
        sku: 'VM-ELEC-P3-SON',
        price: 29990,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
        category: 'Electronics'
      },
      {
        productId: 'p2',
        quantity: 1,
        name: 'Logitech MX Master 3S Mouse',
        sku: 'VM-ELEC-P2-LOG',
        price: 8995,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
        category: 'Electronics'
      }
    ],
    discountType: 'percentage',
    discountValue: 15,
    originalPrice: 38985,
    bundlePrice: 33137,
    savingsAmount: 5848,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=500&fit=crop',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2026-09-01'
  },
  {
    id: 'bnd-102',
    vendorId: 'v2',
    vendorName: 'StyleHub Fashion',
    title: 'Executive Linen Ensemble Bundle',
    description: "Complete formal wardrobe bundle including Men's Pure Linen Shirt and Handcrafted Leather Oxford Shoes.",
    badgeText: 'FESTIVE COMBO',
    items: [
      {
        productId: 'p11',
        quantity: 1,
        name: "Men's Slim Fit Linen Shirt",
        sku: 'VM-FASH-P11-LIN',
        price: 2499,
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop',
        category: 'Fashion'
      },
      {
        productId: 'p14',
        quantity: 1,
        name: 'Handcrafted Leather Oxford Shoes',
        sku: 'VM-FASH-P14-OXF',
        price: 5499,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
        category: 'Fashion'
      }
    ],
    discountType: 'percentage',
    discountValue: 20,
    originalPrice: 7998,
    bundlePrice: 6398,
    savingsAmount: 1600,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&h=500&fit=crop',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    createdAt: '2026-09-05'
  }
];

const isDbReady = () => mongoose.connection.readyState === 1;

/**
 * GET /api/bundles
 * Retrieve active product bundles (filter by vendorId, status)
 */
export const getBundles = async (req, res) => {
  try {
    const { vendorId, status = 'active' } = req.query;

    let bundles = [];
    if (isDbReady()) {
      try {
        const query = {};
        if (vendorId) query.vendorId = vendorId;
        if (status && status !== 'all') query.status = status;

        bundles = await Bundle.find(query).sort({ createdAt: -1 });
        bundles = bundles.map((b) => (b.toJSON ? b.toJSON() : b));
      } catch (e) {
        bundles = [];
      }
    }

    if (!bundles || bundles.length === 0) {
      bundles = memBundles.filter((b) => {
        const matchesVendor = !vendorId || b.vendorId === vendorId;
        const matchesStatus = !status || status === 'all' || b.status === status;
        return matchesVendor && matchesStatus;
      });
    }

    return res.json({
      success: true,
      count: bundles.length,
      bundles
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/bundles/:id
 * Retrieve single bundle
 */
export const getBundleById = async (req, res) => {
  try {
    const { id } = req.params;
    let bundle = null;

    if (isDbReady()) {
      try {
        bundle = await Bundle.findOne({ id });
        if (bundle) bundle = bundle.toJSON();
      } catch (e) {}
    }

    if (!bundle) {
      bundle = memBundles.find((b) => b.id === id);
    }

    if (!bundle) {
      return res.status(404).json({ success: false, message: 'Bundle deal not found' });
    }

    return res.json({ success: true, bundle });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/bundles
 * Create a new product bundle combo (Vendor)
 */
export const createBundle = async (req, res) => {
  try {
    const bundleData = req.body;
    const vendorId = req.user?.id || bundleData.vendorId;

    if (!bundleData.title || !bundleData.items || bundleData.items.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'A bundle requires a title and at least 2 catalog products.'
      });
    }

    const bundleId = 'bnd-' + Date.now();
    const originalPrice = bundleData.items.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0);

    const discountVal = Number(bundleData.discountValue) || 10;
    const discountType = bundleData.discountType || 'percentage';

    let bundlePrice = originalPrice;
    if (discountType === 'percentage') {
      bundlePrice = Math.round(originalPrice * (1 - discountVal / 100));
    } else {
      bundlePrice = Math.max(0, originalPrice - discountVal);
    }

    const savingsAmount = originalPrice - bundlePrice;

    const newBundle = {
      ...bundleData,
      id: bundleId,
      vendorId,
      vendorName: req.user?.name || bundleData.vendorName || 'Verified Merchant',
      originalPrice,
      bundlePrice,
      savingsAmount,
      status: bundleData.status || 'active',
      image: bundleData.image || bundleData.items[0]?.image || '',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (isDbReady()) {
      try {
        const doc = new Bundle(newBundle);
        await doc.save();
      } catch (e) {
        console.warn('DB bundle save fallback:', e.message);
      }
    }

    memBundles.unshift(newBundle);

    return res.status(201).json({
      success: true,
      message: 'Product bundle deal created successfully.',
      bundle: newBundle
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PUT /api/bundles/:id
 * Update bundle
 */
export const updateBundle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let updated = null;
    if (isDbReady()) {
      try {
        updated = await Bundle.findOneAndUpdate({ id }, { $set: updateData }, { new: true });
        if (updated) updated = updated.toJSON();
      } catch (e) {}
    }

    const idx = memBundles.findIndex((b) => b.id === id);
    if (idx > -1) {
      memBundles[idx] = { ...memBundles[idx], ...updateData };
      if (!updated) updated = memBundles[idx];
    }

    return res.json({ success: true, bundle: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/bundles/:id
 * Delete bundle
 */
export const deleteBundle = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbReady()) {
      try {
        await Bundle.findOneAndDelete({ id });
      } catch (e) {}
    }

    memBundles = memBundles.filter((b) => b.id !== id);

    return res.json({ success: true, message: 'Bundle deal deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
