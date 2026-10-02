import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { processClientChatbotMessage } from '../services/chatbotClientEngine';

const ChatbotContext = createContext(null);

const STORAGE_KEY = 'vendorhub_chatbot_history_v2';
const ROLE_STORAGE_KEY = 'vendorhub_chatbot_role';

export const CUSTOMER_INITIAL_GREETING = {
  id: 'msg-bot-welcome-customer',
  sender: 'bot',
  role: 'customer',
  text:
    `👋 Hello! I am **HubBot**, your dedicated Vendor Hub shopping and customer support concierge.\n\n` +
    `I can help you with all customer queries in real-time:\n` +
    `• 📦 **Live Courier Tracking**: Check real-time shipment waybills & delivery ETA.\n` +
    `• 🏷️ **Active Coupons & Deals**: Save with verified promo codes (\`TECH20\`, \`STYLE15\`, \`AUDIO200\`).\n` +
    `• 🔑 **Doorstep Delivery OTP**: Understand the anti-fraud 4-digit code for COD parcels.\n` +
    `• 🔄 **7-Day Returns & Replacements**: Hassle-free physical return guarantee & dispute resolution.\n` +
    `• 🚚 **Shipping & Dispatch**: Free delivery above ₹499 & 24h warehouse dispatch.\n` +
    `• 🛑 **Order Cancellation**: Pre-dispatch 100% instant refund guidelines.\n` +
    `• 🛍️ **Product Search & Recommendations**: Find items under any budget or category.\n` +
    `• 📞 **Customer Care Helpline**: Toll-free support and merchant chat.\n\n` +
    `Click a quick topic below or type your question!`,
  intent: 'welcome',
  quickReplies: [
    'Track My Order',
    'Active Coupons & Offers',
    'Recommend Top Electronics',
    'How does Delivery OTP work?',
    'Return & Replacement Policy',
    'Shipping Charges & Delivery Time'
  ],
  timestamp: new Date().toISOString()
};

export const VENDOR_INITIAL_GREETING = {
  id: 'msg-bot-welcome-vendor',
  sender: 'bot',
  role: 'vendor',
  text:
    `🏪 **Hello! I am HubBot Operations Co-Pilot**, your 24/7 AI merchant business partner on Vendor Hub.\n\n` +
    `I am equipped to handle all your seller operations, cataloging, and logistics queries:\n` +
    `• ➕ **Product Catalog & SKUs**: Add physical products, HSN codes, GST tax slabs, and track approval status.\n` +
    `• 🚚 **Orders & Courier Dispatch**: Print GST tax invoices, generate packing slips, and assign Delhivery/BlueDart waybills.\n` +
    `• 🔑 **Doorstep COD OTP**: Fraud-proof delivery verification protecting merchants against non-delivery claims.\n` +
    `• 💎 **Subscription Plans & Fees**: Compare Starter (12%), Growth (8%), and Pro (5%) tiers.\n` +
    `• 💰 **Payouts & Bank Settlement**: T+3 automated settlement cycle, commission deduction, and NEFT remittance.\n` +
    `• 📄 **GST Invoices & Twilio Gateway**: Automated customer tax billing with automated WhatsApp/SMS dispatch alerts.\n` +
    `• 📣 **Marketing & Store Promotions**: Create custom merchant discount coupons and featured placements.\n` +
    `• 📦 **Smart Inventory & Stock Alerts**: Monitor reorder levels (<=5 units) and prevent out-of-stock penalties.\n` +
    `• ⚠️ **Dispute & Claim Defense**: Resolve buyer return disputes with photo/video packaging proof.\n\n` +
    `Click a quick operational action below or ask your question:`,
  intent: 'vendor_welcome',
  actionCards: [
    {
      type: 'navigation_card',
      title: 'Add Physical Product',
      description: 'List new inventory with SKU, MRP, GST slab & HSN code.',
      buttonText: '➕ Add Product',
      link: '/vendor/add-product',
      badge: 'Catalog'
    },
    {
      type: 'navigation_card',
      title: 'Orders & Dispatch',
      description: 'Process pending orders, print labels & assign courier waybills.',
      buttonText: '🚚 Fulfill Orders',
      link: '/vendor/orders',
      badge: 'Fulfillment'
    },
    {
      type: 'navigation_card',
      title: 'Marketing Center',
      description: 'Launch store promo codes & boost featured items.',
      buttonText: '📣 Launch Promo',
      link: '/vendor/marketing',
      badge: 'Sales'
    }
  ],
  quickReplies: [
    '➕ Add New Product',
    '🚚 Fulfill Orders & AWB',
    '💎 Vendor Plans & Fees',
    '💰 Payout Settlement',
    '📄 GST Invoices & Twilio',
    '📣 Store Marketing & Coupons',
    '⚠️ Dispute Resolution'
  ],
  timestamp: new Date().toISOString()
};

