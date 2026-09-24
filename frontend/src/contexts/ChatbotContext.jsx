import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

const ChatbotContext = createContext(null);

const STORAGE_KEY = 'vendorhub_chatbot_history';

const INITIAL_GREETING = {
  id: 'msg-bot-welcome',
  sender: 'bot',
  text:
    `👋 Hello! I am **HubBot**, your dedicated Vendor Hub customer support assistant.\n\n` +
    `I can help you with:\n` +
    `• 📦 **Live Courier Tracking**: Check real-time shipment & dispatch updates.\n` +
    `• 🔑 **Doorstep Delivery OTP**: Understand the anti-fraud 4-digit code for COD parcels.\n` +
    `• 🔄 **Returns & Replacements**: 7-day physical return guarantee & dispute assistance.\n` +
    `• 🛡️ **Brand Warranty**: Inquiries regarding verified manufacturer invoices.\n` +
    `• 💬 **Storefront Chat**: How to communicate directly with physical merchants.\n\n` +
    `Click a quick topic below or type your question!`,
  intent: 'welcome',
  quickReplies: [
    'Track My Order',
    'How does Delivery OTP work?',
    'Return & Replacement Policy',
    'Brand Warranty Guarantee',
    'Recommend Top Electronics'
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
        const res = await apiService.sendChatbotMessage(
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

        if (res && res.success && res.reply) {
          const botMsg = {
            id: `msg-bot-${Date.now()}`,
            sender: 'bot',
            text: res.reply,
            intent: res.intent || 'general',
            actionCards: res.actionCards || [],
            quickReplies: res.quickReplies || [
              'Track My Order',
              'Return Policy',
              'Delivery OTP Guide'
            ],
            timestamp: res.timestamp || new Date().toISOString()
          };
          setMessages((prev) => [...prev, botMsg]);
        } else {
          // Offline intelligent fallback
          setTimeout(() => {
            const fallbackMsg = {
              id: `msg-bot-${Date.now()}`,
              sender: 'bot',
              text:
                `Thank you for your question regarding "${userText}".\n\n` +
                `• For **Order Tracking & Delivery OTP**: Navigate to **My Orders** in the top navigation bar.\n` +
                `• For **7-Day Returns & Disputes**: You can file a claim directly from your delivered order items.\n` +
                `• For **Direct Merchant Chat**: Click "Message Merchant" on any product or storefront card.`,
              intent: 'offline_fallback',
              quickReplies: ['Track My Orders', 'How does Delivery OTP work?', 'Return Policy'],
              timestamp: new Date().toISOString()
            };
            setMessages((prev) => [...prev, fallbackMsg]);
          }, 400);
        }
      } catch {
        const fallbackMsg = {
          id: `msg-bot-${Date.now()}`,
          sender: 'bot',
          text:
            `I am here to assist with physical merchandise orders, delivery OTP verification, brand warranties, and merchant chat. Please choose an option below:`,
          intent: 'error_fallback',
          quickReplies: ['Track My Orders', 'How does Delivery OTP work?', 'Return Policy'],
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
