import { useState } from 'react';
import { X, Code, Terminal, Key, ShieldCheck, Cpu, Copy, Check, ExternalLink, Zap, Layers, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function ApiAndArchitectureModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('apis'); // 'apis' | 'architecture' | 'tokens'
  const [copiedKey, setCopiedKey] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testingEndpoint, setTestingEndpoint] = useState('');

  if (!isOpen) return null;

  const currentToken = localStorage.getItem('vendorhub_token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.demo_token_signed';

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleTestApi = async (path, method = 'GET') => {
    setTestingEndpoint(path);
    setTestResult(null);
    try {
      const res = await fetch(`http://localhost:5000${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        }
      });
      const data = await res.json();
      setTestResult({ status: res.status, data });
    } catch (e) {
      setTestResult({ status: 'Error', data: { message: e.message } });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--surface, #FFFFFF)',
          borderRadius: 20,
          width: '100%',
          maxWidth: 850,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
            color: 'white'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Code size={22} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Developer API & Architecture Console</h2>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', opacity: 0.85 }}>
                Resume Defense Guide, Live REST Endpoints, OAuth 2.0 & JWT Security Layer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: 8, padding: 6, cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)', padding: '0 24px' }}>
          {[
            { id: 'apis', label: '⚡ Live REST APIs', icon: Terminal },
            { id: 'architecture', label: '🛡️ Resume Non-CRUD Defense', icon: Cpu },
            { id: 'tokens', label: '🔑 JWT & OAuth Verification', icon: Key },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '14px 18px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '0.86rem',
                  fontWeight: active ? 800 : 600,
                  color: active ? 'var(--primary, #4F46E5)' : 'var(--text-secondary)',
                  borderBottom: active ? '2.5px solid var(--primary, #4F46E5)' : '2.5px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Icon size={16} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: REST APIS */}
          {activeTab === 'apis' && (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800 }}>Live Enterprise REST Endpoints</h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Test endpoints directly against Express & MongoDB. All endpoints accept standard Bearer JWT tokens.
                  </p>
                </div>
                <button
                  onClick={() => handleTestApi('/api/docs')}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <RefreshCw size={13} /> Test /api/docs Live
                </button>
              </div>

              {/* Endpoint List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { method: 'GET', path: '/api/docs', desc: 'Platform OpenAPI & Architecture Schema', auth: false },
                  { method: 'GET', path: '/api/health', desc: 'System Health, MongoDB Atlas & Cluster State', auth: false },
                  { method: 'GET', path: '/api/products', desc: 'Catalog with Fair Exposure & Anti-Monopoly Scoring', auth: false },
                  { method: 'POST', path: '/api/auth/oauth/google', desc: 'OAuth 2.0 Sign-In & Cryptographic JWT Provisioning', auth: false },
                  { method: 'GET', path: '/api/auth/me', desc: 'Inspect current user session & JWT Claims', auth: true },
                  { method: 'GET', path: '/api/chatbot/faqs', desc: 'HubBot AI Knowledgebase & Escrow FAQs', auth: false },
                  { method: 'GET', path: '/api/stores', desc: 'Physical Merchant Directory with Pincode Proximity', auth: false },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2, #F8FAFC)',
                      gap: 12,
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: 6,
                          background: ep.method === 'GET' ? '#EEF2FF' : '#FEF3C7',
                          color: ep.method === 'GET' ? '#4F46E5' : '#B45309'
                        }}
                      >
                        {ep.method}
                      </span>
                      <code style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ep.path}</code>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>— {ep.desc}</span>
                    </div>

                    <button
                      onClick={() => handleTestApi(ep.path, ep.method)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      {testingEndpoint === ep.path ? 'Running...' : 'Run Query'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Live Test Output Console */}
              {testResult && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: 6, color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Console Response (Status: {testResult.status})</span>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(testResult.data, null, 2), 'console')}
                      style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.74rem' }}
                    >
                      {copiedKey === 'console' ? '✓ Copied' : 'Copy JSON'}
                    </button>
                  </div>
                  <pre
                    style={{
                      background: '#0F172A',
                      color: '#38BDF8',
                      padding: '14px',
                      borderRadius: 12,
                      fontSize: '0.78rem',
                      fontFamily: 'monospace',
                      overflowX: 'auto',
                      maxHeight: 200
                    }}
                  >
                    {JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESUME DEFENSE (NON-CRUD FEATURES) */}
          {activeTab === 'architecture' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800 }}>Non-CRUD Architecture (Resume Defense Points)</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Use these concrete algorithmic and architectural patterns to defend this platform in technical interviews:
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 14 }}>
                <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#4F46E5', fontWeight: 800, fontSize: '0.9rem', marginBottom: 6 }}>
                    <Zap size={18} />
                    1. Fair Exposure & Anti-Monopoly Algorithm
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Unlike traditional e-commerce which creates winner-take-all monopolies, VendorHub runs a multi-objective scoring formula:
                    <br />
                    <code>Score = 0.35*Rating + 0.25*SLA + 0.20*EmergingBoost + 0.15*Proximity - Decay</code>
                    <br />
                    Guarantees verified local physical merchants get recurring catalog impressions.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#059669', fontWeight: 800, fontSize: '0.9rem', marginBottom: 6 }}>
                    <ShieldCheck size={18} />
                    2. Multi-Party Escrow & Evidence Arbitrator
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Orders place funds in an automated escrow contract state machine. If an item is defective, customers upload unboxing photo/video evidence. Vendors submit counter-evidence, and Admin can execute partial or full escrow disbursement with tamper-proof audit trails.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7C3AED', fontWeight: 800, fontSize: '0.9rem', marginBottom: 6 }}>
                    <Layers size={18} />
                    3. Bi-Directional WebSocket State Synchronization
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Socket.IO engine powers live cross-tab communication: instantaneous inventory decrements on checkout, low-stock threshold triggers to merchant terminals, and live customer-to-merchant chat without page reloads.
                  </p>
                </div>

                <div style={{ padding: '16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D97706', fontWeight: 800, fontSize: '0.9rem', marginBottom: 6 }}>
                    <Cpu size={18} />
                    4. HubBot AI Natural Language Intent Parser
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    Rule-and-intent customer assistance bot parses conversational queries for live courier tracking, doorstep OTP delivery verification, replacement requests, and product compatibility directly mapped to verified merchant records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: JWT & OAUTH */}
          {activeTab === 'tokens' && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800 }}>JWT (JSON Web Token) & OAuth 2.0 Security Layer</h3>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  All platform sessions utilize cryptographically signed JSON Web Tokens (HMAC-SHA256) with role claims (<code>customer</code>, <code>vendor</code>, <code>admin</code>).
                </p>
              </div>

              <div style={{ background: '#0F172A', borderRadius: 12, padding: '16px', color: 'white', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>ACTIVE SESSION JWT BEARER TOKEN:</span>
                  <button
                    onClick={() => copyToClipboard(currentToken, 'jwt')}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#38BDF8', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    {copiedKey === 'jwt' ? '✓ Copied' : 'Copy Token'}
                  </button>
                </div>
                <div style={{ wordBreak: 'break-all', fontFamily: 'monospace', fontSize: '0.76rem', color: '#4ADE80', lineHeight: 1.5 }}>
                  {currentToken}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                <div style={{ padding: '14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: 4, color: 'var(--text-primary)' }}>Google OAuth 2.0 Integration</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Available on Customer & Vendor login forms with one-click token provisioning. Users can sign in without storing plain-text passwords.
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: 4, color: 'var(--text-primary)' }}>5+ Pre-Created Test Accounts</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    5 distinct customers (Arun, Neha, Rohan, Pooja, Vikram), 10 physical merchants (TechZone, StyleHub, FreshBazaar, etc.), and 1 super admin (<code>admin@vendour.com</code>).
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface-2, #F8FAFC)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Authenticated as: <strong>{user?.name || user?.fullName || 'Guest Developer'}</strong> ({user?.type || user?.role || 'anonymous'})
          </div>
          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Console
          </button>
        </div>
      </div>
    </div>
  );
}
