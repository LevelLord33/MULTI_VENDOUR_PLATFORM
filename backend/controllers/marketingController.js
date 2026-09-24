import mongoose from 'mongoose';
import Promotion from '../models/Promotion.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { INITIAL_SEED_PROMOTIONS } from '../routes/seedRoutes.js';

// In-memory fallback if MongoDB connection is temporarily unavailable
let inMemoryPromotions = [...INITIAL_SEED_PROMOTIONS];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Get all promotions, coupons & banners for a vendor
 * GET /api/marketing/vendor/:vendorId
 */
export const getVendorPromotions = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (isDbConnected()) {
      const promotions = await Promotion.find({ vendorId }).sort({ createdAt: -1 }).lean();
      const vendorUser = await User.findOne({ id: vendorId }).select('featuredProductIds announcement banner').lean();

      return res.json({
        success: true,
        promotions,
        featuredProductIds: vendorUser?.featuredProductIds || [],
        vendorSettings: {
          announcement: vendorUser?.announcement || '',
          banner: vendorUser?.banner || ''
        }
      });
    }

    // Resilient fallback
    const filtered = inMemoryPromotions.filter((p) => p.vendorId === vendorId);
    return res.json({
      success: true,
      promotions: filtered,
      featuredProductIds: ['p1', 'p2', 'p3'],
      vendorSettings: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor promotions.',
      error: error.message
    });
  }
};

/**
 * Create a new promotion, coupon, banner, or campaign
 * POST /api/marketing/promotions
 */
export const createPromotion = async (req, res) => {
  try {
    const {
      vendorId,
      title,
      type,
      code,
      discountType,
      discountValue,
      minOrderValue,
      maxDiscount,
      applicableProductIds,
      applicableCategory,
      bannerUrl,
      bannerPlacement,
      bannerLink,
      subtitle,
      buttonText,
      badgeText,
      startDate,
      endDate,
      usageLimit,
      description
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: 'Campaign title and promotion type are required.'
      });
    }

    const effectiveVendorId = vendorId || req.user?.id;
    if (!effectiveVendorId) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID is required.'
      });
    }

    const promoId = `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const formattedCode = code ? code.trim().toUpperCase() : undefined;

    const promoData = {
      id: promoId,
      vendorId: effectiveVendorId,
      title: title.trim(),
      type,
      code: formattedCode,
      discountType: discountType || 'percentage',
      discountValue: Number(discountValue) || 0,
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      applicableProductIds: Array.isArray(applicableProductIds) ? applicableProductIds : [],
      applicableCategory: applicableCategory || 'All',
      bannerUrl: bannerUrl || '',
      bannerPlacement: bannerPlacement || 'store_top',
      bannerLink: bannerLink || '',
      subtitle: subtitle || '',
      buttonText: buttonText || 'Shop Offer',
      badgeText: badgeText || 'SPECIAL OFFER',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      usageLimit: Number(usageLimit) || 100,
      usageCount: 0,
      status: 'active',
      description: description || ''
    };

    if (isDbConnected()) {
      const created = await Promotion.create(promoData);
      return res.status(201).json({
        success: true,
        message: 'Promotion campaign created successfully!',
        promotion: created
      });
    }

    inMemoryPromotions.unshift(promoData);
    return res.status(201).json({
      success: true,
      message: 'Promotion campaign created successfully (local mode).',
      promotion: promoData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create promotion campaign.',
      error: error.message
    });
  }
};

/**
 * Update promotion details or toggle status
 * PUT /api/marketing/promotions/:id
 */
export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates._id;
    delete updates.id;

    if (updates.code) {
      updates.code = updates.code.trim().toUpperCase();
    }

    if (isDbConnected()) {
      const updated = await Promotion.findOneAndUpdate(
        { id },
        { $set: updates },
        { new: true }
      ).lean();

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Promotion not found.' });
      }

      return res.json({
        success: true,
        message: 'Promotion campaign updated successfully.',
        promotion: updated
      });
    }

    const idx = inMemoryPromotions.findIndex((p) => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }
    inMemoryPromotions[idx] = { ...inMemoryPromotions[idx], ...updates };

    return res.json({
      success: true,
      message: 'Promotion updated successfully (local mode).',
      promotion: inMemoryPromotions[idx]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update promotion.',
      error: error.message
    });
  }
};

/**
 * Delete a promotion
 * DELETE /api/marketing/promotions/:id
 */
export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Promotion.findOneAndDelete({ id });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Promotion not found.' });
      }
      return res.json({ success: true, message: 'Promotion removed successfully.' });
    }

    inMemoryPromotions = inMemoryPromotions.filter((p) => p.id !== id);
    return res.json({ success: true, message: 'Promotion removed successfully (local mode).' });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete promotion.',
      error: error.message
    });
  }
};

/**
 * Toggle promotion status (active <-> paused)
 * PATCH /api/marketing/promotions/:id/toggle
 */
export const togglePromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const promo = await Promotion.findOne({ id });
      if (!promo) {
        return res.status(404).json({ success: false, message: 'Promotion not found.' });
      }

      promo.status = promo.status === 'active' ? 'paused' : 'active';
      await promo.save();

      return res.json({
        success: true,
        message: `Promotion is now ${promo.status}.`,
        status: promo.status
      });
    }

    const promo = inMemoryPromotions.find((p) => p.id === id);
    if (!promo) {
      return res.status(404).json({ success: false, message: 'Promotion not found.' });
    }
    promo.status = promo.status === 'active' ? 'paused' : 'active';

    return res.json({
      success: true,
      message: `Promotion is now ${promo.status}.`,
      status: promo.status
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle promotion status.',
      error: error.message
    });
  }
};

/**
 * Validate customer coupon code at checkout
 * POST /api/marketing/validate-coupon
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal = 0, vendorId, cartItems = [] } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Please enter a coupon code.'
      });
    }

    const searchCode = code.trim().toUpperCase();
    const today = new Date().toISOString().split('T')[0];

    let promo = null;
    if (isDbConnected()) {
      promo = await Promotion.findOne({
        type: 'coupon',
        code: searchCode,
        status: 'active'
      }).lean();
    } else {
      promo = inMemoryPromotions.find(
        (p) => p.type === 'coupon' && p.code === searchCode && p.status === 'active'
      );
    }

    if (!promo) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: `Coupon code "${searchCode}" is invalid, expired, or inactive.`
      });
    }

    // Check date validity
    if (promo.startDate && promo.startDate > today) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon "${searchCode}" is not active yet (starts ${promo.startDate}).`
      });
    }

    if (promo.endDate && promo.endDate < today) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon "${searchCode}" has expired on ${promo.endDate}.`
      });
    }

    // Check usage limits
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Coupon "${searchCode}" has reached its maximum redemption limit.`
      });
    }

    // Calculate eligible subtotal (matching vendor or store-wide)
    let eligibleSubtotal = Number(subtotal) || 0;
    if (cartItems.length > 0 && promo.vendorId) {
      const vendorItems = cartItems.filter((item) => item.vendorId === promo.vendorId);
      if (vendorItems.length === 0 && vendorId && vendorId !== promo.vendorId) {
        return res.status(400).json({
          success: false,
          valid: false,
          message: `Coupon "${searchCode}" is only valid for items sold by this vendor.`
        });
      }
      if (vendorItems.length > 0) {
        eligibleSubtotal = vendorItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      }
    }

    // Check minimum order requirement
    if (promo.minOrderValue > 0 && eligibleSubtotal < promo.minOrderValue) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: `Minimum order subtotal of ₹${promo.minOrderValue.toLocaleString()} required for this coupon (current eligible: ₹${eligibleSubtotal.toLocaleString()}).`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((eligibleSubtotal * promo.discountValue) / 100);
      if (promo.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, promo.maxDiscount);
      }
    } else {
      // Fixed discount
      discountAmount = Math.min(promo.discountValue, eligibleSubtotal);
    }

    return res.json({
      success: true,
      valid: true,
      message: `Coupon "${promo.code}" applied! You saved ₹${discountAmount.toLocaleString()}`,
      coupon: {
        id: promo.id,
        code: promo.code,
        title: promo.title,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        vendorId: promo.vendorId
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      valid: false,
      message: 'Error validating coupon code.',
      error: error.message
    });
  }
};

