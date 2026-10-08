import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { processClientChatbotMessage } from '../services/chatbotClientEngine';
import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  speakText,
  stopSpeaking as haltSpeech,
  createSpeechRecognizer,
  playChime
} from '../utils/speechHelper';

const ChatbotContext = createContext(null);

const CUSTOMER_STORAGE_KEY = 'vendorhub_chatbot_customer_history_v3';
const VENDOR_STORAGE_KEY = 'vendorhub_chatbot_vendor_history_v3';
const ROLE_STORAGE_KEY = 'vendorhub_chatbot_role';
const VOICE_MODE_STORAGE_KEY = 'vendorhub_chatbot_voice_mode';
const TTS_STORAGE_KEY = 'vendorhub_chatbot_tts_enabled';

export const CUSTOMER_INITIAL_GREETING = {
  id: 'msg-bot-welcome-customer',
  sender: 'bot',
  role: 'customer',
  text:
    `👋 Hello! I am **HubBot Voice & AI Concierge**, your personal shopping and customer support assistant.\n\n` +
    `You can chat with me via text or **speak directly using Voice Mode (STS/TTS)**!\n\n` +
    `I can help you with:\n` +
    `• 📦 **Live Courier Tracking**: Check real-time shipment waybills & delivery ETA.\n` +
    `• 🏷️ **Active Coupons & Deals**: Save with verified promo codes (\`TECH20\`, \`STYLE15\`, \`AUDIO200\`).\n` +
    `• 🔑 **Doorstep Delivery OTP**: Understand the anti-fraud 4-digit code for COD parcels.\n` +
    `• 🔄 **7-Day Returns & Replacements**: Hassle-free physical return guarantee & dispute resolution.\n` +
    `• 🚚 **Shipping & Dispatch**: Free delivery above ₹499 & 24h warehouse dispatch.\n` +
    `• 🛑 **Order Cancellation**: Pre-dispatch 100% instant refund guidelines.\n` +
    `• 🛍️ **Product Search & Recommendations**: Find items under any budget or category.\n` +
    `• 📞 **Customer Care Helpline**: Toll-free support and merchant chat.\n\n` +
    `Tap the 🎙️ **Voice Mode** or 🎤 **Mic** to speak, or click a topic below!`,
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
    `🏪 **Hello! I am HubBot Operations Voice & AI Co-Pilot**, your 24/7 merchant business partner.\n\n` +
    `I support hands-free **Speech-to-Speech (STS)** voice commands and voice responses!\n\n` +
    `Ask me anything about your seller operations:\n` +
    `• ➕ **Product Catalog & SKUs**: Add physical products, HSN codes, GST tax slabs, and track approval status.\n` +
    `• 🚚 **Orders & Courier Dispatch**: Print GST tax invoices, generate packing slips, and assign Delhivery/BlueDart waybills.\n` +
    `• 🔑 **Doorstep COD OTP**: Fraud-proof delivery verification protecting merchants against non-delivery claims.\n` +
    `• 💎 **Subscription Plans & Fees**: Compare Starter (12%), Growth (8%), and Pro (5%) tiers.\n` +
    `• 💰 **Payouts & Bank Settlement**: T+3 automated settlement cycle, commission deduction, and NEFT remittance.\n` +
    `• 📄 **GST Invoices & Twilio Gateway**: Automated customer tax billing with automated WhatsApp/SMS dispatch alerts.\n` +
    `• 📣 **Marketing & Store Promotions**: Create custom merchant discount coupons and featured placements.\n` +
    `• 📦 **Smart Inventory & Stock Alerts**: Monitor reorder levels (<=5 units) and prevent out-of-stock penalties.\n` +
    `• ⚠️ **Dispute & Claim Defense**: Resolve buyer return disputes with photo/video packaging proof.\n\n` +
    `Click an action below or tap 🎙️ **Voice Mode** to converse!`,
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

  // Determine initial role strictly by user or location
  const isVendorContext = user?.type === 'vendor' || (typeof window !== 'undefined' && window.location.pathname.startsWith('/vendor'));

  // Active persona: 'customer' or 'vendor'
  const [activeRole, setActiveRoleState] = useState(() => {
    return isVendorContext ? 'vendor' : 'customer';
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Dedicated separated message histories
  const [customerMessages, setCustomerMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [CUSTOMER_INITIAL_GREETING];
  });

  const [vendorMessages, setVendorMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(VENDOR_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [VENDOR_INITIAL_GREETING];
  });

  // Active role messages
  const messages = activeRole === 'vendor' ? vendorMessages : customerMessages;

  // ── Voice Assistant State ────────────────────────────────────────────────
  const [voiceMode, setVoiceModeState] = useState(false);
  const [ttsEnabled, setTtsEnabledState] = useState(() => {
    try {
      return localStorage.getItem(TTS_STORAGE_KEY) !== 'false';
    } catch {
      return true;
    }
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceStatusText, setVoiceStatusText] = useState('Idle');

  const recognizerRef = useRef(null);
  const voiceModeRef = useRef(voiceMode);
  voiceModeRef.current = voiceMode;
  const isSpeakingRef = useRef(isSpeaking);
  isSpeakingRef.current = isSpeaking;
  const isListeningRef = useRef(isListening);
  isListeningRef.current = isListening;
  const sendMessageRef = useRef(null);
  const startListeningRef = useRef(null);

  // Strictly sync role to user type: vendor sees vendor bot, customer sees customer bot
  useEffect(() => {
    if (user?.type === 'vendor') {
      setActiveRoleState('vendor');
    } else if (user?.type === 'customer') {
      setActiveRoleState('customer');
    }
  }, [user?.type]);

  // Persist customer messages to customer storage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customerMessages));
    } catch {
      // ignore
    }
  }, [customerMessages]);

  // Persist vendor messages to vendor storage
  useEffect(() => {
    try {
      localStorage.setItem(VENDOR_STORAGE_KEY, JSON.stringify(vendorMessages));
    } catch {
      // ignore
    }
  }, [vendorMessages]);

  const setActiveRole = useCallback((role) => {
    const validRole = role === 'vendor' ? 'vendor' : 'customer';
    setActiveRoleState(validRole);
  }, []);

  const switchRole = useCallback((newRole) => {
    const validRole = newRole === 'vendor' ? 'vendor' : 'customer';
    setActiveRoleState(validRole);
  }, []);

  const toggleChatbot = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const openChatbot = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
    if (isSpeakingRef.current) {
      haltSpeech();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    }
    if (recognizerRef.current) {
      recognizerRef.current.abort();
      setIsListening(false);
      setInterimTranscript('');
    }
  }, []);

  const clearHistory = useCallback(() => {
    haltSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    if (activeRole === 'vendor') {
      setVendorMessages([
        {
          ...VENDOR_INITIAL_GREETING,
          id: `msg-bot-welcome-vendor-${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      ]);
      try {
        localStorage.removeItem(VENDOR_STORAGE_KEY);
      } catch {
        // ignore
      }
    } else {
      setCustomerMessages([
        {
          ...CUSTOMER_INITIAL_GREETING,
          id: `msg-bot-welcome-customer-${Date.now()}`,
          timestamp: new Date().toISOString()
        }
      ]);
      try {
        localStorage.removeItem(CUSTOMER_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }, [activeRole]);

  // ── TTS Text-to-Speech Controllers ─────────────────────────────────────────
  const stopSpeaking = useCallback(() => {
    haltSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);
    setVoiceStatusText('Idle');
  }, []);

  const speakMessage = useCallback(
    (messageId, text, onCompletedCallback = null) => {
      if (!isSpeechSynthesisSupported()) return;

      // Toggle off if clicking the currently playing message
      if (isSpeaking && speakingMessageId === messageId) {
        stopSpeaking();
        return;
      }

      setIsSpeaking(true);
      setSpeakingMessageId(messageId);
      setVoiceStatusText('Speaking...');

      speakText(text, {
        onStart: () => {
          setIsSpeaking(true);
          setSpeakingMessageId(messageId);
          setVoiceStatusText('Speaking...');
        },
        onEnd: () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          setVoiceStatusText('Idle');
          if (onCompletedCallback) {
            onCompletedCallback();
          }
        },
        onError: () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
          setVoiceStatusText('Idle');
        }
      });
    },
    [isSpeaking, speakingMessageId, stopSpeaking]
  );

  // ── Speech-to-Text / Voice Input Controller ───────────────────────────────
  const startListening = useCallback(async (customOnResult = null) => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    // Stop speaking if currently reading
    haltSpeech();
    setIsSpeaking(false);
    setSpeakingMessageId(null);

    // Warm-up AudioContext and check microphone permission if available
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
      } catch (permErr) {
        console.warn('Microphone permission check:', permErr);
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          alert('Microphone permission was denied. Please click the camera/microphone icon in your browser address bar to allow access.');
          setVoiceStatusText('Microphone permission denied');
          setIsListening(false);
          return;
        }
      }
    }

    playChime('start');
    setIsListening(true);
    setInterimTranscript('');
    setVoiceStatusText('Listening... Speak now');

    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }

    recognizerRef.current = createSpeechRecognizer({
      onInterim: (text) => {
        setInterimTranscript(text);
        setVoiceStatusText(`Listening: "${text}"`);
      },
      onResult: (finalText) => {
        playChime('end');
        setIsListening(false);
        setInterimTranscript('');
        setVoiceStatusText('Processing...');
        if (customOnResult) {
          customOnResult(finalText);
        } else {
          sendMessageRef.current?.(finalText, activeRole, { isVoice: true });
        }
      },
      onError: (err) => {
        console.warn('Voice recognizer error:', err);
        setIsListening(false);
        setInterimTranscript('');
        setVoiceStatusText('Voice recognition stopped');
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    recognizerRef.current.start();
  }, [activeRole]);

  const stopListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
    }
    setIsListening(false);
    setVoiceStatusText('Idle');
  }, []);

  const cancelListening = useCallback(() => {
    if (recognizerRef.current) {
      recognizerRef.current.abort();
    }
    setIsListening(false);
    setInterimTranscript('');
    setVoiceStatusText('Idle');
  }, []);

  // ── Send Message Core Logic ────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text, overrideRole = null, options = {}) => {
      if (!text || !text.trim()) return;

      const userText = text.trim();
      const currentRole = overrideRole || activeRole;
      const isVoiceOrigin = options.isVoice || voiceModeRef.current;

      const userMsg = {
        id: `msg-user-${Date.now()}`,
        sender: 'user',
        text: userText,
        role: currentRole,
        isVoice: isVoiceOrigin,
        timestamp: new Date().toISOString()
      };

      if (currentRole === 'vendor') {
        setVendorMessages((prev) => [...prev, userMsg]);
      } else {
        setCustomerMessages((prev) => [...prev, userMsg]);
      }
      setIsTyping(true);
      setVoiceStatusText('Thinking...');

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

          if (currentRole === 'vendor') {
            setVendorMessages((prev) => [...prev, botMsg]);
          } else {
            setCustomerMessages((prev) => [...prev, botMsg]);
          }

          // STS / Auto-TTS Handling: If voiceMode is on, ttsEnabled is true, or voice origin
          if (voiceModeRef.current || ttsEnabled || isVoiceOrigin) {
            speakMessage(botMsg.id, botMsg.text, () => {
              // If in continuous Voice Assistant Mode, auto-listen for user's next question!
              if (voiceModeRef.current) {
                setTimeout(() => {
                  if (voiceModeRef.current && !isListeningRef.current) {
                    startListeningRef.current?.((nextSpeech) => {
                      if (nextSpeech && nextSpeech.trim()) {
                        sendMessageRef.current?.(nextSpeech, currentRole, { isVoice: true });
                      }
                    });
                  }
                }, 350);
              }
            });
          }
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
        if (currentRole === 'vendor') {
          setVendorMessages((prev) => [...prev, fallbackMsg]);
        } else {
          setCustomerMessages((prev) => [...prev, fallbackMsg]);
        }

        if (voiceModeRef.current || ttsEnabled || isVoiceOrigin) {
          speakMessage(fallbackMsg.id, fallbackMsg.text);
        }
      } finally {
        setIsTyping(false);
      }
    },
    [user, activeRole, ttsEnabled, speakMessage]
  );

  sendMessageRef.current = sendMessage;
  startListeningRef.current = startListening;

  // ── Voice Assistant Mode Toggle (STS Hands-Free) ───────────────────────────
  const toggleVoiceMode = useCallback(() => {
    if (!isSpeechRecognitionSupported() || !isSpeechSynthesisSupported()) {
      alert('Your browser does not fully support Speech Recognition or Speech Synthesis. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    setVoiceModeState((prev) => {
      const next = !prev;
      if (next) {
        setIsOpen(true);
        // Automatically start listening when entering voice mode
        setTimeout(() => {
          startListening((transcript) => {
            if (transcript && transcript.trim()) {
              sendMessage(transcript, activeRole, { isVoice: true });
            }
          });
        }, 150);
      } else {
        haltSpeech();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
        if (recognizerRef.current) {
          recognizerRef.current.abort();
        }
        setIsListening(false);
        setInterimTranscript('');
      }
      return next;
    });
  }, [activeRole, sendMessage, startListening]);

  const toggleTts = useCallback(() => {
    setTtsEnabledState((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(TTS_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      if (!next && isSpeakingRef.current) {
        haltSpeech();
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
      return next;
    });
  }, []);

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
    openWithPrompt,
    // Voice Assistant (STS & TTS) APIs
    voiceMode,
    toggleVoiceMode,
    setVoiceMode: setVoiceModeState,
    ttsEnabled,
    toggleTts,
    isSpeaking,
    speakingMessageId,
    speakMessage,
    stopSpeaking,
    isListening,
    interimTranscript,
    voiceStatusText,
    startListening,
    stopListening,
    cancelListening,
    isSpeechRecognitionSupported: isSpeechRecognitionSupported(),
    isSpeechSynthesisSupported: isSpeechSynthesisSupported()
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
