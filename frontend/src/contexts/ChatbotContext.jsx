import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { processClientChatbotMessage } from '../services/chatbotClientEngine';

const ChatbotContext = createContext(null);

const STORAGE_KEY = 'vendorhub_chatbot_history';

const INITIAL_GREETING = {
  id: 'msg-bot-welcome',
  sender: 'bot',
  text:
    `👋 Hello! I am **HubBot**, your dedicated Vendor Hub shopping and customer support assistant.\n\n` +
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

export function ChatbotProvider({ children }) {
  const { user } = useAuth();

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
    return [INITIAL_GREETING];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

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
    setMessages([
      {
        ...INITIAL_GREETING,
        id: `msg-bot-welcome-${Date.now()}`,
        timestamp: new Date().toISOString()
      }
    ]);
  }, []);

  const sendMessage = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;

      const userText = text.trim();
      const userMsg = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: userText,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      try {
        let res = await apiService.sendChatbotMessage(
          {
            message: userText,
            userId: user?.id || null,
            userRole: user?.type || 'customer',
            context: {
              pathname: window.location.pathname
            }
          },
          user
        );

        if (!res || !res.success || !res.reply) {
          // Use client NLP intelligence engine as resilient fallback
          res = processClientChatbotMessage(userText, user, { pathname: window.location.pathname });
        }

        if (res && res.reply) {
          const botMsg = {
            id: `msg-bot-${Date.now()}`,
            sender: 'bot',
            text: res.reply,
            intent: res.intent || 'general',
            actionCards: res.actionCards || [],
            quickReplies: res.quickReplies || [
              'Track My Order',
              'Active Coupons & Offers',
              'How does Delivery OTP work?',
              'Return Policy'
            ],
            timestamp: res.timestamp || new Date().toISOString()
          };
          setMessages((prev) => [...prev, botMsg]);
        }
      } catch (err) {
        console.warn('Chatbot processing exception, using client NLP engine:', err);
        const fallback = processClientChatbotMessage(userText, user, { pathname: window.location.pathname });
        const fallbackMsg = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text: fallback.reply,
          intent: fallback.intent || 'fallback_guided',
          actionCards: fallback.actionCards || [],
          quickReplies: fallback.quickReplies || [
            'Track My Order',
            'Active Coupons & Offers',
            'How does Delivery OTP work?'
          ],
          timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setIsTyping(false);
      }
    },
    [user]
  );

  const openWithPrompt = useCallback(
    (promptText) => {
      setIsOpen(true);
      if (promptText) {
        sendMessage(promptText);
      }
    },
    [sendMessage]
  );

  const value = {
    isOpen,
    isTyping,
    messages,
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
