import { getVendorAnalytics, recordStoreVisit, exportVendorAnalyticsReport } from '../controllers/analyticsController.js';

function mockReqRes(params = {}, query = {}, body = {}) {
  let responseData = null;
  let responseStatus = 200;
  let headers = {};
  const res = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
    setHeader(key, value) {
      headers[key] = value;
      return this;
    },
    send(data) {
      responseData = data;
      return this;
    }
  };
  const req = { params, query, body };
  return {
    req,
    res,
    getResult: () => ({ status: responseStatus, data: responseData, headers })
  };
}

async function runTests() {
  console.log('📊 Running Vendor Growth & Analytics Verification Suite...\n');
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

  // Test 1: getVendorAnalytics for 30D (Default)
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    assert(result.status === 200 && result.data?.success === true, 'getVendorAnalytics returns HTTP 200 and success: true');
    assert(result.data?.kpis?.grossRevenue > 0, `kpis.grossRevenue is calculated (₹${result.data?.kpis?.grossRevenue})`);
    assert(result.data?.kpis?.netEarnings > 0, `kpis.netEarnings is calculated (₹${result.data?.kpis?.netEarnings})`);
    assert(result.data?.kpis?.ordersCount > 0, `kpis.ordersCount is calculated (${result.data?.kpis?.ordersCount} orders)`);
    assert(result.data?.kpis?.averageOrderValue > 0, `kpis.averageOrderValue is calculated (₹${result.data?.kpis?.averageOrderValue})`);
    assert(result.data?.kpis?.conversionRate > 0, `kpis.conversionRate is calculated (${result.data?.kpis?.conversionRate}%)`);
  }

  // Test 2: Sales Velocity Trends (Time-series data)
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    assert(
      Array.isArray(result.data?.trendData) && result.data.trendData.length > 0,
      `trendData contains time-series data points (${result.data?.trendData?.length} intervals)`
    );
    assert(
      result.data.trendData[0]?.date && result.data.trendData[0]?.revenue !== undefined,
      'trendData data point contains valid date, label, orders, and revenue fields'
    );
  }

  // Test 3: Product SKU Performance Ranking
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    assert(
      Array.isArray(result.data?.productPerformance) && result.data.productPerformance.length > 0,
      `productPerformance contains ranked SKUs (${result.data?.productPerformance?.length} products)`
    );
    const topProd = result.data.productPerformance[0];
    assert(
      topProd?.sku && topProd?.revenue >= 0 && topProd?.stockStatus,
      `Top product contains valid SKU (${topProd?.sku}), revenue (₹${topProd?.revenue}), and stockStatus (${topProd?.stockStatus})`
    );
  }

  // Test 4: Conversion Funnel
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    assert(
      Array.isArray(result.data?.funnel) && result.data.funnel.length === 4,
      'funnel contains 4 stages (Visitors ➔ Views ➔ Cart ➔ Orders)'
    );
    assert(
      result.data.funnel[0].conversionRate === 100 && result.data.funnel[3].conversionRate > 0,
      `funnel conversion rates are properly graduated (Final: ${result.data.funnel[3].conversionRate}%)`
    );
  }

  // Test 5: Customer & Order Insights (Payment & Geography)
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    const payment = result.data?.customerInsights?.paymentMethods;
    assert(
      payment?.UPI_QR && payment?.COD && payment?.CARD,
      'customerInsights includes UPI_QR, COD, and CARD breakdowns'
    );
    assert(
      Array.isArray(result.data?.customerInsights?.geographicDistribution) &&
      result.data.customerInsights.geographicDistribution.length > 0,
      'customerInsights includes top regional delivery destinations'
    );
  }

  // Test 6: Actionable Business Insights
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await getVendorAnalytics(req, res);
    const result = getResult();

    assert(
      Array.isArray(result.data?.insights) && result.data.insights.length >= 3,
      `insights contains actionable retail growth advice (${result.data?.insights?.length} recommendations)`
    );
  }

  // Test 7: Multi-timeframe validation (7D, 90D, 1Y)
  {
    const tf7 = mockReqRes({ vendorId: 'v1' }, { timeframe: '7D' });
    await getVendorAnalytics(tf7.req, tf7.res);
    const tf90 = mockReqRes({ vendorId: 'v1' }, { timeframe: '90D' });
    await getVendorAnalytics(tf90.req, tf90.res);

    assert(
      tf7.getResult().data.timeframe === '7D' && tf90.getResult().data.timeframe === '90D',
      'getVendorAnalytics accurately adapts intervals to 7D and 90D timeframes'
    );
  }

  // Test 8: Record Storefront Visit
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' });
    await recordStoreVisit(req, res);
    const result = getResult();

    assert(
      result.status === 200 && result.data?.success === true,
      'recordStoreVisit successfully registers storefront traffic'
    );
  }

  // Test 9: Export CSV Report
  {
    const { req, res, getResult } = mockReqRes({ vendorId: 'v1' }, { timeframe: '30D' });
    await exportVendorAnalyticsReport(req, res);
    const result = getResult();

    assert(
      result.status === 200 &&
      result.headers['Content-Type'] === 'text/csv' &&
      typeof result.data === 'string' &&
      result.data.includes('Vendor Hub - Business Growth & Analytics Report') &&
      result.data.includes('EXECUTIVE KPI SUMMARY'),
      'exportVendorAnalyticsReport produces downloadable formatted CSV'
    );
  }

  console.log(`\n🎉 Results: ${passed}/${total} vendor analytics tests passed!\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal error in analytics tests:', err);
  process.exit(1);
});
