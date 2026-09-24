/**
 * Verification Test Suite for Phase 10: Real-Time Features using Socket.IO
 * Tests live WebSocket connections, user registration, room events, typing indicators,
 * live chat broadcasts, real-time inventory updates, and order status updates.
 */

import { io as ioClient } from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

const waitForEvent = (socket, eventName, timeoutMs = 8000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${eventName}" after ${timeoutMs}ms`));
    }, timeoutMs);

    socket.once(eventName, (data) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
};

async function runSocketTests() {
  console.log('⚡ Starting Phase 10: Socket.IO Real-Time Feature Verification Tests...\n');

  let customerSocket = null;
  let vendorSocket = null;

  try {
    // 1. Connect Customer Socket
    console.log('--- Test 1: Customer Socket.IO Connection ---');
    customerSocket = ioClient(SERVER_URL, {
      transports: ['websocket', 'polling'],
      forceNew: true
    });
    await waitForEvent(customerSocket, 'connect');
    console.log(`✅ Customer connected with Socket ID: ${customerSocket.id}`);

    // 2. Connect Vendor Socket
    console.log('\n--- Test 2: Vendor Socket.IO Connection ---');
    vendorSocket = ioClient(SERVER_URL, {
      transports: ['websocket', 'polling'],
      forceNew: true
    });
    await waitForEvent(vendorSocket, 'connect');
    console.log(`✅ Vendor connected with Socket ID: ${vendorSocket.id}`);

    // 3. Register Users & Rooms
    console.log('\n--- Test 3: User Registration & Room Orchestration ---');
    customerSocket.emit('register_user', {
      userId: 'test_cust_1',
      userRole: 'customer',
      name: 'Rohan Sharma'
    });
    const custReg = await waitForEvent(customerSocket, 'registered');
    console.log('Customer registered successfully:', custReg);

    vendorSocket.emit('register_user', {
      userId: 'test_vend_1',
      userRole: 'vendor',
      name: 'TechZone India'
    });
    const vendReg = await waitForEvent(vendorSocket, 'registered');
    console.log('Vendor registered successfully:', vendReg);
    console.log('✅ User registration and room assignments validated.');

    // 4. Test Conversation Room & Typing Indicators
    console.log('\n--- Test 4: Conversation Room & Typing Indicators ---');
    const testConvId = `conv-sock-test-${Date.now()}`;
    customerSocket.emit('join_conversation', { conversationId: testConvId });
    vendorSocket.emit('join_conversation', { conversationId: testConvId });

    // Wait 100ms for rooms to register in memory
    await new Promise((r) => setTimeout(r, 150));

    // Customer sends typing event
    const typingPromise = waitForEvent(vendorSocket, 'user_typing');
    customerSocket.emit('typing', {
      conversationId: testConvId,
      userId: 'test_cust_1',
      userName: 'Rohan Sharma',
      isTyping: true
    });
    const typingData = await typingPromise;
    console.log('Vendor received typing indicator:', typingData);
    if (!typingData.isTyping || typingData.userName !== 'Rohan Sharma') {
      throw new Error(`Typing data mismatch: ${JSON.stringify(typingData)}`);
    }
    console.log('✅ Test 4 Passed: Real-time typing indicators propagated across sockets.');

    // 5. Test Live Message Broadcast via REST API
    console.log('\n--- Test 5: Live Chat Message Broadcast via REST API ---');
    // First, initiate/fetch a conversation
    const createConvRes = await fetch(`${API_URL}/messages/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: 'test_cust_1',
        customerName: 'Rohan Sharma',
        vendorId: 'test_vend_1',
        vendorName: 'TechZone India',
        subject: 'Real-time Socket Delivery Check',
        initialMessage: 'Hi! Is real-time Socket.IO messaging active?'
      })
    });
    const createConvData = await createConvRes.json();
    const liveConvId = createConvData.conversation?.id;
    console.log(`Created test conversation: ${liveConvId}`);

    // Join both sockets to this live conversation room
    customerSocket.emit('join_conversation', { conversationId: liveConvId });
    vendorSocket.emit('join_conversation', { conversationId: liveConvId });
    await new Promise((r) => setTimeout(r, 150));

    // Setup listener on vendor socket for new_message and notification
    const vendorMsgPromise = waitForEvent(vendorSocket, 'new_message');
    const vendorNotifPromise = waitForEvent(vendorSocket, 'new_notification');

    // Customer sends message via HTTP POST
    const sendMsgRes = await fetch(`${API_URL}/messages/conversations/${liveConvId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: 'test_cust_1',
        senderType: 'customer',
        senderName: 'Rohan Sharma',
        text: 'Live message sent via REST, received via Socket.IO!'
      })
    });
    const sendMsgData = await sendMsgRes.json();
    console.log('REST Message Send Response:', sendMsgData.success);

    // Wait for vendor socket to receive the broadcasted event
    const receivedMsg = await vendorMsgPromise;
    console.log('Vendor received socket new_message:', {
      convId: receivedMsg.conversationId,
      text: receivedMsg.message?.text,
      sender: receivedMsg.message?.senderName
    });

    const receivedNotif = await vendorNotifPromise;
    console.log('Vendor received push notification:', receivedNotif);

    if (receivedMsg.message?.text !== 'Live message sent via REST, received via Socket.IO!') {
      throw new Error('Message text mismatch over socket');
    }
    console.log('✅ Test 5 Passed: REST API message successfully broadcast to WebSocket subscribers!');

    // 6. Test Live Inventory Adjustment Broadcast
    console.log('\n--- Test 6: Real-Time Inventory Adjustment Broadcast ---');
    const vendorInvPromise = waitForEvent(vendorSocket, 'inventory_updated');
    const catalogInvPromise = waitForEvent(customerSocket, 'product_stock_changed');

    // Trigger inventory adjustment via REST
    const adjustRes = await fetch(`${API_URL}/inventory/adjust`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test_vend_1',
        'x-user-role': 'vendor'
      },
      body: JSON.stringify({
        productId: 'p60',
        vendorId: 'test_vend_1',
        quantityDelta: 10,
        reason: 'restock',
        notes: 'Real-time socket verification test adjustment'
      })
    });
    const adjustData = await adjustRes.json();
    console.log('REST Inventory Adjustment Response:', adjustData.success);

    const invUpdate = await vendorInvPromise;
    console.log('Vendor received inventory_updated:', {
      productId: invUpdate.productId,
      newStock: invUpdate.stock,
      delta: invUpdate.delta
    });

    const catalogUpdate = await catalogInvPromise;
    console.log('Catalog client received product_stock_changed:', catalogUpdate);

    if (invUpdate.productId !== 'p60' || catalogUpdate.productId !== 'p60') {
      throw new Error('Inventory update socket payload mismatch');
    }
    console.log('✅ Test 6 Passed: Inventory adjustments broadcast live to vendor & catalog!');

    // 7. Test Live Order Status Updates
    console.log('\n--- Test 7: Real-Time Order Status Update Broadcast ---');
    const createOrderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test_cust_1',
        'x-user-role': 'customer'
      },
      body: JSON.stringify({
        customerId: 'test_cust_1',
        vendorId: 'test_vend_1',
        items: [{ productId: 'p60', quantity: 1, price: 1500, title: 'Hair Brush' }],
        subtotal: 1500,
        total: 1500,
        shippingAddress: { fullName: 'Rohan Sharma', address: 'Delhi' }
      })
    });
    const createOrderData = await createOrderRes.json();
    const testOrderId = createOrderData.order?.id || 'ord1';
    console.log(`Created test Order ID: ${testOrderId}`);

    customerSocket.emit('join_order', { orderId: testOrderId });
    await new Promise((r) => setTimeout(r, 150));

    const orderStatusPromise = waitForEvent(customerSocket, 'order_status_changed');

    // Vendor updates shipment status via REST
    const updateOrderRes = await fetch(`${API_URL}/orders/${testOrderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'test_vend_1',
        'x-user-role': 'vendor'
      },
      body: JSON.stringify({
        status: 'Out for Delivery',
        courierPartner: 'BlueDart Air Priority',
        trackingNumber: 'BD-SOCKET-9921',
        location: 'Local Destination Distribution Hub',
        note: 'Out for delivery with delivery executive.'
      })
    });
    const updateOrderData = await updateOrderRes.json();
    console.log('REST Order Update Response:', updateOrderData.success);

    const receivedOrderStatus = await orderStatusPromise;
    console.log('Customer received order_status_changed:', {
      orderId: receivedOrderStatus.orderId,
      status: receivedOrderStatus.status,
      courier: receivedOrderStatus.courierPartner
    });

    if (receivedOrderStatus.status !== 'Out for Delivery') {
      throw new Error(`Order status mismatch: ${receivedOrderStatus.status}`);
    }
    console.log('✅ Test 7 Passed: Order status updates delivered live to customer tracking room!');

    console.log('\n🎉 ALL PHASE 10 SOCKET.IO REAL-TIME TESTS PASSED (7/7)! 🚀');
  } catch (error) {
    console.error('\n❌ Socket Test Failed:', error);
    process.exit(1);
  } finally {
    if (customerSocket) customerSocket.disconnect();
    if (vendorSocket) vendorSocket.disconnect();
  }
}

runSocketTests();
