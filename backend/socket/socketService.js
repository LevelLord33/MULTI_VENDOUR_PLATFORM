/**
 * Socket.IO Real-Time Service for Vendor Hub
 * Handles room orchestration, customer/vendor messaging, order updates,
 * inventory synchronization, typing indicators, and push notifications.
 */

import { Server } from 'socket.io';

let io = null;

// Connected users mapping: userId -> Set of socketIds
const userSockets = new Map();

/**
 * Initialize Socket.IO with HTTP Server
 * @param {import('http').Server} httpServer
 */
export const initSocketService = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.IO] New client connected: ${socket.id}`);

    // Register User Identity & Join Personal/Role Rooms
    socket.on('register_user', ({ userId, userRole, name }) => {
      if (!userId) return;
      socket.data.userId = userId;
      socket.data.userRole = userRole || 'customer';
      socket.data.name = name || 'User';

      // Join personal room for targeted notifications
      const userRoom = `user_${userId}`;
      socket.join(userRoom);

      // Join role room
      if (userRole) {
        socket.join(`role_${userRole}`);
      }

      // If vendor, join vendor management room
      if (userRole === 'vendor') {
        socket.join(`vendor_${userId}`);
      }

      // Always join public inventory room for catalog stock sync
      socket.join('inventory');

      // Track active sockets
      if (!userSockets.has(userId)) {
        userSockets.set(userId, new Set());
      }
      userSockets.get(userId).add(socket.id);

      console.log(`👤 [Socket.IO] User ${name || userId} (${userRole}) registered on room ${userRoom}`);

      socket.emit('registered', {
        success: true,
        userId,
        socketId: socket.id,
        timestamp: new Date().toISOString()
      });
    });

    // Join Specific Conversation Room
    socket.on('join_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      const room = `conv_${conversationId}`;
      socket.join(room);
      console.log(`💬 [Socket.IO] Socket ${socket.id} joined ${room}`);
    });

    // Leave Specific Conversation Room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (!conversationId) return;
      const room = `conv_${conversationId}`;
      socket.leave(room);
      console.log(`💬 [Socket.IO] Socket ${socket.id} left ${room}`);
    });

    // Typing Indicators in Conversation
    socket.on('typing', ({ conversationId, userId, userName, isTyping }) => {
      if (!conversationId) return;
      socket.to(`conv_${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
        userName: userName || 'Someone',
        isTyping: !!isTyping,
        timestamp: new Date().toISOString()
      });
    });

    // Join Specific Order Tracking Room
    socket.on('join_order', ({ orderId }) => {
      if (!orderId) return;
      const room = `order_${orderId}`;
      socket.join(room);
      console.log(`📦 [Socket.IO] Socket ${socket.id} joined order room ${room}`);
    });

    // Leave Order Tracking Room
    socket.on('leave_order', ({ orderId }) => {
      if (!orderId) return;
      const room = `order_${orderId}`;
      socket.leave(room);
      console.log(`📦 [Socket.IO] Socket ${socket.id} left order room ${room}`);
    });

    // Disconnect Cleanup
    socket.on('disconnect', (reason) => {
      console.log(`❌ [Socket.IO] Client disconnected: ${socket.id} (${reason})`);
      const uid = socket.data?.userId;
      if (uid && userSockets.has(uid)) {
        const set = userSockets.get(uid);
        set.delete(socket.id);
        if (set.size === 0) {
          userSockets.delete(uid);
        }
      }
    });
  });

  console.log('⚡ Socket.IO real-time service initialized and ready.');
  return io;
};

/**
 * Get Socket.IO instance
 */
export const getIO = () => io;

/**
 * Broadcast a new chat message to the conversation room
 * and emit notifications/unread updates to the recipient
 */
export const emitNewMessage = (conversationId, message, conversation) => {
  if (!io) return;

  const convRoom = `conv_${conversationId}`;
  io.to(convRoom).emit('new_message', {
    conversationId,
    message,
    conversation,
    timestamp: new Date().toISOString()
  });

  // Target recipient's private user room for notification & badge increment
  const isFromCustomer = message.senderType === 'customer';
  const recipientId = isFromCustomer ? conversation?.vendorId : conversation?.customerId;

  if (recipientId) {
    const unreadCount = isFromCustomer
      ? (conversation?.unreadVendor || 1)
      : (conversation?.unreadCustomer || 1);

    io.to(`user_${recipientId}`).emit('unread_updated', {
      type: 'message',
      conversationId,
      unreadCount,
      senderName: message.senderName,
      text: message.text
    });

    io.to(`user_${recipientId}`).emit('new_notification', {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'message',
      title: `New message from ${message.senderName}`,
      message: message.text?.slice(0, 100),
      conversationId,
      link: isFromCustomer ? '/vendor/messages' : '/shop/messages',
      createdAt: new Date().toISOString()
    });
  }
};

