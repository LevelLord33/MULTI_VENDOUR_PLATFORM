import http from 'http';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING STOREFRONT APPROVAL WORKFLOW TESTS ---');

  // 1. Submit a vendor storefront for approval
  const testVendorId = 'v_new_merchant_' + Date.now();
  const storefrontPayload = {
    businessName: 'Apex Artisan Woodcrafts',
    storeSlug: 'apex-artisan-' + Date.now(),
    tagline: 'Handcrafted luxury teak & walnut furniture',
    themeColor: '#795548',
    category: 'Home & Living',
    location: 'Bengaluru, Karnataka',
    announcement: 'Grand Opening - 15% off first order!',
    action: 'submit_for_approval'
  };

  console.log('\n[1] Submitting storefront with action: submit_for_approval...');
  const submitRes = await request('POST', `/api/stores/vendor/${testVendorId}/storefront`, storefrontPayload);
  console.log('Submit response status:', submitRes.status);
  console.log('Store status:', submitRes.body?.storeStatus || submitRes.body?.storefront?.storeStatus);
  console.log('Store approval status:', submitRes.body?.storeApprovalStatus || submitRes.body?.storefront?.storeApprovalStatus);
  if (submitRes.body?.storeApprovalStatus !== 'pending') {
    throw new Error('Expected storeApprovalStatus to be "pending"');
  }

  // 2. Verify that unapproved store does NOT appear on customer portal (GET /api/stores)
  console.log('\n[2] Checking Customer Portal public stores list (GET /api/stores)...');
  const publicRes = await request('GET', '/api/stores');
  const stores = publicRes.body?.stores || [];
  const foundUnapproved = stores.find(s => s.id === testVendorId || s.storeSlug === storefrontPayload.storeSlug);
  if (foundUnapproved) {
    throw new Error('FAILURE: Unapproved store appears on customer portal!');
  }
  console.log(`PASS: Store is correctly HIDDEN from Customer Portal (total public stores: ${stores.length})`);

  // 3. Admin retrieves pending storefronts
  console.log('\n[3] Admin retrieving pending storefronts (GET /api/stores/admin/storefronts?status=pending)...');
  const adminPendingRes = await request('GET', '/api/stores/admin/storefronts?status=pending');
  const pendingStores = adminPendingRes.body?.storefronts || [];
  const foundInPending = pendingStores.find(s => s.id === testVendorId);
  if (!foundInPending) {
    throw new Error('FAILURE: Pending storefront not found in Admin list!');
  }
  console.log(`PASS: Store found in Admin pending list: "${foundInPending.businessName}"`);

  // 4. Admin approves storefront
  console.log('\n[4] Admin approving storefront (PATCH /api/stores/admin/:id/approval)...');
  const approveRes = await request('PATCH', `/api/stores/admin/${testVendorId}/approval`, {
    status: 'approved',
    reviewNotes: 'Verified business information, looks great!'
  });
  console.log('Approve response status:', approveRes.status);
  console.log('Updated storeStatus:', approveRes.body?.storeStatus);
  console.log('Updated storeApprovalStatus:', approveRes.body?.storeApprovalStatus);
  if (approveRes.body?.storeStatus !== 'published') {
    throw new Error('Expected storeStatus to be "published" after approval');
  }

  // 5. Verify that store NOW appears on customer portal (GET /api/stores?limit=100)
  console.log('\n[5] Checking Customer Portal public stores list again...');
  const publicRes2 = await request('GET', '/api/stores?limit=100');
  const stores2 = publicRes2.body?.stores || [];
  const foundApproved = stores2.find(s => s.id === testVendorId || s.storeSlug === storefrontPayload.storeSlug);
  if (!foundApproved) {
    throw new Error('FAILURE: Approved store is not visible on customer portal!');
  }
  console.log(`PASS: Approved store "${foundApproved.businessName}" is now LIVE on Customer Portal!`);

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
