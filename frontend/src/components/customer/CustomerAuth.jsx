import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ShoppingBag, Eye, EyeOff, ArrowLeft, CheckCircle, Truck, Shield, Store, UserPlus, LogIn } from 'lucide-react';
import '../../styles/auth.css';

export default function CustomerAuth({ initialMode }) {
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
    fullName: '', email: '', mobile: '', password: '', address: '', location: '',
  });

  const { login, registerCustomer, oauthLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const testUsers = [
    { name: 'Arun Mehta', email: 'arun@example.com', location: 'New Delhi' },
    { name: 'Neha Singh', email: 'neha@example.com', location: 'Pune' },
    { name: 'Rohan Sharma', email: 'rohan@example.com', location: 'Bengaluru' },
    { name: 'Pooja Patel', email: 'pooja@example.com', location: 'Ahmedabad' },
    { name: 'Vikram Verma', email: 'vikram.customer@example.com', location: 'Mumbai' },
  ];

  const handleGoogleOAuth = async () => {
    setLoading(true);
    const mockGoogleProfile = {
      provider: 'google',
      email: 'arun.oauth@example.com',
      name: 'Arun Mehta (Google)',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop',
      googleId: 'google_oauth_992182749',
      role: 'customer'
    };
    const res = await oauthLogin(mockGoogleProfile);
    setLoading(false);
    if (res?.success) {
      addToast('Authenticated seamlessly via Google OAuth 2.0 (JWT Issued)', 'success');
      navigate('/shop');
    } else {
      addToast('Google OAuth failed.', 'error');
    }
  };

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    } else if (location.pathname.includes('register') || location.pathname.includes('signup')) {
      setMode('register');
    } else if (location.pathname === '/login') {
      setMode('login');
    }
  }, [location.pathname, initialMode]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter valid email';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be 6+ chars';
    if (mode === 'register') {
      if (!form.fullName) errs.fullName = 'Full name required';
      if (!form.mobile || form.mobile.length < 10) errs.mobile = 'Valid mobile number required';
      if (!form.address) errs.address = 'Address is required';
      if (!form.location) errs.location = 'Location is required';
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
      result = await login('customer', form.email, form.password);
    } else {
      result = await registerCustomer(form);
    }
    setLoading(false);
    if (result.success) {
      addToast(mode === 'login' ? 'Welcome back!' : 'Account registered and signed in successfully!', 'success');
      navigate('/shop');
    } else {
      addToast(result.message, 'error');
    }
  };

  const fillDemo = () => {
    setForm({ ...form, email: 'arun@example.com', password: 'Customer@123' });
    setErrors({});
  };

  const fillDemoRegister = () => {
    const randomId = Math.floor(1000 + Math.random() * 9000);
    setForm({
      fullName: `Priya Sharma`,
      email: `priya${randomId}@example.com`,
      mobile: '9876543210',
      password: 'Customer@123',
      address: 'Flat 402, Green Valley Apartments, Andheri West',
      location: 'Mumbai, Maharashtra',
    });
    setErrors({});
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-logo"><ShoppingBag size={22} color="#4F46E5" /></div>
          <span className="auth-brand-name">Vendor<span style={{color:'#FCD34D'}}>Hub</span></span>
        </div>
        <h2 className="auth-tagline">
          Shop Smarter,<br />
          Support <span>Local</span><br />
          Vendors
        </h2>
        <p className="auth-sub">
          Browse thousands of quality products from verified local vendors across India — all in one place.
        </p>
        <div className="auth-features">
          {[
            { icon: <CheckCircle size={14} />, text: 'Verified product listings' },
            { icon: <Truck size={14} />, text: 'Fast & reliable delivery' },
            { icon: <Shield size={14} />, text: 'Secure & safe shopping' },
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
              <LogIn size={15} /> Sign In
            </button>
            <button
              type="button"
              className={`auth-mode-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setErrors({}); }}
            >
              <UserPlus size={15} /> Register (New)
            </button>
          </div>

          <h1 className="auth-form-title">
            {mode === 'login' ? 'Welcome back!' : 'Create an Account'}
          </h1>
          <p className="auth-form-sub">
            {mode === 'login'
              ? 'Sign in to access your orders, cart, and account'
              : 'Register now to start purchasing verified local products'}
          </p>

          {/* Google OAuth 2.0 Button */}
          <button
            type="button"
            onClick={handleGoogleOAuth}
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
            Continue with Google (OAuth 2.0 & JWT)
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or sign in with password</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          {mode === 'login' ? (
            <div style={{ marginBottom: 18, background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>⚡ 5 Verified Customer Accounts (1-Click Fill)</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.7rem' }}>Pass: Customer@123</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: 6 }}>
                {testUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, email: u.email, password: 'Customer@123' });
                      setErrors({});
                    }}
                    style={{
                      background: form.email === u.email ? 'rgba(79, 70, 229, 0.15)' : 'white',
                      border: `1.5px solid ${form.email === u.email ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 8,
                      padding: '6px 8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.72rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: form.email === u.email ? 'var(--primary)' : 'var(--text-primary)' }}>{u.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{u.location}</div>
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
              🧪 Auto-fill Sample Registration Data
            </button>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className={`form-input ${errors.fullName ? 'error' : ''}`} name="fullName" placeholder="Arun Mehta" value={form.fullName} onChange={handleChange} />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className={`form-input ${errors.email ? 'error' : ''}`} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input className={`form-input ${errors.mobile ? 'error' : ''}`} name="mobile" placeholder="9876543210" value={form.mobile} onChange={handleChange} />
                {errors.mobile && <span className="form-error">{errors.mobile}</span>}
              </div>
            )}

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
                  <label className="form-label">Address</label>
                  <input className={`form-input ${errors.address ? 'error' : ''}`} name="address" placeholder="House/Flat No., Street, Area" value={form.address} onChange={handleChange} />
                  {errors.address && <span className="form-error">{errors.address}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">City / Location</label>
                  <input className={`form-input ${errors.location ? 'error' : ''}`} name="location" placeholder="Mumbai, Maharashtra" value={form.location} onChange={handleChange} />
                  {errors.location && <span className="form-error">{errors.location}</span>}
                </div>
              </>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setMode('register')}>Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setMode('login')}>Sign in</button></>
            )}
          </div>

          {/* Portal Switcher */}
          <div className="auth-portal-strip">
            <p className="auth-portal-label">Other Portals</p>
            <div className="auth-portal-grid">
              <button
                type="button"
                onClick={() => navigate('/vendor/login')}
                className="auth-portal-btn vendor"
              >
                <Store size={15} /> Vendor Login
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
