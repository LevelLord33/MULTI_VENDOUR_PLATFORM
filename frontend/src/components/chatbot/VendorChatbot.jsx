import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageSquare, X, Send, Bot, Sparkles, ChevronDown,
  RotateCcw, Trash2, Package, Truck, ShieldCheck, Key,
  ExternalLink, Copy, Check, ArrowRight, Store, HelpCircle,
  Ticket, Tag, Maximize2, Mic, MicOff, Volume2, VolumeX,
  Square, Radio, Headphones, FileText, DollarSign, Layers
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function VendorChatbot() {
  const {
    isOpen,
    isTyping,
    messages,
    setActiveRole,
    toggleChatbot,
    closeChatbot,
    clearHistory,
    sendMessage,
    // Voice Assistant APIs
    ttsEnabled,
    toggleTts,
    isSpeaking,
    speakingMessageId,
    speakMessage,
    stopSpeaking,
    isListening,
    interimTranscript,
    startListening,
    stopListening
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [inputVal, setInputVal] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [showTeaser, setShowTeaser] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // STRICT GUARD: Vendor Chatbot only renders on vendor portal routes (/vendor/*)
  const shouldRenderVendor = location.pathname.startsWith('/vendor');

  useEffect(() => {
    if (shouldRenderVendor) {
      setActiveRole('vendor');
    }
  }, [shouldRenderVendor, setActiveRole]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 150);
      setShowTeaser(false);
    }
  }, [isOpen]);

  // If not in vendor context or if on admin routes, do not render at all
  if (!shouldRenderVendor) {
    return null;
  }

  const handleSend = (e) => {
    if (e) e.preventDefault();
    const q = (inputVal || interimTranscript || '').trim();
    if (!q || isTyping) return;
    const wasVoice = Boolean(isListening || interimTranscript);
    if (isListening) {
      stopListening();
    }
    setInputVal('');
    sendMessage(q, 'vendor', { isVoice: wasVoice });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const vendorQuickTopics = [
    { label: '➕ Add Product', prompt: 'How do I add a new physical product with SKU, HSN, and GST?' },
    { label: '🚚 Fulfill Orders', prompt: 'How do I process orders, print labels, and assign courier waybills?' },
    { label: '💎 Vendor Plans', prompt: 'What are the vendor subscription plans and commission rates?' },
    { label: '💰 Payouts (T+3)', prompt: 'When will I receive payouts and how does bank settlement work?' },
    { label: '📄 GST Invoices', prompt: 'How do GST invoices and automated Twilio WhatsApp alerts work?' },
    { label: '📣 Marketing & Promos', prompt: 'How can I create promotional coupons and boost listings?' },
    { label: '📦 Stock Alerts', prompt: 'How do inventory alerts work to prevent out-of-stock penalties?' },
    { label: '⚠️ Return Claims', prompt: 'How do vendors handle customer returns and dispute claims?' },
    { label: '🎨 Store Builder', prompt: 'How do I customize my store banner, logo, and operating hours?' }
  ];

  // Helper to format bot markdown-like text
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-weight:700;color:#059669;">$1</code>'
      );

      if (line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 6, margin: '3px 0' }}>
            <span style={{ color: '#10B981', fontWeight: 800 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: withCode.replace(/^(\s*)[•*]\s*/, '') }} />
          </div>
        );
      }

      if (line.trim().startsWith('> ')) {
        return (
          <div
            key={idx}
            style={{
              padding: '6px 10px',
              margin: '6px 0',
              borderLeft: '3px solid #10B981',
              background: 'rgba(16, 185, 129, 0.08)',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.82rem'
            }}
            dangerouslySetInnerHTML={{ __html: withCode.replace(/^>\s*/, '') }}
          />
        );
      }

      if (!line.trim()) {
        return <div key={idx} style={{ height: 6 }} />;
      }

      return (
        <div key={idx} style={{ margin: '2px 0' }} dangerouslySetInnerHTML={{ __html: withCode }} />
      );
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9990, fontFamily: 'inherit' }}>
      {/* ── TEASER TOOLTIP BANNER (when closed) ── */}
      {!isOpen && showTeaser && (
        <div
          style={{
            position: 'absolute',
            bottom: 74,
            right: 0,
            width: 290,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '12px 14px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            animation: 'fadeIn 0.25s ease-out'
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Store size={19} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                HubBot Vendor Co-Pilot
              </span>
              <button
                type="button"
                onClick={() => setShowTeaser(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            </div>
            <p style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
              Need merchant help with product listing, courier waybills, or payout settlements?
            </p>
            <button
              type="button"
              onClick={toggleChatbot}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                color: '#10B981',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 0
              }}
            >
              <span>Merchant Co-Pilot</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* ── FLOATING TRIGGER LAUNCHER BUTTON ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleChatbot}
          title="Open Vendor Co-Pilot"
          aria-label="Open Vendor Co-Pilot"
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.4)',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(16, 185, 129, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
          }}
        >
          <Store size={24} />
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: '#059669',
              border: '2px solid white'
            }}
          />
        </button>
      )}

      {/* ── EXPANDED CHAT WINDOW ── */}
      {isOpen && (
        <div
          style={{
            width: 410,
            maxWidth: 'calc(100vw - 32px)',
            height: 620,
            maxHeight: 'calc(100vh - 100px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 18,
            boxShadow: '0 16px 48px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUpModal 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* ── TOP HEADER ── */}
          <div
            style={{
              padding: '12px 16px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                  position: 'relative'
                }}
              >
                <Store size={20} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#34D399',
                    border: '2px solid white'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '0.01em' }}>
                    HubBot AI
                  </span>
                  <span
                    style={{
                      fontSize: '0.64rem',
                      background: 'rgba(255,255,255,0.25)',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700
                    }}
                  >
                    Vendor Co-Pilot
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                  Online • Merchant Business Operations
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button
                type="button"
                onClick={toggleTts}
                title={ttsEnabled ? "Text-to-Speech Voice Enabled" : "Text-to-Speech Muted"}
                style={{
                  background: ttsEnabled ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: 6,
                  color: ttsEnabled ? '#FDE047' : 'rgba(255,255,255,0.6)',
                  cursor: 'pointer',
                  padding: '5px 7px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  closeChatbot();
                  navigate('/vendor/assistant');
                }}
                title="Open In Full Page"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 6,
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px 7px'
                }}
              >
                <Maximize2 size={14} />
              </button>
              <button
                type="button"
                onClick={clearHistory}
                title="Clear Chat History"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 6,
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px 7px'
                }}
              >
                <Trash2 size={14} />
              </button>
              <button
                type="button"
                onClick={closeChatbot}
                title="Minimize Chat"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: 6,
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px 7px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* ── CONTEXT STATUS BAR (Strictly Merchant Ops) ── */}
          <div
            style={{
              padding: '6px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              borderBottom: '1px solid rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.74rem'
            }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontWeight: 700,
              color: '#065F46'
            }}>
              <Store size={13} color="#059669" />
              <span>Merchant Operations Co-Pilot</span>
            </div>
            <span style={{ fontSize: '0.68rem', color: '#047857' }}>
              SKU • Courier • Payouts • T+3
            </span>
          </div>

          {/* ── TOP QUICK TOPICS CAROUSEL ── */}
          <div
            style={{
              padding: '8px 12px',
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              gap: 6,
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}
          >
            {vendorQuickTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(item.prompt, 'vendor')}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#10B981';
                  e.currentTarget.style.color = '#10B981';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* ── MESSAGES CONTAINER ── */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              background: 'var(--background)'
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                    maxWidth: '88%',
                    alignSelf: isBot ? 'flex-start' : 'flex-end'
                  }}
                >
                  {/* Sender label */}
                  <div
                    style={{
                      fontSize: '0.68rem',
                      color: 'var(--text-muted)',
                      marginBottom: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {isBot ? (
                      <>
                        <Store size={12} color="#10B981" />
                        <span style={{ fontWeight: 700, color: '#047857' }}>
                          Vendor Co-Pilot
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 700 }}>Merchant</span>
                    )}
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: isBot ? 'var(--surface-2)' : '#10B981',
                      color: isBot ? 'var(--text-primary)' : 'white',
                      fontSize: '0.84rem',
                      lineHeight: 1.45,
                      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                      border: isBot ? '1px solid var(--border)' : 'none',
                      wordBreak: 'break-word'
                    }}
                  >
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* TTS Read Aloud for Bot */}
                  {isBot && (
                    <button
                      type="button"
                      onClick={() => speakMessage(msg.id, msg.text)}
                      title={speakingMessageId === msg.id ? "Stop voice playback" : "Listen aloud"}
                      style={{
                        background: speakingMessageId === msg.id ? 'rgba(16, 185, 129, 0.14)' : 'none',
                        border: speakingMessageId === msg.id ? '1px solid #10B981' : 'none',
                        color: speakingMessageId === msg.id ? '#10B981' : 'var(--text-muted)',
                        borderRadius: 6,
                        padding: '2px 7px',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: '0.68rem',
                        marginTop: 4
                      }}
                    >
                      {speakingMessageId === msg.id ? <Square size={10} fill="#10B981" /> : <Volume2 size={11} />}
                      <span>{speakingMessageId === msg.id ? "Stop voice" : "Read aloud"}</span>
                    </button>
                  )}

                  {/* Action Link if available */}
                  {msg.actionLink && (
                    <button
                      type="button"
                      onClick={() => {
                        closeChatbot();
                        navigate(msg.actionLink);
                      }}
                      style={{
                        marginTop: 6,
                        padding: '5px 10px',
                        borderRadius: 8,
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                        color: '#047857',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span>{msg.actionLabel || 'Open Dashboard Tool'}</span>
                      <ExternalLink size={11} />
                    </button>
                  )}

                  {/* Quick Replies */}
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                      {msg.quickReplies.map((qr, qidx) => (
                        <button
                          key={qidx}
                          type="button"
                          onClick={() => sendMessage(qr, 'vendor')}
                          style={{
                            padding: '3px 8px',
                            borderRadius: 12,
                            background: 'var(--surface-2)',
                            border: '1px solid var(--border)',
                            fontSize: '0.72rem',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#10B981';
                            e.currentTarget.style.color = '#10B981';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }}
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  background: 'var(--surface-2)',
                  borderRadius: 12,
                  width: 'fit-content'
                }}
              >
                <Store size={14} color="#10B981" />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Vendor Co-Pilot is preparing merchant guidance...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── BOTTOM INPUT AREA ── */}
          <div
            style={{
              padding: '10px 12px',
              background: 'var(--surface-2)',
              borderTop: '1px solid var(--border)'
            }}
          >
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={isListening && interimTranscript ? interimTranscript : inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? (interimTranscript || '🎙️ Listening... Speak now')
                    : isSpeaking
                    ? '🔊 Vendor Co-Pilot is speaking...'
                    : 'Ask Vendor Co-Pilot (listing SKU, waybill, payouts)...'
                }
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: isListening ? '1.5px solid #EF4444' : '1px solid var(--border)',
                  background: isListening ? 'rgba(239, 68, 68, 0.05)' : 'var(--surface)',
                  color: isListening ? '#DC2626' : 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
              />

              {/* Mic STT Button */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening((speechText) => {
                      if (speechText && speechText.trim()) {
                        setInputVal(speechText.trim());
                        sendMessage(speechText.trim(), 'vendor', { isVoice: true });
                      }
                    });
                  }
                }}
                title={isListening ? "Listening... click to stop" : "Speak to Vendor Co-Pilot"}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: isListening ? '1px solid #EF4444' : '1px solid var(--border)',
                  background: isListening ? '#EF4444' : 'var(--surface)',
                  color: isListening ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

              <button
                type="submit"
                disabled={(!inputVal.trim() && !interimTranscript.trim()) || isTyping}
                style={{
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#10B981',
                  color: 'white',
                  cursor: (!inputVal.trim() && !interimTranscript.trim()) || isTyping ? 'not-allowed' : 'pointer',
                  opacity: (!inputVal.trim() && !interimTranscript.trim()) || isTyping ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(16, 185, 129, 0.3)'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
