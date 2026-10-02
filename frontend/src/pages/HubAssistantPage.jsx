import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChatbot } from '../contexts/ChatbotContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import {
  Bot, Send, Sparkles, Trash2, ArrowRight, ExternalLink,
  Copy, Check, Package, Tag, Truck, ShieldCheck, Store,
  HelpCircle, UserCheck, Layers, ChevronRight, Zap, RefreshCw,
  ShoppingBag, Megaphone, Box, AlertTriangle, FileText, DollarSign,
  PhoneCall, Key
} from 'lucide-react';
import '../styles/marketplace.css';

export default function HubAssistantPage({ defaultRole = null }) {
  const {
    messages,
    isTyping,
    activeRole,
    switchRole,
    clearHistory,
    sendMessage
  } = useChatbot();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputVal, setInputVal] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync role if defaultRole prop or URL param is provided
  useEffect(() => {
    const roleParam = searchParams.get('role');
    const target = defaultRole || roleParam;
    if (target && (target === 'vendor' || target === 'customer') && target !== activeRole) {
      switchRole(target);
    }
  }, [defaultRole, searchParams, activeRole, switchRole]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    if (e) e.preventDefault();
    if (!inputVal.trim() || isTyping) return;
    const text = inputVal.trim();
    setInputVal('');
    sendMessage(text);
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

  const customerLaunchers = [
    { icon: <Package size={16} />, title: 'Track My Order', prompt: 'Track my recent order status and delivery courier' },
    { icon: <Tag size={16} />, title: 'Active Coupons & Deals', prompt: 'Show active discount coupons and promo codes' },
    { icon: <Key size={16} />, title: 'Doorstep Delivery OTP', prompt: 'How does doorstep Cash on Delivery OTP work?' },
    { icon: <RefreshCw size={16} />, title: '7-Day Return Policy', prompt: 'What is the return and replacement policy?' },
    { icon: <Truck size={16} />, title: 'Free Shipping Threshold', prompt: 'What are the shipping charges and delivery time?' },
    { icon: <ShieldCheck size={16} />, title: 'Brand Warranty & Invoices', prompt: 'Are products covered by manufacturer brand warranty?' },
    { icon: <Sparkles size={16} />, title: 'Top Electronics Deals', prompt: 'Recommend top rated electronics under 5000' },
    { icon: <PhoneCall size={16} />, title: 'Customer Support Helpline', prompt: 'What is the customer support phone number and helpline?' }
  ];

  const vendorLaunchers = [
    { icon: <Package size={16} />, title: 'Add Physical Product', prompt: 'How do I add a new physical product with SKU, HSN, and GST?' },
    { icon: <Truck size={16} />, title: 'Order Fulfillment & AWB', prompt: 'How do I process orders, print labels, and assign courier waybill?' },
    { icon: <DollarSign size={16} />, title: 'Vendor Plans & Fees', prompt: 'What are the vendor subscription plans and commission rates?' },
    { icon: <Zap size={16} />, title: 'Payouts & T+3 Settlement', prompt: 'When will I receive payouts and how does bank settlement work?' },
    { icon: <FileText size={16} />, title: 'GST Tax Invoices & Twilio', prompt: 'How do GST invoices and automated Twilio WhatsApp alerts work?' },
    { icon: <Megaphone size={16} />, title: 'Marketing & Store Coupons', prompt: 'How can I create promotional coupons and boost listings?' },
    { icon: <Box size={16} />, title: 'Smart Inventory Alerts', prompt: 'How do inventory alerts work to prevent out-of-stock penalties?' },
    { icon: <AlertTriangle size={16} />, title: 'Disputes & Return Defense', prompt: 'How do vendors handle customer returns and dispute claims?' },
    { icon: <Store size={16} />, title: 'Storefront Customization', prompt: 'How do I customize my store banner, logo, and operating hours?' }
  ];

  const currentLaunchers = activeRole === 'vendor' ? vendorLaunchers : customerLaunchers;

  // Markdown-like text renderer
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');

    return lines.map((line, idx) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      const withCode = formatted.replace(
        /`([^`]+)`/g,
        '<code style="background:rgba(0,0,0,0.06);padding:2px 6px;border-radius:4px;font-family:monospace;font-weight:700;color:var(--primary);">$1</code>'
      );

      if (line.trim().startsWith('• ') || line.trim().startsWith('* ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, margin: '4px 0' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>•</span>
            <span dangerouslySetInnerHTML={{ __html: withCode.replace(/^(\s*)[•*]\s*/, '') }} />
          </div>
        );
      }

      if (line.trim().startsWith('> ')) {
        return (
          <div
            key={idx}
            style={{
              padding: '8px 12px',
              margin: '8px 0',
              borderLeft: '3px solid var(--primary)',
              background: 'rgba(79, 70, 229, 0.08)',
              borderRadius: '0 8px 8px 0',
              fontSize: '0.88rem'
            }}
            dangerouslySetInnerHTML={{ __html: withCode.replace(/^>\s*/, '') }}
          />
        );
      }

      if (!line.trim()) {
        return <div key={idx} style={{ height: 8 }} />;
      }

      return (
        <div key={idx} style={{ margin: '3px 0' }} dangerouslySetInnerHTML={{ __html: withCode }} />
      );
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background)' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1240, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        {/* ── TOP HERO HEADER & ROLE TOGGLE BAR ── */}
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 20,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <Bot size={26} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Vendor Hub AI Assistant
                </h1>
                <span
                  style={{
                    background: activeRole === 'vendor' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                    color: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 9999
                  }}
                >
                  {activeRole === 'vendor' ? 'Vendor Co-Pilot' : 'Customer Concierge'}
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {activeRole === 'vendor'
                  ? 'Professional merchant assistance for product listings, order fulfillment, commission, and payouts.'
                  : 'Instant 24/7 shopping assistant for order tracking, OTP security, verified coupons, and product advice.'}
              </p>
            </div>
          </div>

          {/* Role Segmented Controller */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                display: 'inline-flex',
                background: 'var(--surface-2)',
                padding: 4,
                borderRadius: 12,
                border: '1px solid var(--border)'
              }}
            >
              <button
                type="button"
                onClick={() => switchRole('customer')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  background: activeRole === 'customer' ? 'var(--primary)' : 'transparent',
                  color: activeRole === 'customer' ? 'white' : 'var(--text-muted)',
                  boxShadow: activeRole === 'customer' ? '0 2px 8px rgba(79, 70, 229, 0.3)' : 'none'
                }}
              >
                <span>🛍️</span>
                <span>Customer Mode</span>
              </button>

              <button
                type="button"
                onClick={() => switchRole('vendor')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 8,
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                  background: activeRole === 'vendor' ? '#10B981' : 'transparent',
                  color: activeRole === 'vendor' ? 'white' : 'var(--text-muted)',
                  boxShadow: activeRole === 'vendor' ? '0 2px 8px rgba(16, 185, 129, 0.3)' : 'none'
                }}
              >
                <span>🏪</span>
                <span>Vendor Mode</span>
              </button>
            </div>

            <button
              type="button"
              onClick={clearHistory}
              title="Reset Conversation"
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              <Trash2 size={15} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ── MAIN WORKSPACE: SIDEBAR + CHAT STREAM ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Left Sidebar: Quick Topics & Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Persona Overview Card */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 16,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>{activeRole === 'vendor' ? '🏪' : '🛍️'}</span>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {activeRole === 'vendor' ? 'Vendor Co-Pilot Deck' : 'Customer Help Desk'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                {activeRole === 'vendor'
                  ? 'Get accurate checklists for inventory listings, GST tax calculations, order packing, courier waybills, and dispute arbitration.'
                  : 'Search verified products, track shipments with live courier waybills, find active promo codes, and understand OTP protection.'}
              </p>
            </div>

            {/* Quick Launch Actions */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 14,
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: 'var(--text-muted)',
                  marginBottom: 10,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <Sparkles size={13} color="var(--primary)" />
                <span>Recommended Topics</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {currentLaunchers.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendMessage(item.prompt)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px 12px',
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      border: '1px solid transparent',
                      color: 'var(--text-primary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = activeRole === 'vendor' ? '#10B981' : 'var(--primary)';
                      e.currentTarget.style.background = 'var(--surface)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.background = 'var(--surface-2)';
                    }}
                  >
                    <span style={{ color: activeRole === 'vendor' ? '#10B981' : 'var(--primary)' }}>
                      {item.icon}
                    </span>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    <ChevronRight size={13} color="var(--text-muted)" />
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Direct Links */}
            <div
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 14,
                padding: 14,
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Direct Platform Portals
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/shop')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <ShoppingBag size={14} />
                <span>Customer Marketplace</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate(user?.type === 'vendor' ? '/vendor/dashboard' : '/vendor/login')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <Store size={14} />
                <span>Vendor Merchant Dashboard</span>
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/stores')}
                style={{ width: '100%', justifyContent: 'flex-start', gap: 8, fontSize: '0.8rem' }}
              >
                <Layers size={14} />
                <span>Explore Verified Stores</span>
              </button>
            </div>
          </div>

          {/* Right Main Chat Panel */}
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              height: '75vh',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              overflow: 'hidden'
            }}
          >
            {/* Messages Feed */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
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
                      maxWidth: '85%',
                      alignSelf: isBot ? 'flex-start' : 'flex-end'
                    }}
                  >
                    {/* Sender Identity */}
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6
                      }}
                    >
                      {isBot ? (
                        <>
                          <Bot size={13} color="var(--primary)" />
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

                    {/* Speech Bubble */}
                    <div
                      style={{
                        padding: '14px 18px',
                        borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                        background: isBot ? 'var(--surface-2)' : 'var(--primary)',
                        color: isBot ? 'var(--text-primary)' : 'white',
                        fontSize: '0.88rem',
                        lineHeight: 1.55,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                        border: isBot ? '1px solid var(--border)' : 'none',
                        wordBreak: 'break-word'
                      }}
                    >
                      {renderFormattedText(msg.text)}
                    </div>

                    {/* ── ACTION CARDS ── */}
                    {isBot && msg.actionCards?.length > 0 && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: msg.actionCards.length > 1 ? 'repeat(auto-fit, minmax(220px, 1fr))' : '1fr',
                          gap: 10,
                          marginTop: 10,
                          width: '100%'
                        }}
                      >
                        {msg.actionCards.map((card, cIdx) => {
                          if (card.type === 'order_card') {
                            return (
                              <div
                                key={cIdx}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.84rem' }}>
                                    Order #{card.orderId}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.7rem',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontWeight: 800,
                                      background: card.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(79, 70, 229, 0.15)',
                                      color: card.status === 'Delivered' ? '#10B981' : 'var(--primary)'
                                    }}
                                  >
                                    {card.status}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                                  {card.courierPartner} • Waybill: <code style={{ fontWeight: 700 }}>{card.trackingNumber}</code>
                                </div>
                                {card.deliveryOtp && (
                                  <div
                                    style={{
                                      padding: '4px 8px',
                                      background: 'rgba(16, 185, 129, 0.1)',
                                      borderRadius: 6,
                                      fontSize: '0.75rem',
                                      color: '#059669',
                                      fontWeight: 700,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      marginBottom: 8
                                    }}
                                  >
                                    <span>Doorstep OTP:</span>
                                    <code style={{ fontSize: '0.9rem', letterSpacing: 2 }}>{card.deliveryOtp}</code>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => navigate('/shop/orders')}
                                  style={{ width: '100%', fontSize: '0.76rem', gap: 6 }}
                                >
                                  <span>View in My Orders</span>
                                  <ExternalLink size={12} />
                                </button>
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
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                  <span
                                    style={{
                                      background: 'var(--primary)',
                                      color: 'white',
                                      padding: '2px 8px',
                                      borderRadius: 6,
                                      fontSize: '0.76rem',
                                      fontWeight: 800
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
                                      fontSize: '0.74rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{isCopied ? 'Copied!' : card.code}</span>
                                  </button>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                  {card.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                  {card.description || `Min order: ₹${(card.minOrderValue || 0).toLocaleString('en-IN')}`}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                  <button
                                    type="button"
                                    onClick={() => navigate('/shop/cart')}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: 'var(--primary)',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <span>Apply in Cart</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          if (card.type === 'product_card') {
                            return (
                              <div
                                key={cIdx}
                                onClick={() => navigate(`/shop/product/${card.id}`)}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '10px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 12,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                              >
                                <img
                                  src={card.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                                  alt={card.name}
                                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.82rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                                    {card.name}
                                  </div>
                                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                                    ₹{(card.price || 0).toLocaleString('en-IN')} • In Stock
                                  </div>
                                </div>
                                <ArrowRight size={14} color="var(--primary)" />
                              </div>
                            );
                          }

                          if (card.type === 'navigation_card') {
                            return (
                              <div
                                key={cIdx}
                                style={{
                                  background: 'var(--surface)',
                                  border: '1px solid var(--border)',
                                  borderRadius: 12,
                                  padding: '12px 14px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                    <span style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                      {card.title}
                                    </span>
                                    {card.badge && (
                                      <span
                                        style={{
                                          fontSize: '0.68rem',
                                          fontWeight: 800,
                                          padding: '1px 6px',
                                          borderRadius: 4,
                                          background: 'var(--surface-2)',
                                          color: 'var(--primary)'
                                        }}
                                      >
                                        {card.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {card.description}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-primary btn-sm"
                                  onClick={() => navigate(card.link)}
                                  style={{
                                    width: '100%',
                                    fontSize: '0.76rem',
                                    fontWeight: 700,
                                    background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                    borderColor: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 6
                                  }}
                                >
                                  <span>{card.buttonText}</span>
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            );
                          }

                          return null;
                        })}
                      </div>
                    )}

                    {/* Quick Reply Chips */}
                    {isBot && msg.quickReplies?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {msg.quickReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            type="button"
                            onClick={() => sendMessage(reply)}
                            style={{
                              background: 'var(--surface)',
                              border: '1px solid var(--border)',
                              borderRadius: 20,
                              padding: '4px 11px',
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                              cursor: 'pointer',
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
                            <span>{reply}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 12, width: 'fit-content' }}>
                  <Bot size={15} color="var(--primary)" />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>HubBot is composing professional guidance...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div
              style={{
                padding: '14px 20px',
                background: 'var(--surface-2)',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                gap: 12
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  activeRole === 'vendor'
                    ? 'Ask about product listings, courier waybills, commissions, payouts, GST invoices...'
                    : 'Ask about live order tracking, delivery OTP, active coupons, 7-day returns, products...'
                }
                disabled={isTyping}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={handleSend}
                disabled={!inputVal.trim() || isTyping}
                style={{
                  padding: '12px 20px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeRole === 'vendor' ? '#10B981' : 'var(--primary)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: !inputVal.trim() || isTyping ? 'not-allowed' : 'pointer',
                  opacity: !inputVal.trim() || isTyping ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <span>Send</span>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div>
            © {new Date().getFullYear()} <strong>Vendor Hub</strong>. Multi-Vendor Physical Marketplace & AI Operations Assistant.
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Verified 4-Digit OTP Protection</span>
            <span>•</span>
            <span>BlueDart & Delhivery Logistics</span>
            <span>•</span>
            <span>100% Physical Tax Invoices</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
