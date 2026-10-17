import React from 'react';
import { RefreshCw, Home, ShoppingBag } from 'lucide-react';

/**
 * PageErrorBoundary
 * Catches any unexpected rendering errors or runtime exceptions in React pages
 * and renders a polished, responsive recovery UI instead of a blank white screen.
 */
export default class PageErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('💥 [PageErrorBoundary] Caught runtime exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoShop = () => {
    window.location.href = '/shop';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'var(--bg-primary, #F8FAFC)',
            color: 'var(--text-primary, #0F172A)',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: 'white',
              borderRadius: '20px',
              padding: '40px 32px',
              boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
              border: '1px solid var(--border, #E2E8F0)'
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: '#EEF2FF',
                color: '#4F46E5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '2rem'
              }}
            >
              🛍️
            </div>

            <h1
              style={{
                fontSize: '1.45rem',
                fontWeight: 800,
                color: '#0F172A',
                marginBottom: 10
              }}
            >
              Notice: Page Encountered an Update
            </h1>

            <p
              style={{
                fontSize: '0.92rem',
                color: '#64748B',
                lineHeight: 1.6,
                marginBottom: 28
              }}
            >
              The application recovered from an unexpected rendering hiccup. You can return directly to the marketplace catalog or reload the current view.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  borderRadius: '10px',
                  background: '#4F46E5',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoShop}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  borderRadius: '10px',
                  background: '#F1F5F9',
                  color: '#1E293B',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer'
                }}
              >
                <ShoppingBag size={16} />
                <span>Go to Marketplace</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 22px',
                  borderRadius: '10px',
                  background: 'transparent',
                  color: '#64748B',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Home size={16} />
                <span>Home</span>
              </button>
            </div>

            {this.state.error && (
              <details style={{ marginTop: 24, textAlign: 'left', background: '#F8FAFC', padding: '10px 14px', borderRadius: 8, fontSize: '0.78rem', color: '#EF4444' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#64748B' }}>Diagnostic error detail</summary>
                <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
