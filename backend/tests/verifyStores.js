import {
  getStores,
  getFeaturedStores,
  getStoreCategories,
  getStoreSeoMetadata
} from '../controllers/storeController.js';

function mockReqRes(params = {}, query = {}, body = {}) {
  let responseData = null;
  let responseStatus = 200;
  const res = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    }
  };
  const req = { params, query, body };
  return {
    req,
    res,
    getResult: () => ({ status: responseStatus, data: responseData })
  };
}

async function runTests() {
  console.log('🏬 Running Store Promotion & Discoverability Verification Suite...\n');
  let passed = 0;
  let total = 0;

  const assert = (condition, desc) => {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  };

  // Test 1: getStores (General listing)
  {
    const { req, res, getResult } = mockReqRes({}, {});
    await getStores(req, res);
    const result = getResult();

    assert(
      result.status === 200 && result.data?.success === true && Array.isArray(result.data?.stores),
      'getStores returns HTTP 200 and array of active stores'
    );
    assert(
      result.data.stores.length > 0 &&
      result.data.stores[0]?.businessName &&
      result.data.stores[0]?.storeSlug &&
      result.data.stores[0]?.category,
      `Store object contains valid businessName (${result.data.stores[0]?.businessName}), slug, and category (${result.data.stores[0]?.category})`
    );
    assert(
      Array.isArray(result.data.stores[0]?.sampleProducts),
      'Store object includes sample physical inventory products'
    );
  }

  // Test 2: getStores with search query
  {
    const { req, res, getResult } = mockReqRes({}, { search: 'TechZone' });
    await getStores(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.data.stores.length > 0 &&
      result.data.stores.every((s) => s.businessName.toLowerCase().includes('techzone') || s.storeSlug.includes('techzone')),
      'getStores filters accurately by search query ("TechZone")'
    );
  }

  // Test 3: getStores with category filter
  {
    const { req, res, getResult } = mockReqRes({}, { category: 'Fashion' });
    await getStores(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.data.stores.length > 0 &&
      result.data.stores.some((s) => s.category.includes('Fashion')),
      'getStores filters accurately by category ("Fashion")'
    );
  }

  // Test 4: getStores with rating sorting
  {
    const { req, res, getResult } = mockReqRes({}, { sortBy: 'rating' });
    await getStores(req, res);
    const result = getResult();

    const stores = result.data.stores;
    let isSorted = true;
    for (let i = 0; i < stores.length - 1; i++) {
      if (stores[i].storeRating < stores[i + 1].storeRating) {
        isSorted = false;
        break;
      }
    }
    assert(isSorted, 'getStores sorts stores by storeRating descending');
  }

  // Test 5: getFeaturedStores
  {
    const { req, res, getResult } = mockReqRes({}, {});
    await getFeaturedStores(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.data?.success === true &&
      Array.isArray(result.data?.featuredStores) &&
      result.data.featuredStores.length > 0,
      `getFeaturedStores returns top featured merchants (${result.data?.featuredStores?.length} stores)`
    );
  }

  // Test 6: getStoreCategories
  {
    const { req, res, getResult } = mockReqRes({}, {});
    await getStoreCategories(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.data?.success === true &&
      Array.isArray(result.data?.categories) &&
      result.data.categories.length >= 4,
      `getStoreCategories returns categories dictionary (${result.data?.categories?.length} categories)`
    );
    assert(
      result.data.categories[0]?.id === 'all' && result.data.categories[0]?.count > 0,
      'Categories include "All Stores" with aggregate count'
    );
  }

  // Test 7: getStoreSeoMetadata
  {
    const { req, res, getResult } = mockReqRes({ slug: 'techzone' }, {});
    await getStoreSeoMetadata(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.data?.success === true &&
      result.data.seo?.title?.includes('TechZone') &&
      result.data.seo?.canonicalUrl?.includes('/store/techzone'),
      'getStoreSeoMetadata returns title, meta description, and canonical URL'
    );
    assert(
      result.data.seo?.jsonLd?.['@type'] === 'Store' &&
      result.data.seo?.jsonLd?.name?.includes('TechZone') &&
      result.data.seo?.jsonLd?.aggregateRating?.ratingValue !== undefined,
      'getStoreSeoMetadata produces valid Schema.org/Store JSON-LD structured data'
    );
  }

  console.log(`\n🎉 Results: ${passed}/${total} store discoverability tests passed!\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error in store discoverability tests:', err);
  process.exit(1);
});
