import assert from 'assert';
import { seedVendors, seedProducts, CATEGORIES } from '../data/seedData.js';
import {
  calculateProductRelevance,
  calculateQualityMultiplier,
  calculateStockFactor,
  calculateFairExposureBoost,
  rankProductsFairly
} from '../utils/fairRanking.js';

console.log('🧪 Starting Fair Discovery & Product Exposure Comprehensive Test Suite...\n');

// ── Test 1: 10 Vendors Validation ─────────────────────────
console.log('▶ Test 1: Verifying 10 realistic demo vendors...');
assert.strictEqual(seedVendors.length, 10, `Expected 10 vendors, got ${seedVendors.length}`);

const vendorIds = seedVendors.map(v => v.id);
['v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9', 'v10'].forEach(id => {
  assert(vendorIds.includes(id), `Missing vendor ${id}`);
});

seedVendors.forEach(v => {
  assert(v.businessName, `Vendor ${v.id} missing businessName`);
  assert(v.location, `Vendor ${v.id} missing location`);
  assert(v.gstin, `Vendor ${v.id} missing gstin`);
  assert(v.storeRating >= 4.0, `Vendor ${v.id} rating too low`);
  assert(v.storeSlug, `Vendor ${v.id} missing storeSlug`);
});
console.log('✅ Passed: All 10 vendors defined with locations across India, GSTIN, and ratings.\n');

// ── Test 2: 150 Products (15 per vendor) Validation ───────
console.log('▶ Test 2: Verifying 150 products (exactly 15 per vendor)...');
assert.strictEqual(seedProducts.length, 150, `Expected 150 products, got ${seedProducts.length}`);

const productCountByVendor = {};
seedProducts.forEach(p => {
  productCountByVendor[p.vendorId] = (productCountByVendor[p.vendorId] || 0) + 1;
  assert(p.name, `Product ${p.id} missing name`);
  assert(p.sku, `Product ${p.id} missing sku`);
  assert(p.category, `Product ${p.id} missing category`);
  assert(p.price > 0, `Product ${p.id} price must be > 0`);
  assert(p.mrp >= p.price, `Product ${p.id} MRP (${p.mrp}) must be >= price (${p.price})`);
  assert(p.stock !== undefined && p.stock >= 0, `Product ${p.id} invalid stock`);
  assert(p.images && p.images.length > 0, `Product ${p.id} missing images`);
  assert(p.shipping && p.shipping.courierPartners, `Product ${p.id} missing shipping specs`);
  assert(p.variants, `Product ${p.id} missing variants`);
});

for (let i = 1; i <= 10; i++) {
  const vid = `v${i}`;
  assert.strictEqual(
    productCountByVendor[vid],
    15,
    `Vendor ${vid} must have exactly 15 products, found ${productCountByVendor[vid]}`
  );
}
console.log('✅ Passed: Exactly 15 realistic products per vendor (150 total) with full attributes.\n');

// ── Test 3: Fair Exposure Ranking Algorithm ─────────────────
console.log('▶ Test 3: Testing Smart Discovery & Fair Ranking Algorithm...');

const vendorMap = {};
seedVendors.forEach(v => { vendorMap[v.id] = v; });

// 3A: Guardrail - Out of Stock items must NOT get Fair Exposure Boost
const oosProduct = {
  id: 'test-oos',
  name: 'Wireless Studio Microphone',
  category: 'Electronics',
  price: 9999,
  stock: 0,
  rating: 4.9,
  vendorId: 'v10' // Emerging vendor
};
const oosBoost = calculateFairExposureBoost(oosProduct, vendorMap['v10'], 'microphone');
assert.strictEqual(oosBoost, 0, 'Out of stock items must NOT receive any Fair Exposure Boost');
console.log('  ✓ Guardrail passed: Out-of-stock items get 0 boost');

// 3B: Guardrail - Irrelevant items must NOT get Fair Exposure Boost on search
const irrelevantProduct = {
  id: 'test-irrel',
  name: 'Pure Banarasi Silk Saree',
  category: 'Fashion',
  price: 15000,
  stock: 10,
  rating: 4.9,
  vendorId: 'v6' // Emerging vendor
};
const irrelBoost = calculateFairExposureBoost(irrelevantProduct, vendorMap['v6'], 'smartwatch microphone headphones');
assert.strictEqual(irrelBoost, 0, 'Irrelevant items must NOT receive Fair Exposure Boost');
console.log('  ✓ Guardrail passed: Irrelevant items get 0 boost during search queries');

// 3C: Emerging vendor with relevant, in-stock, high-quality product DOES get boost
const emergingProduct = {
  id: 'test-emerging',
  name: 'Professional Studio Cardioid Condenser Microphone',
  category: 'Electronics',
  brand: 'SoundMaster',
  price: 8499,
  stock: 12,
  rating: 4.9,
  reviews: [{}, {}, {}],
  vendorId: 'v10'
};
const validBoost = calculateFairExposureBoost(emergingProduct, vendorMap['v10'], 'condenser microphone');
assert(validBoost >= 25, `Expected emerging vendor boost >= 25, got ${validBoost}`);
console.log(`  ✓ Boost verified: High-quality emerging vendor received +${validBoost} fair exposure boost`);

// 3D: Search Ranking Interleaving
const searchResults = rankProductsFairly(seedProducts, {
  query: 'wireless',
  vendorMap,
  sortBy: 'smart_discovery'
});

assert(searchResults.length > 0, 'Search results must not be empty');
console.log(`  ✓ Search for "wireless" returned ${searchResults.length} ranked products`);

// Verify vendor diversity interleaving (no 3 consecutive from same vendor)
let prevVid = null;
let consecutive = 0;
for (let i = 0; i < Math.min(20, searchResults.length); i++) {
  const vid = searchResults[i].vendorId;
  if (vid === prevVid) {
    consecutive++;
    assert(consecutive <= 2, `Vendor ${vid} appeared more than 2 times consecutively at position ${i}`);
  } else {
    prevVid = vid;
    consecutive = 1;
  }
}
console.log('  ✓ Interleaving verified: Top 20 search results contain at most 2 consecutive items per vendor');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Vendor Discovery & Fair Product Exposure system is fully verified.');
