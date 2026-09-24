import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { seedConversations } from '../data/seedData';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useSocket } from './SocketContext';

const MessageContext = createContext(null);

const STORAGE_KEY = 'vendorhub_conversations';

export function MessageProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return seedConversations;
  });

  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const { socket, joinConversation, leaveConversation, sendTyping } = useSocket();

  // Socket: join active conversation room
  useEffect(() => {
    if (activeConversationId) {
      joinConversation(activeConversationId);
      return () => {
        leaveConversation(activeConversationId);
      };
    }
  }, [activeConversationId, joinConversation, leaveConversation]);

  // Socket: listen for incoming new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({ conversationId, message, conversation }) => {
      setConversations((prev) => {
        const convIndex = prev.findIndex((c) => c.id === conversationId);

        if (convIndex > -1) {
          const targetConv = prev[convIndex];
          // Deduplicate if message already added
          const exists = targetConv.messages?.some((m) => m.id === message.id);
          if (exists) return prev;

          const isCurrentlyActive = activeConversationId === conversationId;

          const updatedConv = {
            ...targetConv,
            lastMessage: message.text,
            lastMessageSender: message.senderType,
            lastMessageAt: message.createdAt || new Date().toISOString(),
            status: 'active',
            unreadVendor: (user?.type === 'vendor' && !isCurrentlyActive)
              ? (targetConv.unreadVendor || 0) + 1
              : targetConv.unreadVendor,
            unreadCustomer: (user?.type === 'customer' && !isCurrentlyActive)
              ? (targetConv.unreadCustomer || 0) + 1
              : targetConv.unreadCustomer,
            messages: [...(targetConv.messages || []), message]
          };

          const rest = prev.filter((_, idx) => idx !== convIndex);
          return [updatedConv, ...rest];
        } else if (conversation) {
          return [conversation, ...prev];
        }
        return prev;
      });
    };

    socket.on('new_message', handleNewMessage);
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, user, activeConversationId]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }, [conversations]);

  // Fetch conversations from API whenever user changes
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      if (user.type === 'vendor') {
        const res = await apiService.getVendorConversations(user.id, {}, user);
        if (res && res.success && Array.isArray(res.conversations)) {
          if (res.conversations.length > 0) {
            setConversations((prev) => {
              const others = prev.filter((c) => c.vendorId !== user.id);
              return [...res.conversations, ...others];
            });
          }
        }
        const statsRes = await apiService.getVendorMessageStats(user.id, user);
        if (statsRes && statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
      } else if (user.type === 'customer') {
        const res = await apiService.getCustomerConversations(user.id, user);
        if (res && res.success && Array.isArray(res.conversations)) {
          if (res.conversations.length > 0) {
            setConversations((prev) => {
              const others = prev.filter((c) => c.customerId !== user.id);
              return [...res.conversations, ...others];
            });
          }
        }
      }
    } catch (err) {
      console.warn('API sync notice for messages:', err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    if (!activeConversationId) return null;
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Computed unread counts
  const unreadVendorCount = useMemo(() => {
    if (!user || user.type !== 'vendor') return 0;
    return conversations
      .filter((c) => c.vendorId === user.id)
      .reduce((sum, c) => sum + (c.unreadVendor || 0), 0);
  }, [conversations, user]);

  const unreadCustomerCount = useMemo(() => {
    if (!user || user.type !== 'customer') return 0;
    return conversations
      .filter((c) => c.customerId === user.id)
      .reduce((sum, c) => sum + (c.unreadCustomer || 0), 0);
  }, [conversations, user]);

  // Mark conversation as read
  const markAsRead = useCallback(
    async (conversationId) => {
      if (!conversationId) return;
      const role = user?.type || 'customer';

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          const updatedMessages = (c.messages || []).map((m) => {
            if (role === 'vendor' && m.senderType === 'customer') return { ...m, isRead: true };
            if (role === 'customer' && m.senderType === 'vendor') return { ...m, isRead: true };
            return m;
          });
          return {
            ...c,
            unreadVendor: role === 'vendor' ? 0 : c.unreadVendor,
            unreadCustomer: role === 'customer' ? 0 : c.unreadCustomer,
            messages: updatedMessages
          };
        })
      );

      // Inform API
      apiService.markConversationAsRead(conversationId, role, user);
    },
    [user]
  );

  // Select conversation and auto mark read
  const selectConversation = useCallback(
    (id) => {
      setActiveConversationId(id);
      if (id) {
        markAsRead(id);
      }
    },
    [markAsRead]
  );

  // Send message in existing conversation
  const sendMessage = useCallback(
    async (conversationId, text, attachments = []) => {
      if (!conversationId || !text || !text.trim()) return null;

      const now = new Date().toISOString();
      const senderRole = user?.type || 'customer';
      const senderName =
        user?.fullName || user?.businessName || user?.name || (senderRole === 'vendor' ? 'Store Merchant' : 'Customer');
      const senderAvatar = user?.avatar || '';

      const newMsg = {
        id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        senderId: user?.id || 'anonymous',
        senderType: senderRole,
        senderName,
        senderAvatar,
        text: text.trim(),
        attachments: attachments || [],
        createdAt: now,
        isRead: false
      };

      // Optimistic state update
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== conversationId) return c;
          return {
            ...c,
            messages: [...(c.messages || []), newMsg],
            lastMessage: text.trim(),
            lastMessageSender: senderRole,
            lastMessageAt: now,
            unreadVendor: senderRole === 'customer' ? (c.unreadVendor || 0) + 1 : c.unreadVendor,
            unreadCustomer: senderRole === 'vendor' ? (c.unreadCustomer || 0) + 1 : c.unreadCustomer,
            status: 'active'
          };
        })
      );

      // Send to backend API
      const apiRes = await apiService.sendChatMessage(conversationId, newMsg, user);
      if (apiRes && apiRes.success && apiRes.conversation) {
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, ...apiRes.conversation } : c))
        );
      }

      return newMsg;
    },
    [user]
  );

  // Start a new conversation or open existing
  const startConversation = useCallback(
    async ({
      vendorId,
      vendorName,
      vendorAvatar,
      customerId,
      customerName,
      customerEmail,
      customerAvatar,
      subject,
      category,
      relatedProduct,
      relatedOrder,
      initialMessage,
      attachments
    }) => {
      const effCustomerId = customerId || user?.id || 'c1';
      const effCustomerName = customerName || user?.fullName || user?.name || 'Customer';
      const effCustomerEmail = customerEmail || user?.email || '';
      const effCustomerAvatar = customerAvatar || user?.avatar || '';

      const payload = {
        customerId: effCustomerId,
        customerName: effCustomerName,
        customerEmail: effCustomerEmail,
        customerAvatar: effCustomerAvatar,
        vendorId,
        vendorName: vendorName || 'Vendor Merchant',
        vendorAvatar: vendorAvatar || '',
        subject: subject || (relatedProduct ? `Inquiry: ${relatedProduct.name}` : relatedOrder ? `Order Help: #${relatedOrder.orderId}` : 'Store Inquiry'),
        category: category || (relatedOrder ? 'order_inquiry' : relatedProduct ? 'product_inquiry' : 'general'),
        relatedProduct: relatedProduct || null,
        relatedOrder: relatedOrder || null,
        initialMessage: initialMessage || '',
        attachments: attachments || []
      };

      // Try API first
      const res = await apiService.createConversation(payload, user);
      if (res && res.success && res.conversation) {
        const conv = res.conversation;
        setConversations((prev) => {
          const exists = prev.some((c) => c.id === conv.id);
          if (exists) {
            return prev.map((c) => (c.id === conv.id ? conv : c));
          }
          return [conv, ...prev];
        });
        setActiveConversationId(conv.id);
        return conv;
      }

      // Offline / fallback creation
      const now = new Date().toISOString();
      const existingMatch = conversations.find(
        (c) =>
          c.customerId === effCustomerId &&
          c.vendorId === vendorId &&
          c.status !== 'archived' &&
          ((relatedProduct?.productId && c.relatedProduct?.productId === relatedProduct.productId) ||
            (relatedOrder?.orderId && c.relatedOrder?.orderId === relatedOrder.orderId) ||
            (!relatedProduct?.productId && !relatedOrder?.orderId && !c.relatedProduct && !c.relatedOrder))
      );

      if (existingMatch) {
        if (initialMessage && initialMessage.trim()) {
          const newMsg = {
            id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            senderId: effCustomerId,
            senderType: 'customer',
            senderName: effCustomerName,
            senderAvatar: effCustomerAvatar,
            text: initialMessage.trim(),
            attachments: attachments || [],
            createdAt: now,
            isRead: false
          };
          const updated = {
            ...existingMatch,
            messages: [...(existingMatch.messages || []), newMsg],
            lastMessage: initialMessage.trim(),
            lastMessageSender: 'customer',
            lastMessageAt: now,
            unreadVendor: (existingMatch.unreadVendor || 0) + 1,
            status: 'active'
          };
          setConversations((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
          setActiveConversationId(updated.id);
          return updated;
        }
        setActiveConversationId(existingMatch.id);
        return existingMatch;
      }

      const newId = `conv-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const initialMsgs = [];
      if (initialMessage && initialMessage.trim()) {
        initialMsgs.push({
          id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          senderId: effCustomerId,
          senderType: 'customer',
          senderName: effCustomerName,
          senderAvatar: effCustomerAvatar,
          text: initialMessage.trim(),
          attachments: attachments || [],
          createdAt: now,
          isRead: false
        });
      }

      const newConv = {
        id: newId,
        customerId: effCustomerId,
        customerName: effCustomerName,
        customerEmail: effCustomerEmail,
        customerAvatar: effCustomerAvatar,
        vendorId,
        vendorName: vendorName || 'Vendor Merchant',
        vendorAvatar: vendorAvatar || '',
        subject: payload.subject,
        category: payload.category,
        relatedProduct: payload.relatedProduct,
        relatedOrder: payload.relatedOrder,
        status: 'active',
        unreadVendor: initialMsgs.length > 0 ? 1 : 0,
        unreadCustomer: 0,
        lastMessage: initialMessage ? initialMessage.trim() : 'Conversation initiated',
        lastMessageSender: 'customer',
        lastMessageAt: now,
        messages: initialMsgs
      };

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      return newConv;
    },
    [user, conversations]
  );

  // Update conversation status (active, resolved, archived)
  const updateConversationStatus = useCallback(
    async (conversationId, newStatus) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, status: newStatus } : c))
      );
      addToast(`Conversation marked as ${newStatus}`, 'info');
      apiService.updateConversationStatus(conversationId, newStatus, user);
    },
    [user, addToast]
  );

  const getConversationsForProduct = useCallback(
    (productId) => {
      if (!productId) return [];
      return conversations.filter((c) => c.relatedProduct?.productId === productId);
    },
    [conversations]
  );

  const getConversationsForOrder = useCallback(
    (orderId) => {
      if (!orderId) return [];
      return conversations.filter((c) => c.relatedOrder?.orderId === orderId);
    },
    [conversations]
  );

  const value = {
    conversations,
    activeConversation,
    activeConversationId,
    loading,
    stats,
    unreadVendorCount,
    unreadCustomerCount,
    fetchConversations,
    selectConversation,
    sendMessage,
    startConversation,
    markAsRead,
    updateConversationStatus,
    getConversationsForProduct,
    getConversationsForOrder,
    sendTyping
  };

  return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}
