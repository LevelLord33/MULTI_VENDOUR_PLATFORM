import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../contexts/MessageContext';
import { useToast } from '../../contexts/ToastContext';
import { useSocket } from '../../contexts/SocketContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  MessageSquare, Search, Filter, CheckCircle2, Clock,
  Package, Truck, Send, Check, Paperclip, MoreVertical,
  RotateCcw, ShieldCheck, User, Store, ExternalLink,
  ChevronRight, AlertCircle, Sparkles, X, CornerDownLeft
} from 'lucide-react';
import '../../styles/vendor.css';
import '../../styles/marketplace.css';

export default function VendorInbox() {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    activeConversationId,
    selectConversation,
    sendMessage,
    updateConversationStatus,
    stats
  } = useMessages();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'unread' | 'product' | 'order' | 'resolved'
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const { isConnected, typingUsers, sendTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Vendor's conversations
  const vendorConversations = useMemo(() => {
    if (!user) return [];
    return conversations.filter((c) => c.vendorId === user.id);
  }, [conversations, user]);

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    return vendorConversations.filter((c) => {
      // Tab filter
      if (filterTab === 'unread' && (c.unreadVendor || 0) <= 0) return false;
      if (filterTab === 'product' && c.category !== 'product_inquiry') return false;
      if (filterTab === 'order' && c.category !== 'order_inquiry') return false;
      if (filterTab === 'resolved' && c.status !== 'resolved') return false;
      if (filterTab !== 'resolved' && c.status === 'archived') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCustomer = c.customerName?.toLowerCase().includes(q);
        const matchSubject = c.subject?.toLowerCase().includes(q);
        const matchLastMsg = c.lastMessage?.toLowerCase().includes(q);
        const matchProduct = c.relatedProduct?.name?.toLowerCase().includes(q);
        const matchOrder = c.relatedOrder?.orderId?.toLowerCase().includes(q);
        return matchCustomer || matchSubject || matchLastMsg || matchProduct || matchOrder;
      }

      return true;
    });
  }, [vendorConversations, filterTab, searchQuery]);

  // Auto-select first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && filteredConversations.length > 0) {
      selectConversation(filteredConversations[0].id);
    }
  }, [activeConversationId, filteredConversations, selectConversation]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation?.messages]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversationId || isSending) return;

    setIsSending(true);
    try {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      sendTyping(activeConversationId, false);
      await sendMessage(activeConversationId, messageInput.trim());
      setMessageInput('');
      if (inputRef.current) inputRef.current.focus();
    } catch (err) {
      addToast('Failed to send reply. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessageInput(val);
    if (activeConversationId) {
      sendTyping(activeConversationId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(activeConversationId, false);
      }, 2000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const cannedReplies = [
    'Hello! We have physically verified this SKU in our warehouse stock and it is ready for courier dispatch.',
    'Thank you for your order! Your parcel has been packed with tamper-proof seal and scheduled for courier pickup.',
    'All items shipped from our storefront include full verified brand warranty and GST tax invoice.',
    'Please verify the outer parcel at doorstep and share your 4-digit Delivery OTP only once satisfied.'
  ];

  const handleCannedReply = (text) => {
    setMessageInput(text);
    if (inputRef.current) inputRef.current.focus();
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <main className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="vendor-topbar-title">Customer Communication Hub</div>
              <span style={{
                background: 'var(--primary)',
                color: 'white',
                borderRadius: 9999,
                padding: '2px 10px',
                fontSize: '0.74rem',
                fontWeight: 700
              }}>
                Live Inbox
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 9999,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: isConnected ? 'rgba(34, 197, 94, 0.15)' : 'var(--surface-2)',
                color: isConnected ? '#22C55E' : 'var(--text-muted)',
                border: isConnected ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border)'
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#22C55E' : '#94A3B8' }} />
                {isConnected ? 'Real-Time Sync' : 'Reconnecting...'}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Direct messages, product pre-purchase questions & courier dispatch support
            </div>
          </div>

          {/* Metrics summary pill & theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem'
            }}>
              <MessageSquare size={15} color="var(--primary)" />
              <span><strong>{vendorConversations.length}</strong> Inquiries</span>
            </div>
            <div style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.82rem'
            }}>
              <Clock size={15} color="#D97706" />
              <span>Avg: <strong>{stats?.avgResponseTime || '< 15 mins'}</strong></span>
            </div>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content" style={{ padding: '24px 32px' }}>

        {/* ── SPLIT-PANE INBOX CONTAINER ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            height: 'calc(100vh - 170px)',
            minHeight: 580,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
          }}
        >
          {/* ── LEFT PANE: CONVERSATION LIST ── */}
          <div
            style={{
              borderRight: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--surface-2)',
              overflow: 'hidden'
            }}
          >
            {/* Search Box */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search buyer, order, or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: 36,
                    fontSize: '0.85rem',
                    borderRadius: 10,
                    background: 'var(--surface)',
                    border: '1px solid var(--border)'
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                padding: '8px 12px',
                gap: 6,
                borderBottom: '1px solid var(--border)',
                background: 'var(--surface)',
                overflowX: 'auto'
              }}
            >
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'product', label: 'Products' },
                { key: 'order', label: 'Orders' },
                { key: 'resolved', label: 'Resolved' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: filterTab === tab.key ? 700 : 500,
                    background: filterTab === tab.key ? 'var(--primary)' : 'transparent',
                    color: filterTab === tab.key ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No conversations found</div>
                  <div style={{ fontSize: '0.78rem', marginTop: 4 }}>
                    {searchQuery ? 'Try matching a different keyword' : 'Customer inquiries will appear here.'}
                  </div>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversationId === conv.id;
                  const hasUnread = (conv.unreadVendor || 0) > 0;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      style={{
                        padding: '14px 16px',
                        borderBottom: '1px solid var(--border)',
                        cursor: 'pointer',
                        background: isSelected ? 'var(--surface)' : 'transparent',
                        borderLeft: isSelected ? '4px solid var(--primary)' : '4px solid transparent',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(0,0,0,0.02)';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <img
                          src={conv.customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.customerName || 'C')}&background=4F46E5&color=fff`}
                          alt={conv.customerName}
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1px solid var(--border)'
                          }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.customerName || 'C')}&background=4F46E5&color=fff`;
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: hasUnread ? 800 : 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {conv.customerName}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: hasUnread ? 'var(--primary)' : 'var(--text-muted)', fontWeight: hasUnread ? 700 : 400 }}>
                              {formatTimestamp(conv.lastMessageAt)}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.82rem', fontWeight: hasUnread ? 700 : 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
                            {conv.subject}
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                            {conv.lastMessageSender === 'vendor' ? 'You: ' : ''}{conv.lastMessage}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                            {conv.category === 'product_inquiry' && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#EEF2FF', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Package size={10} /> Product Q&A
                              </span>
                            )}
                            {conv.category === 'order_inquiry' && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#FEF3C7', color: '#92400E', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Truck size={10} /> Order #{conv.relatedOrder?.orderId || ''}
                              </span>
                            )}
                            {conv.status === 'resolved' && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#DCFCE7', color: '#166534', fontWeight: 700 }}>
                                Resolved
                              </span>
                            )}
                            {hasUnread && (
                              <span style={{ marginLeft: 'auto', background: '#EF4444', color: 'white', borderRadius: 9999, padding: '1px 6px', fontSize: '0.68rem', fontWeight: 800 }}>
                                {conv.unreadVendor} new
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── RIGHT PANE: ACTIVE THREAD & COMPOSER ── */}
          {activeConversation ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--surface)' }}>
              {/* Thread Header */}
              <div
                style={{
                  padding: '14px 22px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface-2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={activeConversation.customerAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.customerName || 'C')}&background=4F46E5&color=fff`}
                    alt={activeConversation.customerName}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeConversation.customerName}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontWeight: 700,
                          background: activeConversation.status === 'resolved' ? '#DCFCE7' : '#EEF2FF',
                          color: activeConversation.status === 'resolved' ? '#166534' : 'var(--primary)'
                        }}
                      >
                        {activeConversation.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {activeConversation.customerEmail || 'Customer on Vendor Hub'} • {activeConversation.subject}
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    <span>Status & Actions</span>
                    <MoreVertical size={14} />
                  </button>

                  {showStatusMenu && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: 4,
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        padding: 6,
                        zIndex: 100,
                        width: 180
                      }}
                    >
                      {activeConversation.status !== 'resolved' && (
                        <button
                          type="button"
                          className="nav-dropdown-item"
                          onClick={() => {
                            updateConversationStatus(activeConversation.id, 'resolved');
                            setShowStatusMenu(false);
                          }}
                        >
                          <CheckCircle2 size={15} color="var(--success)" /> Mark as Resolved
                        </button>
                      )}
                      {activeConversation.status === 'resolved' && (
                        <button
                          type="button"
                          className="nav-dropdown-item"
                          onClick={() => {
                            updateConversationStatus(activeConversation.id, 'active');
                            setShowStatusMenu(false);
                          }}
                        >
                          <RotateCcw size={15} color="var(--primary)" /> Reopen Conversation
                        </button>
                      )}
                      <button
                        type="button"
                        className="nav-dropdown-item"
                        onClick={() => {
                          updateConversationStatus(activeConversation.id, 'archived');
                          setShowStatusMenu(false);
                        }}
                      >
                        <AlertCircle size={15} color="var(--text-muted)" /> Archive Thread
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── CONTEXT BANNER (PRODUCT OR ORDER CARD) ── */}
              {activeConversation.relatedProduct && (
                <div
                  style={{
                    padding: '10px 22px',
                    background: 'var(--surface-2)',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={activeConversation.relatedProduct.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                      alt={activeConversation.relatedProduct.name}
                      style={{ width: 42, height: 42, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeConversation.relatedProduct.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                        <span>₹{(activeConversation.relatedProduct.price || 0).toLocaleString('en-IN')}</span>
                        <span>•</span>
                        <span>SKU: {activeConversation.relatedProduct.sku || 'VM-PHYSICAL'}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/shop/product/${activeConversation.relatedProduct.productId}`)}
                    style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <span>View Product</span>
                    <ExternalLink size={13} />
                  </button>
                </div>
              )}

              {activeConversation.relatedOrder && (
                <div
                  style={{
                    padding: '10px 22px',
                    background: '#FEF3C7',
                    borderBottom: '1px solid #FCD34D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16,
                    color: '#92400E'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Truck size={20} />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>
                        Inquiry regarding Order #{activeConversation.relatedOrder.orderId}
                      </div>
                      <div style={{ fontSize: '0.76rem', opacity: 0.9 }}>
                        Waybill Tracking: <strong>{activeConversation.relatedOrder.trackingNumber || 'Active Dispatch'}</strong> • Status: <strong>{activeConversation.relatedOrder.status || 'Dispatched'}</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => navigate('/vendor/orders')}
                    style={{ background: '#92400E', color: 'white', border: 'none', borderRadius: 6, fontSize: '0.78rem' }}
                  >
                    View in Orders
                  </button>
                </div>
              )}

              {/* ── MESSAGE THREAD BUBBLES ── */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <span style={{ fontSize: '0.72rem', background: 'var(--surface-2)', padding: '4px 12px', borderRadius: 9999, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    Conversation started with verified storefront records
                  </span>
                </div>

                {(activeConversation.messages || []).map((msg) => {
                  const isVendor = msg.senderType === 'vendor';

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isVendor ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        alignSelf: isVendor ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 700, color: isVendor ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {isVendor ? 'You (Storefront Merchant)' : msg.senderName}
                        </span>
                        <span>•</span>
                        <span>{formatTimestamp(msg.createdAt)}</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: isVendor ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: isVendor ? 'var(--primary)' : 'var(--surface-2)',
                          color: isVendor ? 'white' : 'var(--text-primary)',
                          border: isVendor ? 'none' : '1px solid var(--border)',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                        }}
                      >
                        {msg.text}
                      </div>

                      {isVendor && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={12} color="var(--success)" />
                          <span>Sent to buyer</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* ── QUICK CANNED REPLIES ── */}
              <div style={{ padding: '6px 20px', background: 'var(--surface-2)', borderTop: '1px solid var(--border)', display: 'flex', gap: 6, overflowX: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600 }}>
                  <Sparkles size={12} color="var(--primary)" /> Fast Replies:
                </div>
                {cannedReplies.map((reply, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleCannedReply(reply)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      fontSize: '0.72rem',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      maxWidth: 240,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={reply}
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* ── TYPING INDICATOR ── */}
              {typingUsers[activeConversation?.id] && (
                <div style={{
                  padding: '6px 20px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  borderTop: '1px solid rgba(34, 197, 94, 0.25)',
                  fontSize: '0.76rem',
                  color: '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  <span><em>{typingUsers[activeConversation.id].userName} is typing...</em></span>
                </div>
              )}

              {/* ── MESSAGE COMPOSER ── */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '14px 20px',
                  background: 'var(--surface)',
                  borderTop: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 12
                }}
              >
                <textarea
                  ref={inputRef}
                  className="form-control"
                  rows={2}
                  placeholder="Type reply to customer (Press Enter to send, Shift+Enter for new line)..."
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  style={{
                    flex: 1,
                    fontSize: '0.88rem',
                    padding: '10px 14px',
                    borderRadius: 12,
                    resize: 'none'
                  }}
                />

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!messageInput.trim() || isSending}
                  style={{
                    height: 48,
                    padding: '0 20px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontWeight: 700
                  }}
                >
                  <Send size={16} />
                  <span>{isSending ? 'Sending...' : 'Reply'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <MessageSquare size={54} style={{ opacity: 0.3, marginBottom: 16 }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Select a Conversation</h3>
              <p style={{ margin: '6px 0 0', fontSize: '0.86rem' }}>Choose an inquiry from the left panel to review and reply.</p>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}
