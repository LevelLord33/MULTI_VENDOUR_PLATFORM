import { useState, useEffect, useRef } from 'react';
import { X, Mail, User, ArrowRight, AlertCircle, ShoppingBag, Plus, ChevronDown } from 'lucide-react';

export default function GoogleAuthModal({ isOpen, onClose, onGoogleSuccess, role = 'customer' }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);
  const [error, setError] = useState('');
  const [mode, setMode] = useState('choose'); // 'choose' or 'manual'
  const [accounts, setAccounts] = useState([]);
  const googleBtnContainerRef = useRef(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Real Google profiles matching the user's exact Google accounts from their system
  const USER_GOOGLE_ACCOUNTS = role === 'vendor' ? [
    {
      name: 'Hariharasudhan M (Merchant)',
      email: 'mhariharasudhan571@gmail.com',
      initial: 'H',
      color: '#3C4043',
      role: 'vendor'
    },
    {
      name: 'Priya Sharma (TechZone Partner)',
      email: 'priya.sharma@gmail.com',
      initial: 'P',
      color: '#E37400',
      role: 'vendor'
    },
    {
      name: 'Satheesh (Store Owner)',
      email: 'satheeshkumar69963950@gmail.com',
      initial: 'S',
      color: '#C5221F',
      role: 'vendor'
    }
  ] : [
    {
      name: 'Hariharasudhan M',
      email: 'mhariharasudhan571@gmail.com',
      initial: 'H',
      color: '#5F6368',
      status: 'Active'
    },
    {
      name: 'HARIHARASUDHAN M CSE-2024',
      email: '24104120@nec.edu.in',
      initial: 'H',
      color: '#4285F4',
      status: 'Signed out'
    },
    {
      name: 'HariHaraSudhan M',
      email: 'themysterioknull33@gmail.com',
      initial: 'H',
      color: '#137333',
      status: 'Signed out'
    },
    {
      name: 'Satheesh',
      email: 'satheeshkumar69963950@gmail.com',
      initial: 'S',
      color: '#EA4335',
      status: 'Signed out'
    },
    {
      name: 'BALAMURUGAN R IT-2024',
      email: '24205045@nec.edu.in',
      initial: 'B',
      color: '#1A73E8',
      status: 'Signed out'
    }
  ];

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vh_google_accounts');
      let customAccounts = [];
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          customAccounts = parsed;
        }
      }
      const merged = [...customAccounts];
      for (const def of USER_GOOGLE_ACCOUNTS) {
        if (!merged.some((a) => a.email.toLowerCase() === def.email.toLowerCase())) {
          merged.push(def);
        }
      }
      setAccounts(merged);
    } catch {
      setAccounts(USER_GOOGLE_ACCOUNTS);
    }
    setMode('choose');
    setError('');
    setActiveAccount(null);
    setEmail('');
    setName('');
  }, [isOpen, role]);

  const handleEmailChange = (val) => {
    setEmail(val);
    setError('');
    if (val && !name) {
      const prefix = val.split('@')[0];
      if (prefix) {
        const cleaned = prefix
          .replace(/[._-]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setName(cleaned);
      }
    }
  };

  const handleAppendGmail = () => {
    if (!email) {
      setEmail('@gmail.com');
      return;
    }
    if (!email.includes('@')) {
      handleEmailChange(`${email.trim()}@gmail.com`);
    } else {
      const prefix = email.split('@')[0];
      handleEmailChange(`${prefix}@gmail.com`);
    }
  };

  const handleCompleteGoogleLogin = async (profileData) => {
    setLoading(true);
    setActiveAccount(profileData.email);
    setError('');
    try {
      const res = await onGoogleSuccess(profileData);
      if (res?.success) {
        try {
          const stored = localStorage.getItem('vh_google_accounts');
          let customAccounts = stored ? JSON.parse(stored) : [];
          customAccounts = customAccounts.filter((a) => a.email.toLowerCase() !== profileData.email.toLowerCase());
          customAccounts.unshift({
            name: profileData.name,
            email: profileData.email,
            initial: (profileData.name || profileData.email).charAt(0).toUpperCase(),
            color: '#1A73E8',
            role,
            lastLogin: new Date().toISOString()
          });
          localStorage.setItem('vh_google_accounts', JSON.stringify(customAccounts.slice(0, 8)));
        } catch {
          // ignore
        }
        onClose();
      } else {
        setError(res?.message || 'Google authentication failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
      setActiveAccount(null);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError('Please enter your Gmail address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email format (e.g. name@gmail.com).');
      return;
    }

    const displayName = name.trim() || cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    await handleCompleteGoogleLogin({
      provider: 'google',
      email: cleanEmail,
      name: displayName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=4285F4&color=fff&bold=true`,
      googleId: `google_usr_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`,
      role
    });
  };

  const handleSelectAccount = (acc) => {
    handleCompleteGoogleLogin({
      provider: 'google',
      email: acc.email,
      name: acc.name,
      avatar: acc.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(acc.name)}&background=4285F4&color=fff&bold=true`,
      googleId: `google_usr_${acc.email.replace(/[^a-z0-9]/g, '_')}`,
      role
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      {/* Google Dark-Themed OAuth Modal (Exact match to Google's official design) */}
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#131314',
          border: '1px solid #303134',
          borderRadius: '28px',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.85)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: "'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, Arial, sans-serif",
          color: '#E8EAED',
          boxSizing: 'border-box'
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px 12px',
            borderBottom: '1px solid #202124'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span style={{ fontSize: '0.88rem', fontWeight: 500, color: '#E8EAED', letterSpacing: '0.01em' }}>
              Sign in with Google
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#9AA0A6',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#2D2E31')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div
            style={{
              margin: '12px 24px 0',
              padding: '10px 14px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              color: '#FCA5A5',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Main 2-Column Split Content (Exact match to Google's Desktop Account Chooser) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            padding: '28px 32px 32px',
            gap: '32px',
            minHeight: '340px'
          }}
        >
          {/* Left Column: App Branding & Title */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#000000',
                border: '1.5px solid #303134',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
              }}
            >
              <ShoppingBag size={22} color="#F59E0B" />
            </div>

            <h2
              style={{
                fontSize: '1.85rem',
                fontWeight: 600,
                color: '#E8EAED',
                margin: '0 0 8px 0',
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Choose an account
            </h2>

            <p style={{ fontSize: '0.96rem', color: '#9AA0A6', margin: '0 0 24px 0', lineHeight: 1.4 }}>
              to continue to{' '}
              <span style={{ color: '#8AB4F8', fontWeight: 500 }}>
                VendorHub
              </span>
            </p>

            <div
              style={{
                marginTop: 'auto',
                fontSize: '0.74rem',
                color: '#5F6368',
                lineHeight: 1.5,
                borderTop: '1px solid #202124',
                paddingTop: '14px'
              }}
            >
              To continue, Google will share your name, email address, language preference, and profile picture with VendorHub.
            </div>
          </div>

          {/* Right Column: Google Accounts List or Manual Form */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mode === 'choose' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxHeight: '360px',
                  overflowY: 'auto',
                  border: '1px solid #303134',
                  borderRadius: '16px',
                  background: '#1F1F1F'
                }}
              >
                {accounts.map((acc, index) => {
                  const isThisLoading = loading && activeAccount === acc.email;
                  return (
                    <div
                      key={acc.email}
                      onClick={() => !loading && handleSelectAccount(acc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '13px 18px',
                        borderBottom: index < accounts.length - 1 ? '1px solid #303134' : 'none',
                        cursor: loading ? 'wait' : 'pointer',
                        transition: 'background-color 0.15s ease',
                        backgroundColor: isThisLoading ? '#2D2E31' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) e.currentTarget.style.backgroundColor = '#2D2E31';
                      }}
                      onMouseLeave={(e) => {
                        if (!isThisLoading) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        {/* Google Avatar Circle with Letter */}
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: acc.color || '#3C4043',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1rem',
                            fontWeight: 600,
                            flexShrink: 0
                          }}
                        >
                          {acc.initial || acc.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#E8EAED', lineHeight: 1.25 }}>
                            {acc.name}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#9AA0A6', marginTop: '2px' }}>
                            {acc.email}
                          </div>
                        </div>
                      </div>

                      {/* Status / Loading */}
                      {isThisLoading ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div
                            style={{
                              width: '14px',
                              height: '14px',
                              border: '2px solid #8AB4F8',
                              borderTopColor: 'transparent',
                              borderRadius: '50%',
                              animation: 'spin 0.6s linear infinite'
                            }}
                          />
                          <span style={{ fontSize: '0.76rem', color: '#8AB4F8' }}>Signing in...</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.74rem', color: '#5F6368' }}>
                          {acc.status || 'Google'}
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* "Use another account" Option */}
                <div
                  onClick={() => !loading && setMode('manual')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '13px 18px',
                    borderTop: '1px solid #303134',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.backgroundColor = '#2D2E31';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1.5px solid #5F6368',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#E8EAED',
                      flexShrink: 0
                    }}
                  >
                    <Plus size={18} />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#E8EAED' }}>
                    Use another account
                  </div>
                </div>
              </div>
            ) : (
              /* MODE: Manual Gmail Input */
              <form
                onSubmit={handleManualSubmit}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  background: '#1F1F1F',
                  padding: '20px',
                  borderRadius: '16px',
                  border: '1px solid #303134'
                }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#E8EAED', marginBottom: '8px' }}>
                    Email or phone
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    placeholder="Enter your Gmail address"
                    autoFocus
                    required
                    style={{
                      width: '100%',
                      height: '46px',
                      padding: '0 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #5F6368',
                      backgroundColor: '#131314',
                      color: '#E8EAED',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#8AB4F8')}
                    onBlur={(e) => (e.target.style.borderColor = '#5F6368')}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={handleAppendGmail}
                      style={{
                        padding: '3px 8px',
                        background: '#303134',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#8AB4F8',
                        fontSize: '0.74rem',
                        cursor: 'pointer'
                      }}
                    >
                      + @gmail.com
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#E8EAED', marginBottom: '8px' }}>
                    Your Name (Google Profile Display Name)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    style={{
                      width: '100%',
                      height: '46px',
                      padding: '0 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #5F6368',
                      backgroundColor: '#131314',
                      color: '#E8EAED',
                      fontSize: '0.94rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#8AB4F8')}
                    onBlur={(e) => (e.target.style.borderColor = '#5F6368')}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('choose')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#8AB4F8',
                      fontSize: '0.86rem',
                      cursor: 'pointer'
                    }}
                  >
                    ← Back to account list
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      height: '40px',
                      padding: '0 24px',
                      borderRadius: '8px',
                      backgroundColor: '#8AB4F8',
                      color: '#000000',
                      border: 'none',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                      cursor: loading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? 'Signing in...' : 'Next'}
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
