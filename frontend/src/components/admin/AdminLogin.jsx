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

          <div style={{ width: 56, height: 56, background: 'rgba(147, 51, 234, 0.1)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, border: '1px solid rgba(147, 51, 234, 0.2)' }}>
            <Shield size={28} color="#9333EA" />
          </div>

          <h1 className="auth-form-title">Admin Login</h1>
          <p className="auth-form-sub">Restricted platform control portal — authorized personnel only</p>

          <div style={{ background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <div style={{ fontWeight: 700, color: '#9333EA', marginBottom: 4 }}>Demo Admin Access:</div>
            <div><strong>Email:</strong> admin@vendour.com</div>
            <div><strong>Password:</strong> Admin@1234</div>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: '0.86rem' }}>
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
              <div className="auth-password-wrapper">
                <input
                  className="form-input"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
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
            </div>

            <button
              type="submit"
              className="btn btn-full btn-lg"
              disabled={loading}
              style={{ background: '#9333EA', color: 'white', border: 'none', borderRadius: 12, padding: '13px', fontWeight: 700, cursor: 'pointer', fontSize: '0.96rem', marginTop: 8 }}
            >
              {loading ? 'Authenticating...' : 'Access Admin Panel'}
            </button>
          </form>

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
                onClick={() => navigate('/vendor/login')}
                className="auth-portal-btn vendor"
              >
                <Store size={15} /> Vendor Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
