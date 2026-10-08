import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Store, Shield, CheckCircle, Star, Truck, ArrowRight, UserCheck, LogOut, ArrowLeft } from 'lucide-react';
import '../styles/auth.css';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCustomerClick = () => {
    navigate('/shop');
  };

  const handleVendorClick = () => {
    if (user?.type === 'vendor') {
      navigate('/vendor/dashboard');
    } else {
      navigate('/vendor/login');
    }
  };

  return (
    <div className="landing-hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Navigation Strip */}
      <header style={{
        width: '100%',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(8px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} color="white" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
            Vendor<span style={{ color: '#FCD34D' }}>Hub</span>
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/shop')}
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', padding: '7px 16px', borderRadius: 10, fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🛍️ Browse Marketplace
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/stores')}
            style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', padding: '7px 16px', borderRadius: 10, fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
          >
            🏬 Explore Stores
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (user.type === 'customer') navigate('/shop');
                  else if (user.type === 'vendor') navigate('/vendor/dashboard');
                  else if (user.type === 'admin') navigate('/admin/dashboard');
                }}
                style={{ padding: '7px 16px', fontSize: '0.84rem' }}
              >
                Dashboard ({user.fullName?.split(' ')[0] || user.businessName || user.type}) →
              </button>
              {user.type === 'customer' && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => navigate('/vendor/login')}
                  style={{ background: '#F59E0B', borderColor: '#D97706', color: '#1E293B', padding: '7px 14px', borderRadius: 10, fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  🏪 Vendor Portal
                </button>
              )}
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#FCA5A5', padding: '7px 10px', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn"
                onClick={() => navigate('/login')}
                style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', padding: '7px 14px', borderRadius: 10, fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}
              >
                🛍️ Customer Sign In
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate('/vendor/login')}
                style={{ padding: '7px 16px', fontSize: '0.84rem', background: '#F59E0B', borderColor: '#D97706', color: '#1E293B', fontWeight: 700 }}
              >
                🏪 Vendor Sign In / Portal
              </button>
            </div>
          )}
        </nav>
      </header>

      <div className="landing-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Logged in Welcome Toast Banner */}
        {user && (
          <div style={{
            maxWidth: 680,
            margin: '0 auto 24px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: 12,
            padding: '10px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            backdropFilter: 'blur(8px)',
            color: 'white',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.88rem' }}>
              <UserCheck size={18} color="#10B981" />
              <span>Signed in as <strong>{user.fullName || user.businessName || user.email}</strong> ({user.type})</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-sm btn-primary"
                onClick={() => {
                  if (user.type === 'customer') navigate('/shop');
                  else if (user.type === 'vendor') navigate('/vendor/dashboard');
                  else if (user.type === 'admin') navigate('/admin/dashboard');
                }}
                style={{ padding: '4px 12px', fontSize: '0.78rem' }}
              >
                Go to Portal →
              </button>
              {user.type === 'customer' && (
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => navigate('/vendor/login')}
                  style={{ background: '#F59E0B', color: '#1E293B', fontWeight: 700, padding: '4px 12px', fontSize: '0.78rem', borderRadius: 8, border: 'none' }}
                >
                  🏪 Switch to Vendor Portal →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.15)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <ShoppingBag size={26} color="white" />
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'white', letterSpacing: '-0.03em' }}>
            Vendor<span style={{ color: '#FCD34D' }}> Hub</span>
          </span>
        </div>

        <div className="landing-badge">
          <Star size={13} fill="#FCD34D" color="#FCD34D" />
          Multi-Vendor E-Commerce Platform
        </div>

        <h1 className="landing-title">
          Connect. Buy. Sell.<br />
          <span className="highlight">Locally & Smartly.</span>
        </h1>

        <p className="landing-desc">
          VendorHub brings local vendors and customers together on one powerful platform.
          Discover verified merchant stores, compare live stock, and shop authentic products.
        </p>

        {/* Portal Cards */}
        <div className="landing-portal-cards">
          {/* Customer */}
          <div className="portal-card portal-customer" onClick={handleCustomerClick}>
            <div className="portal-card-top">
              <div className="portal-card-icon">
                <ShoppingBag size={32} color="#4F46E5" />
              </div>
              <h3>Shop as Customer</h3>
              <p>Browse thousands of products and verified storefronts across India</p>
            </div>
            <div className="portal-card-actions">
              <button
                type="button"
                className="portal-card-btn portal-card-btn-customer"
                onClick={(e) => { e.stopPropagation(); navigate('/shop'); }}
              >
                Start Shopping →
              </button>
              <div className="portal-card-link portal-card-link-customer">
                <span onClick={(e) => { e.stopPropagation(); navigate('/login'); }}>
                  Customer Sign In / Register
                </span>
              </div>
            </div>
          </div>

          {/* Vendor */}
          <div className="portal-card portal-vendor" onClick={handleVendorClick}>
            <div className="portal-card-top">
              <div className="portal-card-icon">
                <Store size={32} color="#10B981" />
              </div>
              <h3>Sell on VendorHub</h3>
              <p>Reach thousands of local customers by listing your products and stores</p>
            </div>
            <div className="portal-card-actions">
              {user?.type === 'vendor' ? (
                <>
                  <button
                    type="button"
                    className="portal-card-btn portal-card-btn-vendor"
                    onClick={(e) => { e.stopPropagation(); navigate('/vendor/dashboard'); }}
                  >
                    Go to Vendor Dashboard →
                  </button>
                  <div className="portal-card-link portal-card-link-vendor" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <span onClick={(e) => { e.stopPropagation(); navigate('/vendor/store-builder'); }}>
                      Maintain Storefront
                    </span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span onClick={(e) => { e.stopPropagation(); navigate('/vendor/inventory'); }}>
                      Manage Inventory
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="portal-card-btn portal-card-btn-vendor"
                    onClick={(e) => { e.stopPropagation(); navigate('/vendor/register'); }}
                  >
                    Register Store / Start Selling →
                  </button>
                  <div className="portal-card-link portal-card-link-vendor" style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <span onClick={(e) => { e.stopPropagation(); navigate('/vendor/login'); }} style={{ fontWeight: 700 }}>
                      Vendor Sign In
                    </span>
                    <span style={{ opacity: 0.4 }}>•</span>
                    <span onClick={(e) => { e.stopPropagation(); navigate('/vendor/register'); }}>
                      Register Storefront
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
          {[
            { icon: <CheckCircle size={16} />, text: 'Verified Vendors' },
            { icon: <Truck size={16} />, text: 'Fast Delivery' },
            { icon: <Shield size={16} />, text: 'Secure Platform' },
          ].map((item) => (
            <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}>
              <span style={{ color: '#FCD34D' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
