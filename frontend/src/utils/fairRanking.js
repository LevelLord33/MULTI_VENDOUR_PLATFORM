/**
 * Frontend Smart Vendor Discovery & Fair Product Exposure Engine
 * 
 * Provides merit-based, balanced search ranking:
 * 1. Product relevance (keyword matching across title, brand, tags, category, description)
 * 2. Stock availability factor (severe penalty for out of stock; no boost for OOS)
 * 3. Quality multiplier (rating + review count validation)
 * 4. Dynamic Fair exposure boost for high-performing emerging & less-discovered merchants
 *    (Calculated from real MongoDB metrics: orders, impressions, clicks, store views, join date)
 * 5. Diversity interleaving (prevents single-vendor domination / monopoly)
 */

export const SEARCH_SYNONYMS = {
  'laptop': ['macbook', 'notebook', 'chromebook', 'thinkpad', 'laptop', 'gaming laptop'],
  'laptops': ['macbook', 'notebook', 'chromebook', 'thinkpad', 'laptop', 'gaming laptop'],
  'phone': ['smartphone', 'iphone', 'mobile', 'android', 'cellphone'],
  'phones': ['smartphone', 'iphone', 'mobile', 'android', 'cellphone'],
  'mobile': ['smartphone', 'iphone', 'mobile', 'android', 'cellphone'],
  'mobiles': ['smartphone', 'iphone', 'mobile', 'android', 'cellphone'],
  'tv': ['television', 'smart tv', 'qled', 'oled', 'led tv'],
  'television': ['tv', 'smart tv', 'qled', 'oled', 'led tv'],
  'earbuds': ['earphones', 'headphones', 'airpods', 'tws', 'earbuds'],
  'earphone': ['earphones', 'headphones', 'airpods', 'tws', 'earbuds'],
  'earphones': ['earphones', 'headphones', 'airpods', 'tws', 'earbuds'],
  'headphone': ['headphones', 'earphones', 'headset', 'airpods', 'tws'],
  'headphones': ['headphones', 'earphones', 'headset', 'airpods', 'tws'],
  'watch': ['smartwatch', 'watch', 'timepiece'],
  'watches': ['smartwatch', 'watch', 'timepiece'],
  'shoe': ['sneakers', 'shoes', 'footwear', 'boots', 'loafers'],
  'shoes': ['sneakers', 'shoes', 'footwear', 'boots', 'loafers'],
};

/**
 * Checks whether a product genuinely matches a user search query.
 * Avoids incidental false-positives from long product descriptions
 * (e.g., eyeglasses describing light from laptops, or car chargers describing charging laptops).
 */
export const isProductSearchMatch = (product, query = '') => {
  if (!product) return false;
  if (!query || !query.trim()) return true;

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);

  const title = (product.name || product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const subCategory = (product.subCategory || '').toLowerCase();
  const sku = (product.sku || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.map(t => String(t).toLowerCase()) : [];
  const specs = product.specifications ? Object.values(product.specifications).map(v => String(v).toLowerCase()).join(' ') : '';

  // 1. Direct query match in primary product fields
  if (
    title.includes(q) ||
    brand.includes(q) ||
    category.includes(q) ||
    subCategory.includes(q) ||
    sku.includes(q) ||
    tags.some(t => t.includes(q)) ||
    specs.includes(q)
  ) {
    return true;
  }

  // 2. High-intent synonym matching
  const expandedSynonyms = new Set();
  tokens.forEach(tok => {
    if (SEARCH_SYNONYMS[tok]) {
      SEARCH_SYNONYMS[tok].forEach(syn => expandedSynonyms.add(syn));
    }
  });

  for (const syn of expandedSynonyms) {
    if (title.includes(syn) || brand.includes(syn) || category.includes(syn) || tags.some(t => t.includes(syn))) {
      return true;
    }
  }

  // 3. Multi-token match across core identity attributes
  const allTokensInPrimary = tokens.every(token =>
    title.includes(token) ||
    brand.includes(token) ||
    category.includes(token) ||
    subCategory.includes(token) ||
    sku.includes(token) ||
    tags.some(t => t.includes(token)) ||
    specs.includes(token)
  );
  if (allTokensInPrimary) return true;

  return false;
};

export const calculateProductRelevance = (product, query = '') => {
  if (!query || !query.trim()) return 100;

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  const title = (product.name || product.title || '').toLowerCase();
  const brand = (product.brand || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const subCategory = (product.subCategory || '').toLowerCase();
  const vendorName = (product.vendorName || '').toLowerCase();
  const tags = Array.isArray(product.tags) ? product.tags.map(t => String(t).toLowerCase()) : [];

  // Direct title match gets highest weighting
  if (title.includes(q)) score += 100;
  if (brand.includes(q)) score += 50;
  if (category.includes(q) || subCategory.includes(q)) score += 40;
  if (vendorName.includes(q)) score += 30;

  // Synonyms boost
  const expandedSynonyms = new Set();
  tokens.forEach(tok => {
    if (SEARCH_SYNONYMS[tok]) {
      SEARCH_SYNONYMS[tok].forEach(syn => expandedSynonyms.add(syn));
    }
  });

  expandedSynonyms.forEach(syn => {
    if (title.includes(syn)) score += 80;
    if (brand.includes(syn)) score += 40;
    if (category.includes(syn)) score += 30;
  });

  tokens.forEach((token) => {
    if (title.includes(token)) score += 35;
    if (brand.includes(token)) score += 25;
    if (tags.some(t => t.includes(token))) score += 20;
    if (category.includes(token) || subCategory.includes(token)) score += 15;
  });

  // Electronics category prioritization for computing devices
  if ((q.includes('laptop') || q.includes('macbook') || q.includes('computer')) && category.includes('electronic')) {
    score += 50;
  }

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
  const meta = vendorMeta || {};
  const stock = Number(product?.stock !== undefined ? product.stock : product?.quantity) || 0;
  const rating = Number(product?.rating) || 4.0;

  if (stock <= 0 || rating < 3.8) return 0;

  if (query && query.trim()) {
    const rel = calculateProductRelevance(product, query);
    if (rel < 15) return 0;
  }

  let boost = 0;

  const ordersFulfilled = Number(meta.totalOrdersFulfilled) || 0;
  const impressions = Number(meta.impressions || meta.visits || 0);

  if (ordersFulfilled < 150) {
    boost += 28;
  } else if (ordersFulfilled < 350) {
    boost += 16;
  }

  if (impressions < 500) {
    boost += 8;
  }

  if (meta.isVerified !== false) {
    boost += 5;
  }

  if (product?.isFairExposureBoosted || product?.badges?.includes('Fair Exposure Boost')) {
    boost += 10;
  }

  return boost;
};

export const rankProductsFairly = (products = [], options = {}) => {
  const { query = '', vendorMap = {}, sortBy = 'smart_discovery' } = options || {};

  if (!products || products.length === 0) return [];

  if (sortBy === 'price_asc') {
    return [...products].sort((a, b) => (Number(a?.price) || 0) - (Number(b?.price) || 0));
  }
  if (sortBy === 'price_desc') {
    return [...products].sort((a, b) => (Number(b?.price) || 0) - (Number(a?.price) || 0));
  }
  if (sortBy === 'rating_desc') {
    return [...products].sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0));
  }
  if (sortBy === 'newest') {
    return [...products].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }

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

  scored.sort((a, b) => b.score - a.score);

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
