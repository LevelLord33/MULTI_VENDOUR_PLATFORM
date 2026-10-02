import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import Navbar from '../common/Navbar';
import {
  Bell, BellOff, Store, CheckCircle, ExternalLink, ShieldCheck,
  Package, ShoppingBag, Star, MapPin, Tag, Sparkles, AlertCircle,
  Clock, ArrowRight, UserCheck, Settings2, Sliders, Check
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function CustomerSubscriptions() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrefsVendorId, setEditingPrefsVendorId] = useState(null);
  const [prefForm, setPrefForm] = useState({
    newProducts: true,
    promotions: true,
    deals: true,
    updates: true
  });
  const [savingPrefs, setSavingPrefs] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await api.getMySubscriptions();
      if (res?.success && Array.isArray(res.subscriptions)) {
        setSubscriptions(res.subscriptions);
      }
    } catch (err) {
      console.warn('Error fetching subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'My Subscribed Vendors & Preferences | Vendor Hub';
    fetchSubscriptions();
  }, []);

  const handleUnsubscribe = async (vendorId, vendorName) => {
    if (!window.confirm(`Unsubscribe from ${vendorName}? You will no longer receive catalog notifications.`)) {
      return;
    }
    try {
      const res = await api.unsubscribeFromVendor(vendorId);
      if (res?.success) {
        addToast(`Unsubscribed from ${vendorName}`, 'info');
        setSubscriptions((prev) => prev.filter((s) => s.vendorId !== vendorId));
      }
    } catch (err) {
      addToast('Failed to unsubscribe. Please try again.', 'error');
    }
  };

  const openPrefsModal = (sub) => {
    setEditingPrefsVendorId(sub.vendorId);
    setPrefForm({
      newProducts: sub.notificationPreferences?.newProducts !== false,
      promotions: sub.notificationPreferences?.promotions !== false,
      deals: sub.notificationPreferences?.deals !== false,
      updates: sub.notificationPreferences?.updates !== false
    });
  };

  const handleSavePreferences = async (vendorId) => {
    try {
      setSavingPrefs(true);
      const res = await api.updateSubscriptionPreferences(vendorId, prefForm);
      if (res?.success) {
        addToast('Notification preferences updated!', 'success');
        setSubscriptions((prev) =>
          prev.map((s) =>
            s.vendorId === vendorId
              ? { ...s, notificationPreferences: { ...prefForm } }
              : s
          )
        );
        setEditingPrefsVendorId(null);
      }
    } catch (err) {
      addToast('Failed to save preferences.', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Bell size={12} /> Subscriber Hub
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Customer ↔ Vendor Relationship
            </span>
          </div>
          <h1>My Subscribed Vendors</h1>
          <p>
            Follow verified physical storefronts, manage your promotional alerts, and discover new products directly.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 60 }}>
        {/* Relationship Distinction Info Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.06), rgba(147, 51, 234, 0.06))',
            border: '1px solid rgba(79, 70, 229, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '10px',
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Understanding Vendor Relationships
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                <span className="badge badge-success" style={{ marginRight: 6, fontSize: '0.72rem' }}>
                  🛍️ Purchased Vendor
                </span>
                Vendors you have completed orders with.
                <span className="badge badge-info" style={{ marginLeft: 10, marginRight: 6, fontSize: '0.72rem' }}>
                  ⭐ Subscribed Vendor
                </span>
                Vendors you follow for updates, new releases, and deals.
              </div>
            </div>
          </div>

          <Link to="/stores" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Store size={15} /> Discover More Merchants
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p>Loading your subscribed merchant storefronts...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && subscriptions.length === 0 && (
          <div className="card empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Store size={56} color="var(--primary)" style={{ margin: '0 auto 16px', opacity: 0.6 }} />
            <h3>No Vendor Subscriptions Yet</h3>
            <p style={{ maxWidth: 460, margin: '8px auto 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Subscribe to your favorite merchants on Vendor Hub to receive notifications on newly stocked products, exclusive discount codes, and store announcements.
            </p>
            <Link to="/stores" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Store size={16} /> Explore Verified Stores
            </Link>
          </div>
        )}

        {/* Subscriptions Grid */}
        {!loading && subscriptions.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 24 }}>
            {subscriptions.map((sub) => {
              const isPurchased = sub.hasPurchased;
              const prefs = sub.notificationPreferences || {};
              const isEditingThis = editingPrefsVendorId === sub.vendorId;

              return (
                <div
                  key={sub.subscriptionId || sub.vendorId}
                  className="card"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: isPurchased ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)'
                  }}
                >
                  {/* Banner / Store Header */}
                  <div
                    style={{
                      height: 100,
                      background: sub.banner
                        ? `url(${sub.banner}) center/cover no-repeat`
                        : 'linear-gradient(135deg, #4F46E5, #9333EA)',
                      position: 'relative',
                      padding: 12
                    }}
                  >
                    <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6 }}>
                      {isPurchased ? (
                        <span
                          className="badge"
                          style={{
                            background: '#10B981',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4
                          }}
                        >
                          <ShoppingBag size={11} /> Purchased Vendor
                        </span>
                      ) : (
                        <span
                          className="badge"
                          style={{
                            background: 'rgba(15, 23, 42, 0.75)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            backdropFilter: 'blur(4px)'
                          }}
                        >
                          ⭐ Subscribed Vendor
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 0 }}>
                    {/* Avatar & Title Row */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginTop: -32, marginBottom: 14 }}>
                      <img
                        src={sub.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sub.vendorName)}&background=4F46E5&color=fff`}
                        alt={sub.vendorName}
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '3px solid white',
                          boxShadow: 'var(--shadow-md)',
                          background: 'white'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {sub.vendorName}
                        </h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          <span>{sub.category}</span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                            <MapPin size={11} /> {sub.location}
                          </span>
                          <span>•</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#F59E0B', fontWeight: 600 }}>
                            <Star size={11} fill="#F59E0B" /> {sub.storeRating}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Relationship Details */}
                    <div
                      style={{
                        background: 'var(--surface-2)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        marginBottom: 16
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Subscription Date:</span>
                        <span style={{ fontWeight: 600 }}>
                          {new Date(sub.subscribedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {isPurchased && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#047857' }}>
                          <span style={{ fontWeight: 600 }}>Orders Completed:</span>
                          <span style={{ fontWeight: 700 }}>
                            {sub.ordersPlacedCount} {sub.ordersPlacedCount === 1 ? 'order' : 'orders'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Notification Preferences Section */}
                    <div style={{ marginBottom: 16, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
                          Notification Preferences
                        </span>
                        <button
                          type="button"
                          onClick={() => (isEditingThis ? setEditingPrefsVendorId(null) : openPrefsModal(sub))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3
                          }}
                        >
                          <Sliders size={12} />
                          {isEditingThis ? 'Cancel' : 'Edit'}
                        </button>
                      </div>

                      {/* Display Active Tags when not editing */}
                      {!isEditingThis && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          <span className={`badge ${prefs.newProducts !== false ? 'badge-primary' : 'badge-ghost'}`} style={{ fontSize: '0.72rem' }}>
                            {prefs.newProducts !== false ? '✓' : '✗'} New Products
                          </span>
                          <span className={`badge ${prefs.promotions !== false ? 'badge-success' : 'badge-ghost'}`} style={{ fontSize: '0.72rem' }}>
                            {prefs.promotions !== false ? '✓' : '✗'} Promotions
                          </span>
                          <span className={`badge ${prefs.deals !== false ? 'badge-warning' : 'badge-ghost'}`} style={{ fontSize: '0.72rem' }}>
                            {prefs.deals !== false ? '✓' : '✗'} Flash Deals
                          </span>
                          <span className={`badge ${prefs.updates !== false ? 'badge-info' : 'badge-ghost'}`} style={{ fontSize: '0.72rem' }}>
                            {prefs.updates !== false ? '✓' : '✗'} Store Updates
                          </span>
                        </div>
                      )}

                      {/* Interactive Preferences Form when editing */}
                      {isEditingThis && (
                        <div
                          style={{
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            padding: '12px 14px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8
                          }}
                        >
                          {[
                            { key: 'newProducts', label: 'New Product Releases', desc: 'When vendor adds new catalog items' },
                            { key: 'promotions', label: 'Vendor Promotions & Coupons', desc: 'Discount vouchers & seasonal offers' },
                            { key: 'deals', label: 'Combo Deals & Bundles', desc: 'Special multi-item bundle deals' },
                            { key: 'updates', label: 'Important Store Updates', desc: 'Dispatch SLA changes & notices' }
                          ].map((item) => (
                            <label
                              key={item.key}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, color: '#1E293B' }}>{item.label}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{item.desc}</div>
                              </div>
                              <input
                                type="checkbox"
                                checked={prefForm[item.key]}
                                onChange={(e) =>
                                  setPrefForm({ ...prefForm, [item.key]: e.target.checked })
                                }
                                style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                              />
                            </label>
                          ))}

                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleSavePreferences(sub.vendorId)}
                            disabled={savingPrefs}
                            style={{ marginTop: 6, width: '100%', display: 'flex', justifyContent: 'center', gap: 6 }}
                          >
                            <Check size={14} /> {savingPrefs ? 'Saving...' : 'Save Preferences'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        onClick={() => navigate(`/store/${sub.storeSlug || sub.vendorId}`)}
                      >
                        <Store size={14} /> Visit Storefront
                      </button>

                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{ color: '#EF4444' }}
                        title="Unsubscribe from vendor"
                        onClick={() => handleUnsubscribe(sub.vendorId, sub.vendorName)}
                      >
                        <BellOff size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
