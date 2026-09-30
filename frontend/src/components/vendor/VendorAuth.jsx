import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Store, Eye, EyeOff, ArrowLeft, TrendingUp, Users, Package, ShoppingBag, Shield, LogIn, UserPlus } from 'lucide-react';
import '../../styles/auth.css';

export default function VendorAuth({ initialMode }) {
  const location = useLocation();
  const [mode, setMode] = useState(() => {
    if (initialMode) return initialMode;
    if (location.pathname.includes('register') || location.pathname.includes('signup')) return 'register';
    return 'login';
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    businessName: '', ownerName: '', email: '', mobile: '', password: '',
    businessAddress: '', location: '',
  });

  const { login, registerVendor, oauthLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleVendorGoogleOAuth = async () => {
    setLoading(true);
    const mockVendorProfile = {
      provider: 'google',
      email: 'rajesh@techzone.in',
      name: 'Rajesh Kumar (TechZone)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop',
      googleId: 'google_vendor_882910',
      role: 'vendor'
    };
    const res = await oauthLogin(mockVendorProfile);
    setLoading(false);
    if (res?.success) {
      addToast('Vendor authenticated via Google OAuth 2.0!', 'success');
      navigate('/vendor/dashboard');
    } else {
      addToast('Google OAuth failed.', 'error');
    }
  };

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    } else if (location.pathname.includes('register') || location.pathname.includes('signup')) {
      setMode('register');
    } else if (location.pathname === '/vendor/login') {
      setMode('login');
    }
  }, [location.pathname, initialMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Password 6+ chars';
    if (mode === 'register') {
      if (!form.businessName) errs.businessName = 'Business name required';
      if (!form.ownerName) errs.ownerName = 'Owner name required';
      if (!form.mobile || form.mobile.length < 10) errs.mobile = 'Valid mobile required';
      if (!form.businessAddress) errs.businessAddress = 'Business address required';
      if (!form.location) errs.location = 'Location required';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    let result;
    if (mode === 'login') {
      result = await login('vendor', form.email, form.password);
    } else {
      result = await registerVendor(form);
    }
    setLoading(false);
    if (result.success) {
      addToast(mode === 'login' ? 'Welcome back, Vendor!' : 'Vendor store registered and logged in successfully!', 'success');
      navigate('/vendor/dashboard');
    } else {
      addToast(result.message, 'error');
    }
  };

  const fillDemo = () => {
    setForm({ ...form, email: 'rajesh@techzone.in', password: 'Vendor@123' });
    setErrors({});
  };

  const fillDemoRegister = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setForm({
      businessName: `Apex Retailers ${randomId}`,
      ownerName: 'Vikram Malhotra',
      email: `vikram${randomId}@apexretail.in`,
      mobile: '9811223344',
      password: 'Vendor@123',
      businessAddress: 'Unit 12B, Okhla Industrial Area Phase III',
      location: 'New Delhi, Delhi',
    });
    setErrors({});
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel-left" style={{ background: 'linear-gradient(145deg, #1A0533 0%, #4A1A80 60%, #7C3AED 100%)' }}>
        <div className="auth-brand">
          <div className="auth-brand-logo"><Store size={22} color="#7C3AED" /></div>
          <span className="auth-brand-name">Vendor<span style={{color:'#FCD34D'}}>Hub</span></span>
        </div>
        <h2 className="auth-tagline">
          Grow Your<br />
          Business with<br />
          <span>Smart Selling</span>
        </h2>
        <p className="auth-sub">
          List your products, reach thousands of local customers, and manage your store — all from one dashboard.
        </p>
        <div className="auth-features">
          {[
            { icon: <TrendingUp size={14} />, text: 'Reach local customers easily' },
            { icon: <Package size={14} />, text: 'Easy product management' },
            { icon: <Users size={14} />, text: 'Grow your vendor network' },
          ].map((f) => (
            <div key={f.text} className="auth-feature-item">
              <div className="auth-feature-icon">{f.icon}</div>
              {f.text}
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <button className="auth-back" onClick={() => navigate('/')}>
            <ArrowLeft size={16} /> Back to Home
          </button>

          {/* Mode Switcher Tabs */}
          <div className="auth-mode-tabs">
            <button
              type="button"
              className={`auth-mode-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrors({}); }}
            >
              <LogIn size={15} /> Vendor Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrors({}); }}
            >
              <UserPlus size={15} /> Register Store
            </button>
          </div>

          <h1 className="auth-form-title">
            {mode === 'login' ? 'Vendor Login' : 'Register Your Store'}
          </h1>
          <p className="auth-form-sub">
            {mode === 'login' ? 'Access your merchant dashboard & live inventory' : 'Start selling verified products on VendorHub today'}
          </p>

          {/* Google OAuth 2.0 Button */}
          <button
            type="button"
            onClick={handleVendorGoogleOAuth}
            className="btn btn-outline btn-full"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '11px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: '0.9rem',
              background: '#fff',
              color: '#374151',
              border: '1.5px solid var(--border)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              marginBottom: 16,
              cursor: 'pointer'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google (Merchant OAuth 2.0)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or sign in with password</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          {mode === 'login' ? (
            <div style={{ marginBottom: 18, background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>⚡ Verified Vendor Accounts (1-Click Fill)</span>
                <span style={{ color: '#7C3AED', fontSize: '0.7rem' }}>Pass: Vendor@123</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 6 }}>
                {[
                  { name: 'TechZone', email: 'rajesh@techzone.in', cat: 'Electronics' },
                  { name: 'StyleHub', email: 'priya@stylehub.in', cat: 'Fashion' },
                  { name: 'FreshBazaar', email: 'vikram@freshbazaar.in', cat: 'Grocery' },
                  { name: 'ChaiCulture', email: 'vikram@chaiculture.in', cat: 'Gourmet Tea & Spices' },
                  { name: 'Lumina Lighting', email: 'sneha@lumina.in', cat: 'Smart Lighting' },
                  { name: 'Himalayan Pure', email: 'rahul@himalayanpure.in', cat: 'Organic Honey & Ghee' },
                  { name: 'Aethelgard', email: 'kabir@aethelgard.in', cat: 'Leather Works' },
                  { name: 'Apex Fitness', email: 'harpreet@apexfitness.in', cat: 'Gym & Barbells' },
                  { name: 'Kaveri Silks', email: 'meenakshi@kaverisilks.in', cat: 'Kanchipuram Silks' },
                  { name: 'AutoCraft Pro', email: 'gaurav@autocraft.in', cat: '4K Dash Cams & Auto' }
                ].map((v) => (
                  <button
                    key={v.email}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, email: v.email, password: 'Vendor@123' });
                      setErrors({});
                    }}
                    style={{
                      background: form.email === v.email ? 'rgba(124, 58, 237, 0.15)' : 'white',
                      border: `1.5px solid ${form.email === v.email ? '#7C3AED' : 'var(--border)'}`,
                      borderRadius: 8,
                      padding: '6px 8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.72rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: form.email === v.email ? '#7C3AED' : 'var(--text-primary)' }}>{v.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{v.cat}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="auth-demo-btn"
              style={{ borderColor: 'var(--success, #16A34A)', color: 'var(--success, #16A34A)', background: 'rgba(22, 163, 74, 0.08)', marginBottom: 16 }}
              onClick={fillDemoRegister}
            >
              🧪 Auto-fill Sample Store Registration
            </button>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <input className={`form-input ${errors.businessName ? 'error' : ''}`} name="businessName" placeholder="TechZone Electronics" value={form.businessName} onChange={handleChange} />
                    {errors.businessName && <span className="form-error">{errors.businessName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Owner Name</label>
                    <input className={`form-input ${errors.ownerName ? 'error' : ''}`} name="ownerName" placeholder="Rajesh Kumar" value={form.ownerName} onChange={handleChange} />
                    {errors.ownerName && <span className="form-error">{errors.ownerName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input className={`form-input ${errors.mobile ? 'error' : ''}`} name="mobile" placeholder="9876543210" value={form.mobile} onChange={handleChange} />
                  {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" placeholder="you@business.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-password-wrapper">
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPass(!showPass)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <input className={`form-input ${errors.businessAddress ? 'error' : ''}`} name="businessAddress" placeholder="Street, Area" value={form.businessAddress} onChange={handleChange} />
                  {errors.businessAddress && <span className="form-error">{errors.businessAddress}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">City / Location</label>
                  <input className={`form-input ${errors.location ? 'error' : ''}`} name="location" placeholder="New Delhi, Delhi" value={form.location} onChange={handleChange} />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>
              </>
            )}

            <button
              type="submit"
              className="btn btn-full btn-lg"
              disabled={loading}
              style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontWeight: 700, cursor: 'pointer', fontSize: '0.96rem', marginTop: 6 }}
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to Dashboard' : 'Create Vendor Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>New vendor? <button onClick={() => setMode('register')}>Register your store</button></>
            ) : (
              <>Already registered? <button onClick={() => setMode('login')}>Sign in</button></>
            )}
          </div>

          {/* Portal Switcher */}
          <div className="auth-portal-strip">
            <p className="auth-portal-label">Other Portals</p>
            <div className="auth-portal-grid">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="auth-portal-btn customer"
              >
                <ShoppingBag size={15} /> Customer Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="auth-portal-btn admin"
              >
                <Shield size={15} /> Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