/**
 * Public endpoint: Get active promotional banners & coupons for storefront / marketplace
 * GET /api/marketing/public
 */
export const getPublicPromotions = async (req, res) => {
  try {
    const { vendorId } = req.query;
    const query = { status: 'active' };
    if (vendorId) {
      query.vendorId = vendorId;
    }

    if (isDbConnected()) {
      const promotions = await Promotion.find(query).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, promotions });
    }

    const filtered = inMemoryPromotions.filter(
      (p) => p.status === 'active' && (!vendorId || p.vendorId === vendorId)
    );
    return res.json({ success: true, promotions: filtered });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve public promotions.',
      error: error.message
    });
  }
};

/**
 * Update vendor's featured product selection
 * PUT /api/marketing/featured-products
 */
export const updateFeaturedProducts = async (req, res) => {
  try {
    const { vendorId, productIds } = req.body;
    const targetVendorId = vendorId || req.user?.id;

    if (!targetVendorId || !Array.isArray(productIds)) {
      return res.status(400).json({
        success: false,
        message: 'Vendor ID and productIds array are required.'
      });
    }

    if (isDbConnected()) {
      await User.findOneAndUpdate(
        { id: targetVendorId },
        { $set: { featuredProductIds: productIds } }
      );

      return res.json({
        success: true,
        message: `Successfully pinned ${productIds.length} featured products to store collection!`,
        featuredProductIds: productIds
      });
    }

    return res.json({
      success: true,
      message: `Updated ${productIds.length} featured products (local mode).`,
      featuredProductIds: productIds
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update featured products.',
      error: error.message
    });
  }
};
