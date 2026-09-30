import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { additionalVendors, additionalProducts } from './completeSeedGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function run() {
  console.log('Loading existing seed data from backend/data/seedData.js...');
  const backendSeedModule = await import('../data/seedData.js');

  const existingVendors = backendSeedModule.seedVendors || [];
  const existingProducts = backendSeedModule.seedProducts || [];
  const existingCustomers = backendSeedModule.seedCustomers || [];
  const adminCreds = backendSeedModule.ADMIN_CREDENTIALS;
  const categories = backendSeedModule.CATEGORIES || [];
  const existingConversations = backendSeedModule.seedConversations || [];
  const existingOrders = backendSeedModule.seedOrders || [];
  const existingPromotions = backendSeedModule.seedPromotions || [];

  console.log(`Current vendors: ${existingVendors.length}, Current products: ${existingProducts.length}`);

  // Deduplicate and merge vendors
  const vendorIds = new Set(existingVendors.map(v => v.id));
  const mergedVendors = [...existingVendors];
  for (const v of additionalVendors) {
    if (!vendorIds.has(v.id)) {
      mergedVendors.push(v);
      vendorIds.add(v.id);
    }
  }

  // Deduplicate and merge products
  const productIds = new Set(existingProducts.map(p => p.id));
  const mergedProducts = [...existingProducts];
  for (const p of additionalProducts) {
    if (!productIds.has(p.id)) {
      mergedProducts.push(p);
      productIds.add(p.id);
    }
  }

  // Ensure "Automotive" is in categories
  const mergedCategories = Array.from(new Set([...categories, 'Automotive']));

  console.log(`Merged vendors: ${mergedVendors.length}, Merged products: ${mergedProducts.length}`);

  const fileHeader = `// ─────────────────────────────────────────────
//  Vendor Hub · Multi-Vendor Physical Marketplace Seed Data
//  20 Verified Merchants · 250 Catalog SKUs
// ─────────────────────────────────────────────

`;

  const backendContent = `${fileHeader}export const ADMIN_CREDENTIALS = ${JSON.stringify(adminCreds, null, 2)};

export const CATEGORIES = ${JSON.stringify(mergedCategories, null, 2)};

// ── 20 Physical Merchants ────────────────────────
export const seedVendors = ${JSON.stringify(mergedVendors, null, 2)};

// ── 5 Customers ─────────────────────────────────
export const seedCustomers = ${JSON.stringify(existingCustomers, null, 2)};

// ── 250 Physical Products ────────────────────────
export const seedProducts = ${JSON.stringify(mergedProducts, null, 2)};

// ── Active Promotions ───────────────────────────
export const seedPromotions = ${JSON.stringify(existingPromotions, null, 2)};

// ── Orders ─────────────────────────────────────
export const seedOrders = ${JSON.stringify(existingOrders, null, 2)};

// ── Conversations ──────────────────────────────
export const seedConversations = ${JSON.stringify(existingConversations, null, 2)};
`;

  const backendPath = path.resolve(__dirname, '../data/seedData.js');
  const frontendPath = path.resolve(__dirname, '../../frontend/src/data/seedData.js');

  fs.writeFileSync(backendPath, backendContent, 'utf8');
  console.log(`✅ Successfully updated ${backendPath}`);

  fs.writeFileSync(frontendPath, backendContent, 'utf8');
  console.log(`✅ Successfully updated ${frontendPath}`);
}

run().catch(err => {
  console.error('Merge error:', err);
  process.exit(1);
});
