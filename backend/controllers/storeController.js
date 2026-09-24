import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';
import { seedVendors, seedProducts } from '../data/seedData.js';
import { INITIAL_SEED_PROMOTIONS } from '../routes/seedRoutes.js';

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

/**
 * Helper: determine primary category of a store based on products and tagline
 */
const inferStoreCategory = (vendor, vendorProducts = []) => {
  const combinedText = `${vendor.businessName} ${vendor.tagline} ${vendor.description} ${vendorProducts.map((p) => `${p.name} ${p.category}`).join(' ')}`.toLowerCase();

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
      sortBy = 'popular', // 'popular' | 'rating' | 'orders' | 'newest'
      page = 1,
      limit = 24
    } = req.query;

    let vendors = [];
    if (isDbConnected()) {
      try {
        const query = { type: 'vendor', storeStatus: { $ne: 'draft' } };
        vendors = await User.find(query).lean();
      } catch (e) {
        console.warn('MongoDB getStores fallback:', e.message);
      }
    }

    if (!vendors || vendors.length === 0) {
      vendors = seedVendors.filter((v) => v.storeStatus !== 'draft');
    }

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

    // Map each vendor with enriched data
    let enrichedStores = vendors.map((vendor) => {
      const vProducts = allProducts.filter((p) => p.vendorId === vendor.id);
      const storeCat = inferStoreCategory(vendor, vProducts);
      const isEmergingVendor = Boolean(vendor.isEmerging || ['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(vendor.id) || (vendor.totalOrdersFulfilled && vendor.totalOrdersFulfilled < 200));

      return {
        id: vendor.id,
        businessName: vendor.businessName,
        storeSlug: vendor.storeSlug || vendor.id,
        tagline: vendor.tagline || 'Verified Physical Storefront on Vendor Hub',
        ownerName: vendor.ownerName || vendor.name,
        location: vendor.location || vendor.businessAddress || 'India',
        businessType: vendor.businessType || 'Private Limited',
        avatar: vendor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName || 'Store')}&background=4F46E5&color=fff`,
        banner: vendor.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
        themeColor: vendor.themeColor || '#4F46E5',
        isVerified: vendor.isVerified !== false,
        isEmerging: isEmergingVendor,
        gstin: vendor.gstin || '07AABCT1234F1Z8',
        storeRating: vendor.storeRating || 4.8,
        totalOrdersFulfilled: vendor.totalOrdersFulfilled || 1240,
        onTimeDispatchRate: vendor.onTimeDispatchRate || '98.8%',
        announcement: vendor.announcement || '⚡ Same-Day Courier Dispatch & Direct Brand Warranty!',
        returnPolicy: vendor.returnPolicy || '7 Days Hassle-Free Physical Replacement or Full Refund',
        warrantyPolicy: vendor.warrantyPolicy || '100% Verified Brand Warranty & Tax Invoice Included',
        category: storeCat,
        totalProducts: vProducts.length,
        isFeatured: vendor.totalOrdersFulfilled >= 1000 || vendor.isVerified,
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

    // ── Apply Sorting ──
    if (sortBy === 'rating') {
      enrichedStores.sort((a, b) => b.storeRating - a.storeRating);
    } else if (sortBy === 'orders') {
      enrichedStores.sort((a, b) => b.totalOrdersFulfilled - a.totalOrdersFulfilled);
    } else if (sortBy === 'name') {
      enrichedStores.sort((a, b) => a.businessName.localeCompare(b.businessName));
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
