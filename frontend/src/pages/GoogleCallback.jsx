import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { ShoppingBag, AlertCircle } from 'lucide-react';

export default function GoogleCallback() {
  const { oauthLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Verifying Google credentials...');
  const [error, setError] = useState(null);

  useEffect(() => {
    let handled = false;

    const handleOAuthResponse = async () => {
      if (handled) return;
      handled = true;

      try {
        // 1. Check for token in URL hash (#access_token=...)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);
        const accessToken = hashParams.get('access_token');
        const stateParam = hashParams.get('state');

        // 2. Check query params (?code=... or ?error=...)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error') || hashParams.get('error');
        const role = stateParam || searchParams.get('state') || 'customer';

        if (errorParam) {
          setError(`Google Sign-In was cancelled or rejected: ${errorParam}`);
          addToast(`Google Sign-In: ${errorParam}`, 'error');
          setTimeout(() => navigate(role === 'vendor' ? '/vendor/login' : '/login'), 2200);
          return;
        }

        if (accessToken) {
          setStatus('Retrieving your Google profile...');
          const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (!userInfoRes.ok) {
            throw new Error('Could not fetch user information from Google.');
          }

          const profile = await userInfoRes.json();
          setStatus(`Welcome, ${profile.name || profile.email}! Signing into VendorHub...`);

          const res = await oauthLogin({
            provider: 'google',
            email: profile.email,
            name: profile.name,
            avatar: profile.picture,
            googleId: profile.sub,
            token: accessToken,
            role
          });

          if (res?.success) {
            addToast(`Signed in successfully with Google (${profile.email})`, 'success');
            navigate(role === 'vendor' ? '/vendor/dashboard' : '/shop', { replace: true });
          } else {
            setError(res?.message || 'Failed to authenticate with VendorHub.');
            setTimeout(() => navigate(role === 'vendor' ? '/vendor/login' : '/login'), 2500);
          }
          return;
        }

        if (code) {
          setStatus('Authenticating with backend server...');
          const res = await oauthLogin({
            provider: 'google',
            code,
            role
          });
          if (res?.success) {
            addToast('Signed in successfully with Google!', 'success');
            navigate(role === 'vendor' ? '/vendor/dashboard' : '/shop', { replace: true });
          } else {
            setError(res?.message || 'Google code verification failed.');
            setTimeout(() => navigate(role === 'vendor' ? '/vendor/login' : '/login'), 2500);
          }
          return;
        }

        setError('No authentication token received from Google.');
        setTimeout(() => navigate('/login'), 2200);
      } catch (err) {
        console.error('Google callback error:', err);
        setError(err.message || 'Authentication error.');
        setTimeout(() => navigate('/login'), 2500);
      }
    };

    handleOAuthResponse();
  }, [oauthLogin, addToast, navigate, location]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--background)',
      fontFamily: 'inherit',
      padding: 20
    }}>
      <div style={{
        maxWidth: 440,
        width: '100%',
        background: 'var(--surface)',
        borderRadius: 16,
        padding: '36px 28px',
        textAlign: 'center',
        border: '1px solid var(--border)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: 'linear-gradient(135deg, var(--primary) 0%, #7C3AED 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <ShoppingBag size={28} />
        </div>

        {error ? (
          <>
            <div style={{ color: '#EF4444', marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
              <AlertCircle size={36} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              Sign-In Unsuccessful
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '0 0 16px' }}>
              {error}
            </p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Redirecting back to sign-in page...
            </p>
          </>
        ) : (
          <>
            <div style={{ color: 'var(--primary)', marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
              <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-primary)' }}>
              Connecting with Google
            </h2>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: 0 }}>
              {status}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
