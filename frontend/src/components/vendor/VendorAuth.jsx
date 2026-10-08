import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import {
  Store, Eye, EyeOff, ArrowLeft, TrendingUp, Users, Package,
  ShoppingBag, Shield, LogIn, UserPlus, FileCheck, CheckCircle2,
  Building, MapPin, Truck, Award, HelpCircle, ChevronDown, ChevronUp
} from 'lucide-react';
import '../../styles/auth.css';

export default function VendorAuth({ initialMode }) {
  const location = useLocation();
  const [mode, setMode] = useState(() => {
    if (initialMode) return initialMode;
    if (location.pathname.includes('register') || location.pathname.includes('signup')) return 'register';
    return 'login';
  });
  const [appType, setAppType] = useState('full'); // 'quick' | 'full'
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemoDrawer, setShowDemoDrawer] = useState(false);
  const googleBtnRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('vh_google_client_id');
  const [officialGoogleReady, setOfficialGoogleReady] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    mobile: '',
    password: '',
    businessAddress: '',
    location: '',
    category: 'Electronics',
    businessType: 'Sole Proprietorship',
    gstin: '',
    panNumber: '',
    deliveryRadiusKm: 30,
    deliveryScope: 'pan_india',
    pincode: '110020',
    accountNumber: '',
    ifscCode: '',
    docGstUrl: '',
    docPanUrl: ''
  });

  const { user, login, registerVendor, oauthLogin, verifyRegistration, resendVerificationCode } = useAuth();
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

  const handleUpgradeCurrentCustomer = async () => {
    if (!user) return;
    setLoading(true);
    const res = await oauthLogin({
      email: user.email,
      name: user.fullName || user.name || 'Merchant Owner',
      avatar: user.avatar,
      role: 'vendor'
    });
    setLoading(false);
    if (res?.success) {
      addToast('Switched to Merchant account! Welcome to your Vendor Dashboard.', 'success');
      navigate('/vendor/dashboard');
    } else {
      addToast(res?.message || 'Could not launch vendor storefront.', 'error');
    }
  };

  const handleVendorGoogleOAuth = () => {
    if (!googleClientId) {
      addToast('Google Client ID is not configured.', 'error');
      return;
    }

    setLoading(true);

    // 1. Google Identity Services official OAuth2 popup (avoids redirect_uri mismatch by using origin authorization)
    if (window.google?.accounts?.oauth2) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (tokenResponse?.access_token) {
              try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                if (!userInfoRes.ok) throw new Error('Could not fetch Google profile');
                const profile = await userInfoRes.json();
                await handleVendorGoogleSuccess({
                  provider: 'google',
                  email: profile.email,
                  name: profile.name,
                  avatar: profile.picture,
                  googleId: profile.sub,
                  token: tokenResponse.access_token,
                  role: 'vendor'
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

    // 2. Fallback to Google One-Tap prompt
    if (window.google?.accounts?.id?.prompt) {
      window.google.accounts.id.prompt();
      setLoading(false);
      return;
    }

    setLoading(false);
    addToast('Google Sign-In is initializing. Please click again.', 'info');
  };

  const handleVendorGoogleSuccess = async (googleProfile) => {
    setLoading(true);
    const res = await oauthLogin({ ...googleProfile, role: 'vendor' });
    setLoading(false);
    if (res?.success) {
      addToast(`Welcome, ${googleProfile.name || 'Merchant'}! Signed in to Vendor Portal.`, 'success');
      navigate('/vendor/dashboard');
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
                  handleVendorGoogleSuccess({
                    provider: 'google',
                    email: payload.email,
                    name: payload.name,
                    avatar: payload.picture,
                    googleId: payload.sub,
                    credential: response.credential,
                    role: 'vendor'
                  });
                } catch {
                  handleVendorGoogleSuccess({
                    provider: 'google',
                    credential: response.credential,
                    role: 'vendor'
                  });
                }
              }
            }
          });

          // Render official Google button if target element is present
          const gBtnContainer = document.getElementById('google-vendor-button-container');
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
    } else if (location.pathname === '/vendor/login') {
      setMode('login');
    }
  }, [location.pathname, initialMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Password 6+ chars';
    if (mode === 'register') {
      if (!form.businessName) errs.businessName = 'Business name required';
      if (!form.ownerName) errs.ownerName = 'Owner name required';
      if (!form.mobile || form.mobile.length < 10) errs.mobile = 'Valid 10-digit mobile required';
      if (!form.businessAddress) errs.businessAddress = 'Business address required';
      if (!form.location) errs.location = 'Location required';
      if (appType === 'full') {
        if (!form.gstin) errs.gstin = 'GSTIN required for verification';
        if (!form.panNumber) errs.panNumber = 'PAN required';
      }
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
      const regPayload = {
        ...form,
        vendorApplicationStatus: appType === 'full' ? 'pending' : 'approved',
        isVerified: appType !== 'full',
        deliveryRadiusKm: Number(form.deliveryRadiusKm) || 25,
        documents: [
          {
            type: 'GST Certificate',
            title: 'Form GST REG-06 Certificate',
            url: form.docGstUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop'
          },
          {
            type: 'PAN Card',
            title: 'Business PAN Entity Card',
            url: form.docPanUrl || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
          }
        ],
        bankDetails: {
          accountNumber: form.accountNumber || '918273645019',
          ifscCode: form.ifscCode || 'HDFC0001234'
        }
      };

      result = await registerVendor(regPayload);

      // Submit application record to backend as well
      if (appType === 'full') {
        try {
          await api.submitVendorApplication({
            ...regPayload,
            vendorId: result?.user?.id || 'v' + Date.now(),
            city: form.location.split(',')[0]?.trim() || form.location,
            state: form.location.split(',')[1]?.trim() || 'Delhi'
          });
        } catch (appErr) {
          console.warn('Backend application submit note:', appErr);
        }
      }
    }
    setLoading(false);

    if (result?.requiresVerification) {
      setIsVerifying(true);
      setVerificationEmail(result.email || form.email);
      setDemoVerificationCode(result.demoCode || '');
      setResendCooldown(60);
      addToast(
        mode === 'login'
          ? 'Security approval code sent to your email & admin (themysterioknull33@gmail.com). Please verify to continue.'
          : 'Security verification code dispatched to your email & themysterioknull33@gmail.com! Please verify to complete store registration.',
        'info'
      );
      return;
    }

    if (result.success) {
      if (mode === 'login') {
        addToast('Welcome back, Vendor!', 'success');
      } else if (appType === 'full') {
        addToast('Merchant application submitted for verification! Admin review in progress.', 'success');
      } else {
        addToast('Vendor store registered and logged in successfully!', 'success');
      }
      navigate('/vendor/dashboard');
    } else {
      addToast(result.message || 'Operation failed', 'error');
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
      type: 'vendor'
    });
    setLoading(false);
    if (res.success) {
      addToast('Email verified and merchant account approved! Welcome to VendorHub.', 'success');
      navigate('/vendor/dashboard');
    } else {
      setErrors({ verify: res.message || 'Invalid verification code. Please check the code.' });
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
      addToast('A new 6-digit security code has been dispatched to your email & themysterioknull33@gmail.com!', 'success');
    } else {
      addToast(res.message || 'Failed to resend code. Please try again.', 'error');
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
      category: 'Electronics',
      businessType: 'Private Limited',
      gstin: `07AABCA${randomId}K1Z2`,
      panNumber: `AABCA${randomId}K`,
      deliveryRadiusKm: 35,
      deliveryScope: 'pan_india',
      pincode: '110020',
      accountNumber: '918273645019',
      ifscCode: 'HDFC0001234',
      docGstUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
      docPanUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
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

          {isVerifying ? (
            <div className="auth-verification-box" style={{ padding: '16px 0' }}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F3E8FF, #EDE9FE)',
                  color: '#7C3AED',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 12,
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.18)'
                }}>
                  <Shield size={28} />
                </div>
                <h1 className="auth-form-title" style={{ fontSize: '1.45rem', marginBottom: 6 }}>
                  Merchant Security Clearance
                </h1>
                <p className="auth-form-sub" style={{ margin: 0, fontSize: '0.86rem' }}>
                  A 6-digit approval code was dispatched to your registered address:
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
                  fontSize: '0.86rem'
                }}>
                  {verificationEmail}
                </div>
                <div style={{ marginTop: 6, fontSize: '0.74rem', color: '#64748B' }}>
                  Admin verification copy sent to: <span style={{ fontWeight: 600, color: '#7C3AED' }}>themysterioknull33@gmail.com</span>
                </div>
              </div>

              {demoVerificationCode && (
                <div
                  onClick={() => {
                    setVerificationCode(demoVerificationCode);
                    setErrors((prev) => ({ ...prev, verify: '' }));
                  }}
                  style={{
                    background: '#F5F3FF',
                    border: '1px dashed #7C3AED',
                    borderRadius: 8,
                    padding: '8px 12px',
                    marginBottom: 18,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Click to auto-fill code"
                >
                  <div style={{ fontSize: '0.76rem', color: '#6D28D9', fontWeight: 600 }}>
                    ⚡ Instant Sandbox Code: <span style={{ fontFamily: 'monospace', letterSpacing: '2px', fontSize: '0.96rem', background: '#EDE9FE', padding: '2px 6px', borderRadius: 4 }}>{demoVerificationCode}</span>
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#7C3AED', marginTop: 2 }}>
                    (Click here to auto-fill and test)
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifySubmit}>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label" style={{ textAlign: 'center', display: 'block', marginBottom: 8, fontWeight: 600 }}>
                    Enter 6-Digit Approval Code
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
                      border: errors.verify ? '2px solid #EF4444' : '2px solid #7C3AED',
                      background: '#F8FAFC',
                      outline: 'none',
                      boxShadow: '0 2px 8px rgba(124, 58, 237, 0.08)'
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
                  className="btn btn-full btn-lg"
                  disabled={loading || verificationCode.length !== 6}
                  style={{
                    background: '#7C3AED',
                    color: 'white',
                    border: 'none',
                    borderRadius: 12,
                    padding: '13px',
                    fontWeight: 700,
                    cursor: (loading || verificationCode.length !== 6) ? 'not-allowed' : 'pointer',
                    fontSize: '0.96rem',
                    marginTop: 6
                  }}
                >
                  {loading ? 'Verifying Code...' : 'Verify & Launch Dashboard'}
                </button>
              </form>

              <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || resending}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: resendCooldown > 0 ? '#94A3B8' : '#7C3AED',
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
              {/* Active User Switching Banner */}
              {user && user.type === 'customer' && (
                <div style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: '0.82rem',
                  color: '#1E40AF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap'
                }}>
                  <div>
                    Currently signed in as Customer: <strong>{user.fullName || user.email}</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={handleUpgradeCurrentCustomer}
                    disabled={loading}
                    style={{
                      background: '#2563EB',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🚀 Open Storefront with this Account →
                  </button>
                </div>
              )}

              {user && user.type === 'vendor' && (
                <div style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: 10,
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: '0.82rem',
                  color: '#065F46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                  flexWrap: 'wrap'
                }}>
                  <div>
                    Already signed in as Merchant: <strong>{user.businessName || user.fullName}</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/vendor/dashboard')}
                    style={{
                      background: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: 6,
                      padding: '5px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Go to Vendor Dashboard →
                  </button>
                </div>
              )}

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

          {/* Google Sign-In Container */}
          <div style={{ width: '100%', marginBottom: 14 }}>
            <div
              id="google-vendor-button-container"
              style={{
                width: '100%',
                display: officialGoogleReady ? 'flex' : 'none',
                justifyContent: 'center'
              }}
            ></div>

            {!officialGoogleReady && (
              <button
                type="button"
                id="btn-vendor-google-auth"
                onClick={handleVendorGoogleOAuth}
                className="google-auth-btn-official"
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

          <div style={{ display: 'flex', alignItems: 'center', margin: '14px 0 16px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
            <span style={{ padding: '0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>or sign in with password</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}></div>
          </div>

          {mode === 'login' ? (
            <div className="auth-demo-drawer" style={{ marginBottom: 18, marginTop: 0 }}>
              <button
                type="button"
                className="auth-demo-drawer-toggle"
                onClick={() => setShowDemoDrawer(!showDemoDrawer)}
              >
                <span>⚡ Demo Merchant Accounts (Click to view test stores)</span>
                {showDemoDrawer ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showDemoDrawer && (
                <div className="auth-demo-drawer-content">
                  <div style={{ fontSize: '0.72rem', color: '#64748B', marginBottom: 8 }}>
                    Click any test merchant to auto-fill credentials (Pass: Vendor@123):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 }}>
                    {[
                      { name: 'TechZone', email: 'rajesh@techzone.in', cat: 'Electronics' },
                      { name: 'StyleHub', email: 'priya@stylehub.in', cat: 'Fashion' },
                      { name: 'FreshBazaar', email: 'vikram@freshbazaar.in', cat: 'Grocery' },
                      { name: 'ChaiCulture', email: 'vikram@chaiculture.in', cat: 'Gourmet Tea' },
                      { name: 'Lumina Lighting', email: 'sneha@lumina.in', cat: 'Smart Lighting' },
                      { name: 'Himalayan Pure', email: 'rahul@himalayanpure.in', cat: 'Organic Honey' }
                    ].map((v) => (
                      <button
                        key={v.email}
                        type="button"
                        onClick={() => {
                          setForm({ ...form, email: v.email, password: 'Vendor@123' });
                          setErrors({});
                          addToast(`Filled credentials for ${v.name}`, 'info');
                        }}
                        style={{
                          background: form.email === v.email ? '#F5F3FF' : '#FFFFFF',
                          border: `1px solid ${form.email === v.email ? '#7C3AED' : '#E2E8F0'}`,
                          borderRadius: 6,
                          padding: '6px 8px',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '0.74rem', color: '#1E293B' }}>{v.name}</div>
                        <div style={{ fontSize: '0.65rem', color: '#64748B' }}>{v.cat}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              {/* Application type switcher */}
              <div style={{ display: 'flex', gap: 6, background: 'var(--surface-2, #F8FAFC)', padding: 4, borderRadius: 10, border: '1px solid var(--border)', marginBottom: 12 }}>
                <button
                  type="button"
                  onClick={() => setAppType('full')}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: appType === 'full' ? '#7C3AED' : 'transparent',
                    color: appType === 'full' ? 'white' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <FileCheck size={14} /> Full Onboarding Application (GST & PAN)
                </button>
                <button
                  type="button"
                  onClick={() => setAppType('quick')}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: appType === 'quick' ? '#7C3AED' : 'transparent',
                    color: appType === 'quick' ? 'white' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  ⚡ Quick Demo Store
                </button>
              </div>

              <button
                type="button"
                className="auth-demo-btn"
                style={{
                  width: '100%',
                  borderColor: 'var(--success, #16A34A)',
                  color: 'var(--success, #16A34A)',
                  background: 'rgba(22, 163, 74, 0.08)',
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
                onClick={fillDemoRegister}
              >
                🧪 1-Click Auto-Fill Full Merchant Application (Compliant GST + Docs)
              </button>
            </div>
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
                  <label className="form-label">Business Pickup Address</label>
                  <input className={`form-input ${errors.businessAddress ? 'error' : ''}`} name="businessAddress" placeholder="Street, Industrial Area / Unit" value={form.businessAddress} onChange={handleChange} />
                  {errors.businessAddress && <span className="form-error">{errors.businessAddress}</span>}
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">City / Location</label>
                    <input className={`form-input ${errors.location ? 'error' : ''}`} name="location" placeholder="New Delhi, Delhi" value={form.location} onChange={handleChange} />
                    {errors.location && <span className="form-error">{errors.location}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input className="form-input" name="pincode" placeholder="110020" value={form.pincode} onChange={handleChange} />
                  </div>
                </div>

                {appType === 'full' && (
                  <div style={{ background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border)', borderRadius: 12, padding: 14, margin: '10px 0 14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Award size={15} color="#7C3AED" />
                      <span>Compliance & Fulfillment Credentials</span>
                    </div>

                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Primary Category</label>
                        <select className="form-input" name="category" value={form.category} onChange={handleChange}>
                          <option value="Electronics">Electronics & Tech</option>
                          <option value="Fashion">Fashion & Apparel</option>
                          <option value="Grocery">Grocery & Gourmet</option>
                          <option value="Beauty">Beauty & Personal Care</option>
                          <option value="Home Decor">Home, Lighting & Living</option>
                          <option value="Sports & Fitness">Sports & Fitness</option>
                          <option value="Automotive">Automotive Accessories</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Business Structure</label>
                        <select className="form-input" name="businessType" value={form.businessType} onChange={handleChange}>
                          <option value="Sole Proprietorship">Sole Proprietorship</option>
                          <option value="Partnership">Partnership Firm</option>
                          <option value="Private Limited">Private Limited (Pvt Ltd)</option>
                          <option value="LLP">Limited Liability Partnership</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 6 }}>
                      <div className="form-group">
                        <label className="form-label">GSTIN (15 Digits)</label>
                        <input className={`form-input ${errors.gstin ? 'error' : ''}`} name="gstin" placeholder="07AABCS1234F1Z5" value={form.gstin} onChange={handleChange} />
                        {errors.gstin && <span className="form-error">{errors.gstin}</span>}
                      </div>

                      <div className="form-group">
                        <label className="form-label">PAN Number (10 Digits)</label>
                        <input className={`form-input ${errors.panNumber ? 'error' : ''}`} name="panNumber" placeholder="AABCS1234F" value={form.panNumber} onChange={handleChange} />
                        {errors.panNumber && <span className="form-error">{errors.panNumber}</span>}
                      </div>
                    </div>

                    <div className="form-grid" style={{ marginTop: 6 }}>
                      <div className="form-group">
                        <label className="form-label">Delivery Radius (km)</label>
                        <input
                          type="number"
                          className="form-input"
                          name="deliveryRadiusKm"
                          placeholder="30"
                          min="5"
                          max="200"
                          value={form.deliveryRadiusKm}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Fulfillment Reach</label>
                        <select className="form-input" name="deliveryScope" value={form.deliveryScope} onChange={handleChange}>
                          <option value="pan_india">Pan-India Courier Network</option>
                          <option value="state_only">State-wide Express</option>
                          <option value="city_radius">City & Radius Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
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
                <p className="auth-portal-label">Looking for Customer Shopping?</p>
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="auth-portal-btn customer"
                    style={{ width: '100%' }}
                  >
                    <ShoppingBag size={15} /> Customer Login & Registration
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
