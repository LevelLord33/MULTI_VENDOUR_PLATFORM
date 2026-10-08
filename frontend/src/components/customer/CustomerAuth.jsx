import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { ShoppingBag, Eye, EyeOff, Shield, Store, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);
  const googleBtnRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('vh_google_client_id');
  const [officialGoogleReady, setOfficialGoogleReady] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    address: '',
    location: ''
  });

  const { login, registerCustomer, oauthLogin, verifyRegistration, resendVerificationCode } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [demoVerificationCode, setDemoVerificationCode] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const testUsers = [
    { name: 'Arun Mehta', email: 'arun@example.com', location: 'New Delhi' },
    { name: 'Neha Singh', email: 'neha@example.com', location: 'Pune' },
    { name: 'Rohan Sharma', email: 'rohan@example.com', location: 'Bengaluru' },
    { name: 'Pooja Patel', email: 'pooja@example.com', location: 'Ahmedabad' },
    { name: 'Vikram Verma', email: 'vikram.customer@example.com', location: 'Mumbai' }
  ];

  const handleGoogleOAuth = () => {
    if (!googleClientId) {
      addToast('Google Client ID is not configured.', 'error');
      return;
    }

    // 1. First try Google Identity Services Token Client Popup (Bypasses redirect_uri_mismatch on localhost)
    if (window.google?.accounts?.oauth2) {
      try {
        setLoading(true);
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'email profile openid',
          callback: async (tokenResponse) => {
            if (tokenResponse?.error) {
              setLoading(false);
              addToast(`Google Sign-In: ${tokenResponse.error}`, 'error');
              return;
            }
            if (tokenResponse?.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (!userInfoRes.ok) throw new Error('Could not fetch Google profile');
                const profile = await userInfoRes.json();
                await handleGoogleSuccess({
                  provider: 'google',
                  email: profile.email,
                  name: profile.name,
                  avatar: profile.picture,
                  googleId: profile.sub,
                  token: tokenResponse.access_token,
                  role: 'customer'
                });
              } catch (err) {
                console.error('Google profile fetch error:', err);
                addToast('Failed to retrieve Google profile. Please try again.', 'error');
              } finally {
                setLoading(false);
              }
            } else {
              setLoading(false);
            }
          },
          error_callback: (err) => {
            setLoading(false);
            console.warn('Google popup notice:', err);
            if (window.google?.accounts?.id?.prompt) {
              window.google.accounts.id.prompt();
            } else {
              addToast('Google Sign-In popup was closed. Please try again.', 'info');
            }
          }
        });
        client.requestAccessToken({ prompt: 'select_account' });
        return;
      } catch (err) {
        console.warn('Google token client notice:', err);
      }
    }

    // 2. Google One-Tap prompt fallback
    if (window.google?.accounts?.id?.prompt) {
      window.google.accounts.id.prompt();
      setLoading(false);
      return;
    }

    setLoading(false);
    addToast('Google Sign-In is initializing. Please click again.', 'info');
  };

  const handleGoogleSuccess = async (googleProfile) => {
    setLoading(true);
    const res = await oauthLogin({ ...googleProfile, role: 'customer' });
    setLoading(false);
    if (res?.success) {
      addToast(`Welcome back, ${googleProfile.name || googleProfile.email}! Signed in with Google.`, 'success');
      navigate('/shop');
      return { success: true };
    } else {
      addToast(res?.message || 'Google authentication failed.', 'error');
      return { success: false, message: res?.message };
    }
  };

  // Pre-initialize Google Identity Services One-Tap / ID SDK if configured
  useEffect(() => {
    if (!googleClientId) return;

    let mounted = true;
    const interval = setInterval(() => {
      if (window.google?.accounts?.id && mounted) {
        clearInterval(interval);
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: async (response) => {
              if (response?.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split('')
                      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                      .join('')
                  );
                  const payload = JSON.parse(jsonPayload);
                  handleGoogleSuccess({
                    provider: 'google',
                    email: payload.email,
                    name: payload.name,
                    avatar: payload.picture,
                    googleId: payload.sub,
                    credential: response.credential,
                    role: 'customer'
                  });
                } catch {
                  handleGoogleSuccess({
                    provider: 'google',
                    credential: response.credential,
                    role: 'customer'
                  });
                }
              }
            }
          });

          // Render official Google button if target element is present
          const gBtnContainer = document.getElementById('google-customer-button-container');
          if (gBtnContainer) {
            try {
              window.google.accounts.id.renderButton(gBtnContainer, {
                theme: 'outline',
                size: 'large',
                type: 'standard',
                text: 'continue_with',
                shape: 'rectangular',
                width: 380,
                logo_alignment: 'center'
              });
              setOfficialGoogleReady(true);
            } catch (err) {
              console.warn('Google renderButton notice:', err);
            }
          }
        } catch (e) {
          console.warn('Google GSI initialize notice:', e);
        }
      }
    }, 200);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [googleClientId]);

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
    if (!form.email) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (mode === 'register') {
      if (!form.fullName) errs.fullName = 'Full name is required';
      if (!form.mobile) errs.mobile = 'Mobile number is required';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    if (mode === 'login') {
      const res = await login('customer', form.email, form.password);
      setLoading(false);
      if (res.success) {
        addToast('Signed in successfully!', 'success');
        navigate('/shop');
      } else if (res.requiresVerification) {
        setIsVerifying(true);
        setVerificationEmail(res.email || form.email);
        setDemoVerificationCode(res.demoCode || '');
        setResendCooldown(60);
        addToast('Verification code sent to your email & admin (themysterioknull33@gmail.com). Please enter code to continue.', 'info');
      } else {
        setErrors({ email: res.message || 'Invalid credentials' });
      }
    } else {
      const res = await registerCustomer({
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
        address: form.address,
        location: form.location || 'Mumbai'
      });
      setLoading(false);
      if (res.requiresVerification) {
        setIsVerifying(true);
        setVerificationEmail(res.email || form.email);
        setDemoVerificationCode(res.demoCode || '');
        setResendCooldown(60);
        addToast('Security verification code sent to your email & themysterioknull33@gmail.com!', 'success');
      } else if (res.success) {
        addToast('Account created successfully! Welcome to VendorHub.', 'success');
        navigate('/shop');
      } else {
        setErrors({ email: res.message || 'Registration failed' });
      }
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.trim().length !== 6) {
      setErrors({ verify: 'Please enter the 6-digit approval code.' });
      return;
    }
    setLoading(true);
    const res = await verifyRegistration({
      email: verificationEmail,
      code: verificationCode.trim(),
      type: 'customer'
    });
    setLoading(false);
    if (res.success) {
      addToast('Email verified and account approved! Welcome to VendorHub.', 'success');
      navigate('/shop');
    } else {
      setErrors({ verify: res.message || 'Invalid verification code. Please try again.' });
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    const res = await resendVerificationCode(verificationEmail);
    setResending(false);
    if (res.success) {
      if (res.demoCode) setDemoVerificationCode(res.demoCode);
      setResendCooldown(60);
      addToast('A new 6-digit verification code has been dispatched!', 'success');
    } else {
      addToast(res.message || 'Failed to resend code. Please try again.', 'error');
    }
  };


  return (
    <div className="auth-ecommerce-page">
      {/* Top Brand Header */}
      <div className="auth-ecommerce-brand" onClick={() => navigate('/')}>
        <div className="auth-ecommerce-logo-row">
          <div className="auth-ecommerce-logo-icon">
            <ShoppingBag size={22} color="#FFFFFF" />
          </div>
          <span className="auth-ecommerce-logo-text">
            Vendor<span>Hub</span>
          </span>
        </div>
      </div>

      {/* Main E-Commerce Auth Card */}
      <div className="auth-ecommerce-card">
        {isVerifying ? (
          <div className="auth-verification-box">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)',
                color: '#4F46E5',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
              }}>
                <Shield size={28} />
              </div>
              <h1 className="auth-ecommerce-heading" style={{ fontSize: '1.4rem', marginBottom: 6 }}>
                Security Approval Code
              </h1>
              <p className="auth-ecommerce-subheading" style={{ margin: 0, fontSize: '0.85rem' }}>
                A 6-digit authentication approval code was sent to:
              </p>
              <div style={{
                marginTop: 6,
                padding: '6px 12px',
                background: '#F8FAFC',
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                display: 'inline-block',
                fontWeight: 600,
                color: '#1E293B',
                fontSize: '0.85rem'
              }}>
                {verificationEmail}
              </div>
              <div style={{ marginTop: 6, fontSize: '0.74rem', color: '#64748B' }}>
                Security admin copy dispatched to: <span style={{ fontWeight: 600, color: '#4F46E5' }}>themysterioknull33@gmail.com</span>
              </div>
            </div>

            {demoVerificationCode && (
              <div
                onClick={() => {
                  setVerificationCode(demoVerificationCode);
                  setErrors((prev) => ({ ...prev, verify: '' }));
                }}
                style={{
                  background: '#ECFDF5',
                  border: '1px dashed #10B981',
                  borderRadius: 8,
                  padding: '8px 12px',
                  marginBottom: 16,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="Click to auto-fill"
              >
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600 }}>
                  ⚡ Auto-Fill Verification Code: <span style={{ fontFamily: 'monospace', letterSpacing: '2px', fontSize: '0.95rem', background: '#D1FAE5', padding: '2px 6px', borderRadius: 4 }}>{demoVerificationCode}</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#059669', marginTop: 2 }}>
                  (Click here to test instantaneously)
                </div>
              </div>
            )}

            <form onSubmit={handleVerifySubmit}>
              <div className="auth-ecommerce-field">
                <label className="auth-ecommerce-label" style={{ textAlign: 'center', display: 'block', marginBottom: 8 }}>
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, '');
                    setVerificationCode(val);
                    setErrors((prev) => ({ ...prev, verify: '' }));
                  }}
                  placeholder="------"
                  autoFocus
                  style={{
                    width: '100%',
                    letterSpacing: '0.65rem',
                    textAlign: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                    padding: '12px 16px',
                    borderRadius: 10,
                    border: errors.verify ? '2px solid #EF4444' : '2px solid #6366F1',
                    background: '#F8FAFC',
                    outline: 'none',
                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.08)'
                  }}
                />
                {errors.verify && (
                  <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 6, display: 'block', textAlign: 'center' }}>
                    {errors.verify}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="auth-ecommerce-btn-primary"
                disabled={loading || verificationCode.length !== 6}
                style={{ marginTop: 12 }}
              >
                {loading ? 'Verifying Code...' : 'Verify & Activate Account'}
              </button>
            </form>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || resending}
                style={{
                  background: 'none',
                  border: 'none',
                  color: resendCooldown > 0 ? '#94A3B8' : '#4F46E5',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  padding: 0
                }}
              >
                {resending ? 'Sending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsVerifying(false);
                  setVerificationCode('');
                  setErrors({});
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.8rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                ← Back to {mode === 'login' ? 'Sign in' : 'Registration'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="auth-ecommerce-heading">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h1>
            <p className="auth-ecommerce-subheading">
              {mode === 'login'
                ? 'to access your orders, cart, and account'
                : 'to start purchasing verified local products'}
            </p>

            {/* Continue with Google Button */}
            <div style={{ width: '100%', marginBottom: 14 }}>
              <div
                id="google-customer-button-container"
                style={{
                  width: '100%',
                  display: officialGoogleReady ? 'flex' : 'none',
                  justifyContent: 'center'
                }}
              ></div>

              {!officialGoogleReady && (
                <button
                  type="button"
                  id="btn-continue-with-google"
                  className="google-auth-btn-official"
                  onClick={handleGoogleOAuth}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="auth-ecommerce-divider">
              <span>or continue with email</span>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className="auth-ecommerce-field">
                  <label className="auth-ecommerce-label">Your Name</label>
                  <input
                    className={`auth-ecommerce-input ${errors.fullName ? 'error' : ''}`}
                    type="text"
                    name="fullName"
                    placeholder="First and last name"
                    value={form.fullName}
                    onChange={handleChange}
                  />
                  {errors.fullName && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.fullName}</span>}
                </div>
              )}

              <div className="auth-ecommerce-field">
                <label className="auth-ecommerce-label">Email or Mobile Number</label>
                <input
                  className={`auth-ecommerce-input ${errors.email ? 'error' : ''}`}
                  type="text"
                  name="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.email}</span>}
              </div>

              {mode === 'register' && (
                <div className="auth-ecommerce-field">
                  <label className="auth-ecommerce-label">Mobile Number</label>
                  <input
                    className={`auth-ecommerce-input ${errors.mobile ? 'error' : ''}`}
                    type="tel"
                    name="mobile"
                    placeholder="10-digit mobile number"
                    value={form.mobile}
                    onChange={handleChange}
                  />
                  {errors.mobile && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.mobile}</span>}
                </div>
              )}

              <div className="auth-ecommerce-field">
                <div className="auth-ecommerce-label">
                  <span>Password</span>
                  {mode === 'login' && (
                    <span
                      style={{ color: '#4F46E5', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 500 }}
                      onClick={() => addToast('Please sign in with your email or use Continue with Google.', 'info')}
                    >
                      Forgot password?
                    </span>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    className={`auth-ecommerce-input ${errors.password ? 'error' : ''}`}
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    style={{ paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <span style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.password}</span>}
              </div>

              {mode === 'register' && (
                <>
                  <div className="auth-ecommerce-field">
                    <label className="auth-ecommerce-label">Delivery Address</label>
                    <input
                      className={`auth-ecommerce-input ${errors.address ? 'error' : ''}`}
                      type="text"
                      name="address"
                      placeholder="Street / Area / Flat"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="auth-ecommerce-field">
                    <label className="auth-ecommerce-label">City / Location</label>
                    <input
                      className={`auth-ecommerce-input ${errors.location ? 'error' : ''}`}
                      type="text"
                      name="location"
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="auth-ecommerce-btn-primary"
                disabled={loading}
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create your VendorHub account'}
              </button>
            </form>

            <p className="auth-ecommerce-legal">
              By continuing, you agree to VendorHub's <a href="#terms" onClick={(e) => e.preventDefault()}>Conditions of Use</a> and <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Notice</a>.
            </p>
          </>
        )}
      </div>

      {/* Amazon-style Switcher between Sign In and Create Account */}
      {!isVerifying && (
        <div className="auth-ecommerce-new-user">
          <div className="auth-ecommerce-new-divider">
            <span>{mode === 'login' ? 'New to VendorHub?' : 'Already have an account?'}</span>
          </div>
          <button
            type="button"
            className="auth-ecommerce-btn-secondary"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setErrors({});
            }}
          >
            {mode === 'login' ? 'Create your VendorHub account' : 'Sign in to your account'}
          </button>
        </div>
      )}

      {/* Discreet Demo Customer Drawer */}
      {!isVerifying && (
        <div className="auth-demo-drawer">
          <button
            type="button"
            className="auth-demo-drawer-toggle"
            onClick={() => setShowDemoDrawer(!showDemoDrawer)}
          >
            <span>⚡ Demo Customer Access (Click to view test profiles)</span>
            {showDemoDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showDemoDrawer && (
            <div className="auth-demo-drawer-content">
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 8 }}>
                Click any verified test user to auto-fill credentials (Pass: Customer@123):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: 6 }}>
                {testUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      setForm({ ...form, email: u.email, password: 'Customer@123' });
                      setErrors({});
                      addToast(`Filled credentials for ${u.name}`, 'info');
                    }}
                    style={{
                      background: form.email === u.email ? '#EEF2FF' : '#FFFFFF',
                      border: `1px solid ${form.email === u.email ? '#4F46E5' : '#E2E8F0'}`,
                      borderRadius: 6,
                      padding: '6px 8px',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.74rem', color: '#1E293B' }}>{u.name}</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{u.location}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}


      {/* Portal & System Links */}
      <div className="auth-ecommerce-footer">
        <div className="auth-ecommerce-footer-links">
          <button type="button" onClick={() => navigate('/vendor/login')}>
            <Store size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
            Selling on VendorHub? Merchant Portal →
          </button>
        </div>
        <div>
          © 2026 VendorHub, Inc. or its affiliates. All rights reserved.
        </div>
      </div>
    </div>
  );
}
