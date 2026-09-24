import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { socketService } from '../services/socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  // Initialize Socket connection
  useEffect(() => {
    const s = socketService.connect();
    setSocket(s);

    const onConnect = () => {
      setIsConnected(true);
      if (user) {
        socketService.registerUser(user);
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Global Notifications
    const onNewNotification = (notif) => {
      console.log('🔔 [Socket] Notification received:', notif);
      const variant = notif.type === 'order_new' ? 'success' :
                      notif.type === 'inventory_alert' ? 'warning' : 'info';
      addToast(`${notif.title}: ${notif.message}`, variant);
    };

    const onNewOrderPlaced = (data) => {
      console.log('🛍️ [Socket] New order received:', data);
      addToast(`New order #${data.orderId} received! Total: ₹${data.total?.toLocaleString()}`, 'success');
    };

    const onLowStockAlert = (data) => {
      console.log('⚠️ [Socket] Low stock warning:', data);
      addToast(`Low stock warning: ${data.title || data.sku} (${data.stock || data.currentStock} units left)`, 'warning');
    };

    const onUserTyping = ({ conversationId, userId, userName, isTyping }) => {
      setTypingUsers(prev => ({
        ...prev,
        [conversationId]: isTyping ? { userId, userName } : null
      }));
    };

    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);
    s.on('new_notification', onNewNotification);
    s.on('new_order_placed', onNewOrderPlaced);
    s.on('low_stock_alert', onLowStockAlert);
    s.on('user_typing', onUserTyping);

    if (s.connected) {
      setIsConnected(true);
      if (user) {
        socketService.registerUser(user);
      }
    }

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      s.off('new_notification', onNewNotification);
      s.off('new_order_placed', onNewOrderPlaced);
      s.off('low_stock_alert', onLowStockAlert);
      s.off('user_typing', onUserTyping);
    };
  }, [user, addToast]);

  // Register user when identity changes
  useEffect(() => {
    if (socket && isConnected && user) {
      socketService.registerUser(user);
    }
  }, [socket, isConnected, user]);

  const joinConversation = useCallback((convId) => {
    socketService.joinConversation(convId);
  }, []);

  const leaveConversation = useCallback((convId) => {
    socketService.leaveConversation(convId);
  }, []);

  const sendTyping = useCallback((convId, isTyping) => {
    socketService.sendTyping(convId, user, isTyping);
  }, [user]);

  const joinOrder = useCallback((orderId) => {
    socketService.joinOrder(orderId);
  }, []);

  const leaveOrder = useCallback((orderId) => {
    socketService.leaveOrder(orderId);
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        typingUsers,
        joinConversation,
        leaveConversation,
        sendTyping,
        joinOrder,
        leaveOrder
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    return {
      socket: null,
      isConnected: false,
      typingUsers: {},
      joinConversation: () => {},
      leaveConversation: () => {},
      sendTyping: () => {},
      joinOrder: () => {},
      leaveOrder: () => {}
    };
  }
  return context;
};
