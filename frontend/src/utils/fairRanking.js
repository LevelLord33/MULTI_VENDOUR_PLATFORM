/**
 * Frontend Smart Vendor Discovery & Fair Product Exposure Engine
 * 
 * Provides merit-based, balanced search ranking:
 * 1. Product relevance (keyword matching across title, brand, tags, category, description)
 * 2. Stock availability factor (severe penalty for out of stock; no boost for OOS)
 * 3. Quality multiplier (rating + review count validation)
 * 4. Fair exposure boost for high-performing emerging merchants (prevents monopoly)
 * 5. Saturation penalty & vendor diversity interleaving (prevents single-vendor domination)
 */

export const calculateProductRelevance = (product, query = '') => {
  if (!query || !query.trim()) return 100;

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  const title = (product.name || product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const subCategory = (product.subCategory || '').toLowerCase();
  const description = (product.description || '').toLowerCase();
  const vendorName = (product.vendorName || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.map(t => String(t).toLowerCase()) : [];

  // Exact phrase match in title
  if (title.includes(q)) {
    score += 60;
  }

  // Exact brand or category match
  if (brand.includes(q) || category.includes(q)) {
    score += 35;
  }

  // Match vendor name
  if (vendorName.includes(q)) {
    score += 30;
  }

  // Token matching
  tokens.forEach((token) => {
    if (title.includes(token)) score += 25;
    if (brand.includes(token)) score += 20;
    if (tags.some(t => t.includes(token))) score += 18;
    if (category.includes(token) || subCategory.includes(token)) score += 15;
    if (description.includes(token)) score += 5;
  });

  return score;
};

export const calculateQualityMultiplier = (product) => {
  const rating = Number(product.rating) || 4.0;
  const reviewCount = Array.isArray(product.reviews)
    ? product.reviews.length
    : Number(product.reviewsCount) || 1;

  const ratingFactor = Math.min(1.0, Math.max(0.2, rating / 5.0));
  const credibilityFactor = Math.min(1.0, 0.7 + (Math.min(reviewCount, 25) / 25) * 0.3);

  return ratingFactor * credibilityFactor;
};

export const calculateStockFactor = (product) => {
  const stock = Number(product.stock !== undefined ? product.stock : product.quantity) || 0;
  if (stock <= 0) return 0.05;
  if (stock <= 4) return 0.85;
  return 1.0;
};

export const calculateFairExposureBoost = (product, vendorMeta = {}, query = '') => {
  const stock = Number(product.stock !== undefined ? product.stock : product.quantity) || 0;
  const rating = Number(product.rating) || 4.0;

  if (stock <= 0 || rating < 3.8) return 0;

  if (query && query.trim()) {
    const rel = calculateProductRelevance(product, query);
    if (rel < 15) return 0;
  }

  let boost = 0;

  const isEmerging = vendorMeta.isEmerging ||
    ['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(product.vendorId) ||
    (vendorMeta.totalOrdersFulfilled && vendorMeta.totalOrdersFulfilled < 200);

  if (isEmerging) {
    boost += 25;
  }

  if (vendorMeta.isVerified !== false) {
    boost += 5;
  }

  if (product.isFairExposureBoosted || product.badges?.includes('Fair Exposure Boost')) {
    boost += 10;
  }

  return boost;
};

export const rankProductsFairly = (products = [], options = {}) => {
  const { query = '', vendorMap = {}, sortBy = 'smart_discovery' } = options;

  if (!products || products.length === 0) return [];

  if (sortBy === 'price_asc') {
    return [...products].sort((a, b) => a.price - b.price);
  }
  if (sortBy === 'price_desc') {
    return [...products].sort((a, b) => b.price - a.price);
  }
  if (sortBy === 'rating_desc') {
    return [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  if (sortBy === 'newest') {
    return [...products].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  const scored = products.map((product) => {
    const vendorMeta = vendorMap[product.vendorId] || {};
    const relevance = calculateProductRelevance(product, query);
    const quality = calculateQualityMultiplier(product);
    const stockFactor = calculateStockFactor(product);
    const fairBoost = calculateFairExposureBoost(product, vendorMeta, query);

    const baseScore = relevance * quality * stockFactor;
    const finalScore = baseScore + fairBoost;

    return {
      product,
      score: finalScore,
      relevance,
      quality,
      stockFactor,
      fairBoost,
      isEmerging: vendorMeta.isEmerging || ['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(product.vendorId)
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const result = [];
  const remaining = [...scored];
  let consecutiveVendorId = null;
  let consecutiveCount = 0;

  while (remaining.length > 0) {
    let pickIndex = 0;

    if (consecutiveCount >= 2) {
      const altIndex = remaining.findIndex(item => item.product.vendorId !== consecutiveVendorId);
      if (altIndex !== -1) {
        pickIndex = altIndex;
      }
    }

    const picked = remaining.splice(pickIndex, 1)[0];
    result.push({
      ...picked.product,
      _fairDiscovery: {
        score: Math.round(picked.score),
        fairBoost: picked.fairBoost,
        isEmerging: picked.isEmerging
      }
    });

    if (picked.product.vendorId === consecutiveVendorId) {
      consecutiveCount++;
    } else {
      consecutiveVendorId = picked.product.vendorId;
      consecutiveCount = 1;
    }
  }

  return result;
};
