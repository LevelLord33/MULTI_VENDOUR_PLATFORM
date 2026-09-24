/**
 * Frontend Socket.IO Client Service
 * Singleton client connection management with auto-reconnect and room helpers
 */

import { io } from 'socket.io-client';

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Strip trailing /api if present to get the root server URL
  return apiUrl.replace(/\/api\/?$/, '');
};

const SOCKET_SERVER_URL = getSocketUrl();

class SocketClient {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect() {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (!this.socket) {
      console.log(`🔌 [SocketClient] Connecting to Socket.IO at ${SOCKET_SERVER_URL}...`);
      this.socket = io(SOCKET_SERVER_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000
      });

      this.socket.on('connect', () => {
        console.log(`✅ [SocketClient] Connected with ID: ${this.socket.id}`);
        this.isConnected = true;
      });

      this.socket.on('disconnect', (reason) => {
        console.warn(`⚠️ [SocketClient] Disconnected: ${reason}`);
        this.isConnected = false;
      });

      this.socket.on('connect_error', (err) => {
        console.warn('⚠️ [SocketClient] Connection note:', err.message);
        this.isConnected = false;
      });
    } else if (!this.socket.connected) {
      this.socket.connect();
    }

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.isConnected = false;
    }
  }

  getSocket() {
    if (!this.socket) {
      return this.connect();
    }
    return this.socket;
  }

  registerUser(user) {
    if (!this.socket || !user) return;
    const payload = {
      userId: user.id || user._id,
      userRole: user.type || user.role || 'customer',
      name: user.fullName || user.businessName || user.name || 'User'
    };
    this.socket.emit('register_user', payload);
  }

  joinConversation(conversationId) {
    if (!this.socket || !conversationId) return;
    this.socket.emit('join_conversation', { conversationId });
  }

  leaveConversation(conversationId) {
    if (!this.socket || !conversationId) return;
    this.socket.emit('leave_conversation', { conversationId });
  }

  sendTyping(conversationId, user, isTyping) {
    if (!this.socket || !conversationId) return;
    this.socket.emit('typing', {
      conversationId,
      userId: user?.id,
      userName: user?.fullName || user?.businessName || user?.name || 'Someone',
      isTyping
    });
  }

  joinOrder(orderId) {
    if (!this.socket || !orderId) return;
    this.socket.emit('join_order', { orderId });
  }

  leaveOrder(orderId) {
    if (!this.socket || !orderId) return;
    this.socket.emit('leave_order', { orderId });
  }
}

export const socketService = new SocketClient();
export default socketService;