export function ChatbotProvider({ children }) {
  const { user } = useAuth();

  // Active persona: 'customer' or 'vendor'
  const [activeRole, setActiveRoleState] = useState(() => {
    try {
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY);
      if (savedRole === 'customer' || savedRole === 'vendor') return savedRole;
    } catch {
      // ignore
    }
    return user?.type === 'vendor' ? 'vendor' : 'customer';
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [user?.type === 'vendor' ? VENDOR_INITIAL_GREETING : CUSTOMER_INITIAL_GREETING];
  });

  // Sync role when user changes authentication state
  useEffect(() => {
    if (user?.type === 'vendor' && activeRole !== 'vendor') {
      setActiveRoleState('vendor');
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'vendor');
      } catch {
        // ignore
      }
    } else if (user?.type === 'customer' && activeRole !== 'customer') {
      setActiveRoleState('customer');
      try {
        localStorage.setItem(ROLE_STORAGE_KEY, 'customer');
      } catch {
        // ignore
      }
    }
  }, [user?.type]);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const setActiveRole = useCallback((role) => {
    const validRole = role === 'vendor' ? 'vendor' : 'customer';
    setActiveRoleState(validRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, validRole);
    } catch {
      // ignore
    }
  }, []);

  const switchRole = useCallback((newRole) => {
    const validRole = newRole === 'vendor' ? 'vendor' : 'customer';
    setActiveRoleState(validRole);
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, validRole);
    } catch {
      // ignore
    }

    const switchNotice = {
      id: `msg-role-switch-${Date.now()}`,
      sender: 'bot',
      role: validRole,
      text:
        validRole === 'vendor'
          ? `🔄 Switched to **Vendor Operations Co-Pilot Mode**.\n\nHow can I assist with your catalog listings, courier dispatch, subscriptions, or payout settlements?`
          : `🔄 Switched to **Customer Shopping Concierge Mode**.\n\nHow can I help with your order tracking, active coupons, returns, or product recommendations?`,
      quickReplies:
        validRole === 'vendor'
          ? [
              '➕ Add New Product',
              '🚚 Fulfill Orders & AWB',
              '💎 Vendor Plans & Fees',
              '💰 Payout Settlement',
              '📄 GST Invoices & Twilio'
            ]
          : [
              'Track My Order',
              'Active Coupons & Offers',
              'Recommend Top Electronics',
              'How does Delivery OTP work?',
              'Return & Replacement Policy'
            ],
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, switchNotice]);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openChatbot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const clearHistory = useCallback(() => {
    const initial = activeRole === 'vendor' ? VENDOR_INITIAL_GREETING : CUSTOMER_INITIAL_GREETING;
    setMessages([
      {
        ...initial,
        id: `msg-bot-welcome-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, [activeRole]);

  const sendMessage = useCallback(
    async (text, overrideRole = null) => {
      if (!text || !text.trim()) return;

      const userText = text.trim();
      const currentRole = overrideRole || activeRole;

      const userMsg = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: userText,
        role: currentRole,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        let res = await apiService.sendChatbotMessage(
          {
            message: userText,
            userId: user?.id || null,
            userRole: currentRole,
            context: {
              pathname: window.location.pathname,
              userRole: currentRole
            }
          },
          user
        );

        if (!res || !res.success || !res.reply) {
          // Use client NLP intelligence engine as resilient fallback
          res = processClientChatbotMessage(userText, user, {
            pathname: window.location.pathname,
            userRole: currentRole
          });
        }

        if (res && res.reply) {
          const defaultQuickReplies =
            currentRole === 'vendor'
              ? [
                  '➕ Add New Product',
                  '🚚 Fulfill Orders & AWB',
                  '💎 Vendor Plans & Fees',
                  '💰 Payout Settlement'
                ]
              : [
                  'Track My Order',
                  'Active Coupons & Offers',
                  'How does Delivery OTP work?',
                  'Return Policy'
                ];

          const botMsg = {
            id: `msg-bot-${Date.now()}`,
            sender: 'bot',
            role: res.role || currentRole,
            text: res.reply,
            intent: res.intent || 'general',
            actionCards: res.actionCards || [],
            quickReplies: res.quickReplies || defaultQuickReplies,
            timestamp: res.timestamp || new Date().toISOString()
          };
          setMessages((prev) => [...prev, botMsg]);
        }
      } catch (err) {
        console.warn('Chatbot processing exception, using client NLP engine:', err);
        const fallback = processClientChatbotMessage(userText, user, {
          pathname: window.location.pathname,
          userRole: currentRole
        });
        const fallbackMsg = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          role: currentRole,
          text: fallback.reply,
          intent: fallback.intent || 'fallback_guided',
          actionCards: fallback.actionCards || [],
          quickReplies:
            fallback.quickReplies ||
            (currentRole === 'vendor'
              ? ['➕ Add New Product', '🚚 Fulfill Orders & AWB', '💎 Vendor Plans & Fees']
              : ['Track My Order', 'Active Coupons & Offers', 'How does Delivery OTP work?']),
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [user, activeRole]
  );

  const openWithPrompt = useCallback(
    (promptText, targetRole = null) => {
      setIsOpen(true);
      if (targetRole && targetRole !== activeRole) {
        setActiveRole(targetRole);
      }
      if (promptText) {
        sendMessage(promptText, targetRole || activeRole);
      }
    },
    [sendMessage, activeRole, setActiveRole]
  );

  const value = {
    isOpen,
    isTyping,
    messages,
    activeRole,
    setActiveRole,
    switchRole,
    toggleChatbot,
    openChatbot,
    closeChatbot,
    clearHistory,
    sendMessage,
    openWithPrompt
  };

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
