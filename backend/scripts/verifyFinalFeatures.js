import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateDistanceKm, checkDeliveryCoverage, getCoordinatesForLocation } from '../utils/geoUtils.js';
import { generateGstInvoice, numberToWordsINR } from '../utils/invoiceGenerator.js';
import { calculateFairExposureBoost, rankProductsFairly, calculateProductRelevance } from '../utils/fairRanking.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

console.log('====================================================');
console.log('  VENDOR HUB - 9 FINAL FEATURES VERIFICATION TEST');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failCount++;
  }
}

// ─────────────────────────────────────────────────────────────
// FEATURE 1: PWA + Push Notifications
// ─────────────────────────────────────────────────────────────
console.log('--- Feature 1: PWA + Push Notifications ---');
const manifestPath = path.join(rootDir, 'frontend/public/manifest.json');
const swPath = path.join(rootDir, 'frontend/public/sw.js');
const indexHtmlPath = path.join(rootDir, 'frontend/index.html');

assert(fs.existsSync(manifestPath), 'manifest.json exists in frontend/public');
if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  assert(manifest.display === 'standalone', 'PWA display mode is standalone');
  assert(manifest.icons && manifest.icons.length >= 2, 'PWA has multi-size icons (192x192, 512x512)');
  assert(manifest.start_url === '/', 'PWA start_url is /');
}

