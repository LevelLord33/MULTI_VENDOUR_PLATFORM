import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useMessages } from '../../contexts/MessageContext';
import { useChatbot } from '../../contexts/ChatbotContext';
import {
  ShoppingBag, ShoppingCart, User, LogOut, Package,
  ChevronDown, Search, LayoutDashboard, Store, Shield, ArrowRightLeft,
  Globe, Check, Sun, Moon, Palette, MessageSquare, Bot
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function Navbar({ searchQuery, onSearchChange }) {
  // 1. useContext hooks
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const { compareCount } = useComparison();
  const { unreadCustomerCount, unreadVendorCount } = useMessages();
  const { openChatbot } = useChatbot();
  const { language, setLanguage, t, languages, currentLangMeta } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // 2. useState hooks
  const [dropOpen, setDropOpen] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);

  // 3. useRef hook
  const dropRef = useRef(null);
  const langDropRef = useRef(null);

  // 4. useCallback hooks for event and navigation handlers
  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
    setDropOpen(false);
  }, [logout, navigate]);

  const toggleDropdown = useCallback(() => {
    setDropOpen((prev) => !prev);
    setLangDropOpen(false);
  }, []);

  const toggleLangDropdown = useCallback(() => {
    setLangDropOpen((prev) => !prev);
    setDropOpen(false);
  }, []);

  const navigateTo = useCallback((path) => {
    navigate(path);
    setDropOpen(false);
    setLangDropOpen(false);
  }, [navigate]);

  // 5. useEffect hooks for event listeners (click outside & Escape key)
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
      if (langDropRef.current && !langDropRef.current.contains(e.target)) {
        setLangDropOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setDropOpen(false);
        setLangDropOpen(false);
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
            <span className="platform-tag">⚡ {t('platformTag', 'Vendor Hub — Multi-Vendor Marketplace')}</span>
          </div>
          <div className="portal-topstrip-right">
            <span className="portal-label">Portals:</span>
            <button
              className={`portal-chip ${user?.type === 'customer' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'customer' ? '/shop' : '/login')}
              title="Browse & buy products as a customer"
            >
              🛍️ {t('customerShop', 'Customer Shop')}
            </button>
            <button
              className="portal-chip"
              onClick={() => navigateTo('/stores')}
              title="Explore verified physical stores and merchant storefronts"
            >
              🏬 {t('exploreStores', 'Explore Stores')}
            </button>
            <button
              className={`portal-chip ${user?.type === 'vendor' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'vendor' ? '/vendor/dashboard' : '/vendor/login')}
              title="Manage store & list products as a vendor"
            >
              🏪 {t('vendorPortal', 'Vendor Portal')}
            </button>
            <button
              className={`portal-chip ${user?.type === 'admin' ? 'active' : ''}`}
              onClick={() => navigateTo(user?.type === 'admin' ? '/admin/dashboard' : '/admin/login')}
              title="Review & approve products as platform admin"
            >
              🛡️ {t('adminPortal', 'Admin Portal')}
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
          <span className="navbar-brand-name">Vendor<span>Hub</span></span>
        </Link>

        {/* Search — customer only */}
        {user?.type === 'customer' && (
          <div className="navbar-search">
            <Search size={16} className="navbar-search-icon" />
            <input
              type="text"
              placeholder={t('searchPlaceholder', 'Search products, brands, categories...')}
              value={searchQuery || ''}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {/* Language Selector Dropdown */}
          <div style={{ position: 'relative' }} ref={langDropRef}>
            <button
              type="button"
              className="nav-lang-btn"
              onClick={toggleLangDropdown}
              title={t('language', 'Select Language')}
            >
              <Globe size={15} />
              <span>{currentLangMeta.native}</span>
              <ChevronDown size={12} />
            </button>

            {langDropOpen && (
              <div className="lang-dropdown-menu">
                <div style={{ padding: '8px 12px', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                  Language / மொழி / ഭാഷ / భాష / ಭಾಷೆ / भाषा
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    className={`lang-item-btn ${language === l.code ? 'active' : ''}`}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropOpen(false);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{l.flag}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{l.native}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{l.name}</div>
                      </div>
                    </div>
                    {language === l.code && <Check size={14} color="var(--primary)" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Official Website Light / Dark Theme Toggle */}
          <button
            type="button"
            className={`theme-toggle-switch ${isDark ? 'dark' : 'light'}`}
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span className="theme-toggle-track">
              <span className="theme-toggle-thumb">
                {isDark ? (
                  <Moon size={12} className="theme-icon moon-icon" />
                ) : (
                  <Sun size={12} className="theme-icon sun-icon" />
                )}
              </span>
            </span>
          </button>

          {/* HubBot AI Assistant Action Button */}
          <button
            className="nav-icon-btn"
            onClick={() => openChatbot()}
            title="HubBot AI Assistant"
            style={{ color: 'var(--primary)', position: 'relative' }}
          >
            <Bot size={20} />
          </button>

          {user?.type === 'customer' && (
            <>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/compare')} title={t('compare', 'Compare')}>
                <ArrowRightLeft size={19} />
                {compareCount > 0 && <span className="nav-badge" style={{ background: 'var(--primary)' }}>{compareCount}</span>}
              </button>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/messages')} title={t('messages', 'Messages')}>
                <MessageSquare size={19} />
                {unreadCustomerCount > 0 && <span className="nav-badge" style={{ background: 'var(--primary)' }}>{unreadCustomerCount}</span>}
              </button>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/cart')} title={t('cart', 'Cart')}>
                <ShoppingCart size={20} />
                {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
              </button>
              <button className="nav-icon-btn" onClick={() => navigateTo('/shop/orders')} title={t('orders', 'Orders')}>
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
                    <span style={{ display: 'inline-block', marginTop: 4, padding: '2px 8px', borderRadius: 4, background: user.type === 'admin' ? '#FEE2E2' : user.type === 'vendor' ? '#FEF3C7' : '#EEF2FF', color: user.type === 'admin' ? '#991B1B' : user.type === 'vendor' ? '#92400E' : 'var(--primary)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'capitalize' }}>
                      {user.type} Portal
                    </span>
                  </div>

                  {user.type === 'customer' && (
                    <>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/profile')}>
                        <User size={16} /> {t('profile', 'My Profile')}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/messages')}>
                        <MessageSquare size={16} /> {t('messages', 'Messages & Inquiries')} {unreadCustomerCount > 0 ? `(${unreadCustomerCount})` : ''}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/orders')}>
                        <Package size={16} /> {t('orders', 'My Orders & Tracking')}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/shop/compare')}>
                        <ArrowRightLeft size={16} /> {t('compare', 'Compare Products')} {compareCount > 0 ? `(${compareCount})` : ''}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/stores')}>
                        <Store size={16} color="var(--primary)" /> {t('exploreStores', 'Explore Stores & Brands')}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => { openChatbot(); setDropOpen(false); }}>
                        <Bot size={16} color="var(--primary)" /> {t('helpSupport', 'AI Support (HubBot)')}
                      </button>
                    </>
                  )}

                  {user.type === 'vendor' && (
                    <>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/dashboard')}>
                        <LayoutDashboard size={16} /> Vendor Dashboard
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/messages')}>
                        <MessageSquare size={16} color="var(--primary)" /> Customer Inbox {unreadVendorCount > 0 ? `(${unreadVendorCount})` : ''}
                      </button>
                      <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/store-builder')}>
                        <Palette size={16} color="var(--primary)" /> Store Builder
                      </button>
                    </>
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
                      <ShoppingBag size={16} color="var(--primary)" /> {t('customerShop', 'Customer Shop')}
                    </button>
                  )}
                  {user.type !== 'vendor' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/vendor/login')}>
                      <Store size={16} color="#D97706" /> {t('vendorPortal', 'Vendor Portal')}
                    </button>
                  )}
                  {user.type !== 'admin' && (
                    <button className="nav-dropdown-item" onClick={() => navigateTo('/admin/login')}>
                      <Shield size={16} color="#DC2626" /> {t('adminPortal', 'Admin Portal')}
                    </button>
                  )}

                  <div className="divider" />
                  <button className="nav-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} /> {t('logout', 'Sign Out')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className="btn btn-outline"
                onClick={() => navigateTo('/register')}
                style={{ padding: '7px 14px', fontSize: '0.85rem' }}
              >
                {t('register', 'Register')}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigateTo('/login')}
                style={{ padding: '7px 16px', fontSize: '0.85rem' }}
              >
                {t('login', 'Sign In')}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
