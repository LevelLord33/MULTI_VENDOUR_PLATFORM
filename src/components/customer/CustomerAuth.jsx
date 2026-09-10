import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ShoppingBag, Eye, EyeOff, ArrowLeft, CheckCircle, Truck, Shield, Store } from 'lucide-react';
import '../../styles/auth.css';

export default function CustomerAuth() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: '', email: '', mobile: '', password: '', address: '', location: '',
  });

  const { login, registerCustomer } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

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
      result = login('customer', form.email, form.password);
    } else {
      result = registerCustomer(form);
    }
    setLoading(false);
    if (result.success) {
      addToast(mode === 'login' ? 'Welcome back!' : 'Account created! Welcome to Vendour-Mart', 'success');
      navigate('/shop');
    } else {
      addToast(result.message, 'error');
    }
  };

  const fillDemo = () => {
    setForm({ ...form, email: 'arun@example.com', password: 'Customer@123' });
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel-left">
        <div className="auth-brand">
          <div className="auth-brand-logo"><ShoppingBag size={22} color="#4F46E5" /></div>
          <span className="auth-brand-name">Vendour<span style={{color:'#FCD34D'}}>-Mart</span></span>
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

          <h1 className="auth-form-title">
            {mode === 'login' ? 'Welcome back!' : 'Create account'}
          </h1>
          <p className="auth-form-sub">
            {mode === 'login'
              ? 'Sign in to start shopping from local vendors'
              : 'Join Vendour-Mart and start discovering great products'}
          </p>

          {mode === 'login' && (
            <button
              onClick={fillDemo}
              style={{ marginBottom: 16, background: '#EEF2FF', color: '#4F46E5', border: '1px solid #C7D2FE', borderRadius: 8, padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              🧪 Use Demo Account
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
              <div style={{ position: 'relative' }}>
                <input
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
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

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
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
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Portals</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate('/vendor/login')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}
                onMouseOver={e => e.currentTarget.style.background='#FDE68A'}
                onMouseOut={e => e.currentTarget.style.background='#FEF3C7'}
              >
                <Store size={14} /> Vendor Login
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
