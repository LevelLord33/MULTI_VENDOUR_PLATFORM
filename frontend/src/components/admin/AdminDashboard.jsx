import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { useDisputes } from '../../contexts/DisputeContext';
import { api } from '../../services/api';
import {
  LayoutDashboard, Clock, CheckCircle, XCircle, LogOut,
  ShoppingBag, Shield, MapPin, Phone, Mail, Store, Package,
  Truck, Box, Scale, AlertTriangle, Users, TrendingUp,
  Smartphone, MessageSquare, Bell, Search, Eye, Filter,
  Sliders, ExternalLink, RefreshCw, Send, Sparkles, Check,
  Activity, ArrowUpRight, DollarSign, Layers, ChevronRight, X, ShieldCheck
} from 'lucide-react';
import '../../styles/vendor.css';

/* ── Admin Sidebar ─────────────────────────── */
const ADMIN_NAV = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard & Monitoring', path: '/admin/dashboard' },
  { icon: <Store size={18} />, label: 'Vendor Directory & Catalogs', path: '/admin/vendors' },
  { icon: <Scale size={18} />, label: 'Dispute Management', path: '/admin/disputes', isDispute: true },
  { icon: <Clock size={18} />, label: 'Pending Physical SKUs', path: '/admin/pending' },
  { icon: <CheckCircle size={18} />, label: 'Approved SKUs', path: '/admin/approved' },
  { icon: <XCircle size={18} />, label: 'Rejected SKUs', path: '/admin/rejected' },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getPendingProducts } = useProducts();
  const { disputes } = useDisputes();
  const pendingCount = getPendingProducts().length;
  const activeDisputesCount = disputes.filter(
    (d) => d.status !== 'Resolved' && d.status !== 'Rejected'
  ).length;

  return (
    <aside className="admin-sidebar">
      <div className="vendor-sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" style={{ background: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)', boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)' }}>
            <ShoppingBag size={20} />
          </div>
          <span className="sidebar-brand-name">Vendor <span>Hub</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg, #9333EA 0%, #6B21A8 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)' }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div className="sidebar-vendor-name" style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Marketplace Admin</div>
            <div className="sidebar-vendor-type" style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>Platform Governance Core</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.66rem', color: '#34D399', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '2px 7px', borderRadius: 9999, marginTop: 4, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }} />
              Production Online
            </div>
          </div>
        </div>
      </div>

      <nav className="vendor-sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-label" style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem' }}>Catalog & Governance</div>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                style={isActive ? {
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(126, 34, 206, 0.95))',
                  boxShadow: '0 4px 14px rgba(147, 51, 234, 0.35)',
                  borderLeft: '3px solid #C084FC',
                  fontWeight: 600,
                  color: '#FFFFFF'
                } : {}}
              >
                {item.icon}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.path === '/admin/pending' && pendingCount > 0 && (
                  <span style={{ background: '#F59E0B', color: 'white', borderRadius: '9999px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)' }}>
                    {pendingCount}
                  </span>
                )}
                {item.isDispute && activeDisputesCount > 0 && (
                  <span style={{ background: '#EF4444', color: 'white', borderRadius: '9999px', padding: '1px 8px', fontSize: '0.7rem', fontWeight: 800, boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)' }}>
                    {activeDisputesCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="vendor-sidebar-footer">
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            Storefronts & Portals
          </div>
          <button className="sidebar-nav-item" onClick={() => navigate('/shop')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left', marginBottom: 4 }}>
            🛍️ Customer Marketplace
          </button>
          <button className="sidebar-nav-item" onClick={() => navigate('/vendor/login')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left' }}>
            🏪 Vendor Hub
          </button>
        </div>
        <button className="sidebar-nav-item" onClick={() => { logout(); navigate('/'); }} style={{ color: '#F87171' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ── Product Review Card ───────────────────── */
export function ProductReviewCard({ product, onApprove, onReject, showActions = true }) {
  const { getVendorById } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const vendor = getVendorById(product.vendorId);
  const stock = product.stock != null ? product.stock : (product.quantity || 0);

  return (
    <div className="review-product-card">
      <div className="review-product-header">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'}
          alt={product.name}
          className="review-product-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'; }}
        />
        <div className="review-product-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className="badge badge-primary">{product.category}</span>
            <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
              SKU: {product.sku || 'VM-SKU'}
            </code>
            {product.condition && product.condition !== 'N/A' && (
              <span className="badge badge-info">{product.condition}</span>
            )}
          </div>

          <div className="review-product-name">{product.name}</div>
          {product.brand && (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              Brand: <strong>{product.brand}</strong>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              ₹{product.price?.toLocaleString('en-IN')}
            </div>
            {product.mrp && product.mrp > product.price && (
              <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                MRP: ₹{product.mrp?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {expanded ? product.description : (product.description || '').slice(0, 140) + ((product.description || '').length > 140 ? '...' : '')}
            {(product.description || '').length > 140 && (
              <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', marginLeft: 4 }}>
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail strip */}
        {product.images?.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            {product.images.slice(1, 4).map((img, i) => (
              <img key={i} src={img} alt={`View ${i + 2}`} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
          </div>
        )}
      </div>

      {/* Vendor Info */}
      {vendor && (
        <div className="vendor-detail-mini">
          <img src={vendor.avatar} alt={vendor.businessName} className="vendor-mini-avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName)}&background=4F46E5&color=fff`; }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{vendor.businessName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', gap: 12 }}>
              <span><MapPin size={11} style={{ display: 'inline', marginRight: 2 }} />{vendor.location}</span>
              <span><Phone size={11} style={{ display: 'inline', marginRight: 2 }} />{vendor.mobile}</span>
              <span><Mail size={11} style={{ display: 'inline', marginRight: 2 }} />{vendor.email}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Physical Stock: <strong>{stock} units</strong>
          </span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="review-product-footer">
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Physical Stock: <strong>{stock} units</strong> {product.shipping?.dispatchTime && `· ${product.shipping.dispatchTime}`}
          </div>
          <div className="review-actions">
            <button className="btn btn-success btn-sm" onClick={() => onApprove(product.id)}>
              <CheckCircle size={15} /> Approve Physical SKU
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => onReject(product.id)}>
              <XCircle size={15} /> Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Admin Dashboard ──────────────────── */
export default function AdminDashboard() {
  const { getPendingProducts, getApprovedProducts, getRejectedProducts, approveProduct, rejectProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Monitoring Tab
  const [activeTab, setActiveTab] = useState('overview');
  // 'overview' | 'vendor_monitoring' | 'customer_usage' | 'fair_exposure' | 'subscriptions' | 'communications' | 'activity_logs' | 'sku_audits'

  const [timeframe, setTimeframe] = useState('30D');
  const [loading, setLoading] = useState(false);

  // Platform Monitoring States
  const [platformData, setPlatformData] = useState(null);
  const [vendorMonitoringData, setVendorMonitoringData] = useState(null);
  const [customerUsageData, setCustomerUsageData] = useState(null);
  const [fairExposureData, setFairExposureData] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [communicationData, setCommunicationData] = useState(null);
  const [activityLogsData, setActivityLogsData] = useState([]);

  // Deep Dive Modal
  const [inspectVendorId, setInspectVendorId] = useState(null);
  const [vendorDeepDive, setVendorDeepDive] = useState(null);
  const [loadingDeepDive, setLoadingDeepDive] = useState(false);

  // Vendor Table Filter in Vendor Monitoring Tab
  const [vendorFilterStatus, setVendorFilterStatus] = useState('all');
  const [vendorSearch, setVendorSearch] = useState('');

  // SKU lists from Context
  const pending = useMemo(() => getPendingProducts(), [getPendingProducts]);
  const approved = useMemo(() => getApprovedProducts(), [getApprovedProducts]);
  const rejected = useMemo(() => getRejectedProducts(), [getRejectedProducts]);

  // Load Platform Overview Data
  useEffect(() => {
    document.title = 'Admin Platform Monitoring & Analytics Console | Vendor Hub';
    async function loadData() {
      setLoading(true);
      try {
        const [plat, vend, cust, exp, subs, comm, logs] = await Promise.all([
          api.getPlatformAnalytics(timeframe),
          api.getVendorMonitoring(),
          api.getCustomerUsageAnalytics(),
          api.getFairExposureMonitoring(),
          api.getSubscriptionAnalytics(),
          api.getCommunicationMonitoring(),
          api.getActivityLogs()
        ]);
        if (plat?.success) setPlatformData(plat);
        if (vend?.success) setVendorMonitoringData(vend);
        if (cust?.success) setCustomerUsageData(cust);
        if (exp?.success) setFairExposureData(exp);
        if (subs?.success) setSubscriptionData(subs);
        if (comm?.success) setCommunicationData(comm);
        if (logs?.success && logs.logs) setActivityLogsData(logs.logs);
      } catch (err) {
        console.warn('Analytics loading notice:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [timeframe]);

  // Deep dive fetcher
  const handleOpenVendorDeepDive = async (vendorId) => {
    setInspectVendorId(vendorId);
    setLoadingDeepDive(true);
    try {
      const res = await api.getVendorDeepDive(vendorId);
      if (res?.success) {
        setVendorDeepDive(res);
      }
    } catch (e) {
      console.warn('Deep dive error:', e);
    } finally {
      setLoadingDeepDive(false);
    }
  };

  const handleApprove = useCallback((id) => {
    approveProduct(id);
    if (addToast) addToast('Physical SKU approved for marketplace catalog!', 'success');
  }, [approveProduct, addToast]);

  const handleReject = useCallback((id) => {
    rejectProduct(id);
    if (addToast) addToast('Physical SKU rejected', 'error');
  }, [rejectProduct, addToast]);

  // Filtered vendors in Vendor Monitoring Tab
  const displayedVendors = useMemo(() => {
    let list = vendorMonitoringData?.vendors || [];
    if (vendorSearch.trim()) {
      const q = vendorSearch.toLowerCase();
      list = list.filter(
        (v) =>
          v.businessName.toLowerCase().includes(q) ||
          v.ownerName.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }
    if (vendorFilterStatus !== 'all') {
      if (vendorFilterStatus === 'verified') list = list.filter((v) => v.isVerified);
      else if (vendorFilterStatus === 'low_stock') list = list.filter((v) => v.lowStockItems > 0);
      else if (vendorFilterStatus === 'low_activity') list = list.filter((v) => v.totalOrders < 5);
      else if (vendorFilterStatus === 'has_disputes') list = list.filter((v) => v.activeDisputes > 0);
      else if (vendorFilterStatus === 'emerging') list = list.filter((v) => v.isEmerging);
    }
    return list;
  }, [vendorMonitoringData?.vendors, vendorSearch, vendorFilterStatus]);

  const overview = platformData?.overview || {
    totalVendors: 20,
    activeVendors: 18,
    totalCustomers: 24,
    totalProducts: 250,
    approvedProducts: 242,
    totalOrders: 38,
    completedOrders: 32,
    totalSubscriptions: 24,
    totalInvoices: 38,
    totalRevenue: 284500,
    periodRevenue: 142000,
    activeDisputes: 2,
    totalPromotions: 8
  };

  return (
    <div className="vendor-layout">
      <AdminSidebar />

      <div className="admin-main">
        {/* Admin Topbar */}
        <div className="admin-topbar">
          <div>
            <div className="vendor-topbar-title" style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Marketplace Administration & Platform Analytics</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Executive governance: vendor compliance, customer telemetry, fair exposure, and digital invoice communication
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            {/* Live Service Health Indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', padding: '4px 10px', borderRadius: 20, background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.25)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 4px #10B981' }} /> Atlas DB: Active
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', padding: '4px 10px', borderRadius: 20, background: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', border: '1px solid rgba(59, 130, 246, 0.25)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#3B82F6', display: 'inline-block', boxShadow: '0 0 4px #3B82F6' }} /> Twilio: Live
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', padding: '4px 10px', borderRadius: 20, background: 'rgba(147, 51, 234, 0.1)', color: '#9333EA', border: '1px solid rgba(147, 51, 234, 0.25)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9333EA', display: 'inline-block', boxShadow: '0 0 4px #9333EA' }} /> BlueDart: Linked
              </span>
            </div>

            {/* Timeframe Selector */}
            <div style={{ display: 'flex', background: 'var(--surface-2)', padding: 3, borderRadius: 10, border: '1px solid var(--border)' }}>
              {['Today', '7D', '30D', 'All'].map((tf) => {
                const isSelected = timeframe === tf;
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    style={{
                      border: 'none',
                      background: isSelected ? 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)' : 'transparent',
                      color: isSelected ? 'white' : 'var(--text-secondary)',
                      padding: '5px 12px',
                      borderRadius: 8,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 2px 6px rgba(147, 51, 234, 0.3)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.12), rgba(126, 34, 206, 0.18))', border: '1px solid rgba(147, 51, 234, 0.3)', borderRadius: 10, color: '#7E22CE', fontSize: '0.82rem', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>Root Admin Console</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '4px 24px 0',
            display: 'flex',
            overflowX: 'auto',
            gap: 6
          }}
        >
          {[
            { id: 'overview', label: 'Platform Overview', icon: <LayoutDashboard size={15} /> },
            { id: 'vendor_monitoring', label: 'Vendor Ecosystem', icon: <Store size={15} /> },
            { id: 'customer_usage', label: 'Customer Usage', icon: <Users size={15} /> },
            { id: 'fair_exposure', label: 'Fair Exposure', icon: <Scale size={15} /> },
            { id: 'subscriptions', label: 'Subscriptions', icon: <Bell size={15} /> },
            { id: 'communications', label: 'Invoices & Twilio', icon: <Smartphone size={15} /> },
            { id: 'activity_logs', label: 'Audit Trail', icon: <Activity size={15} /> },
            { id: 'sku_audits', label: 'SKU Audits', icon: <Package size={15} />, count: pending.length },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive ? 'linear-gradient(180deg, rgba(147, 51, 234, 0.08) 0%, rgba(147, 51, 234, 0.02) 100%)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '3px solid #9333EA' : '3px solid transparent',
                  color: isActive ? '#9333EA' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  padding: '12px 14px',
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'all 0.15s ease',
                  borderTopLeftRadius: 6,
                  borderTopRightRadius: 6
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span style={{
                    background: '#F59E0B',
                    color: 'white',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 9999
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="admin-content" style={{ padding: '24px' }}>
          {/* ────────────────────────────────────────────────────────
              TAB 1: PLATFORM OVERVIEW
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div>
              {/* Top Stats Grid */}
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card" onClick={() => setActiveTab('vendor_monitoring')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}><Store size={22} /></div>
                  <div>
                    <div className="stat-value">{overview.totalVendors}</div>
                    <div className="stat-label">Total Verified Vendors ({overview.activeVendors} active)</div>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('customer_usage')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Users size={22} /></div>
                  <div>
                    <div className="stat-value">{overview.totalCustomers}</div>
                    <div className="stat-label">Registered Customers</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><DollarSign size={22} /></div>
                  <div>
                    <div className="stat-value">₹{(overview.totalRevenue / 100000).toFixed(2)}L</div>
                    <div className="stat-label">Platform GMV (₹{overview.periodRevenue?.toLocaleString('en-IN')} in {timeframe})</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}><Package size={22} /></div>
                  <div>
                    <div className="stat-value">{overview.totalOrders}</div>
                    <div className="stat-label">Orders Placed ({overview.completedOrders} completed)</div>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('subscriptions')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Bell size={22} /></div>
                  <div>
                    <div className="stat-value">{overview.totalSubscriptions}</div>
                    <div className="stat-label">Customer Subscriptions Active</div>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('communications')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}><Smartphone size={22} /></div>
                  <div>
                    <div className="stat-value">{overview.totalInvoices}</div>
                    <div className="stat-label">Digital Tax Invoices Generated</div>
                  </div>
                </div>

                <div className="stat-card" onClick={() => navigate('/admin/disputes')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: overview.activeDisputes > 0 ? '#FEE2E2' : '#D1FAE5', color: overview.activeDisputes > 0 ? '#EF4444' : '#10B981' }}>
                    <Scale size={22} />
                  </div>
                  <div>
                    <div className="stat-value">{overview.activeDisputes}</div>
                    <div className="stat-label">Disputes in Arbitration</div>
                  </div>
                </div>

                <div className="stat-card" onClick={() => setActiveTab('sku_audits')} style={{ cursor: 'pointer' }}>
                  <div className="stat-icon" style={{ background: pending.length > 0 ? '#FEF3C7' : '#D1FAE5', color: pending.length > 0 ? '#F59E0B' : '#10B981' }}>
                    <Clock size={22} />
                  </div>
                  <div>
                    <div className="stat-value">{pending.length}</div>
                    <div className="stat-label">Physical SKUs Awaiting Audit</div>
                  </div>
                </div>
              </div>

              {/* Platform Activity & Time-Series Trend */}
              <div className="card" style={{ padding: 24, marginBottom: 28 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <TrendingUp size={20} color="#9333EA" /> Marketplace Growth & Order Velocity ({timeframe})
                    </h3>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Daily order counts and gross revenue progression across the platform
                    </div>
                  </div>
                  <span className="badge badge-success">✓ Real-time MongoDB Synchronized</span>
                </div>

                {platformData?.trendData && platformData.trendData.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${platformData.trendData.length}, 1fr)`, gap: 8, alignItems: 'flex-end', height: 160, paddingTop: 20 }}>
                    {platformData.trendData.map((pt, i) => {
                      const maxRev = Math.max(...platformData.trendData.map((p) => p.revenue || 1), 1000);
                      const heightPercent = Math.max(15, Math.round(((pt.revenue || 0) / maxRev) * 100));
                      return (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            {pt.orders > 0 ? `${pt.orders} ord` : ''}
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: `${heightPercent}%`,
                              background: 'linear-gradient(180deg, #9333EA, #4F46E5)',
                              borderRadius: '4px 4px 0 0',
                              minHeight: 12
                            }}
                            title={`Date: ${pt.date} | Orders: ${pt.orders} | Revenue: ₹${pt.revenue}`}
                          />
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {pt.date.slice(-5)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                    No order trend events recorded in this window.
                  </div>
                )}
              </div>

              {/* Quick Jump Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <div className="card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('vendor_monitoring')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>🏪 Vendor Ecosystem Health</div>
                    <ArrowUpRight size={18} color="#9333EA" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                    Inspect verification statuses, low stock warnings, application approvals, and subscriber counts.
                  </p>
                </div>

                <div className="card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('fair_exposure')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>⚖️ Fair Exposure Monitoring</div>
                    <ArrowUpRight size={18} color="#10B981" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                    Monitor emerging vs established merchant visibility to maintain anti-monopoly balance.
                  </p>
                </div>

                <div className="card" style={{ padding: 18, cursor: 'pointer' }} onClick={() => setActiveTab('communications')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>📱 Twilio & Invoices Gateway</div>
                    <ArrowUpRight size={18} color="#2563EB" />
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                    Track SMS and WhatsApp delivery rates, operational readiness, and generated GST tax invoices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 2: VENDOR ECOSYSTEM MONITORING
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'vendor_monitoring' && (
            <div>
              {/* Ecosystem Status Cards */}
              {vendorMonitoringData?.stats && (
                <div className="stats-grid" style={{ marginBottom: 24 }}>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Store size={20} /></div>
                    <div>
                      <div className="stat-value">{vendorMonitoringData.stats.totalVendors}</div>
                      <div className="stat-label">Total Registered Vendors</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><CheckCircle size={20} /></div>
                    <div>
                      <div className="stat-value">{vendorMonitoringData.stats.verifiedVendors}</div>
                      <div className="stat-label">Verified Merchants</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Clock size={20} /></div>
                    <div>
                      <div className="stat-value">{vendorMonitoringData.stats.pendingApplications}</div>
                      <div className="stat-label">Pending Merchant Apps</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#FEE2E2', color: '#EF4444' }}><AlertTriangle size={20} /></div>
                    <div>
                      <div className="stat-value">{vendorMonitoringData.stats.lowStockVendors}</div>
                      <div className="stat-label">Vendors with Low Stock</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}><Users size={20} /></div>
                    <div>
                      <div className="stat-value">{vendorMonitoringData.stats.totalPlatformSubscribers}</div>
                      <div className="stat-label">Total Store Subscribers</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search & Filter Toolbar */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ position: 'relative', width: 300 }}>
                  <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by store name, owner, city..."
                    className="form-input"
                    value={vendorSearch}
                    onChange={(e) => setVendorSearch(e.target.value)}
                    style={{ paddingLeft: 34, height: 38, fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All Vendors' },
                    { id: 'verified', label: '✓ Verified' },
                    { id: 'emerging', label: '🌱 Emerging' },
                    { id: 'low_stock', label: '⚠️ Low Stock' },
                    { id: 'low_activity', label: '💤 Low Activity' },
                    { id: 'has_disputes', label: '⚖️ Has Disputes' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      className={`btn btn-sm ${vendorFilterStatus === f.id ? 'btn-primary' : 'btn-outline'}`}
                      onClick={() => setVendorFilterStatus(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vendors Table */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="vendor-table">
                    <thead>
                      <tr>
                        <th>Merchant & Business Details</th>
                        <th>Category & City</th>
                        <th>Inventory Summary</th>
                        <th>Orders & Revenue</th>
                        <th>Subscribers</th>
                        <th>Status & SLA</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayedVendors.map((v) => (
                        <tr key={v.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 8, background: '#EEF2FF', color: '#4F46E5', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {v.businessName.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{v.businessName}</div>
                                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  Owner: {v.ownerName} · {v.mobile}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{v.category}</div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{v.location}</div>
                          </td>

                          <td>
                            <div style={{ fontSize: '0.82rem' }}>
                              <strong>{v.totalProducts}</strong> SKUs live
                            </div>
                            {v.lowStockItems > 0 && (
                              <span className="badge badge-warning" style={{ fontSize: '0.68rem', marginTop: 2 }}>
                                ⚠️ {v.lowStockItems} low stock
                              </span>
                            )}
                          </td>

                          <td>
                            <div style={{ fontWeight: 700, fontSize: '0.86rem', color: '#059669' }}>
                              ₹{v.totalRevenue?.toLocaleString('en-IN')}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {v.totalOrders} fulfilled orders
                            </div>
                          </td>

                          <td>
                            <span className="badge badge-primary" style={{ fontSize: '0.74rem' }}>
                              <Users size={11} style={{ marginRight: 3 }} /> {v.subscribersCount}
                            </span>
                          </td>

                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                              {v.isVerified ? (
                                <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>✓ Verified</span>
                              ) : (
                                <span className="badge badge-ghost" style={{ fontSize: '0.68rem' }}>Unverified</span>
                              )}
                              {v.activeDisputes > 0 && (
                                <span className="badge badge-danger" style={{ fontSize: '0.68rem' }}>
                                  ⚖️ {v.activeDisputes} Dispute
                                </span>
                              )}
                            </div>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => handleOpenVendorDeepDive(v.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <Eye size={13} /> Deep Dive
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 3: CUSTOMER PLATFORM USAGE & ENGAGEMENT
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'customer_usage' && customerUsageData && (
            <div>
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Users size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.totalRegisteredCustomers}</div>
                    <div className="stat-label">Total Registered Customers</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><Activity size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.activeCustomers}</div>
                    <div className="stat-label">Active Transacting Customers</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Search size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.totalProductSearches?.toLocaleString('en-IN')}</div>
                    <div className="stat-label">Product Search Queries Run</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}><Eye size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.productViews?.toLocaleString('en-IN')}</div>
                    <div className="stat-label">Product Page Detail Views</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}><Store size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.storeViews?.toLocaleString('en-IN')}</div>
                    <div className="stat-label">Storefront Visits</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#E0E7FF', color: '#4338CA' }}><Sliders size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.productComparisonActivity?.toLocaleString('en-IN')}</div>
                    <div className="stat-label">Product Comparisons</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEE2E2', color: '#EF4444' }}><MessageSquare size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.chatConversations}</div>
                    <div className="stat-label">Merchant Direct Chats</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#CCFBF1', color: '#0F766E' }}><Sparkles size={22} /></div>
                  <div>
                    <div className="stat-value">{customerUsageData.metrics?.chatbotSessions}</div>
                    <div className="stat-label">HubBot AI Sessions</div>
                  </div>
                </div>
              </div>

              {/* Category & Vendor Popularity Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>🔥 Most Viewed Product Categories</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(customerUsageData.mostViewedCategories || []).map((cat, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 6, fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{cat.category}</span>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{cat.views?.toLocaleString('en-IN')} views</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card" style={{ padding: 22 }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>🏪 Most Visited Physical Storefronts</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {(customerUsageData.mostVisitedVendors || []).map((v, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 6, fontSize: '0.85rem' }}>
                        <div>
                          <span style={{ fontWeight: 700 }}>{v.businessName}</span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8 }}>({v.category})</span>
                        </div>
                        <span style={{ color: '#059669', fontWeight: 700 }}>{v.visits?.toLocaleString('en-IN')} visits</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 4: FAIR EXPOSURE MONITORING
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'fair_exposure' && fairExposureData && (
            <div>
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><ShieldCheck size={22} /></div>
                  <div>
                    <div className="stat-value">{fairExposureData.summary?.fairExposureHealthScore}</div>
                    <div className="stat-label">Anti-Monopoly Health Score</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Store size={22} /></div>
                  <div>
                    <div className="stat-value">{fairExposureData.summary?.emergingVendorExposureShare}</div>
                    <div className="stat-label">Emerging Merchant Exposure Share</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><TrendingUp size={22} /></div>
                  <div>
                    <div className="stat-value">{fairExposureData.summary?.emergingVendorsCount} of {fairExposureData.summary?.totalVendors}</div>
                    <div className="stat-label">Emerging Merchants Incubating</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}><Search size={22} /></div>
                  <div>
                    <div className="stat-value">{fairExposureData.summary?.searchResultExposurePercent}</div>
                    <div className="stat-label">Exposure via Fair Search Rank</div>
                  </div>
                </div>
              </div>

              {/* Exposure Distribution Policy Note */}
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8, padding: '14px 18px', marginBottom: 24, fontSize: '0.84rem', color: '#166534' }}>
                <strong>Fair-Exposure Algorithm Active:</strong> Vendor Hub distributes 40%+ of search and category impressions to verified emerging sellers to prevent monopoly dominance and give new merchants equal discovery opportunities.
              </div>

              {/* Vendor Exposure Ranking Table */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table className="vendor-table">
                    <thead>
                      <tr>
                        <th>Merchant Store</th>
                        <th>Category</th>
                        <th>Classification</th>
                        <th>Marketplace Impressions</th>
                        <th>Store Clicks</th>
                        <th>Orders Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(fairExposureData.vendorExposureList || []).slice(0, 15).map((v) => (
                        <tr key={v.vendorId}>
                          <td style={{ fontWeight: 700 }}>{v.businessName}</td>
                          <td>{v.category}</td>
                          <td>
                            {v.isEmerging ? (
                              <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                                🌱 Emerging Merchant
                              </span>
                            ) : (
                              <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                                🏆 Established Anchor
                              </span>
                            )}
                          </td>
                          <td style={{ fontWeight: 600 }}>{v.totalImpressions?.toLocaleString('en-IN')}</td>
                          <td>{v.clicks?.toLocaleString('en-IN')}</td>
                          <td style={{ fontWeight: 700, color: '#059669' }}>{v.ordersCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 5: SUBSCRIPTIONS ANALYTICS
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'subscriptions' && subscriptionData && (
            <div>
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Users size={22} /></div>
                  <div>
                    <div className="stat-value">{subscriptionData.overview?.totalActiveSubscriptions}</div>
                    <div className="stat-label">Total Active Subscriptions</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><TrendingUp size={22} /></div>
                  <div>
                    <div className="stat-value">{subscriptionData.overview?.retentionRate}</div>
                    <div className="stat-label">Subscriber Retention Rate</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Bell size={22} /></div>
                  <div>
                    <div className="stat-value">{subscriptionData.overview?.netGrowthThisMonth}</div>
                    <div className="stat-label">Net Monthly Subscriber Growth</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEE2E2', color: '#EF4444' }}><LogOut size={22} /></div>
                  <div>
                    <div className="stat-value">{subscriptionData.overview?.totalUnsubscriptions}</div>
                    <div className="stat-label">Total Unsubscriptions</div>
                  </div>
                </div>
              </div>

              {/* Top Followed Vendors */}
              <div className="card" style={{ padding: 22, marginBottom: 24 }}>
                <h3 style={{ fontSize: '1rem', marginBottom: 14 }}>⭐ Top 8 Merchants with Most Subscribers</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
                  {(subscriptionData.topVendorsBySubscribers || []).map((v, i) => (
                    <div key={i} style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{v.businessName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.category}</div>
                      </div>
                      <span className="badge badge-primary" style={{ fontWeight: 700 }}>
                        {v.subscribers} followers
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 6: INVOICES & TWILIO COMMUNICATION MONITORING
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'communications' && communicationData && (
            <div>
              {/* Twilio Operational Status Card */}
              {communicationData.twilioStatus && (
                <div
                  style={{
                    background: communicationData.twilioStatus.isConfigured ? '#ECFDF5' : '#EFF6FF',
                    border: communicationData.twilioStatus.isConfigured ? '1px solid #A7F3D0' : '1px solid #BFDBFE',
                    borderRadius: 10,
                    padding: '16px 20px',
                    marginBottom: 24,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 16
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Smartphone size={24} color={communicationData.twilioStatus.isConfigured ? '#059669' : '#2563EB'} />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#1E293B' }}>
                        Twilio Communication Gateway Status: {communicationData.twilioStatus.isConfigured ? 'LIVE PRODUCTION' : 'SIMULATED RESILIENCE MODE'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: 2 }}>
                        {communicationData.twilioStatus.statusMessage}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem' }}>
                    <div style={{ background: 'white', padding: '6px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}>
                      SMS Gateway: <strong>{communicationData.twilioStatus.maskedPhoneNumber}</strong>
                    </div>
                    <div style={{ background: 'white', padding: '6px 12px', borderRadius: 6, border: '1px solid #CBD5E1' }}>
                      WhatsApp Gateway: <strong>{communicationData.twilioStatus.maskedWhatsAppNumber}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Communication KPIs */}
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}><Package size={22} /></div>
                  <div>
                    <div className="stat-value">{communicationData.stats?.totalInvoicesGenerated}</div>
                    <div className="stat-label">Total Invoices Generated</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#D1FAE5', color: '#10B981' }}><CheckCircle size={22} /></div>
                  <div>
                    <div className="stat-value">{communicationData.stats?.successfulDeliveries}</div>
                    <div className="stat-label">Live Deliveries (Twilio)</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}><Smartphone size={22} /></div>
                  <div>
                    <div className="stat-value">{communicationData.stats?.simulatedDeliveries}</div>
                    <div className="stat-label">Simulated Deliveries (Dev)</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}><Clock size={22} /></div>
                  <div>
                    <div className="stat-value">{communicationData.stats?.pendingDeliveries}</div>
                    <div className="stat-label">Deliveries Ready / Pending</div>
                  </div>
                </div>
              </div>

              {/* Recent Communication Log */}
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem' }}>Recent Twilio Dispatch Events</h3>
                  <span className="badge badge-primary">Audit Log Protected</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="vendor-table">
                    <thead>
                      <tr>
                        <th>Invoice Number</th>
                        <th>Order ID</th>
                        <th>Channel</th>
                        <th>Recipient</th>
                        <th>Status</th>
                        <th>Dispatched At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(communicationData.recentCommunicationEvents || []).map((ev, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 700 }}>{ev.invoiceNumber}</td>
                          <td>#{ev.orderId}</td>
                          <td>
                            <span className="badge" style={{ background: ev.channel === 'whatsapp' ? '#22C55E' : '#3B82F6', color: 'white', textTransform: 'uppercase', fontSize: '0.7rem' }}>
                              {ev.channel}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem' }}>{ev.recipient}</td>
                          <td>
                            <span className={`badge ${ev.status === 'sent' || ev.status === 'simulated' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.72rem' }}>
                              {ev.status}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {ev.sentAt ? new Date(ev.sentAt).toLocaleTimeString('en-IN') : 'Just now'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 7: ACTIVITY AUDIT LOG
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'activity_logs' && (
            <div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>Platform Activity & Audit Trail</h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Immutable timeline of administrative, merchant, and automated system actions
                    </div>
                  </div>
                  <span className="badge badge-success">✓ Zero-Credential Safe</span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="vendor-table">
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>Action Type</th>
                        <th>Actor</th>
                        <th>Target Entity</th>
                        <th>Event Summary</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityLogsData.map((log) => (
                        <tr key={log.id}>
                          <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                            {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : 'Recent'}
                          </td>
                          <td>
                            <code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>
                              {log.action}
                            </code>
                          </td>
                          <td>
                            <span className="badge" style={{ background: log.actorRole === 'admin' ? '#9333EA' : log.actorRole === 'vendor' ? '#F59E0B' : '#4F46E5', color: 'white', fontSize: '0.7rem' }}>
                              {log.actorRole}
                            </span>
                            <span style={{ fontSize: '0.78rem', marginLeft: 6 }}>{log.actorName}</span>
                          </td>
                          <td>
                            <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                              {log.targetType} #{log.targetId?.slice(0, 12)}
                            </span>
                          </td>
                          <td style={{ fontSize: '0.84rem' }}>{log.title}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────
              TAB 8: SKU AUDITS (ORIGINAL FUNCTIONALITY PRESERVED)
             ──────────────────────────────────────────────────────── */}
          {activeTab === 'sku_audits' && (
            <div>
              <div className="section-title" style={{ marginBottom: 16 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={20} color="#F59E0B" /> Physical Products Awaiting Audit ({pending.length})
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/pending')}>View Full Audit Queue</button>
              </div>

              {pending.length > 0 ? (
                <div>
                  {pending.map((p) => (
                    <ProductReviewCard key={p.id} product={p} onApprove={handleApprove} onReject={handleReject} />
                  ))}
                </div>
              ) : (
                <div className="empty-state card" style={{ padding: 48, textAlign: 'center' }}>
                  <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 12px' }} />
                  <h3>All caught up!</h3>
                  <p>No physical SKU listings currently pending review.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          VENDOR DEEP DIVE MODAL / DRAWER
         ──────────────────────────────────────────────────────── */}
      {inspectVendorId && (
        <div
          className="modal-overlay"
          onClick={() => { setInspectVendorId(null); setVendorDeepDive(null); }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(3px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
          }}
        >
          <div
            className="card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 720, maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 0, borderRadius: 14 }}
          >
            {loadingDeepDive || !vendorDeepDive ? (
              <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                Loading complete vendor ecosystem profile...
              </div>
            ) : (
              <div>
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{vendorDeepDive.vendor?.businessName}</h3>
                      {vendorDeepDive.vendor?.isVerified && (
                        <span className="badge badge-success">✓ Verified</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      GSTIN: <strong>{vendorDeepDive.vendor?.gstin}</strong> · {vendorDeepDive.vendor?.location}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => { setInspectVendorId(null); setVendorDeepDive(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={22} />
                  </button>
                </div>

                <div style={{ padding: 24 }}>
                  {/* KPI Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                    <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#059669' }}>
                        ₹{vendorDeepDive.metrics?.totalRevenue?.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Gross Revenue</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                        {vendorDeepDive.metrics?.ordersCount}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Orders Fulfilled</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#4F46E5' }}>
                        {vendorDeepDive.metrics?.subscribersCount}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Store Subscribers</div>
                    </div>
                    <div style={{ background: '#F8FAFC', padding: 12, borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706' }}>
                        {vendorDeepDive.inventorySummary?.totalUnitsInStock}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Physical Stock Units</div>
                    </div>
                  </div>

                  {/* Business & Inventory Summary */}
                  <div style={{ marginBottom: 20 }}>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>📦 Inventory Health</h4>
                    <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                      <div>Total SKUs: <strong>{vendorDeepDive.inventorySummary?.totalSkus}</strong></div>
                      <div>Low Stock Items: <strong style={{ color: '#D97706' }}>{vendorDeepDive.inventorySummary?.lowStockSkus}</strong></div>
                      <div>Categories: <strong>{vendorDeepDive.inventorySummary?.categories?.join(', ')}</strong></div>
                    </div>
                  </div>

                  {/* Recent Orders */}
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: 8 }}>🛍️ Recent Customer Orders</h4>
                    {(vendorDeepDive.recentOrders || []).length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {vendorDeepDive.recentOrders.map((o) => (
                          <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 6, fontSize: '0.8rem' }}>
                            <span>Order #{o.id} · {o.createdAt}</span>
                            <span><strong>₹{o.total?.toLocaleString('en-IN')}</strong> · <span className="badge badge-success">{o.status}</span></span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No customer orders placed yet.</div>
                    )}
                  </div>
                </div>

                <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      navigate(`/store/${vendorDeepDive.vendor?.storeSlug || vendorDeepDive.vendor?.id}`);
                    }}
                  >
                    Open Merchant Storefront →
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => { setInspectVendorId(null); setVendorDeepDive(null); }}
                  >
                    Close Inspector
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
