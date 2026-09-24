import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageSquare, X, Send, Bot, Sparkles, ChevronDown,
  RotateCcw, Trash2, Package, Truck, ShieldCheck, Key,
  ExternalLink, Copy, Check, ArrowRight, Store, HelpCircle
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function CustomerChatbot() {
  const {
    isOpen,
    isTyping,
    messages,
    toggleChatbot,
    closeChatbot,
    clearHistory,
    sendMessage
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [inputVal, setInputVal] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [showTeaser, setShowTeaser] = useState(true);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const q = inputVal.trim();
    setInputVal('');
    sendMessage(q);
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

  const quickTopics = [
    { label: '📦 Track My Order', prompt: 'Track my recent order' },
    { label: '🔑 Delivery OTP Guide', prompt: 'How does doorstep Cash on Delivery OTP work?' },
    { label: '🔄 Returns & Refund', prompt: 'What is the return and replacement policy?' },
    { label: '🛡️ Brand Warranty', prompt: 'Are products covered by official brand warranty?' },
    { label: '💬 Contact Seller', prompt: 'How do I message a merchant directly?' },
    { label: '⚡ Top Electronics', prompt: 'Recommend top rated electronics with warranty' }
  ];

  // Helper to format bot markdown-like text
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold tags
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withCode = formatted.replace(/`([^`]+)`/g, '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-weight:700;">$1</code>');

      if (line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 6, margin: '3px 0' }}>
            <span>•</span>
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
              borderLeft: '3px solid var(--primary)',
              background: 'rgba(79, 70, 229, 0.08)',
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
            width: 270,
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
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Sparkles size={16} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Need order or delivery help?
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Ask <strong>HubBot</strong> for live courier tracking, doorstep OTP & return assistance!
            </div>
            <button
              type="button"
              onClick={toggleChatbot}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              Start Chat <ArrowRight size={12} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowTeaser(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── FLOATING LAUNCHER BUTTON ── */}
      {!isOpen && (
        <button
          type="button"
          onClick={toggleChatbot}
          aria-label="Open Customer Support Chatbot"
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
            color: 'white',
            border: '3px solid rgba(255,255,255,0.8)',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(79, 70, 229, 0.6)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.45)';
          }}
        >
          <Bot size={28} />
          {/* Green active dot */}
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid white'
            }}
          />
        </button>
      )}

      {/* ── CHAT WINDOW ── */}
      {isOpen && (
        <div
          style={{
            width: 400,
            maxWidth: 'calc(100vw - 32px)',
            height: 570,
            maxHeight: 'calc(100vh - 40px)',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            boxShadow: '0 20px 45px rgba(0,0,0,0.22)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          {/* ── CHAT HEADER ── */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.3)',
                  position: 'relative'
                }}
              >
                <Bot size={22} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: '#10B981',
                    border: '2px solid white'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 800, fontSize: '0.96rem', letterSpacing: '0.01em' }}>
                    HubBot Support
                  </span>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      background: 'rgba(255,255,255,0.25)',
                      padding: '1px 6px',
                      borderRadius: 4,
                      fontWeight: 700
                    }}
                  >
                    AI Assistant
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', opacity: 0.9 }}>
                  Online • Verified Marketplace Help
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
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
                <Trash2 size={15} />
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
                <ChevronDown size={17} />
              </button>
            </div>
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
            {quickTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(item.prompt)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  fontSize: '0.74rem',
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
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--primary)';
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
              background: 'var(--surface)'
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
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      marginBottom: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {isBot && <Bot size={11} color="var(--primary)" />}
                    <span>{isBot ? 'HubBot' : user?.fullName || 'You'}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isBot ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                      background: isBot ? 'var(--surface-2)' : 'var(--primary)',
                      color: isBot ? 'var(--text-primary)' : 'white',
                      border: isBot ? '1px solid var(--border)' : 'none',
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                    }}
                  >
                    {renderFormattedText(msg.text)}
                  </div>

                  {/* ── ACTION CARDS (Order or Product preview) ── */}
                  {msg.actionCards?.length > 0 && (
                    <div style={{ width: '100%', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {msg.actionCards.map((card, cIdx) => {
                        if (card.type === 'order_card') {
                          return (
                            <div
                              key={cIdx}
                              style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: 10,
                                boxShadow: '0 3px 10px rgba(0,0,0,0.06)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                                  Order #{card.orderId}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    padding: '2px 6px',
                                    borderRadius: 4,
                                    background: card.status === 'Delivered' ? '#DCFCE7' : '#FEF3C7',
                                    color: card.status === 'Delivered' ? '#166534' : '#92400E'
                                  }}
                                >
                                  {card.status}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                                <div>Courier: <strong>{card.courierPartner}</strong></div>
                                <div>Waybill: <code>{card.trackingNumber}</code></div>
                              </div>

                              {card.deliveryOtp && (
                                <div
                                  style={{
                                    padding: '6px 8px',
                                    background: '#F0FDF4',
                                    border: '1px dashed #22C55E',
                                    borderRadius: 6,
                                    fontSize: '0.74rem',
                                    color: '#15803D',
                                    fontWeight: 700,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 6
                                  }}
                                >
                                  <span>Doorstep OTP:</span>
                                  <code style={{ fontSize: '0.86rem', letterSpacing: 2 }}>{card.deliveryOtp}</code>
                                </div>
                              )}

                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => {
                                  closeChatbot();
                                  navigate('/shop/orders');
                                }}
                                style={{ width: '100%', fontSize: '0.74rem', padding: '4px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                              >
                                <span>View in My Orders</span>
                                <ExternalLink size={12} />
                              </button>
                            </div>
                          );
                        }

                        if (card.type === 'product_card') {
                          return (
                            <div
                              key={cIdx}
                              onClick={() => {
                                closeChatbot();
                                navigate(`/shop/product/${card.id}`);
                              }}
                              style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '8px 10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                            >
                              <img
                                src={card.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                alt={card.name}
                                style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                              />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                                  {card.name}
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  ₹{(card.price || 0).toLocaleString('en-IN')} • In Stock
                                </div>
                              </div>
                              <ArrowRight size={13} color="var(--primary)" />
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}

                  {/* ── QUICK SUGGESTION CHIPS UNDER BOT MESSAGE ── */}
                  {isBot && msg.quickReplies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 8 }}>
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          type="button"
                          onClick={() => sendMessage(qr)}
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
                            e.currentTarget.style.borderColor = 'var(--primary)';
                            e.currentTarget.style.color = 'var(--primary)';
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

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.75rem', padding: '6px 12px' }}>
                <Bot size={13} color="var(--primary)" />
                <span>HubBot is checking verified records...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── CHAT COMPOSER ── */}
          <form
            onSubmit={handleSend}
            style={{
              padding: '10px 14px',
              borderTop: '1px solid var(--border)',
              background: 'var(--surface-2)',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder="Ask about orders, delivery OTP, returns..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '0.84rem',
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}
            />

            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: inputVal.trim() ? 'var(--primary)' : 'var(--border)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputVal.trim() ? 'pointer' : 'default',
                transition: 'background 0.15s ease'
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
