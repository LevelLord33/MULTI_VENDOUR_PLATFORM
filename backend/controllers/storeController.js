import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';
import { seedVendors, seedProducts } from '../data/seedData.js';
import { INITIAL_SEED_PROMOTIONS } from '../routes/seedRoutes.js';
import { checkDeliveryCoverage, calculateDistanceKm, getCoordinatesForLocation } from '../utils/geoUtils.js';
import { memUsers } from './authController.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Curated Category Definitions
// Curated Category Definitions for all 10 Merchants
const STORE_CATEGORIES = [
  { id: 'all', name: 'All Stores', icon: 'Store' },
  { id: 'electronics', name: 'Electronics & Gadgets', icon: 'Laptop', keywords: ['electronic', 'audio', 'phone', 'gear', 'tech', 'gadget'] },
  { id: 'fashion', name: 'Fashion & Apparel', icon: 'Shirt', keywords: ['fashion', 'apparel', 'clothing', 'footwear', 'style', 'saree', 'linen'] },
  { id: 'grocery', name: 'Organic Grocery & Staples', icon: 'Apple', keywords: ['grocery', 'organic', 'farm', 'fresh', 'food', 'spice', 'honey'] },
  { id: 'home', name: 'Home & Kitchen Essentials', icon: 'Home', keywords: ['home', 'kitchen', 'cookware', 'furniture', 'pan', 'kettle'] },
  { id: 'sports', name: 'Sports, Fitness & Outdoor', icon: 'Activity', keywords: ['sport', 'fitness', 'cricket', 'badminton', 'dumbbell', 'gym', 'cycling'] },
  { id: 'beauty', name: 'Ayurvedic Beauty & Wellness', icon: 'Sparkles', keywords: ['beauty', 'skincare', 'serum', 'ayurvedic', 'wellness', 'kumkumadi'] },
  { id: 'handicrafts', name: 'Handcrafted Arts & Heritage Decor', icon: 'Palette', keywords: ['craft', 'artisan', 'pottery', 'dhokra', 'brass', 'rug', 'handwoven'] },
  { id: 'workspace', name: 'Modern Workspaces & Living', icon: 'Briefcase', keywords: ['workspace', 'desk', 'ergonomic', 'office', 'blotter', 'organizer'] },
  { id: 'botanicals', name: 'Live Botanicals & Exotic Foliage', icon: 'Feather', keywords: ['plant', 'botanical', 'monstera', 'foliage', 'bonsai', 'succulent', 'planter'] },
  { id: 'proaudio', name: 'Pro Audio & Studio Sound', icon: 'Headphones', keywords: ['audio', 'microphone', 'studio', 'shure', 'sound', 'interface', 'monitor'] }
];

const VENDOR_CATEGORY_MAP = {
  v1: 'Electronics & Gadgets',
  v2: 'Fashion & Apparel',
  v3: 'Organic Grocery & Staples',
  v4: 'Home & Kitchen Essentials',
  v5: 'Sports, Fitness & Outdoor',
  v6: 'Ayurvedic Beauty & Wellness',
  v7: 'Handcrafted Arts & Heritage Decor',
  v8: 'Modern Workspaces & Living',
  v9: 'Live Botanicals & Exotic Foliage',
  v10: 'Pro Audio & Studio Sound'
};

/**
 * Helper: determine primary category of a store based on products and explicit map
 */
const inferStoreCategory = (vendor, vendorProducts = []) => {
  if (vendor.category && vendor.category !== 'General Retail') return vendor.category;
  if (VENDOR_CATEGORY_MAP[vendor.id]) return VENDOR_CATEGORY_MAP[vendor.id];
  if (vendorProducts && vendorProducts.length > 0 && vendorProducts[0].category) {
    return vendorProducts[0].category;
  }
  const combinedText = `${vendor.businessName} ${vendor.tagline} ${vendor.description}`.toLowerCase();
  for (const cat of STORE_CATEGORIES) {
    if (cat.id === 'all') continue;
    if (cat.keywords?.some((kw) => combinedText.includes(kw))) {
      return cat.name;
    }
  }
  return 'General Retail';
};

