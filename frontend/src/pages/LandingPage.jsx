import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { ShoppingBag, Store, Shield, CheckCircle, Star, Truck } from 'lucide-react';
import '../styles/auth.css';

export default function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.type === 'customer') navigate('/shop');
      if (user.type === 'vendor') navigate('/vendor/dashboard');
      if (user.type === 'admin') navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="landing-hero">
      <div className="landing-content">
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '28px' }}>
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
          Discover products, support local businesses, and shop smarter.
        </p>

        {/* Portal Cards */}
        <div className="landing-portal-cards">
          {/* Customer */}
          <div className="portal-card portal-customer" onClick={() => navigate('/login')}>
            <div className="portal-card-icon">
              <ShoppingBag size={32} color="#4F46E5" />
            </div>
            <h3>Shop as Customer</h3>
            <p>Browse thousands of products from verified local vendors</p>
            <button className="btn btn-primary btn-full">
              Start Shopping →
            </button>
          </div>

          {/* Vendor */}
          <div className="portal-card portal-vendor" onClick={() => navigate('/vendor/login')}>
            <div className="portal-card-icon">
              <Store size={32} color="#10B981" />
            </div>
            <h3>Sell on VendorHub</h3>
            <p>Reach thousands of local customers by listing your products</p>
            <button className="btn btn-full" style={{ background: '#F59E0B', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>
              Start Selling →
            </button>
          </div>

          {/* Admin */}
          <div className="portal-card portal-admin" onClick={() => navigate('/admin/login')}>
            <div className="portal-card-icon">
              <Shield size={32} color="#DC2626" />
            </div>
            <h3>Admin Portal</h3>
            <p>Review and approve vendor products to maintain quality</p>
            <button className="btn btn-full" style={{ background: '#EF4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>
              Admin Login →
            </button>
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
