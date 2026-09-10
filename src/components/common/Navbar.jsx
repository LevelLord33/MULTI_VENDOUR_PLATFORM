import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import {
  ShoppingBag, ShoppingCart, User, LogOut, Package,
  ChevronDown, Search, LayoutDashboard, Store, Shield
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function Navbar({ searchQuery, onSearchChange }) {
  // 1. useContext hooks
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  // 2. useState hook
  const [dropOpen, setDropOpen] = useState(false);

  // 3. useRef hook
  const dropRef = useRef(null);

  // 4. useCallback hooks for event and navigation handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setDropOpen(false);
  }, [logout, navigate]);

  const toggleDropdown = useCallback(() => {
    setDropOpen((prev) => !prev);
  }, []);

  const navigateTo = useCallback((path) => {
    navigate(path);
    setDropOpen(false);
  }, [navigate]);

  // 5. useEffect hooks for event listeners (click outside & Escape key)
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDropOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // 6. useMemo hooks for computed user details and logo target
  const displayName = useMemo(() => {
    return user?.fullName || user?.businessName || user?.name || 'User';
  }, [user]);

  const avatarUrl = useMemo(() => {
    if (user?.avatar) return user.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4F46E5&color=fff`;
  }, [user, displayName]);

  const logoTarget = useMemo(() => {
    if (user?.type === 'customer') return '/shop';
    if (user?.type === 'vendor') return '/vendor/dashboard';
    if (user?.type === 'admin') return '/admin/dashboard';
    return '/';
  }, [user?.type]);

  return (
    <nav className="navbar">
      {/* ── Top Portal Switcher Strip ── */}
      <div className="portal-topstrip">
        <div className="portal-topstrip-inner">
          <div className="portal-topstrip-left">
            <span className="platform-tag">⚡ India's Smart Multi-Vendor Marketplace</span>
          </div>
          <div className="portal-topstrip-right">
            <span className="portal-label">Portals:</span>
            <button
              className={`portal-chip ${user?.type === 'customer' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'customer' ? '/shop' : '/login')}
              title="Browse & buy products as a customer"
            >
              🛍️ Customer Shop
            </button>
            <button
              className={`portal-chip ${user?.type === 'vendor' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'vendor' ? '/vendor/dashboard' : '/vendor/login')}
              title="Manage store & list products as a vendor"
            >
              🏪 Vendor Portal
            </button>
            <button
              className={`portal-chip ${user?.type === 'admin' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'admin' ? '/admin/dashboard' : '/admin/login')}
              title="Review & approve products as platform admin"
            >
              🛡️ Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="navbar-inner">
        {/* Logo */}
        <Link to={logoTarget} className="navbar-logo">
          <div className="navbar-logo-icon">
            <ShoppingBag size={20} />
          </div>
          <span className="navbar-brand-name">Vendour<span>-Mart</span></span>
        </Link>

        {/* Search — customer only */}
        {user?.type === 'customer' && (
          <div className="navbar-search">
            <Search size={16} className="navbar-search-icon" />
            <input
              type="text"
              placeholder="Search products, brands, categories... (Press /)"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {user?.type === 'customer' && (
            <>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/cart')} title="Cart">
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </button>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/orders')} title="Orders">
                <Package size={20} />
              </button>
            </>
          )}

          {/* User Menu */}
          {user ? (
            <div className="nav-dropdown-wrap" ref={dropRef}>
              <button className="nav-user-btn" onClick={toggleDropdown}>
                <img src={avatarUrl} alt={displayName} className="nav-user-avatar" />
                <span className="nav-user-name">{displayName.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--text-muted)" />
              </button>

              {dropOpen && (
                <div className="nav-dropdown">
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-name">{displayName}</div>
                    <div className="nav-dropdown-email">{user.email}</div>
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 4, background: user.type === 'admin' ? '#FEE2E2' : user.type === 'vendor' ? '#FEF3C7' : '#EEF2FF', color: user.type === 'admin' ? '#991B1B' : user.type === 'vendor' ? '#92400E' : '#4F46E5', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
                      {user.type} Portal
                    </span>
                  </div>

                  {user.type === 'customer' && (
                    <>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/profile')}>
                        <User size={16} /> My Profile
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/orders')}>
                        <Package size={16} /> My Orders
                      </button>
                    </>
                  )}

                  {user.type === 'vendor' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/dashboard')}>
                      <LayoutDashboard size={16} /> Vendor Dashboard
                    </button>
                  )}

                  {user.type === 'admin' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/admin/dashboard')}>
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </button>
                  )}

                  <div className="divider" />
                  <div style={{ padding: '6px 16px 2px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Switch Portal
                  </div>
                  {user.type !== 'customer' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/shop')}>
                      <ShoppingBag size={16} color="#4F46E5" /> Customer Shop
                    </button>
                  )}
                  {user.type !== 'vendor' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/login')}>
                      <Store size={16} color="#D97706" /> Vendor Portal
                    </button>
                  )}
                  {user.type !== 'admin' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/admin/login')}>
                      <Shield size={16} color="#DC2626" /> Admin Portal
                    </button>
                  )}

                  <div className="divider" />
                  <button className="nav-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => navigateTo('/login')} style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
