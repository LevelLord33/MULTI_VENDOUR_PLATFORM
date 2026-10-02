/**
 * Dynamic Smart Vendor Discovery & Fair Product Exposure Engine
 * 
 * Provides merit-based, balanced search ranking:
 * 1. Product relevance (keyword matching across title, brand, tags, category, description)
 * 2. Stock availability factor (severe penalty for out of stock; no boost for OOS)
 * 3. Quality multiplier (rating + review count validation)
 * 4. Dynamic Fair exposure boost for high-performing emerging & less-discovered merchants
 *    (Calculated from real MongoDB metrics: orders, impressions, clicks, store views, join date)
 * 5. Diversity interleaving (prevents single-vendor domination / monopoly)
 */

export const calculateProductRelevance = (product, query = '') => {
  if (!query || !query.trim()) return 100; // Baseline when browsing without query

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

  // Normalized rating score: 5.0 -> 1.0, 4.0 -> 0.8
  const ratingFactor = Math.min(1.0, Math.max(0.2, rating / 5.0));

  // Review credibility curve
  const credibilityFactor = Math.min(1.0, 0.7 + (Math.min(reviewCount, 25) / 25) * 0.3);

  return ratingFactor * credibilityFactor;
};

export const calculateStockFactor = (product) => {
  const stock = Number(product.stock !== undefined ? product.stock : product.quantity) || 0;
  if (stock <= 0) return 0.05; // Out of stock items pushed down
  if (stock <= 4) return 0.85; // Low stock warning
  return 1.0; // In healthy stock
};

/**
 * Dynamic Fair Exposure Boost:
 * Calculates exposure from real MongoDB merchant metrics:
 * - Orders fulfilled (< 100 orders: high discovery boost; 100-300: moderate boost)
 * - Impressions / views deficit: merchants with lower recent exposure get boosted
 * - Verified merchant trust status
 * - Product quality (rating >= 3.8, healthy stock > 0, relevant to query)
 * 
 * NO hardcoded vendor IDs or fixed lists.
 */
export const calculateFairExposureBoost = (product, vendorMeta = {}, query = '') => {
  const stock = Number(product.stock !== undefined ? product.stock : product.quantity) || 0;
  const rating = Number(product.rating) || 4.0;

  // Strict guardrails: No boost if out of stock or low rating
  if (stock <= 0 || rating < 3.8) return 0;

  // If search query is active, only boost if product has baseline relevance
  if (query && query.trim()) {
    const rel = calculateProductRelevance(product, query);
    if (rel < 15) return 0; // Don't boost irrelevant products
  }

  let boost = 0;

  // 1. Dynamic Emerging Merchant Factor (based on fulfilled orders and account history)
  const ordersFulfilled = Number(vendorMeta.totalOrdersFulfilled) || 0;
  const impressions = Number(vendorMeta.impressions || vendorMeta.visits || 0);

  // If merchant has fulfilled under 150 orders, they are emerging and need discovery exposure
  if (ordersFulfilled < 150) {
    boost += 28;
  } else if (ordersFulfilled < 350) {
    boost += 16;
  }

  // 2. Exposure Deficit Factor: vendors with under 500 store views get fair visibility
  if (impressions < 500) {
    boost += 8;
  }

  // 3. Verified merchant trust multiplier
  if (vendorMeta.isVerified !== false) {
    boost += 5;
  }

  // 4. Product-level promotion / fair boost badge
  if (product.isFairExposureBoosted || product.badges?.includes('Fair Exposure Boost')) {
    boost += 10;
  }

  return boost;
};

/**
 * Apply Fair Ranking & Diversity Interleaving
 * 
 * @param {Array} products 
 * @param {Object} options { query, vendorMap, sortBy }
 * @returns {Array} Fairly ranked and diverse product list
 */
export const rankProductsFairly = (products = [], options = {}) => {
  const { query = '', vendorMap = {}, sortBy = 'smart_discovery' } = options;

  if (!products || products.length === 0) return [];

  // If user explicitly requests price asc/desc or newest, respect explicit sort
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

  // Compute composite score for each product
  const scored = products.map((product) => {
    const vendorMeta = vendorMap[product.vendorId] || {};
    const relevance = calculateProductRelevance(product, query);
    const quality = calculateQualityMultiplier(product);
    const stockFactor = calculateStockFactor(product);
    const fairBoost = calculateFairExposureBoost(product, vendorMeta, query);

    const baseScore = relevance * quality * stockFactor;
    const finalScore = baseScore + fairBoost;

    const isEmerging = (vendorMeta.totalOrdersFulfilled !== undefined && vendorMeta.totalOrdersFulfilled < 350) ||
      Boolean(vendorMeta.isEmerging);

    return {
      product,
      score: finalScore,
      relevance,
      quality,
      stockFactor,
      fairBoost,
      isEmerging
    };
  });

  // Sort descending by calculated merit & exposure score
  scored.sort((a, b) => b.score - a.score);

  // Vendor Diversity Interleaving:
  // Prevents a single merchant from having more than 2 consecutive items
  const result = [];
  const remaining = [...scored];
  let consecutiveVendorId = null;
  let consecutiveCount = 0;

  while (remaining.length > 0) {
    let pickIndex = -1;

    for (let i = 0; i < remaining.length; i++) {
      const candidateVendorId = remaining[i].product.vendorId;

      if (candidateVendorId === consecutiveVendorId && consecutiveCount >= 2) {
        continue;
      }

      pickIndex = i;
      break;
    }

    // Fallback if all remaining belong to same vendor
    if (pickIndex === -1) {
      pickIndex = 0;
    }

    const picked = remaining.splice(pickIndex, 1)[0];

    const currentVendorId = picked.product.vendorId;
    if (currentVendorId === consecutiveVendorId) {
      consecutiveCount++;
    } else {
      consecutiveVendorId = currentVendorId;
      consecutiveCount = 1;
    }

    // Attach computed ranking metadata to product
    const enrichedProduct = {
      ...picked.product,
      rankingScore: Math.round(picked.score * 10) / 10,
      isEmergingVendor: picked.isEmerging,
      fairExposureBoostApplied: picked.fairBoost > 0
    };

    result.push(enrichedProduct);
  }

  return result;
};