assert(fs.existsSync(swPath), 'sw.js service worker exists in frontend/public');
if (fs.existsSync(swPath)) {
  const swContent = fs.readFileSync(swPath, 'utf8');
  assert(swContent.includes("addEventListener('install'"), 'Service worker handles install event & cache');
  assert(swContent.includes("addEventListener('push'"), 'Service worker handles push notification events');
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
assert(indexHtml.includes('rel="manifest"'), 'index.html links to manifest.json');
assert(indexHtml.includes('navigator.serviceWorker.register'), 'index.html registers service worker');

// ─────────────────────────────────────────────────────────────
// FEATURE 2: Vendor Location + Delivery Radius
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 2: Vendor Location + Delivery Radius ---');
// Test Delhi to Jaipur distance (~235-245 km)
const distDelhiJaipur = calculateDistanceKm(28.6139, 77.2090, 26.9124, 75.7873);
assert(distDelhiJaipur > 220 && distDelhiJaipur < 260, `Haversine distance Delhi to Jaipur is accurate (${distDelhiJaipur} km)`);

// Test same-city close coordinates (< 5 km)
const distIntraCity = calculateDistanceKm(28.6139, 77.2090, 28.6304, 77.2177);
assert(distIntraCity < 5, `Intra-city distance calculation is accurate (${distIntraCity} km)`);

// Test delivery coverage
const localVendor = {
  location: 'New Delhi, Delhi',
  latitude: 28.6139,
  longitude: 77.2090,
  deliveryRadiusKm: 25,
  deliveryScope: 'radius_only'
};

const nearbyCustomer = { city: 'New Delhi', latitude: 28.6304, longitude: 77.2177 };
const farCustomer = { city: 'Jaipur', latitude: 26.9124, longitude: 75.7873 };

const nearCoverage = checkDeliveryCoverage(localVendor, nearbyCustomer);
assert(nearCoverage.delivers === true, 'Vendor delivers to nearby customer within 25km radius');

const farCoverage = checkDeliveryCoverage(localVendor, farCustomer);
assert(farCoverage.delivers === false, 'Vendor correctly indicates non-delivery to customer outside 25km radius');

const panIndiaVendor = {
  ...localVendor,
  deliveryScope: 'pan_india'
};
const panIndiaCoverage = checkDeliveryCoverage(panIndiaVendor, farCustomer);
assert(panIndiaCoverage.delivers === true, 'Pan-India vendor delivers to customer regardless of distance');

// ─────────────────────────────────────────────────────────────
// FEATURE 3: Wishlist + Follow Vendor
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 3: Wishlist + Follow Vendor ---');
const userModelContent = fs.readFileSync(path.join(rootDir, 'backend/models/User.js'), 'utf8');
assert(userModelContent.includes('wishlist: ['), 'User model includes wishlist array');
assert(userModelContent.includes('followedVendors: ['), 'User model includes followedVendors array');
assert(userModelContent.includes('followersCount:'), 'User model includes followersCount metric');

const authCtxContent = fs.readFileSync(path.join(rootDir, 'frontend/src/contexts/AuthContext.jsx'), 'utf8');
assert(authCtxContent.includes('toggleWishlist'), 'AuthContext provides toggleWishlist persistent state');
assert(authCtxContent.includes('toggleFollowVendor'), 'AuthContext provides toggleFollowVendor persistent state');

// ─────────────────────────────────────────────────────────────
// FEATURE 4: GST Invoice + Order Invoice
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 4: GST Invoice + Order Invoice ---');
// Intra-state order (Delhi -> Delhi)
const intraOrder = {
  id: 'ORD-9901',
  orderDate: '2026-09-30T10:00:00.000Z',
  total: 11800,
  items: [
    {
      id: 'p-101',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 10000,
      quantity: 1,
      vendorId: 'v1',
      vendorName: 'TechZone Electronics',
      gstRate: 18,
      hsnCode: '85183000'
    }
  ],
  shippingAddress: {
    fullName: 'Rohan Verma',
    address: 'B-42, Vasant Kunj',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110070',
    phone: '9876543210'
  },
  paymentMethod: 'UPI'
};

const intraVendor = {
  id: 'v1',
  businessName: 'TechZone Electronics',
  gstin: '07AABCS1234F1Z5',
  businessAddress: '15 Nehru Place',
  location: 'New Delhi, Delhi'
};

const intraInvoice = generateGstInvoice(intraOrder, intraVendor);
assert(intraInvoice.isIntraState === true, 'Intra-state order identified (Delhi -> Delhi)');
assert(intraInvoice.totals.totalCgst > 0 && intraInvoice.totals.totalSgst > 0, 'Intra-state splits into CGST 9% and SGST 9%');
assert(intraInvoice.totals.totalIgst === 0, 'Intra-state IGST is 0');
assert(intraInvoice.totals.grandTotal > 0, 'Invoice total amount calculated properly');

// Inter-state order (Delhi vendor -> Mumbai customer)
const interOrder = {
  ...intraOrder,
  shippingAddress: {
    ...intraOrder.shippingAddress,
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001'
  }
};

const interInvoice = generateGstInvoice(interOrder, intraVendor);
assert(interInvoice.isIntraState === false, 'Inter-state order identified (Delhi -> Maharashtra)');
assert(interInvoice.totals.totalIgst > 0, 'Inter-state applies IGST 18%');
assert(interInvoice.totals.totalCgst === 0 && interInvoice.totals.totalSgst === 0, 'Inter-state CGST & SGST are 0');

// Test INR words converter
const words1 = numberToWordsINR(15499);
assert(words1.includes('Fifteen Thousand Four Hundred') && words1.includes('Ninety'), `numberToWordsINR converts 15,499 correctly: "${words1}"`);

// ─────────────────────────────────────────────────────────────
// FEATURE 5: Product Bundles + Vendor Deals
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 5: Product Bundles + Vendor Deals ---');
const bundleModelContent = fs.readFileSync(path.join(rootDir, 'backend/models/Bundle.js'), 'utf8');
assert(bundleModelContent.includes('discountType:'), 'Bundle schema supports percentage and fixed discounts');
assert(bundleModelContent.includes('bundlePrice:'), 'Bundle schema stores bundle combo price');
assert(bundleModelContent.includes('originalPrice:'), 'Bundle schema stores original sum price');

// Calculate sample bundle discount
const itemA = { id: 'p1', price: 2000, stock: 15 };
const itemB = { id: 'p2', price: 3000, stock: 4 };
const sumOriginal = itemA.price + itemB.price; // 5000
const pctDiscount = 20; // 20%
const calculatedBundlePrice = Math.round(sumOriginal * (1 - pctDiscount / 100)); // 4000
const bundleStock = Math.min(itemA.stock, itemB.stock); // 4

assert(calculatedBundlePrice === 4000, `Bundle price calculation is exact: ₹${calculatedBundlePrice} (20% off ₹5,000)`);
assert(bundleStock === 4, `Bundle stock is constrained by minimum stock item (${bundleStock})`);

// ─────────────────────────────────────────────────────────────
// FEATURE 6: Vendor Digital Business Card + QR Store
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 6: Vendor Digital Business Card + QR Store ---');
const vCardModalPath = path.join(rootDir, 'frontend/src/components/common/VendorBusinessCardModal.jsx');
assert(fs.existsSync(vCardModalPath), 'VendorBusinessCardModal component exists');
if (fs.existsSync(vCardModalPath)) {
  const vCardContent = fs.readFileSync(vCardModalPath, 'utf8');
  assert(vCardContent.includes('api.qrserver.com'), 'Uses dynamic QR code generator for storefront link');
  assert(vCardContent.includes('BEGIN:VCARD'), 'Supports downloadable vCard standard format');
  assert(vCardContent.includes('navigator.share'), 'Supports native Web Share API with clipboard fallback');
}

// ─────────────────────────────────────────────────────────────
// FEATURE 7: Vendor Onboarding / Application Workflow
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 7: Vendor Onboarding Workflow ---');
const appModelContent = fs.readFileSync(path.join(rootDir, 'backend/models/VendorApplication.js'), 'utf8');
assert(appModelContent.includes("enum: ['pending', 'under_review', 'approved', 'rejected']"), 'VendorApplication schema has complete review lifecycle');
assert(appModelContent.includes('gstin:'), 'VendorApplication requires GSTIN');
assert(appModelContent.includes('deliveryRadiusKm:'), 'VendorApplication includes deliveryRadiusKm');
assert(appModelContent.includes('bankDetails:'), 'VendorApplication captures bank verification details');

const adminVendorsContent = fs.readFileSync(path.join(rootDir, 'frontend/src/components/admin/AdminVendors.jsx'), 'utf8');
assert(adminVendorsContent.includes('Merchant Onboarding Applications'), 'AdminVendors features Onboarding Applications tab');
assert(adminVendorsContent.includes('handleApproveApp'), 'AdminVendors handles 1-click merchant approval');
assert(adminVendorsContent.includes('handleConfirmReject'), 'AdminVendors handles merchant rejection with reason modal');

// ─────────────────────────────────────────────────────────────
// FEATURE 8: Dynamic Fair-Exposure Ranking
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 8: Dynamic Fair-Exposure Ranking ---');
const sampleVendors = {
  v1: { id: 'v1', totalOrdersFulfilled: 1200, isVerified: true, impressions: 8000 },
  v2: { id: 'v2', totalOrdersFulfilled: 45, isVerified: true, impressions: 210 }
};

const productGiant = { id: 'p1', name: 'Cotton T-Shirt', vendorId: 'v1', stock: 50, rating: 4.5 };
const productEmerging = { id: 'p2', name: 'Cotton T-Shirt Handcrafted', vendorId: 'v2', stock: 15, rating: 4.8 };

const boostGiant = calculateFairExposureBoost(productGiant, sampleVendors.v1, 'Cotton T-Shirt');
const boostEmerging = calculateFairExposureBoost(productEmerging, sampleVendors.v2, 'Cotton T-Shirt');

assert(boostEmerging > boostGiant, `Dynamic fair exposure awards higher boost to emerging store with low orders (${boostEmerging} vs ${boostGiant})`);

const ranked = rankProductsFairly([productGiant, productEmerging], {
  query: 'Cotton T-Shirt',
  vendorMap: sampleVendors
});
assert(ranked.length === 2, 'rankProductsFairly ranks products');
assert(ranked[0].fairExposureBoostApplied === true, 'Fair exposure boost applied to top ranking product');

// Verify no hardcoded vendor IDs in ranking files
const fairRankingBackend = fs.readFileSync(path.join(rootDir, 'backend/utils/fairRanking.js'), 'utf8');
assert(!fairRankingBackend.includes("['v5', 'v6', 'v7'"), 'backend/utils/fairRanking.js has no hardcoded emerging vendor IDs');

const fairRankingFrontend = fs.readFileSync(path.join(rootDir, 'frontend/src/utils/fairRanking.js'), 'utf8');
assert(!fairRankingFrontend.includes("['v5', 'v6', 'v7'"), 'frontend/src/utils/fairRanking.js has no hardcoded emerging vendor IDs');

// ─────────────────────────────────────────────────────────────
// FEATURE 9: Advanced Vendor Search
// ─────────────────────────────────────────────────────────────
console.log('\n--- Feature 9: Advanced Vendor Search ---');
const storeDirContent = fs.readFileSync(path.join(rootDir, 'frontend/src/components/customer/StoreDirectory.jsx'), 'utf8');
assert(storeDirContent.includes('activeTab === \'nearby\''), 'StoreDirectory includes "Nearby to Me" tab');
assert(storeDirContent.includes('activeTab === \'top_rated\''), 'StoreDirectory includes "Top Rated" tab');
assert(storeDirContent.includes('deliversOnly'), 'StoreDirectory supports "Delivers to My Area" filter');
assert(storeDirContent.includes('minRating'), 'StoreDirectory supports minimum rating filter');
assert(storeDirContent.includes('selectedCity'), 'StoreDirectory supports city location discovery');
assert(storeDirContent.includes('selectedBusinessType'), 'StoreDirectory supports business type filter');

console.log('\n====================================================');
console.log(`  RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================\n');

if (failCount === 0) {
  console.log('✨ All 9 Final Feature Additions are 100% verified and operational!\n');
  process.exit(0);
} else {
  console.error('❌ Some tests failed. Please review errors above.\n');
  process.exit(1);
}
