import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useChatbot } from '../../contexts/ChatbotContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MessageSquare, X, Send, Bot, Sparkles, ChevronDown,
  RotateCcw, Trash2, Package, Truck, ShieldCheck, Key,
  ExternalLink, Copy, Check, ArrowRight, Store, HelpCircle,
  Ticket, Tag, Maximize2
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function CustomerChatbot() {
  const {
    isOpen,
    isTyping,
    messages,
    activeRole,
    switchRole,
    toggleChatbot,
    closeChatbot,
    clearHistory,
    sendMessage
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

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

  const customerQuickTopics = [
    { label: '📦 Track Order', prompt: 'Track my recent order' },
    { label: '🏷️ Active Coupons', prompt: 'Show active discount coupons and promo codes' },
    { label: '🔑 Delivery OTP', prompt: 'How does doorstep Cash on Delivery OTP work?' },
    { label: '🔄 7-Day Returns', prompt: 'What is the return and replacement policy?' },
    { label: '🚚 Shipping & Fees', prompt: 'What are the shipping charges and delivery time?' },
    { label: '🛑 Cancel Order', prompt: 'Can I cancel my order and how does refund work?' },
    { label: '🛡️ Brand Warranty', prompt: 'Are products covered by official brand warranty?' },
    { label: '⚡ Top Electronics', prompt: 'Recommend top rated electronics under 5000' },
    { label: '👗 Fashion Deals', prompt: 'Show me best deals in fashion and clothing' },
    { label: '💬 Contact Seller', prompt: 'How do I message a merchant directly?' },
    { label: '📞 Support Helpline', prompt: 'What is the customer support phone number and helpline?' }
  ];

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

  const currentTopics = activeRole === 'vendor' ? vendorQuickTopics : customerQuickTopics;

  // Helper to format bot markdown-like text
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      // Bold tags
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-weight:700;">$1</code>'
      );

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
            width: 280,
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
              width: 34,
              height: 34,
              borderRadius: 8,
              background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Bot size={19} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
              <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                {activeRole === 'vendor' ? 'HubBot Vendor Co-Pilot' : 'HubBot Assistant'}
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
              {activeRole === 'vendor'
                ? 'Need help with product listing, courier waybills, or payout settlements?'
                : 'Need help with orders, active coupons, or delivery OTPs?'}
            </p>
            <button
              type="button"
              onClick={toggleChatbot}
              style={{
                marginTop: 6,
                background: 'none',
                border: 'none',
                color: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: 0
              }}
            >
              <span>Chat now</span>
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
          title="Open Hub Assistant"
          aria-label="Open AI Assistant"
          style={{
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: activeRole === 'vendor' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.4)',
            boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 28px rgba(79, 70, 229, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1) translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 70, 229, 0.4)';
          }}
        >
          <Bot size={26} />
          <span
            style={{
              position: 'absolute',
              top: 2,
              right: 2,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: '#10B981',
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
              background: activeRole === 'vendor' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
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
                <Bot size={20} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    right: -1,
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: '#10B981',
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
                    {activeRole === 'vendor' ? 'Vendor Co-Pilot' : 'Concierge'}
                  </span>
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                  Online • {activeRole === 'vendor' ? 'Merchant Business Ops' : 'Verified Shopping Help'}
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button
                type="button"
                onClick={() => {
                  closeChatbot();
                  navigate('/assistant');
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
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* ── ROLE SWITCHER STRIP ── */}
          <div
            style={{
              padding: '6px 12px',
              background: 'var(--surface-2)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8
            }}
          >
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Mode:
            </span>
            <div style={{ display: 'inline-flex', background: 'var(--surface)', borderRadius: 16, padding: 2, border: '1px solid var(--border)' }}>
              <button
                type="button"
                onClick={() => switchRole('customer')}
                style={{
                  padding: '3px 10px',
                  borderRadius: 14,
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeRole === 'customer' ? 'var(--primary)' : 'transparent',
                  color: activeRole === 'customer' ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                🛍️ Customer
              </button>
              <button
                type="button"
                onClick={() => switchRole('vendor')}
                style={{
                  padding: '3px 10px',
                  borderRadius: 14,
                  border: 'none',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: activeRole === 'vendor' ? '#10B981' : 'transparent',
                  color: activeRole === 'vendor' ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
              >
                🏪 Vendor
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
            {currentTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(item.prompt)}
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
                  e.currentTarget.style.borderColor = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                  e.currentTarget.style.color = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
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
                        <Bot size={12} color="var(--primary)" />
                        <span style={{ fontWeight: 700 }}>
                          {msg.role === 'vendor' ? 'HubBot Vendor Co-Pilot' : 'HubBot Concierge'}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 700 }}>You</span>
                    )}
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                      background: isBot ? 'var(--surface-2)' : 'var(--primary)',
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

                  {/* ── ACTION CARDS ── */}
                  {isBot && msg.actionCards?.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, width: '100%' }}>
                      {msg.actionCards.map((card, cIdx) => {
                        if (card.type === 'order_card') {
                          return (
                            <div
                              key={cIdx}
                              style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '10px 12px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span style={{ fontWeight: 800, fontSize: '0.8rem' }}>
                                  Order #{card.orderId}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    fontWeight: 700,
                                    background: card.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                                    color: card.status === 'Delivered' ? '#10B981' : 'var(--primary)'
                                  }}
                                >
                                  {card.status}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                                {card.courierPartner} • Tracking: <code style={{ fontWeight: 700 }}>{card.trackingNumber}</code>
                              </div>
                              {card.deliveryOtp && (
                                <div
                                  style={{
                                    padding: '4px 8px',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    borderRadius: 6,
                                    fontSize: '0.72rem',
                                    color: '#059669',
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

                        if (card.type === 'coupon_card') {
                          const isCopied = copiedCode === card.code;
                          return (
                            <div
                              key={cIdx}
                              style={{
                                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                                border: '1px dashed var(--primary)',
                                borderRadius: 10,
                                padding: '10px 12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <span
                                  style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.03em'
                                  }}
                                >
                                  {card.discountType === 'percentage' ? `${card.discountValue}% OFF` : `₹${card.discountValue} OFF`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(card.code)}
                                  style={{
                                    background: isCopied ? '#10B981' : 'var(--surface)',
                                    color: isCopied ? 'white' : 'var(--primary)',
                                    border: isCopied ? 'none' : '1px solid var(--primary)',
                                    padding: '3px 8px',
                                    borderRadius: 6,
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4
                                  }}
                                >
                                  {isCopied ? <Check size={11} /> : <Copy size={11} />}
                                  <span>{isCopied ? 'Copied!' : card.code}</span>
                                </button>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: 4 }}>
                                {card.title}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                {card.description || `Min order: ₹${(card.minOrderValue || 0).toLocaleString('en-IN')}`}
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 6 }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    closeChatbot();
                                    navigate('/shop/cart');
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--primary)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    padding: 0
                                  }}
                                >
                                  <span>Apply in Cart</span>
                                  <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        if (card.type === 'navigation_card') {
                          return (
                            <div
                              key={cIdx}
                              style={{
                                background: 'var(--surface-2)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '10px 12px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                                  {card.title}
                                </span>
                                {card.badge && (
                                  <span style={{ fontSize: '0.64rem', fontWeight: 800, padding: '1px 5px', borderRadius: 4, background: 'var(--surface)', color: 'var(--primary)' }}>
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                                {card.description}
                              </div>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  closeChatbot();
                                  navigate(card.link);
                                }}
                                style={{
                                  width: '100%',
                                  fontSize: '0.72rem',
                                  padding: '4px 8px',
                                  background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                  borderColor: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 4
                                }}
                              >
                                <span>{card.buttonText}</span>
                                <ArrowRight size={12} />
                              </button>
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
                            e.currentTarget.style.borderColor = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                            e.currentTarget.style.color = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
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
                <Bot size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>HubBot is composing...</span>
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
            <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeRole === 'vendor'
                    ? 'Ask Vendor Co-Pilot (listing, AWB, payouts)...'
                    : 'Ask Customer Concierge (orders, OTP, coupons)...'
                }
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                style={{
                  padding: '9px 14px',
                  borderRadius: 10,
                  border: 'none',
                  background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                  color: 'white',
                  cursor: !inputVal.trim() || isTyping ? 'not-allowed' : 'pointer',
                  opacity: !inputVal.trim() || isTyping ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
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
