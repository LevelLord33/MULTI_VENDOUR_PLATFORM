/**
 * Verification Test Script for Phase 9: Smart Inventory Management
 * Tests all inventory endpoints against the running Express & MongoDB backend
 */

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Phase 9: Smart Inventory Management Tests...\n');

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    console.log(`✅ Backend Health Check: ${healthData.status} (Mongo: ${healthData.mongoStatus})`);

    // 2. Fetch existing products or vendors
    const prodRes = await fetch(`${API_BASE}/products`);
    const prodData = await prodRes.json();
    const products = Array.isArray(prodData) ? prodData : (prodData.data || prodData.products || []);
    console.log(`📦 Found ${products.length} products in database`);

    if (products.length === 0) {
      console.warn('⚠️ No products found to test inventory with, triggering seed...');
      await fetch(`${API_BASE}/seed?force=true`, { method: 'POST' });
    }

    const testProduct = products[0];
    const vendorId = testProduct?.vendorId || 'vendor-1';
    const productId = testProduct?._id || testProduct?.id;
    console.log(`🎯 Testing with Vendor ID: "${vendorId}", Product: "${testProduct?.title}" (${productId})\n`);

    // 3. Test GET /api/inventory/summary/:vendorId
    console.log('--- Test 1: GET /api/inventory/summary/:vendorId ---');
    const summaryRes = await fetch(`${API_BASE}/inventory/summary/${vendorId}`);
    const summaryJson = await summaryRes.json();
    console.log('Summary response status:', summaryRes.status);
    console.log('Summary KPIs:', summaryJson.data?.kpi);
    if (!summaryJson.success || !summaryJson.data) {
      throw new Error(`Summary API failed: ${JSON.stringify(summaryJson)}`);
    }
    console.log('✅ Test 1 Passed: Inventory summary returned successfully.\n');

    // 4. Test GET /api/inventory/alerts/:vendorId
    console.log('--- Test 2: GET /api/inventory/alerts/:vendorId ---');
    const alertsRes = await fetch(`${API_BASE}/inventory/alerts/${vendorId}`);
    const alertsJson = await alertsRes.json();
    console.log(`Alerts found: ${alertsJson.alerts?.length || 0}`);
    if (!alertsJson.success) {
      throw new Error(`Alerts API failed: ${JSON.stringify(alertsJson)}`);
    }
    console.log('✅ Test 2 Passed: Low-stock alerts returned successfully.\n');

    // 5. Test POST /api/inventory/adjust (Restock +20 units)
    console.log('--- Test 3: POST /api/inventory/adjust (Restock +20) ---');
    const currentStock = testProduct.stock != null ? testProduct.stock : 15;
    const adjustRes = await fetch(`${API_BASE}/inventory/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': vendorId,
        'x-user-role': 'vendor'
      },
      body: JSON.stringify({
        productId: productId,
        quantityDelta: 20,
        reason: 'restock',
        notes: 'Automated test inbound delivery batch #TEST-001',
        referenceId: 'PO-TEST-99'
      })
    });
    const adjustJson = await adjustRes.json();
    console.log('Adjust response:', adjustJson);
    if (!adjustJson.success || adjustJson.movement?.quantityDelta !== 20) {
      throw new Error(`Adjust API failed: ${JSON.stringify(adjustJson)}`);
    }
    console.log(`✅ Test 3 Passed: Stock adjusted from ${adjustJson.movement.previousStock} to ${adjustJson.movement.newStock}.\n`);

    // 6. Test GET /api/inventory/movements/:vendorId
    console.log('--- Test 4: GET /api/inventory/movements/:vendorId ---');
    const movementsRes = await fetch(`${API_BASE}/inventory/movements/${vendorId}?limit=10`);
    const movementsJson = await movementsRes.json();
    console.log(`Logged movements count: ${movementsJson.movements?.length || 0}`);
    const latestMove = movementsJson.movements?.[0];
    if (latestMove) {
      console.log('Latest movement:', {
        reason: latestMove.reason,
        delta: latestMove.quantityDelta,
        balance: `${latestMove.previousStock} -> ${latestMove.newStock}`,
        referenceId: latestMove.referenceId
      });
    }
    if (!movementsJson.success) {
      throw new Error(`Movements API failed: ${JSON.stringify(movementsJson)}`);
    }
    console.log('✅ Test 4 Passed: Movement history retrieved with audit log.\n');

    // 7. Test PUT /api/inventory/sku-barcode/:productId
    console.log('--- Test 5: PUT /api/inventory/sku-barcode/:productId ---');
    const newSku = `SKU-TEST-${Date.now().toString().slice(-4)}`;
    const newBarcode = '8901234567890';
    const newLoc = 'Zone C, Shelf 4, Bin 12';
    const skuRes = await fetch(`${API_BASE}/inventory/sku-barcode/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': vendorId,
        'x-user-role': 'vendor'
      },
      body: JSON.stringify({
        sku: newSku,
        barcode: newBarcode,
        warehouseLocation: newLoc,
        lowStockThreshold: 8,
        restockLeadDays: 4
      })
    });
    const skuJson = await skuRes.json();
    console.log('SKU Barcode update response:', skuJson);
    if (!skuJson.success || skuJson.product?.sku !== newSku) {
      throw new Error(`SKU update API failed: ${JSON.stringify(skuJson)}`);
    }
    console.log('✅ Test 5 Passed: SKU, Barcode, and Warehouse Location updated.\n');

    // 8. Test POST /api/inventory/adjust (Damage Write-off -5 units)
    console.log('--- Test 6: POST /api/inventory/adjust (Damage Write-off -5) ---');
    const damageRes = await fetch(`${API_BASE}/inventory/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': vendorId,
        'x-user-role': 'vendor'
      },
      body: JSON.stringify({
        productId: productId,
        quantityDelta: -5,
        reason: 'damage_write_off',
        notes: 'Damaged in transit audit verification',
        referenceId: 'WRITEOFF-TEST-01'
      })
    });
    const damageJson = await damageRes.json();
    console.log('Damage write-off response:', damageJson);
    if (!damageJson.success || damageJson.movement?.quantityDelta !== -5) {
      throw new Error(`Damage write-off API failed: ${JSON.stringify(damageJson)}`);
    }
    console.log(`✅ Test 6 Passed: Write-off adjusted stock from ${damageJson.movement.previousStock} to ${damageJson.movement.newStock}.\n`);

    console.log('🎉 ALL SMART INVENTORY BACKEND TESTS PASSED SUCCESSFULLY! 🚀');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

runTests();
