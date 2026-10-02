import {
  subscribeToVendor,
  unsubscribeFromVendor,
  getMySubscriptions,
  updateNotificationPreferences,
  getVendorSubscribers,
  sendVendorUpdateToSubscribers
} from '../controllers/subscriptionController.js';
import {
  getInvoices,
  getInvoiceById,
  generateInvoice,
  sendInvoiceDelivery,
  getTwilioStatus
} from '../controllers/invoiceController.js';
import {
  getPlatformAnalytics,
  getVendorMonitoring,
  getVendorDeepDive,
  getCustomerUsage,
  getFairExposureMonitoring,
  getSubscriptionAnalytics,
  getCommunicationMonitoring,
  getActivityLogs
} from '../controllers/analyticsController.js';
import { getTwilioOperationalStatus } from '../utils/twilioService.js';

function mockReqRes({ params = {}, query = {}, body = {}, user = null } = {}) {
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
  const req = { params, query, body, user };
  return {
    req,
    res,
    getResult: () => ({ status: responseStatus, data: responseData })
  };
}

async function runTestSuite() {
  console.log('🧪 Running Comprehensive Subscription, Invoice & Admin Monitoring Suite...\n');
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

  // ── 1. CUSTOMER VENDOR SUBSCRIPTIONS ──
  console.log('\n--- 1. Customer Vendor Subscriptions ---');
  {
    // Subscribe to vendor v1
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', name: 'Arun Mehta', role: 'customer' },
      body: {
        vendorId: 'v1',
        notificationPreferences: { newProducts: true, promotions: true, deals: true, updates: false }
      }
    });
    await subscribeToVendor(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Customer can subscribe to vendor v1');
    assert(r.data?.isSubscribed === true, 'Subscription status is active');
    assert(r.data?.subscription?.notificationPreferences?.updates === false, 'Customer custom notification preferences saved');
  }

  {
    // Get customer's subscriptions and distinguish Purchased vs Subscribed
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', role: 'customer' }
    });
    await getMySubscriptions(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Customer can list their subscribed vendors');
    assert(r.data?.subscriptions?.length > 0, `Returned ${r.data?.subscriptions?.length} subscribed vendor(s)`);
    const sub = r.data?.subscriptions?.[0];
    assert(sub?.relationshipType != null, `Clearly marks relationship type: "${sub?.relationshipType}"`);
    assert(sub?.vendorName != null, `Includes vendor storefront info: ${sub?.vendorName}`);
  }

  {
    // Update preferences
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', role: 'customer' },
      params: { vendorId: 'v1' },
      body: { updates: true, deals: true }
    });
    await updateNotificationPreferences(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Customer can update vendor notification preferences');
  }

  // ── 2. VENDOR SUBSCRIBER MANAGEMENT & BROADCASTS ──
  console.log('\n--- 2. Vendor Subscriber Management ---');
  {
    const { req, res, getResult } = mockReqRes({
      user: { id: 'v1', role: 'vendor' },
      params: { vendorId: 'v1' }
    });
    await getVendorSubscribers(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Vendor can retrieve their subscribers list');
    assert(r.data?.totalSubscribers >= 1, `Vendor subscriber count is ${r.data?.totalSubscribers}`);
    assert(r.data?.buyerConversionRate != null, `Buyer conversion rate calculated: ${r.data?.buyerConversionRate}`);
    const firstSub = r.data?.subscribers?.[0];
    assert(firstSub?.maskedEmail?.includes('***'), `Customer email is privacy-masked: ${firstSub?.maskedEmail}`);
  }

  {
    // Vendor broadcast update to subscribers
    const { req, res, getResult } = mockReqRes({
      user: { id: 'v1', role: 'vendor' },
      params: { vendorId: 'v1' },
      body: {
        updateType: 'new_product',
        title: 'New Flagship Audio Gear Just Landed!',
        message: 'Explore true wireless high-resolution audio with 1-year brand warranty.',
        link: '/store/techzone'
      }
    });
    await sendVendorUpdateToSubscribers(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Vendor can send eligible updates to opted-in subscribers');
    assert(r.data?.stats?.eligibleSubscribers >= 0, `Broadcast targeted ${r.data?.stats?.eligibleSubscribers} eligible subscribers`);
  }

  // ── 3. DIGITAL INVOICES & TWILIO DELIVERY ──
  console.log('\n--- 3. Digital Invoices & Twilio Delivery ---');
  {
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', role: 'customer' },
      params: { orderId: 'ord1' }
    });
    await generateInvoice(req, res);
    const r = getResult();
    assert(r.status === 201 && r.data?.success === true, 'Digital GST Tax Invoice generated from order');
    assert(r.data?.invoice?.invoiceNumber?.startsWith('VH-INV-'), `Unique Invoice number: ${r.data?.invoice?.invoiceNumber}`);
    assert(r.data?.invoice?.vendorGstin != null, `Vendor GSTIN included: ${r.data?.invoice?.vendorGstin}`);
    assert(r.data?.invoice?.items?.length > 0, `Invoice contains itemized details: ${r.data?.invoice?.items?.length} SKU(s)`);
    assert(r.data?.invoice?.amountInWords != null, `Indian currency amount in words: ${r.data?.invoice?.amountInWords}`);
  }

  {
    // Fetch invoice by order ID
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', role: 'customer' },
      params: { id: 'ord1' }
    });
    await getInvoiceById(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Authorized user can fetch invoice by orderId');
  }

  {
    // Dispatch Twilio SMS & WhatsApp delivery
    const { req, res, getResult } = mockReqRes({
      user: { id: 'c1', role: 'customer' },
      params: { id: 'ord1' },
      body: { channel: 'both', recipientPhone: '+919876543210' }
    });
    await sendInvoiceDelivery(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Twilio invoice communication dispatched');
    assert(r.data?.results?.length === 2, 'Attempted both SMS and WhatsApp channels');
    assert(r.data?.deliveryStatus != null, `Delivery status recorded: ${r.data?.deliveryStatus}`);
  }

  {
    // Verify Twilio Operational Status (Admin safe, secrets masked)
    const status = getTwilioOperationalStatus();
    assert(status?.maskedAccountSid != null, `Masked Account SID: ${status?.maskedAccountSid}`);
    assert(!JSON.stringify(status).includes('AUTH_TOKEN'), 'Twilio secrets are NOT exposed in operational status');
    assert(status?.mode != null, `Twilio mode: ${status?.mode}`);
  }

  // ── 4. ADMIN PLATFORM MONITORING & ANALYTICS ──
  console.log('\n--- 4. Admin Platform Monitoring ---');
  {
    // Platform Overview
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' },
      query: { timeframe: '30D' }
    });
    await getPlatformAnalytics(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can retrieve Platform Overview metrics');
    assert(r.data?.overview?.totalVendors > 0, `Total vendors: ${r.data?.overview?.totalVendors}`);
    assert(r.data?.overview?.totalRevenue > 0, `Total revenue: ₹${r.data?.overview?.totalRevenue}`);
    assert(r.data?.overview?.totalInvoices > 0, `Total invoices: ${r.data?.overview?.totalInvoices}`);
    assert(r.data?.trendData?.length > 0, `Platform time-series trends returned: ${r.data?.trendData?.length} points`);
  }

  {
    // Vendor Ecosystem Monitoring
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' },
      query: { search: '' }
    });
    await getVendorMonitoring(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can monitor entire vendor ecosystem');
    assert(r.data?.stats?.verifiedVendors != null, `Verified vendors: ${r.data?.stats?.verifiedVendors}`);
    assert(r.data?.stats?.lowStockVendors != null, `Vendors with low stock: ${r.data?.stats?.lowStockVendors}`);
    assert(r.data?.vendors?.length > 0, `Ecosystem vendor table populated with ${r.data?.vendors?.length} vendors`);
  }

  {
    // Vendor Deep Dive
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' },
      params: { vendorId: 'v1' }
    });
    await getVendorDeepDive(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can inspect vendor deep dive');
    assert(r.data?.vendor?.businessName === 'TechZone Electronics', `Inspected vendor: ${r.data?.vendor?.businessName}`);
    assert(r.data?.inventorySummary?.totalUnitsInStock > 0, `Inventory summary: ${r.data?.inventorySummary?.totalUnitsInStock} units in stock`);
  }

  {
    // Customer Usage Analytics
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' }
    });
    await getCustomerUsage(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can retrieve customer usage analytics');
    assert(r.data?.metrics?.totalProductSearches > 0, `Search query velocity: ${r.data?.metrics?.totalProductSearches}`);
    assert(r.data?.mostViewedCategories?.length > 0, `Most viewed categories populated: ${r.data?.mostViewedCategories?.length}`);
  }

  {
    // Fair Exposure Monitoring
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' }
    });
    await getFairExposureMonitoring(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can monitor marketplace fair-exposure');
    assert(r.data?.summary?.emergingVendorExposureShare != null, `Emerging merchant exposure: ${r.data?.summary?.emergingVendorExposureShare}`);
    assert(r.data?.summary?.fairExposureHealthScore != null, `Anti-monopoly health score: ${r.data?.summary?.fairExposureHealthScore}`);
  }

  {
    // Platform Subscription Analytics
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' }
    });
    await getSubscriptionAnalytics(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can monitor platform subscription metrics');
    assert(r.data?.topVendorsBySubscribers?.length > 0, `Top merchants by subscribers: ${r.data?.topVendorsBySubscribers?.length}`);
  }

  {
    // Communication & Twilio Monitoring
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' }
    });
    await getCommunicationMonitoring(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can monitor invoice and Twilio deliveries');
    assert(r.data?.stats?.totalInvoicesGenerated > 0, `Total invoices monitored: ${r.data?.stats?.totalInvoicesGenerated}`);
  }

  {
    // Activity & Audit Log
    const { req, res, getResult } = mockReqRes({
      user: { id: 'admin', role: 'admin' },
      query: { limit: 10 }
    });
    await getActivityLogs(req, res);
    const r = getResult();
    assert(r.status === 200 && r.data?.success === true, 'Admin can query immutable platform activity logs');
    assert(r.data?.logs?.length > 0, `Activity logs retrieved: ${r.data?.logs?.length} events`);
  }

  console.log(`\n=================================================`);
  console.log(`🎉 TEST RESULTS: ${passed} / ${total} ASSERTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log(`=================================================\n`);

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test Suite Exception:', err);
  process.exit(1);
});
