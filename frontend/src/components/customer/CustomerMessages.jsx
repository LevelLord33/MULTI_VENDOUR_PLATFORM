import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessages } from '../../contexts/MessageContext';
import { useToast } from '../../contexts/ToastContext';
import { useSocket } from '../../contexts/SocketContext';
import Navbar from '../common/Navbar';
import {
  MessageSquare, Store, Package, Truck, Send, Check,
  ExternalLink, ArrowLeft, Search, Clock, ShieldCheck,
  Award, X, Sparkles
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function CustomerMessages() {
  const { user } = useAuth();
  const {
    conversations,
    activeConversation,
    activeConversationId,
    selectConversation,
    sendMessage
  } = useMessages();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'product' | 'order'
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const { isConnected, typingUsers, sendTyping } = useSocket();
  const typingTimeoutRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Customer's conversations
  const customerConversations = useMemo(() => {
    if (!user) return [];
    return conversations.filter((c) => c.customerId === user.id);
  }, [conversations, user]);

  const filteredConversations = useMemo(() => {
    return customerConversations.filter((c) => {
      if (filterTab === 'product' && c.category !== 'product_inquiry') return false;
      if (filterTab === 'order' && c.category !== 'order_inquiry') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.vendorName?.toLowerCase().includes(q) ||
          c.subject?.toLowerCase().includes(q) ||
          c.lastMessage?.toLowerCase().includes(q) ||
          c.relatedProduct?.name?.toLowerCase().includes(q) ||
          c.relatedOrder?.orderId?.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [customerConversations, filterTab, searchQuery]);

  // Auto-select first if none selected
  useEffect(() => {
    if (!activeConversationId && filteredConversations.length > 0) {
      selectConversation(filteredConversations[0].id);
    }
  }, [activeConversationId, filteredConversations, selectConversation]);

  // Scroll to bottom on new messages
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
      addToast('Failed to send message. Please try again.', 'error');
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
    <div className="page-wrapper">
      <Navbar />

      <div className="container" style={{ padding: '24px 16px', maxWidth: 1240 }}>
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 12 }}>
          <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 600 }}>Marketplace</Link>
          <span>/</span>
          <span>Merchant Inquiries & Messages</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Storefront Messages & Inquiries
              </h1>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                borderRadius: 9999,
                fontSize: '0.74rem',
                fontWeight: 700,
                background: isConnected ? '#DCFCE7' : '#F1F5F9',
                color: isConnected ? '#15803D' : '#64748B',
                border: isConnected ? '1px solid #86EFAC' : '1px solid #CBD5E1'
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: isConnected ? '#22C55E' : '#94A3B8' }} />
                {isConnected ? 'Real-Time Sync' : 'Reconnecting...'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Direct chats with verified physical merchants regarding catalog products and order delivery
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/shop')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Store size={15} /> Browse Marketplace
          </button>
        </div>

        {/* ── SPLIT-PANE MESSAGES CARD ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '360px 1fr',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            minHeight: 560,
            height: 'calc(100vh - 220px)',
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
            {/* Search */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search store or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control"
                  style={{
                    paddingLeft: 36,
                    fontSize: '0.84rem',
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
            <div style={{ display: 'flex', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
              {[
                { key: 'all', label: 'All' },
                { key: 'product', label: 'Products' },
                { key: 'order', label: 'Orders' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFilterTab(tab.key)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    fontWeight: filterTab === tab.key ? 700 : 500,
                    background: filterTab === tab.key ? 'var(--primary)' : 'transparent',
                    color: filterTab === tab.key ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
                  <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: 8 }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No conversations found</div>
                  <div style={{ fontSize: '0.78rem', marginTop: 4 }}>
                    Ask a seller questions on any product or order.
                  </div>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversationId === conv.id;
                  const hasUnread = (conv.unreadCustomer || 0) > 0;

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
                          src={conv.vendorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.vendorName || 'V')}&background=4F46E5&color=fff`}
                          alt={conv.vendorName}
                          style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(conv.vendorName || 'V')}&background=4F46E5&color=fff`;
                          }}
                        />

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                            <span style={{ fontSize: '0.88rem', fontWeight: hasUnread ? 800 : 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {conv.vendorName}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: hasUnread ? 'var(--primary)' : 'var(--text-muted)', fontWeight: hasUnread ? 700 : 400 }}>
                              {formatTimestamp(conv.lastMessageAt)}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                            {conv.subject}
                          </div>

                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 6 }}>
                            {conv.lastMessageSender === 'customer' ? 'You: ' : ''}{conv.lastMessage}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {conv.category === 'product_inquiry' && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#EEF2FF', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Package size={10} /> Product
                              </span>
                            )}
                            {conv.category === 'order_inquiry' && (
                              <span style={{ fontSize: '0.68rem', padding: '1px 6px', borderRadius: 4, background: '#FEF3C7', color: '#92400E', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                <Truck size={10} /> Order #{conv.relatedOrder?.orderId}
                              </span>
                            )}
                            {hasUnread && (
                              <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', borderRadius: 9999, padding: '1px 6px', fontSize: '0.68rem', fontWeight: 800 }}>
                                New reply
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

          {/* ── RIGHT PANE: CHAT THREAD ── */}
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
                    src={activeConversation.vendorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(activeConversation.vendorName || 'V')}&background=4F46E5&color=fff`}
                    alt={activeConversation.vendorName}
                    style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeConversation.vendorName}
                      </span>
                      <Award size={15} color="#D97706" title="Verified Storefront" />
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {activeConversation.subject}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => navigate(`/shop/vendor/${activeConversation.vendorId}`)}
                    style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 5 }}
                  >
                    <Store size={13} /> Visit Store
                  </button>
                </div>
              </div>

              {/* ── CONTEXT ITEM BANNER ── */}
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
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {activeConversation.relatedProduct.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        ₹{(activeConversation.relatedProduct.price || 0).toLocaleString('en-IN')} • SKU: {activeConversation.relatedProduct.sku || 'VM-PHYSICAL'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/shop/product/${activeConversation.relatedProduct.productId}`)}
                    style={{ fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <span>View SKU</span>
                    <ExternalLink size={12} />
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
                    <Truck size={18} />
                    <div style={{ fontSize: '0.84rem' }}>
                      <strong>Order #{activeConversation.relatedOrder.orderId}</strong> — Status: <strong>{activeConversation.relatedOrder.status}</strong>
                      {activeConversation.relatedOrder.trackingNumber && (
                        <span> • Waybill Tracking: <code>{activeConversation.relatedOrder.trackingNumber}</code></span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={() => navigate('/shop/orders')}
                    style={{ background: '#92400E', color: 'white', border: 'none', borderRadius: 6, fontSize: '0.76rem' }}
                  >
                    Track in Orders
                  </button>
                </div>
              )}

              {/* Message History */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center', margin: '4px 0' }}>
                  <span style={{ fontSize: '0.72rem', background: 'var(--surface-2)', padding: '3px 12px', borderRadius: 9999, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    End-to-end verified communication with store merchant
                  </span>
                </div>

                {(activeConversation.messages || []).map((msg) => {
                  const isMe = msg.senderType === 'customer';

                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '80%',
                        alignSelf: isMe ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontWeight: 700, color: isMe ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span>•</span>
                        <span>{formatTimestamp(msg.createdAt)}</span>
                      </div>

                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          background: isMe ? 'var(--primary)' : 'var(--surface-2)',
                          color: isMe ? 'white' : 'var(--text-primary)',
                          border: isMe ? 'none' : '1px solid var(--border)',
                          fontSize: '0.88rem',
                          lineHeight: 1.5,
                          wordBreak: 'break-word',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                        }}
                      >
                        {msg.text}
                      </div>

                      {isMe && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Check size={12} color="var(--success)" />
                          <span>Delivered to merchant</span>
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing Indicator */}
              {typingUsers[activeConversation?.id] && (
                <div style={{
                  padding: '5px 20px',
                  background: '#F0FDF4',
                  borderTop: '1px solid #BBF7D0',
                  fontSize: '0.76rem',
                  color: '#166534',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E' }} />
                  <span><em>{typingUsers[activeConversation.id].userName} is typing...</em></span>
                </div>
              )}

              {/* Message Composer */}
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
                  placeholder="Type message to merchant (Enter to send, Shift+Enter for new line)..."
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
                  <span>{isSending ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <MessageSquare size={54} style={{ opacity: 0.3, marginBottom: 16 }} />
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)' }}>Select a Conversation</h3>
              <p style={{ margin: '6px 0 0', fontSize: '0.86rem' }}>Select a merchant conversation from the left to read and reply.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
