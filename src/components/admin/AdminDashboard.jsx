import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import {
  LayoutDashboard, Clock, CheckCircle, XCircle, LogOut,
  ShoppingBag, Shield, MapPin, Phone, Mail, Store
} from 'lucide-react';
import '../../styles/vendor.css';

/* ── Admin Sidebar ─────────────────────────── */
const ADMIN_NAV = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <Clock size={18} />, label: 'Pending Products', path: '/admin/pending' },
  { icon: <CheckCircle size={18} />, label: 'Approved', path: '/admin/approved' },
  { icon: <XCircle size={18} />, label: 'Rejected', path: '/admin/rejected' },
];

export function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getPendingProducts } = useProducts();
  const pendingCount = getPendingProducts().length;

  return (
    <aside className="admin-sidebar">
      <div className="vendor-sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" style={{ background: '#9333EA' }}><ShoppingBag size={20} /></div>
          <span className="sidebar-brand-name">Vendour<span>-Mart</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 36, height: 36, background: '#9333EA', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <div className="sidebar-vendor-name">Platform Admin</div>
            <div className="sidebar-vendor-type">Admin Account</div>
          </div>
        </div>
      </div>

      <nav className="vendor-sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-label">Admin Menu</div>
          {ADMIN_NAV.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={pathname === item.path ? { background: '#9333EA' } : {}}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.path === '/admin/pending' && pendingCount > 0 && (
                <span style={{ background: '#F59E0B', color: 'white', borderRadius: '9999px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="vendor-sidebar-footer">
        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>Other Portals</div>
          <button className="sidebar-nav-item" onClick={() => navigate('/shop')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left', marginBottom: 4 }}>
            🛍️ Customer Shop
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

  return (
    <div className="review-product-card">
      <div className="review-product-header">
        <img
          src={product.images[0]}
          alt={product.name}
          className="review-product-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'; }}
        />
        <div className="review-product-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span className="badge badge-primary">{product.category}</span>
            {product.condition && product.condition !== 'N/A' && (
              <span className="badge badge-info">{product.condition}</span>
            )}
          </div>
          <div className="review-product-name">{product.name}</div>
          {product.brand && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Brand: {product.brand}</div>}
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 6 }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {expanded ? product.description : product.description.slice(0, 140) + (product.description.length > 140 ? '...' : '')}
            {product.description.length > 140 && (
              <button onClick={() => setExpanded(!expanded)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', marginLeft: 4 }}>
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>

        {/* Thumbnail strip */}
        {product.images.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
            {product.images.slice(1).map((img, i) => (
              <img key={i} src={img} alt={`View ${i + 2}`} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} onError={(e) => { e.target.style.display = 'none'; }} />
            ))}
          </div>
        )}
      </div>

      {/* Specs (collapsed by default) */}
      {expanded && product.specifications && Object.keys(product.specifications).length > 0 && (
        <div style={{ padding: '0 20px 16px' }}>
          <h5 style={{ marginBottom: 8, fontSize: '0.85rem' }}>Specifications</h5>
          <table className="product-spec-table">
            <tbody>
              {Object.entries(product.specifications).map(([k, v]) => (
                <tr key={k}>
                  <td>{k}</td>
                  <td style={{ fontWeight: 600 }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
            Submitted: {new Date(product.createdAt).toLocaleDateString('en-IN')}
          </span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="review-product-footer">
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Stock: {product.quantity} units
          </div>
          <div className="review-actions">
            <button className="btn btn-success btn-sm" onClick={() => onApprove(product.id)}>
              <CheckCircle size={15} /> Approve
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

/* ── Admin Dashboard ───────────────────────── */
export default function AdminDashboard() {
  const { getPendingProducts, getApprovedProducts, getRejectedProducts, approveProduct, rejectProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Dashboard | Vendour-Mart';
  }, []);

  const pending = useMemo(() => getPendingProducts(), [getPendingProducts]);
  const approved = useMemo(() => getApprovedProducts(), [getApprovedProducts]);
  const rejected = useMemo(() => getRejectedProducts(), [getRejectedProducts]);

  const stats = useMemo(() => [
    { icon: <Clock size={24} />, label: 'Pending Review', value: pending.length, color: '#F59E0B', bg: '#FEF3C7', path: '/admin/pending' },
    { icon: <CheckCircle size={24} />, label: 'Approved', value: approved.length, color: '#10B981', bg: '#D1FAE5', path: '/admin/approved' },
    { icon: <XCircle size={24} />, label: 'Rejected', value: rejected.length, color: '#EF4444', bg: '#FEE2E2', path: '/admin/rejected' },
    { icon: <Store size={24} />, label: 'Total Products', value: pending.length + approved.length + rejected.length, color: '#4F46E5', bg: '#EEF2FF', path: '/admin/pending' },
  ], [pending.length, approved.length, rejected.length]);

  const handleApprove = useCallback((id) => {
    approveProduct(id);
    if (addToast) addToast('Product approved!', 'success');
  }, [approveProduct, addToast]);

  const handleReject = useCallback((id) => {
    rejectProduct(id);
    if (addToast) addToast('Product rejected', 'error');
  }, [rejectProduct, addToast]);

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="vendor-topbar-title">Admin Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color="#9333EA" />
            <span style={{ fontSize: '0.85rem', color: '#9333EA', fontWeight: 600 }}>Platform Administrator</span>
          </div>
        </div>
        <div className="admin-content">
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate(s.path)}>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Products */}
          {pending.length > 0 && (
            <div>
              <div className="section-title" style={{ marginBottom: 16 }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={20} color="#F59E0B" /> Pending Products ({pending.length})
                </h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/pending')}>View All</button>
              </div>
              {pending.slice(0, 3).map((p) => (
                <ProductReviewCard key={p.id} product={p} onApprove={handleApprove} onReject={handleReject} />
              ))}
              {pending.length > 3 && (
                <button className="btn btn-outline btn-full" onClick={() => navigate('/admin/pending')}>
                  View {pending.length - 3} more pending products
                </button>
              )}
            </div>
          )}

          {pending.length === 0 && (
            <div className="empty-state card">
              <CheckCircle size={56} color="#10B981" className="empty-state-icon" />
              <h3>All caught up!</h3>
              <p>No products pending review</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