/**
 * GET /api/stores
 * Discover, search, and filter verified vendor stores
 */
export const getStores = async (req, res) => {
  try {
    const {
      search = '',
      category = 'All',
      location,
      city,
      businessType,
      featured,
      verifiedOnly,
      emergingOnly,
      deliversOnly,
      nearbyOnly,
      minRating,
      customerLat,
      customerLng,
      customerCity,
      customerPincode,
      sortBy = 'popular', // 'popular' | 'rating' | 'orders' | 'nearest' | 'name' | 'smart_discovery'
      page = 1,
      limit = 24
    } = req.query;

    const customerLoc = {
      latitude: customerLat ? Number(customerLat) : null,
      longitude: customerLng ? Number(customerLng) : null,
      city: customerCity || location || city || '',
      pincode: customerPincode || ''
    };

    let vendors = [];
    if (isDbConnected()) {
      try {
        const query = { type: 'vendor', storeStatus: { $in: ['published', 'approved'] } };
        vendors = await User.find(query).lean();
      } catch (e) {
        console.warn('MongoDB getStores fallback:', e.message);
      }
    }

    if (!vendors || vendors.length === 0) {
      vendors = seedVendors.filter((v) => v.storeStatus === 'published' || v.storeStatus === 'approved' || (!v.storeStatus && v.isVerified !== false));
    }

    // Merge dynamic and in-memory storefront updates
    for (const [id, mStore] of memStorefronts.entries()) {
      const isApprovedOrPublished = mStore.storeStatus === 'published' || mStore.storeStatus === 'approved';
      const existingIdx = vendors.findIndex((c) => c.id === id || String(c._id) === id);

      if (isApprovedOrPublished) {
        if (existingIdx >= 0) {
          vendors[existingIdx] = { ...vendors[existingIdx], ...mStore };
        } else {
          vendors.push({
            id,
            businessName: mStore.businessName || 'Merchant Store',
            ownerName: mStore.ownerName || 'Merchant',
            storeSlug: mStore.storeSlug || id,
            category: mStore.category || 'General Retail',
            tagline: mStore.tagline || '',
            description: mStore.description || '',
            location: mStore.location || 'India',
            businessAddress: mStore.businessAddress || '',
            themeColor: mStore.themeColor || '#4F46E5',
            avatar: mStore.avatar || '',
            banner: mStore.banner || '',
            announcement: mStore.announcement || '',
            isVerified: true,
            storeStatus: mStore.storeStatus,
            storeApprovalStatus: mStore.storeApprovalStatus || 'approved'
          });
        }
      } else if (existingIdx >= 0) {
        // If an existing vendor was updated to pending_approval, draft, or rejected, remove from public list
        vendors.splice(existingIdx, 1);
      }
    }

    // Also include any approved vendors from memUsers
    if (Array.isArray(memUsers)) {
      memUsers.filter((u) => u.type === 'vendor' && (u.storeStatus === 'published' || u.storeStatus === 'approved')).forEach((mv) => {
        const existingIdx = vendors.findIndex((c) => c.id === mv.id || String(c._id) === mv.id);
        if (existingIdx >= 0) {
          vendors[existingIdx] = { ...vendors[existingIdx], ...mv };
        } else {
          vendors.push(mv);
        }
      });
    }

    // Filter strictly to approved or published storefronts
    vendors = vendors.filter((v) =>
      (v.storeStatus === 'published' || v.storeStatus === 'approved' || (!v.storeStatus && v.isVerified !== false)) &&
      v.storeStatus !== 'pending_approval' &&
      v.storeStatus !== 'draft' &&
      v.storeStatus !== 'rejected'
    );

    // Get all products to link sample products to stores
    let allProducts = [];
    if (isDbConnected()) {
      try {
        allProducts = await Product.find({ status: 'approved' }).lean();
      } catch (e) {
        console.warn('MongoDB products fallback:', e.message);
      }
    }
    if (!allProducts || allProducts.length === 0) {
      allProducts = seedProducts;
    }

    // Map each vendor with enriched data including delivery coverage & dynamic emerging status
    let enrichedStores = vendors.map((vendor) => {
      const vProducts = allProducts.filter((p) => p.vendorId === vendor.id);
      const storeCat = inferStoreCategory(vendor, vProducts);
      const ordersFulfilled = Number(vendor.totalOrdersFulfilled) || 0;
      const isEmergingVendor = Boolean(vendor.isEmerging || ordersFulfilled < 350);

      const deliveryCoverage = checkDeliveryCoverage(vendor, customerLoc);

      return {
        id: vendor.id,
        businessName: vendor.businessName,
        storeSlug: vendor.storeSlug || vendor.id,
        tagline: vendor.tagline || 'Verified Physical Storefront on Vendor Hub',
        ownerName: vendor.ownerName || vendor.name,
        location: vendor.location || vendor.businessAddress || 'India',
        businessAddress: vendor.businessAddress || '',
        businessType: vendor.businessType || 'Private Limited',
        avatar: vendor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName || 'Store')}&background=4F46E5&color=fff`,
        banner: vendor.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
        themeColor: vendor.themeColor || '#4F46E5',
        themePreset: vendor.themePreset || 'indigo',
        isVerified: vendor.isVerified !== false,
        isEmerging: isEmergingVendor,
        storeStatus: vendor.storeStatus || 'published',
        storeApprovalStatus: vendor.storeApprovalStatus || 'approved',
        gstin: vendor.gstin || '07AABCT1234F1Z8',
        storeRating: vendor.storeRating || 4.8,
        totalOrdersFulfilled: ordersFulfilled,
        followersCount: vendor.followersCount || 0,
        deliveryRadiusKm: Number(vendor.deliveryRadiusKm) || 25,
        deliveryScope: vendor.deliveryScope || 'pan_india',
        deliveryCoverage,
        onTimeDispatchRate: vendor.onTimeDispatchRate || '98.8%',
        announcement: vendor.announcement || '⚡ Same-Day Courier Dispatch & Direct Brand Warranty!',
        returnPolicy: vendor.returnPolicy || '7 Days Hassle-Free Physical Replacement or Full Refund',
        warrantyPolicy: vendor.warrantyPolicy || '100% Verified Brand Warranty & Tax Invoice Included',
        description: vendor.description || '',
        category: storeCat,
        totalProducts: vProducts.length,
        isFeatured: ordersFulfilled >= 1000 || vendor.isVerified,
        sampleProducts: vProducts.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name || p.title,
          price: p.price,
          image: p.image || p.images?.[0] || '',
          sku: p.sku
        }))
      };
    });

    // ── Apply Filters ──
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      enrichedStores = enrichedStores.filter((s) =>
        s.businessName.toLowerCase().includes(q) ||
        s.storeSlug.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.ownerName.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All' && category !== 'all') {
      const cleanCat = category.toLowerCase();
      enrichedStores = enrichedStores.filter((s) =>
        s.category.toLowerCase().includes(cleanCat) ||
        cleanCat.includes(s.category.toLowerCase())
      );
    }

    const locFilter = location || city;
    if (locFilter && locFilter !== 'All' && locFilter !== 'all') {
      const locClean = locFilter.toLowerCase().trim();
      enrichedStores = enrichedStores.filter((s) =>
        s.location.toLowerCase().includes(locClean)
      );
    }

    if (businessType && businessType !== 'All' && businessType !== 'all') {
      const btClean = businessType.toLowerCase().trim();
      enrichedStores = enrichedStores.filter((s) =>
        s.businessType.toLowerCase().includes(btClean)
      );
    }

    if (featured === 'true' || featured === true) {
      enrichedStores = enrichedStores.filter((s) => s.isFeatured);
    }

    if (verifiedOnly === 'true' || verifiedOnly === true) {
      enrichedStores = enrichedStores.filter((s) => s.isVerified);
    }

    if (emergingOnly === 'true' || emergingOnly === true) {
      enrichedStores = enrichedStores.filter((s) => s.isEmerging);
    }

    if (deliversOnly === 'true' || deliversOnly === true) {
      enrichedStores = enrichedStores.filter((s) => s.deliveryCoverage?.delivers);
    }

    if (nearbyOnly === 'true' || nearbyOnly === true) {
      enrichedStores = enrichedStores.filter(
        (s) => s.deliveryCoverage?.distanceKm !== null && s.deliveryCoverage?.distanceKm <= s.deliveryRadiusKm
      );
    }

    if (minRating) {
      const minR = Number(minRating);
      enrichedStores = enrichedStores.filter((s) => s.storeRating >= minR);
    }

    // ── Apply Sorting ──
    if (sortBy === 'rating') {
      enrichedStores.sort((a, b) => b.storeRating - a.storeRating);
    } else if (sortBy === 'orders') {
      enrichedStores.sort((a, b) => b.totalOrdersFulfilled - a.totalOrdersFulfilled);
    } else if (sortBy === 'name') {
      enrichedStores.sort((a, b) => a.businessName.localeCompare(b.businessName));
    } else if (sortBy === 'nearest') {
      enrichedStores.sort((a, b) => {
        const distA = a.deliveryCoverage?.distanceKm ?? 99999;
        const distB = b.deliveryCoverage?.distanceKm ?? 99999;
        return distA - distB;
      });
    } else if (sortBy === 'smart_discovery') {
      // Dynamic Fair Exposure Discovery sort
      enrichedStores.sort((a, b) => {
        const emergingBonusA = a.isEmerging ? 25 : 0;
        const emergingBonusB = b.isEmerging ? 25 : 0;
        const scoreA = (a.isVerified ? 15 : 0) + a.storeRating * 15 + emergingBonusA + Math.min(a.totalOrdersFulfilled * 0.05, 40);
        const scoreB = (b.isVerified ? 15 : 0) + b.storeRating * 15 + emergingBonusB + Math.min(b.totalOrdersFulfilled * 0.05, 40);
        return scoreB - scoreA;
      });
    } else {
      // Default: 'popular' (combination of verified, orders, and rating)
      enrichedStores.sort((a, b) => {
        const scoreA = a.totalOrdersFulfilled * (a.isVerified ? 1.2 : 1) + a.storeRating * 100;
        const scoreB = b.totalOrdersFulfilled * (b.isVerified ? 1.2 : 1) + b.storeRating * 100;
        return scoreB - scoreA;
      });
    }

    const totalStores = enrichedStores.length;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 24;
    const paginatedStores = enrichedStores.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      success: true,
      count: totalStores,
      page: pageNum,
      totalPages: Math.ceil(totalStores / limitNum) || 1,
      stores: paginatedStores
    });
  } catch (error) {
    console.error('getStores Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve vendor stores',
      error: error.message
    });
  }
};

/**
 * GET /api/stores/featured
 * Top-tier verified merchant stores with active promotional highlights
 */
export const getFeaturedStores = async (req, res) => {
  try {
    const mockReq = { query: { featured: 'true', sortBy: 'popular', limit: 6 } };
    let responseData = null;
    const mockRes = {
      json: (d) => { responseData = d; return mockRes; },
      status: () => mockRes
    };

    await getStores(mockReq, mockRes);
    return res.json({
      success: true,
      featuredStores: responseData?.stores || []
    });
  } catch (error) {
    console.error('getFeaturedStores Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/stores/emerging
 * High-performing emerging merchant storefronts (Fair Exposure)
 */
export const getEmergingStores = async (req, res) => {
  try {
    const mockReq = { query: { emergingOnly: 'true', sortBy: 'rating', limit: 8 } };
    let responseData = null;
    const mockRes = {
      json: (d) => { responseData = d; return mockRes; },
      status: () => mockRes
    };

    await getStores(mockReq, mockRes);
    return res.json({
      success: true,
      emergingStores: responseData?.stores || []
    });
  } catch (error) {
    console.error('getEmergingStores Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/stores/categories
 * Distinct store categories with active verified store counts
 */
export const getStoreCategories = async (req, res) => {
  try {
    const mockReq = { query: { limit: 100 } };
    let responseData = null;
    const mockRes = {
      json: (d) => { responseData = d; return mockRes; },
      status: () => mockRes
    };

    await getStores(mockReq, mockRes);
    const allStores = responseData?.stores || [];

    const categoryMap = {};
    allStores.forEach((s) => {
      const cat = s.category || 'General Retail';
      categoryMap[cat] = (categoryMap[cat] || 0) + 1;
    });

    const result = [
      { id: 'all', name: 'All Stores', count: allStores.length, icon: 'Store' },
      ...STORE_CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({
        id: c.id,
        name: c.name,
        count: categoryMap[c.name] || 0,
        icon: c.icon
      }))
    ];

    return res.json({
      success: true,
      categories: result
    });
  } catch (error) {
    console.error('getStoreCategories Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/stores/:slug/seo
 * Return dynamic SEO metadata, Open Graph preview tags & Schema.org JSON-LD
 */
export const getStoreSeoMetadata = async (req, res) => {
  try {
    const { slug } = req.params;
    const clean = slug.toLowerCase().trim();

    let vendor = null;
    if (isDbConnected()) {
      try {
        vendor = await User.findOne({
          type: 'vendor',
          $or: [{ storeSlug: clean }, { id: clean }]
        }).lean();
      } catch (e) {
        console.warn('MongoDB getStoreSeoMetadata fallback:', e.message);
      }
    }

    if (!vendor) {
      vendor = seedVendors.find(
        (v) => v.storeSlug?.toLowerCase() === clean || v.id.toLowerCase() === clean
      ) || seedVendors[0];
    }

    const businessName = vendor.businessName || 'Verified Store';
    const storeSlug = vendor.storeSlug || vendor.id;
    const canonicalUrl = `https://vendorhub.in/store/${storeSlug}`;
    const pageTitle = `${businessName} — Official Verified Storefront | Vendor Hub`;
    const metaDescription = `${businessName} on Vendor Hub: ${vendor.tagline || '100% genuine physical inventory'}. Located in ${vendor.location || 'India'}. Fast courier fulfillment, GST invoice & verified brand warranty.`;

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: businessName,
      description: metaDescription,
      url: canonicalUrl,
      image: vendor.avatar || vendor.banner,
      telephone: vendor.mobile ? `+91-${vendor.mobile}` : '+91-9876543210',
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        streetAddress: vendor.businessAddress || 'Main Market Road',
        addressLocality: vendor.location ? vendor.location.split(',')[0].trim() : 'New Delhi',
        addressRegion: vendor.location ? vendor.location.split(',')[1]?.trim() : 'Delhi',
        addressCountry: 'IN'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: vendor.storeRating || 4.8,
        reviewCount: Math.round((vendor.totalOrdersFulfilled || 1240) * 0.28)
      }
    };

    return res.json({
      success: true,
      seo: {
        title: pageTitle,
        description: metaDescription,
        canonicalUrl,
        ogTitle: pageTitle,
        ogDescription: metaDescription,
        ogImage: vendor.banner || vendor.avatar,
        ogUrl: canonicalUrl,
        twitterCard: 'summary_large_image',
        jsonLd
      }
    });
  } catch (error) {
    console.error('getStoreSeoMetadata Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory registry for storefront submissions to ensure instant updates in dev & fallback
const memStorefronts = new Map();

/**
 * POST /api/stores/vendor/:id/storefront
 * Vendor creates, updates, and uploads storefront for Admin approval
 */
export const submitVendorStorefront = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body || {};
    const now = new Date().toISOString();

    const isDraft = data.storeStatus === 'draft';
    const newStoreStatus = isDraft ? 'draft' : 'pending_approval';
    const newApprovalStatus = isDraft ? 'none' : 'pending';

    const storefrontPayload = {
      businessName: data.businessName,
      storeSlug: data.storeSlug,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      avatar: data.avatar,
      banner: data.banner,
      themeColor: data.themeColor || '#4F46E5',
      themePreset: data.themePreset || 'indigo',
      announcement: data.announcement,
      announcementActive: data.announcementActive !== false,
      featuredProductIds: Array.isArray(data.featuredProductIds) ? data.featuredProductIds : [],
      businessAddress: data.businessAddress,
      location: data.location,
      mobile: data.mobile,
      storeStatus: newStoreStatus,
      storeApprovalStatus: newApprovalStatus,
      storeSubmittedAt: isDraft ? null : now,
      storeRejectionReason: '',
      updatedAt: now
    };

    // 1. Update in MongoDB if connected
    if (isDbConnected()) {
      try {
        await User.findOneAndUpdate(
          { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
          { $set: storefrontPayload },
          { new: true }
        );
      } catch (e) {
        console.warn('MongoDB submitVendorStorefront fallback:', e.message);
      }
    }

    // 2. Update in memory map
    const existing = memStorefronts.get(id) || {};
    memStorefronts.set(id, { ...existing, id, vendorId: id, ...storefrontPayload });

    // 3. Update in memUsers
    if (Array.isArray(memUsers)) {
      const uIdx = memUsers.findIndex((u) => u.id === id);
      if (uIdx >= 0) {
        memUsers[uIdx] = { ...memUsers[uIdx], ...storefrontPayload };
      }
    }

    return res.json({
      success: true,
      message: isDraft
        ? 'Storefront draft saved successfully.'
        : 'Storefront uploaded and submitted for Admin approval! Once approved, your store will go live on the customer portal.',
      storeStatus: newStoreStatus,
      storeApprovalStatus: newApprovalStatus,
      storefront: { id, ...storefrontPayload }
    });
  } catch (error) {
    console.error('submitVendorStorefront Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/stores/vendor/:id/storefront
 * Retrieve vendor's storefront configuration and approval status
 */
export const getVendorStorefront = async (req, res) => {
  try {
    const { id } = req.params;

    let vendor = null;
    if (isDbConnected()) {
      try {
        vendor = await User.findOne({
          $or: [{ id }, { storeSlug: id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }]
        }).lean();
      } catch (e) {
        console.warn('MongoDB getVendorStorefront fallback:', e.message);
      }
    }

    if (!vendor) {
      vendor = memStorefronts.get(id) || seedVendors.find((v) => v.id === id || v.storeSlug === id);
    }

    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor store not found' });
    }

    return res.json({
      success: true,
      storefront: {
        id: vendor.id,
        businessName: vendor.businessName,
        storeSlug: vendor.storeSlug || vendor.id,
        category: vendor.category || 'General Retail',
        tagline: vendor.tagline,
        description: vendor.description,
        avatar: vendor.avatar,
        banner: vendor.banner,
        themeColor: vendor.themeColor || '#4F46E5',
        themePreset: vendor.themePreset || 'indigo',
        announcement: vendor.announcement,
        announcementActive: vendor.announcementActive !== false,
        featuredProductIds: vendor.featuredProductIds || [],
        storeStatus: vendor.storeStatus || 'draft',
        storeApprovalStatus: vendor.storeApprovalStatus || 'none',
        storeRejectionReason: vendor.storeRejectionReason || '',
        storeSubmittedAt: vendor.storeSubmittedAt || null,
        storeApprovedAt: vendor.storeApprovedAt || null,
        businessAddress: vendor.businessAddress || '',
        location: vendor.location || '',
        mobile: vendor.mobile || ''
      }
    });
  } catch (error) {
    console.error('getVendorStorefront Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/stores/admin/storefronts
 * Admin lists all vendor storefront submissions with optional filter
 */
export const getAdminStorefronts = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    let vendors = [];
    if (isDbConnected()) {
      try {
        const query = { type: 'vendor' };
        if (status === 'pending') {
          query.storeStatus = 'pending_approval';
        } else if (status === 'approved') {
          query.storeStatus = { $in: ['published', 'approved'] };
        } else if (status === 'rejected') {
          query.storeStatus = 'rejected';
        }
        vendors = await User.find(query).sort({ updatedAt: -1 }).lean();
      } catch (e) {
        console.warn('MongoDB getAdminStorefronts fallback:', e.message);
      }
    }

    // Merge in-memory and seed vendors
    const allCandidates = [...vendors];
    for (const [id, mStore] of memStorefronts.entries()) {
      const idx = allCandidates.findIndex((c) => c.id === id);
      if (idx >= 0) {
        allCandidates[idx] = { ...allCandidates[idx], ...mStore };
      } else {
        allCandidates.push(mStore);
      }
    }

    // Merge memUsers vendors
    if (Array.isArray(memUsers)) {
      memUsers.filter((u) => u.type === 'vendor').forEach((mv) => {
        const idx = allCandidates.findIndex((c) => c.id === mv.id);
        if (idx >= 0) {
          allCandidates[idx] = { ...allCandidates[idx], ...mv };
        } else {
          allCandidates.push(mv);
        }
      });
    }

    if (allCandidates.length === 0) {
      seedVendors.forEach((v) => {
        allCandidates.push({
          ...v,
          storeStatus: v.storeStatus || 'published',
          storeApprovalStatus: 'approved'
        });
      });
    }

    let filtered = allCandidates;
    if (status === 'pending') {
      filtered = allCandidates.filter((v) => v.storeStatus === 'pending_approval');
    } else if (status === 'approved') {
      filtered = allCandidates.filter((v) => v.storeStatus === 'published' || v.storeStatus === 'approved');
    } else if (status === 'rejected') {
      filtered = allCandidates.filter((v) => v.storeStatus === 'rejected');
    }

    return res.json({
      success: true,
      count: filtered.length,
      storefronts: filtered.map((v) => ({
        id: v.id,
        vendorId: v.id,
        businessName: v.businessName || 'Merchant Store',
        ownerName: v.ownerName || v.name || '',
        email: v.email || '',
        mobile: v.mobile || '',
        category: v.category || 'General',
        storeSlug: v.storeSlug || v.id,
        avatar: v.avatar || '',
        banner: v.banner || '',
        tagline: v.tagline || '',
        description: v.description || '',
        location: v.location || '',
        businessAddress: v.businessAddress || '',
        themeColor: v.themeColor || '#4F46E5',
        themePreset: v.themePreset || 'indigo',
        announcement: v.announcement || '',
        storeStatus: v.storeStatus || 'draft',
        storeApprovalStatus: v.storeApprovalStatus || (v.storeStatus === 'published' ? 'approved' : 'none'),
        storeRejectionReason: v.storeRejectionReason || '',
        storeSubmittedAt: v.storeSubmittedAt || v.createdAt || null,
        storeApprovedAt: v.storeApprovedAt || null
      }))
    });
  } catch (error) {
    console.error('getAdminStorefronts Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/stores/admin/:id/approval
 * Admin approves or rejects a vendor storefront submission
 */
export const updateStorefrontApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const rawStatus = (req.body.status || req.body.action || '').toLowerCase().trim();
    const adminNotes = req.body.adminNotes || req.body.remarks || '';
    const now = new Date().toISOString();

    let status = rawStatus;
    if (status === 'approve') status = 'approved';
    if (status === 'reject') status = 'rejected';

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be "approved" or "rejected"' });
    }

    const isApproved = status === 'approved';
    const updateFields = {
      storeStatus: isApproved ? 'published' : 'rejected',
      storeApprovalStatus: isApproved ? 'approved' : 'rejected',
      storeApprovedAt: isApproved ? now : null,
      storeRejectionReason: isApproved ? '' : (adminNotes || 'Please update storefront information.'),
      updatedAt: now
    };

    if (isDbConnected()) {
      try {
        await User.findOneAndUpdate(
          { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
          { $set: updateFields },
          { new: true }
        );
      } catch (e) {
        console.warn('MongoDB updateStorefrontApproval fallback:', e.message);
      }
    }

    const existing = memStorefronts.get(id) || {};
    memStorefronts.set(id, { ...existing, id, ...updateFields });

    if (Array.isArray(memUsers)) {
      const uIdx = memUsers.findIndex((u) => u.id === id);
      if (uIdx >= 0) {
        memUsers[uIdx] = { ...memUsers[uIdx], ...updateFields, isVerified: isApproved };
      }
    }

    return res.json({
      success: true,
      message: isApproved
        ? 'Storefront has been APPROVED by Admin! Store is now live on the Customer Portal.'
        : 'Storefront has been REJECTED with revision requested.',
      storeStatus: updateFields.storeStatus,
      storeApprovalStatus: updateFields.storeApprovalStatus,
      rejectionReason: updateFields.storeRejectionReason
    });
  } catch (error) {
    console.error('updateStorefrontApproval Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
