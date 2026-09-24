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

  const { login, registerVendor } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
          <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: 10, padding: 4, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => { setMode('login'); setErrors({}); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 8,
                border: 'none',
                background: mode === 'login' ? 'white' : 'transparent',
                color: mode === 'login' ? '#7C3AED' : 'var(--text-muted)',
                fontWeight: mode === 'login' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <LogIn size={15} /> Vendor Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setErrors({}); }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 8,
                border: 'none',
                background: mode === 'register' ? 'white' : 'transparent',
                color: mode === 'register' ? '#7C3AED' : 'var(--text-muted)',
                fontWeight: mode === 'register' ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              <UserPlus size={15} /> Register Store
            </button>
          </div>

          <h1 className="auth-form-title">
            {mode === 'login' ? 'Vendor Login' : 'Register Your Store'}
          </h1>
          <p className="auth-form-sub">
            {mode === 'login' ? 'Access your merchant dashboard & orders' : 'Start selling verified products on VendorHub today'}
          </p>

          {mode === 'login' ? (
            <button
              type="button"
              onClick={fillDemo}
              style={{ marginBottom: 16, background: '#F5F3FF', color: '#7C3AED', border: '1px solid #DDD6FE', borderRadius: 8, padding: '9px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              🧪 Quick Sign In with Demo Vendor Account
            </button>
          ) : (
            <button
              type="button"
              onClick={fillDemoRegister}
              style={{ marginBottom: 16, background: '#F0FDF4', color: '#16A34A', border: '1px solid #BBF7D0', borderRadius: 8, padding: '9px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
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
                    <input className={`form-input ${errors.businessName?'error':''}`} name="businessName" placeholder="TechZone Electronics" value={form.businessName} onChange={handleChange} />
                    {errors.businessName && <span className="form-error">{errors.businessName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Owner Name</label>
                    <input className={`form-input ${errors.ownerName?'error':''}`} name="ownerName" placeholder="Rajesh Kumar" value={form.ownerName} onChange={handleChange} />
                    {errors.ownerName && <span className="form-error">{errors.ownerName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input className={`form-input ${errors.mobile?'error':''}`} name="mobile" placeholder="9876543210" value={form.mobile} onChange={handleChange} />
                  {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className={`form-input ${errors.email?'error':''}`} type="email" name="email" placeholder="you@business.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`form-input ${errors.password?'error':''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Business Address</label>
                  <input className={`form-input ${errors.businessAddress?'error':''}`} name="businessAddress" placeholder="Street, Area" value={form.businessAddress} onChange={handleChange} />
                  {errors.businessAddress && <span className="form-error">{errors.businessAddress}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">City / Location</label>
                  <input className={`form-input ${errors.location?'error':''}`} name="location" placeholder="New Delhi, Delhi" value={form.location} onChange={handleChange} />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>
              </>
            )}

            <button type="submit" className="btn btn-full btn-lg" disabled={loading}
              style={{ background: '#7C3AED', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
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
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Portals</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate('/login')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#EEF2FF', color: '#3730A3', border: '1px solid #C7D2FE', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseOver={e => e.currentTarget.style.background='#C7D2FE'}
                onMouseOut={e => e.currentTarget.style.background='#EEF2FF'}
              >
                <ShoppingBag size={14} /> Customer Login
              </button>
              <button
                onClick={() => navigate('/admin/login')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#FEE2E2', color: '#991B1B', border: '1px solid #FECACA', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseOver={e => e.currentTarget.style.background='#FECACA'}
                onMouseOut={e => e.currentTarget.style.background='#FEE2E2'}
              >
                <Shield size={14} /> Admin Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