/**
 * Broadcast order status updates to the order room and customer/vendor rooms
 */
export const emitOrderStatusUpdate = (orderId, order, customerId, vendorId) => {
  if (!io) return;

  const payload = {
    orderId,
    status: order?.status,
    courierPartner: order?.courierPartner,
    trackingNumber: order?.trackingNumber,
    shipmentTimeline: order?.shipmentTimeline,
    order,
    timestamp: new Date().toISOString()
  };

  // 1. Emit to order tracking room (active customer tracking page)
  io.to(`order_${orderId}`).emit('order_status_changed', payload);

  // 2. Emit to customer personal room
  const targetCustId = customerId || order?.customerId;
  if (targetCustId) {
    io.to(`user_${targetCustId}`).emit('order_status_changed', payload);
    io.to(`user_${targetCustId}`).emit('new_notification', {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'order',
      title: `Order #${orderId} Updated`,
      message: `Status is now: ${order?.status}`,
      orderId,
      link: '/shop/orders',
      createdAt: new Date().toISOString()
    });
  }

  // 3. Emit to vendor room
  const targetVendId = vendorId || order?.vendorId;
  if (targetVendId) {
    io.to(`user_${targetVendId}`).emit('vendor_order_updated', payload);
    io.to(`vendor_${targetVendId}`).emit('vendor_order_updated', payload);
  }
};

/**
 * Broadcast new order placement to vendor
 */
export const emitNewOrderPlaced = (order, vendorId) => {
  if (!io) return;

  const targetVendId = vendorId || order?.vendorId;
  if (targetVendId) {
    const payload = {
      orderId: order?.id,
      order,
      total: order?.total,
      itemCount: order?.items?.length || 1,
      customerName: order?.shippingAddress?.fullName || 'Customer',
      timestamp: new Date().toISOString()
    };

    io.to(`user_${targetVendId}`).emit('new_order_placed', payload);
    io.to(`vendor_${targetVendId}`).emit('new_order_placed', payload);

    io.to(`user_${targetVendId}`).emit('new_notification', {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: 'order_new',
      title: `New Order Received! (#${order?.id})`,
      message: `Total: ₹${order?.total?.toLocaleString()} from ${payload.customerName}`,
      orderId: order?.id,
      link: '/vendor/orders',
      createdAt: new Date().toISOString()
    });
  }
};

/**
 * Broadcast inventory updates to vendor room and public catalog room
 */
export const emitInventoryUpdate = (vendorId, productId, newStock, delta, movement) => {
  if (!io) return;

  const payload = {
    productId,
    stock: newStock,
    delta,
    movement,
    timestamp: new Date().toISOString()
  };

  // Emit to public catalog room so storefront product cards update stock in real time
  io.to('inventory').emit('product_stock_changed', {
    productId,
    stock: newStock,
    availableStock: newStock
  });

  // Emit to vendor-specific room
  if (vendorId) {
    io.to(`vendor_${vendorId}`).emit('inventory_updated', payload);
    io.to(`user_${vendorId}`).emit('inventory_updated', payload);
  }
};

/**
 * Emit low stock alert to vendor
 */
export const emitLowStockAlert = (vendorId, alertData) => {
  if (!io || !vendorId) return;

  io.to(`user_${vendorId}`).emit('low_stock_alert', alertData);
  io.to(`vendor_${vendorId}`).emit('low_stock_alert', alertData);

  io.to(`user_${vendorId}`).emit('new_notification', {
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: 'inventory_alert',
    title: `Low Stock Alert: ${alertData.title || alertData.sku || 'Product'}`,
    message: `Only ${alertData.stock || alertData.currentStock} units remaining (Safety: ${alertData.threshold})`,
    productId: alertData.productId,
    link: '/vendor/inventory',
    createdAt: new Date().toISOString()
  });
};
