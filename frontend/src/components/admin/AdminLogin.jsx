import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { Shield, Eye, EyeOff, ArrowLeft, Lock, ShoppingBag, Store, ChevronDown, ChevronUp, KeyRound } from 'lucide-react';
import GoogleAuthModal from '../common/GoogleAuthModal';
import '../../styles/auth.css';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('vh_google_client_id');

  const { login, oauthLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleAdminGoogleOAuth = () => {
    if (window.google?.accounts?.oauth2 && googleClientId) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              setLoading(true);
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                const profile = await userInfoRes.json();
                await handleAdminGoogleSuccess({
                  provider: 'google',
                  email: profile.email,
                  name: profile.name,
                  avatar: profile.picture,
                  googleId: profile.sub,
                  token: tokenResponse.access_token,
                  role: 'admin'
                });
              } catch (e) {
                console.warn('UserInfo fetch error:', e);
                setShowGoogleModal(true);
              } finally {
                setLoading(false);
              }
            }
          },
          error_callback: (err) => {
            console.warn('Google TokenClient popup notice:', err);
            setShowGoogleModal(true);
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google TokenClient initialization notice:', err);
      }
    }
    setShowGoogleModal(true);
  };

  const handleAdminGoogleSuccess = async (googleProfile) => {
    setLoading(true);
    const res = await oauthLogin({ ...googleProfile, role: 'admin' });
    setLoading(false);
    if (res?.success) {
      addToast(`Administrative SSO verified. Welcome, ${googleProfile.name || 'Admin'}!`, 'success');
      navigate('/admin/dashboard');
      return { success: true };
    } else {
      addToast(res?.message || 'Administrative Google sign-in failed.', 'error');
      return { success: false, message: res?.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email.trim() || !form.password) {
      setShowGoogleModal(true);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const result = await login('admin', form.email, form.password);
    setLoading(false);
    if (result.success) {
      addToast('Welcome, Administrator!', 'success');
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid administrative credentials.');
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-panel-left" style={{ background: 'linear-gradient(145deg, #0C0A1E 0%, #1A0533 50%, #3B0764 100%)' }}>
        <div className="auth-brand">
          <div className="auth-brand-logo"><Shield size={22} color="#9333EA" /></div>
          <span className="auth-brand-name">Vendor<span style={{ color: '#FCD34D' }}>Hub</span></span>
        </div>
        <h2 className="auth-tagline">
          Enterprise<br />
          Control <span>Center</span>
        </h2>
        <p className="auth-sub">
          Review vendor products, verify merchant documentation, audit transactions, and uphold platform integrity.
        </p>
        <div className="auth-features">
          {[
            { icon: <Shield size={14} />, text: 'Audit merchant compliance & GSTIN' },
            { icon: <Lock size={14} />, text: 'Approve or reject inventory listings' },
            { icon: <KeyRound size={14} />, text: 'Enforce platform escrow security' },
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: 'rgba(147, 51, 234, 0.1)',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(147, 51, 234, 0.25)',
                color: '#9333EA'
              }}
            >
              <Shield size={24} />
            </div>
            <div>
              <h1 className="auth-form-title" style={{ margin: 0, fontSize: '1.5rem' }}>Admin Console</h1>
              <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }}></span>
                Restricted Platform Gateway
              </span>
            </div>
          </div>

          <p className="auth-form-sub" style={{ marginBottom: 18 }}>
            Authenticate with verified platform credentials or authorized Google Workspace SSO.
          </p>

          {/* Continue with Google (Admin SSO) Button */}
          <button
            type="button"
            onClick={handleAdminGoogleOAuth}
            className="google-auth-btn-official"
            disabled={loading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google (Admin SSO)</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0 18px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or sign in with password</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          {/* Discreet Collapsible Demo Drawer */}
          <div className="auth-demo-drawer" style={{ marginBottom: 18, marginTop: 0 }}>
            <button
              type="button"
              className="auth-demo-drawer-toggle"
              onClick={() => setShowDemoDrawer(!showDemoDrawer)}
            >
              <span>⚡ Demo Admin Access (admin@vendour.com)</span>
              {showDemoDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {showDemoDrawer && (
              <div className="auth-demo-drawer-content">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: '0.78rem', color: '#1E293B', fontWeight: 600 }}>Default Platform Administrator</div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ email: 'admin@vendour.com', password: 'Admin@1234' });
                      setError('');
                      addToast('Filled admin credentials!', 'info');
                    }}
                    style={{
                      background: '#9333EA',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 10px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill
                  </button>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  <strong>Email:</strong> admin@vendour.com • <strong>Pass:</strong> Admin@1234
                </div>
              </div>
            )}
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#DC2626', fontSize: '0.86rem' }}>
              {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Administrator Email</label>
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
              <label className="form-label">Master Password</label>
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
              style={{
                background: 'linear-gradient(135deg, #7E22CE 0%, #9333EA 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                padding: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.96rem',
                marginTop: 8,
                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)'
              }}
            >
              {loading ? 'Verifying Credentials...' : 'Authenticate & Access Console'}
            </button>
          </form>

          {/* Portal Switcher */}
          <div className="auth-portal-strip" style={{ marginTop: 28 }}>
            <p className="auth-portal-label">Switch Workspace</p>
            <div className="auth-portal-grid">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="auth-portal-btn customer"
              >
                <ShoppingBag size={15} /> Customer Marketplace
              </button>
              <button
                type="button"
                onClick={() => navigate('/vendor/login')}
                className="auth-portal-btn vendor"
              >
                <Store size={15} /> Merchant Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onGoogleSuccess={handleAdminGoogleSuccess}
        role="admin"
      />
    </div>
  );
}
