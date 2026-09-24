import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, ShoppingBag, Store } from 'lucide-react';
import '../../styles/auth.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = await login('admin', form.email, form.password);
    setLoading(false);
    if (result.success) {
      addToast('Welcome, Admin!', 'success');
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel-left" style={{ background: 'linear-gradient(145deg, #0C0A1E 0%, #1A0533 50%, #3B0764 100%)' }}>
        <div className="auth-brand">
          <div className="auth-brand-logo"><Shield size={22} color="#9333EA" /></div>
          <span className="auth-brand-name">Vendor<span style={{color:'#FCD34D'}}>Hub</span></span>
        </div>
        <h2 className="auth-tagline">
          Admin<br />
          Control <span>Center</span>
        </h2>
        <p className="auth-sub">
          Review vendor products, approve or reject listings, and maintain the quality of the Vendor Hub marketplace.
        </p>
        <div className="auth-features">
          {[
            { icon: <Shield size={14} />, text: 'Review product submissions' },
            { icon: <Lock size={14} />, text: 'Approve or reject listings' },
            { icon: <Shield size={14} />, text: 'Maintain platform quality' },
          ].map((f, i) => (
            <div key={i} className="auth-feature-item">
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

          <div style={{ width: 60, height: 60, background: '#F3E8FF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Shield size={28} color="#9333EA" />
          </div>

          <h1 className="auth-form-title">Admin Login</h1>
          <p className="auth-form-sub">Restricted access — authorised personnel only</p>

          <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', borderRadius: 10, padding: '10px 14px', marginBottom: 20, fontSize: '0.8rem', color: '#6D28D9' }}>
            <strong>Demo Credentials:</strong><br />
            Email: admin@vendour.com<br />
            Password: Admin@1234
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@vendour.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={{ paddingRight: 44 }}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-full btn-lg" disabled={loading}
              style={{ background: '#9333EA', color: 'white', border: 'none', borderRadius: 12, padding: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', marginTop: 8 }}>
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>

          {/* Portal Switcher */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Other Portals</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => navigate('/login')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#EEF2FF', color: '#3730A3', border: '1px solid #C7D2FE', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.background='#C7D2FE'}
                onMouseOut={e => e.currentTarget.style.background='#EEF2FF'}
              >
                <ShoppingBag size={14} /> Customer Login
              </button>
              <button
                onClick={() => navigate('/vendor/login')}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                onMouseOver={e => e.currentTarget.style.background='#FDE68A'}
                onMouseOut={e => e.currentTarget.style.background='#FEF3C7'}
              >
                <Store size={14} /> Vendor Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
