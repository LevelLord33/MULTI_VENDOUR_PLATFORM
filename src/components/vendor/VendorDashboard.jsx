import { useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import {
  LayoutDashboard, Package, PlusCircle, LogOut,
  ShoppingBag, Clock, CheckCircle, XCircle
} from 'lucide-react';
import '../../styles/vendor.css';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/vendor/dashboard' },
  { icon: <Package size={18} />, label: 'My Products', path: '/vendor/products' },
  { icon: <PlusCircle size={18} />, label: 'Add Product', path: '/vendor/add-product' },
];

export function VendorSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.businessName || 'V')}&background=4F46E5&color=fff`;

  return (
    <aside className="vendor-sidebar">
      <div className="vendor-sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><ShoppingBag size={20} /></div>
          <span className="sidebar-brand-name">Vendour<span>-Mart</span></span>
        </div>
        <div className="sidebar-vendor-info">
          <img src={avatarUrl} alt={user?.businessName} className="sidebar-vendor-avatar" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.businessName || 'V')}&background=4F46E5&color=fff`; }} />
          <div>
            <div className="sidebar-vendor-name">{user?.businessName}</div>
            <div className="sidebar-vendor-type">Vendor Account</div>
          </div>
        </div>
      </div>

      <nav className="vendor-sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-label">Menu</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              {item.icon} {item.label}
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
          <button className="sidebar-nav-item" onClick={() => navigate('/admin/login')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left' }}>
            🛡️ Admin Portal
          </button>
        </div>
        <button className="sidebar-nav-item" onClick={handleLogout} style={{ color: '#F87171' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const { getVendorProducts } = useProducts();
  const navigate = useNavigate();

  // useEffect for document title
  useEffect(() => {
    document.title = 'Vendor Dashboard | Vendour-Mart';
  }, []);

  // useMemo for vendor products & counts
  const products = useMemo(() => {
    return user?.id ? getVendorProducts(user.id) : [];
  }, [user, getVendorProducts]);

  const approved = useMemo(() => products.filter((p) => p.status === 'approved').length, [products]);
  const pending = useMemo(() => products.filter((p) => p.status === 'pending').length, [products]);
  const rejected = useMemo(() => products.filter((p) => p.status === 'rejected').length, [products]);

  const stats = useMemo(() => [
    { icon: <Package size={24} />, label: 'Total Products', value: products.length, color: '#4F46E5', bg: '#EEF2FF' },
    { icon: <CheckCircle size={24} />, label: 'Approved', value: approved, color: '#10B981', bg: '#D1FAE5' },
    { icon: <Clock size={24} />, label: 'Pending Review', value: pending, color: '#F59E0B', bg: '#FEF3C7' },
    { icon: <XCircle size={24} />, label: 'Rejected', value: rejected, color: '#EF4444', bg: '#FEE2E2' },
  ], [products.length, approved, pending, rejected]);

  // useCallback for navigation triggers
  const handleAddProduct = useCallback(() => {
    navigate('/vendor/add-product');
  }, [navigate]);

  const handleManageProducts = useCallback(() => {
    navigate('/vendor/products');
  }, [navigate]);

  return (
    <div className="vendor-layout">
      <VendorSidebar />
      <div className="vendor-main">
        <div className="vendor-topbar">
          <div className="vendor-topbar-title">Dashboard</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Welcome back, {user?.ownerName?.split(' ')[0] || 'Vendor'}! 👋
          </div>
        </div>

        <div className="vendor-content">
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card" style={{ marginBottom: 28 }}>
            <div className="card-body">
              <h3 style={{ marginBottom: 16 }}>Quick Actions</h3>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="btn btn-primary" onClick={handleAddProduct}>
                  <PlusCircle size={16} /> Add New Product
                </button>
                <button className="btn btn-outline" onClick={handleManageProducts}>
                  <Package size={16} /> Manage Products
                </button>
              </div>
            </div>
          </div>

          {/* Recent Products */}
          <div className="card">
            <div className="card-body">
              <div className="section-title">
                <h3>Recent Products</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vendor/products')}>
                  View All
                </button>
              </div>
              {products.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px' }}>
                  <Package size={48} className="empty-state-icon" />
                  <h3>No products yet</h3>
                  <p>Add your first product to get started</p>
                  <button className="btn btn-primary" onClick={() => navigate('/vendor/add-product')}>
                    <PlusCircle size={16} /> Add Product
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                      <img src={p.images[0]} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{p.price.toLocaleString('en-IN')} · {p.quantity} in stock</div>
                      </div>
                      <span className={`badge badge-${p.status}`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
