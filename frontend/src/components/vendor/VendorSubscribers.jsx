import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import { VendorSidebar } from './VendorDashboard';
import {
  Users, UserCheck, Bell, Send, Search, CheckCircle,
  Megaphone, Tag, Sparkles, Filter, ShieldCheck, ShoppingBag,
  Sliders, AlertCircle, X, ChevronRight, Check
} from 'lucide-react';
import '../../styles/vendor.css';

export default function VendorSubscribers() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [subscribersData, setSubscribersData] = useState({
    totalSubscribers: 0,
    buyerSubscribers: 0,
    buyerConversionRate: '0%',
    preferenceStats: { newProducts: 0, promotions: 0, deals: 0, updates: 0 },
    subscribers: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'buyers' | 'subscribers_only'

  // Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({
    updateType: 'new_product',
    title: '',
    message: '',
    link: '',
    channel: 'both'
  });
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  const fetchSubscribers = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await api.getVendorSubscribers(user.id);
      if (res?.success) {
        setSubscribersData(res);
      }
    } catch (err) {
      console.warn('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Subscriber Management & Broadcasts | Vendor Hub';
    fetchSubscribers();
  }, [user?.id]);

  const filteredSubscribers = useMemo(() => {
    let list = subscribersData.subscribers || [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.customerName.toLowerCase().includes(q) ||
          s.maskedEmail.toLowerCase().includes(q)
      );
    }
    if (filterType === 'buyers') {
      list = list.filter((s) => s.hasPurchased);
    } else if (filterType === 'subscribers_only') {
      list = list.filter((s) => !s.hasPurchased);
    }
    return list;
  }, [subscribersData.subscribers, searchQuery, filterType]);

  // Calculate estimated reach for current broadcast type
  const estimatedReach = useMemo(() => {
    const prefKeyMap = {
      new_product: 'newProducts',
      promotion: 'promotions',
      deal: 'deals',
      updates: 'updates'
    };
    const key = prefKeyMap[broadcastForm.updateType] || 'updates';
    const count = subscribersData.preferenceStats?.[key] || 0;
    return count > 0 ? count : (subscribersData.totalSubscribers || 0);
  }, [broadcastForm.updateType, subscribersData]);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      addToast('Please enter both title and message.', 'error');
      return;
    }
    try {
      setSendingBroadcast(true);
      const res = await api.sendVendorUpdate(user.id, broadcastForm);
      if (res?.success) {
        let successMsg = res.message || 'Update broadcast sent successfully!';
        const parts = [];
        if (res.stats?.emailReport?.sent > 0) {
          parts.push(`${res.stats.emailReport.sent} Emails`);
        }
        const phoneSent = (res.stats?.twilioReport?.smsSent || 0) + (res.stats?.twilioReport?.whatsappSent || 0);
        if (phoneSent > 0) {
          parts.push(`${phoneSent} SMS/WhatsApp`);
        }
        if (parts.length > 0) {
          successMsg += ` (${parts.join(', ')} delivered)`;
        }
        addToast(successMsg, 'success');
        setShowBroadcastModal(false);
        setBroadcastForm({
          updateType: 'new_product',
          title: '',
          message: '',
          link: '',
          channel: 'all'
        });
      }
    } catch (err) {
      addToast('Failed to dispatch broadcast.', 'error');
    } finally {
      setSendingBroadcast(false);
    }
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <main className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Subscriber Management & Customer Relations</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Engage your subscribed customer base with targeted product drops, seasonal vouchers, and store updates
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowBroadcastModal(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Megaphone size={16} /> Send Subscriber Update
            </button>
          </div>
        </div>

        <div className="vendor-content">
          {/* KPI Cards */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                <Users size={22} />
              </div>
              <div>
                <div className="stat-value">{subscribersData.totalSubscribers}</div>
                <div className="stat-label">Active Storefront Followers</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}>
                <ShoppingBag size={22} />
              </div>
              <div>
                <div className="stat-value">{subscribersData.buyerSubscribers}</div>
                <div className="stat-label">Buyer Subscribers (Repeat Customers)</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <UserCheck size={22} />
              </div>
              <div>
                <div className="stat-value">{subscribersData.buyerConversionRate}</div>
                <div className="stat-label">Subscriber-to-Buyer Conversion</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
                <Bell size={22} />
              </div>
              <div>
                <div className="stat-value">{subscribersData.preferenceStats?.newProducts || 0}</div>
                <div className="stat-label">Opted-in for New Product Alerts</div>
              </div>
            </div>
          </div>

          {/* Privacy Note Banner */}
          <div
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '12px 18px',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.82rem',
              color: 'var(--text-secondary)'
            }}
          >
            <ShieldCheck size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Customer Privacy Protected:</strong> Customer email addresses are masked and personal contact information is kept confidential in compliance with marketplace data safety policies.
            </span>
          </div>

          {/* Search & Filter Toolbar */}
          <div
            className="card"
            style={{
              padding: '16px 20px',
              marginBottom: 20,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 14
            }}
          >
            <div style={{ position: 'relative', width: 320, maxWidth: '100%' }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search subscribers by name..."
                className="form-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 36, height: 38, fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter:</span>
              <button
                type="button"
                className={`btn btn-sm ${filterType === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterType('all')}
              >
                All ({subscribersData.totalSubscribers})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterType === 'buyers' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterType('buyers')}
              >
                🛍️ Buyers Only ({subscribersData.buyerSubscribers})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${filterType === 'subscribers_only' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilterType('subscribers_only')}
              >
                ⭐ Followers Only ({subscribersData.totalSubscribers - subscribersData.buyerSubscribers})
              </button>
            </div>
          </div>

          {/* Subscribers Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                Loading subscribers...
              </div>
            ) : filteredSubscribers.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
                <Users size={40} style={{ opacity: 0.5, margin: '0 auto 12px' }} />
                <h4>No subscribers match your search</h4>
                <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
                  Invite customers to follow your verified storefront to build your subscriber community.
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="vendor-table">
                  <thead>
                    <tr>
                      <th>Subscriber</th>
                      <th>Relationship Status</th>
                      <th>Subscribed Date</th>
                      <th>Purchases Made</th>
                      <th>Notification Preferences</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((sub) => {
                      const prefs = sub.notificationPreferences || {};
                      return (
                        <tr key={sub.id || sub.customerId}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #EEF2FF, #DDD6FE)',
                                  color: '#4F46E5',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem'
                                }}
                              >
                                {sub.customerName.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{sub.customerName}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub.maskedEmail}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            {sub.hasPurchased ? (
                              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                                🛍️ Buyer & Subscriber
                              </span>
                            ) : (
                              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                                ⭐ Storefront Subscriber
                              </span>
                            )}
                          </td>

                          <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                            {new Date(sub.subscribedAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </td>

                          <td>
                            {sub.hasPurchased ? (
                              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--success)' }}>
                                {sub.ordersCount} completed {sub.ordersCount === 1 ? 'order' : 'orders'}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No orders yet</span>
                            )}
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                              {prefs.channelEmail !== false && (
                                <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }}>
                                  ✉️ Email
                                </span>
                              )}
                              {prefs.channelSms && (
                                <span className="badge" style={{ fontSize: '0.68rem', padding: '1px 6px', background: '#DCFCE7', color: '#166534', fontWeight: 700 }}>
                                  📱 SMS
                                </span>
                              )}
                              {prefs.newProducts !== false && (
                                <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                  New Drops
                                </span>
                              )}
                              {prefs.promotions !== false && (
                                <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                  Vouchers
                                </span>
                              )}
                              {prefs.deals !== false && (
                                <span className="badge badge-warning" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                  Deals
                                </span>
                              )}
                              {prefs.updates !== false && (
                                <span className="badge badge-info" style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                                  Notices
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Broadcast Modal */}
        {showBroadcastModal && (
          <div
            className="modal-overlay"
            onClick={() => setShowBroadcastModal(false)}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(3px)',
              zIndex: 1500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20
            }}
          >
            <div
              className="card"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 580,
                maxWidth: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: 0,
                borderRadius: 14
              }}
            >
              <div
                style={{
                  padding: '18px 24px',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Megaphone size={20} color="var(--primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Broadcast Update to Subscribers</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSendBroadcast} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
                    Broadcast Category
                  </label>
                  <select
                    className="form-input"
                    value={broadcastForm.updateType}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, updateType: e.target.value })}
                  >
                    <option value="new_product">✨ New Product Arrival (Delivered to New Drop opt-ins)</option>
                    <option value="promotion">🏷️ Promotional Voucher / Discount Offer</option>
                    <option value="deal">⚡ Exclusive Combo Bundle / Flash Deal</option>
                    <option value="updates">📢 Store Notice / Shipping SLA Update</option>
                  </select>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
                    Delivery Channels
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8 }}>
                    {[
                      { key: 'all', label: '🚀 All Channels', badge: 'Email + SMS + App' },
                      { key: 'email', label: '✉️ Email Digest', badge: 'High Privacy' },
                      { key: 'both', label: '📱 SMS + WhatsApp', badge: 'Mobile Alerts' },
                      { key: 'sms', label: '💬 SMS Only', badge: 'Carrier Direct' },
                      { key: 'app_only', label: '🔔 In-App Notice', badge: 'Silent Bell' }
                    ].map((ch) => (
                      <button
                        key={ch.key}
                        type="button"
                        onClick={() => setBroadcastForm({ ...broadcastForm, channel: ch.key })}
                        style={{
                          padding: '8px 10px',
                          borderRadius: 8,
                          border: broadcastForm.channel === ch.key ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: broadcastForm.channel === ch.key ? '#EEF2FF' : 'var(--surface-2)',
                          color: broadcastForm.channel === ch.key ? '#4F46E5' : 'var(--text-primary)',
                          fontWeight: broadcastForm.channel === ch.key ? 700 : 500,
                          fontSize: '0.78rem',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}
                      >
                        <span>{ch.label}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{ch.badge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Audience Reach Banner */}
                <div
                  style={{
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: '0.8rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <CheckCircle size={16} color="#16A34A" />
                  <span>
                    Estimated target audience: <strong>{estimatedReach} subscribers</strong> opted in for this communication category.
                  </span>
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
                    Update Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Just restocked: Flagship Titanium Wireless Buds with 1-Year Warranty"
                    className="form-input"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
                    Broadcast Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the product launch, offer details, minimum order value, or important delivery information..."
                    className="form-input"
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  />
                </div>

                <div>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 6 }}>
                    Action Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., /shop or specific product URL"
                    className="form-input"
                    value={broadcastForm.link}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, link: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowBroadcastModal(false)}
                    disabled={sendingBroadcast}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={sendingBroadcast}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Send size={16} /> {sendingBroadcast ? 'Broadcasting...' : 'Send Broadcast Now'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
