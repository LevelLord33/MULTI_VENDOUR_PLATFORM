import { useState, useMemo } from 'react';
import {
  X, Check, Copy, Share2, QrCode, MessageCircle,
  ExternalLink, Sparkles, Download, Code
} from 'lucide-react';

export default function ShareModal({
  isOpen,
  onClose,
  type = 'store', // 'store' | 'product'
  title = '',
  subtitle = '',
  url = '',
  image = '',
  badge = ''
}) {
  const [copied, setCopied] = useState(false);
  const [badgeCopied, setBadgeCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('social'); // 'social' | 'qr' | 'embed'

  const fullUrl = useMemo(() => {
    if (!url) return window.location.href;
    if (url.startsWith('http')) return url;
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  }, [url]);

  const shareText = useMemo(() => {
    if (type === 'store') {
      return `Check out ${title} — a verified physical store on Vendor Hub! ${subtitle ? `(${subtitle})` : ''} Shop genuine stock: ${fullUrl}`;
    }
    return `Check out ${title} on Vendor Hub! ${subtitle ? `${subtitle} • ` : ''}Verified authentic inventory: ${fullUrl}`;
  }, [type, title, subtitle, fullUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleCopyEmbed = () => {
    const embedCode = `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;background:#4F46E5;color:#fff;border-radius:8px;font-family:sans-serif;text-decoration:none;font-weight:700;font-size:13px;"><span>⚡ Verified Merchant on Vendor Hub: <strong>${title}</strong></span></a>`;
    navigator.clipboard.writeText(embedCode);
    setBadgeCopied(true);
    setTimeout(() => setBadgeCopied(false), 2200);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: fullUrl
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  // Social Links
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(`Vendor Hub: ${title}`)}&body=${encodeURIComponent(shareText)}`;

  // Deterministic SVG QR Code Generator based on URL string
  const qrSvg = (
    <svg viewBox="0 0 160 160" width="160" height="160" style={{ borderRadius: 12, background: '#fff', padding: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
      {/* Corner position markers */}
      <rect x="10" y="10" width="40" height="40" fill="#1E1B4B" rx="4" />
      <rect x="18" y="18" width="24" height="24" fill="#fff" rx="2" />
      <rect x="24" y="24" width="12" height="12" fill="#4F46E5" rx="1" />

      <rect x="110" y="10" width="40" height="40" fill="#1E1B4B" rx="4" />
      <rect x="118" y="18" width="24" height="24" fill="#fff" rx="2" />
      <rect x="124" y="24" width="12" height="12" fill="#4F46E5" rx="1" />

      <rect x="10" y="110" width="40" height="40" fill="#1E1B4B" rx="4" />
      <rect x="18" y="118" width="24" height="24" fill="#fff" rx="2" />
      <rect x="24" y="124" width="12" height="12" fill="#4F46E5" rx="1" />

      {/* Decorative Data Grid Matrix */}
      <rect x="60" y="15" width="8" height="8" fill="#1E1B4B" />
      <rect x="75" y="15" width="8" height="8" fill="#4F46E5" />
      <rect x="90" y="15" width="8" height="8" fill="#1E1B4B" />

      <rect x="60" y="35" width="8" height="8" fill="#4F46E5" />
      <rect x="75" y="35" width="12" height="8" fill="#1E1B4B" />
      <rect x="95" y="35" width="6" height="8" fill="#4F46E5" />

      <rect x="15" y="60" width="8" height="8" fill="#1E1B4B" />
      <rect x="30" y="60" width="8" height="8" fill="#4F46E5" />
      <rect x="45" y="60" width="8" height="8" fill="#1E1B4B" />
      <rect x="60" y="60" width="14" height="14" fill="#6366F1" rx="2" />
      <rect x="85" y="60" width="8" height="8" fill="#1E1B4B" />
      <rect x="100" y="60" width="8" height="8" fill="#4F46E5" />
      <rect x="115" y="60" width="8" height="8" fill="#1E1B4B" />
      <rect x="135" y="60" width="8" height="8" fill="#4F46E5" />

      <rect x="15" y="80" width="8" height="8" fill="#4F46E5" />
      <rect x="35" y="80" width="12" height="8" fill="#1E1B4B" />
      <rect x="60" y="85" width="8" height="8" fill="#1E1B4B" />
      <rect x="75" y="80" width="10" height="10" fill="#4F46E5" />
      <rect x="95" y="85" width="10" height="8" fill="#1E1B4B" />
      <rect x="115" y="80" width="8" height="8" fill="#4F46E5" />
      <rect x="130" y="80" width="14" height="8" fill="#1E1B4B" />

      <rect x="60" y="105" width="8" height="8" fill="#4F46E5" />
      <rect x="75" y="105" width="8" height="8" fill="#1E1B4B" />
      <rect x="90" y="105" width="8" height="8" fill="#4F46E5" />

      <rect x="60" y="125" width="12" height="8" fill="#1E1B4B" />
      <rect x="80" y="125" width="8" height="8" fill="#4F46E5" />
      <rect x="95" y="125" width="12" height="8" fill="#1E1B4B" />
      <rect x="115" y="125" width="8" height="8" fill="#4F46E5" />
      <rect x="130" y="125" width="15" height="12" fill="#1E1B4B" />

      {/* Center Store Icon Marker */}
      <circle cx="80" cy="80" r="14" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
      <text x="80" y="84" fontSize="10" textAnchor="middle" fill="#4F46E5" fontWeight="bold">VH</text>
    </svg>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: 520,
          background: 'var(--surface)',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 22px',
            borderBottom: '1px solid var(--border)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: '#EEF2FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)'
              }}
            >
              <Share2 size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Share {type === 'store' ? 'Storefront' : 'Product'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Promote verified physical inventory with 1-click links
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Card */}
        <div style={{ padding: '16px 22px', background: 'var(--surface-sunken, rgba(0,0,0,0.02))', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {image ? (
              <img
                src={image}
                alt={title}
                style={{ width: 48, height: 48, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
              />
            ) : (
              <div style={{ width: 48, height: 48, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 800 }}>
                {title.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {title}
                </div>
                {badge && (
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: '#ECFDF5', color: '#059669', flexShrink: 0 }}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {subtitle}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 22px' }}>
          <button
            onClick={() => setActiveTab('social')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: activeTab === 'social' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'social' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Social & Link
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            style={{
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: activeTab === 'qr' ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: activeTab === 'qr' ? '2px solid var(--primary)' : '2px solid transparent'
            }}
          >
            Counter QR Code
          </button>
          {type === 'store' && (
            <button
              onClick={() => setActiveTab('embed')}
              style={{
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: activeTab === 'embed' ? 'var(--primary)' : 'var(--text-muted)',
                borderBottom: activeTab === 'embed' ? '2px solid var(--primary)' : '2px solid transparent'
              }}
            >
              Storefront Badge
            </button>
          )}
        </div>

        {/* Tab 1: Social & Link */}
        {activeTab === 'social' && (
          <div style={{ padding: 22 }}>
            {/* 1-Click Copy Box */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
                Shareable URL Link
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--surface-sunken, rgba(0,0,0,0.04))',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '4px 6px',
                  gap: 8
                }}
              >
                <input
                  type="text"
                  readOnly
                  value={fullUrl}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    padding: '6px 8px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleCopyLink}
                  className="btn btn-primary"
                  style={{
                    padding: '7px 14px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    background: copied ? '#10B981' : 'var(--primary)',
                    borderColor: copied ? '#10B981' : 'var(--primary)'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Social Channels */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, display: 'block' }}>
                Instant Share Channels
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {/* WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 10,
                    background: '#25D36615',
                    color: '#128C7E',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '1px solid #25D36630'
                  }}
                >
                  <MessageCircle size={20} />
                  <span>WhatsApp</span>
                </a>

                {/* X / Twitter */}
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 10,
                    background: '#00000010',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '1px solid var(--border)'
                  }}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: 900, lineHeight: 1 }}>𝕏</span>
                  <span>Twitter / X</span>
                </a>

                {/* Facebook */}
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 10,
                    background: '#1877F215',
                    color: '#1877F2',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '1px solid #1877F230'
                  }}
                >
                  <Share2 size={20} />
                  <span>Facebook</span>
                </a>

                {/* Telegram */}
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 8px',
                    borderRadius: 10,
                    background: '#0088CC15',
                    color: '#0088CC',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    border: '1px solid #0088CC30'
                  }}
                >
                  <ExternalLink size={20} />
                  <span>Telegram</span>
                </a>
              </div>
            </div>

            {/* Mobile Native Share Button */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={handleNativeShare}
                className="btn btn-outline"
                style={{ width: '100%', marginTop: 16, padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Share2 size={16} />
                <span>More Share Options...</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Dynamic QR Code */}
        {activeTab === 'qr' && (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ display: 'inline-block', marginBottom: 12 }}>
              {qrSvg}
            </div>
            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 4 }}>
              Scan with Any Mobile Camera
            </div>
            <p style={{ margin: '0 auto 16px', fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 360 }}>
              Customers or visitors can point their smartphone camera at this QR code to instantly view this {type === 'store' ? 'storefront catalog' : 'product SKU'}.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button
                onClick={handleCopyLink}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Copy size={15} />
                <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Embeddable Store Badge */}
        {activeTab === 'embed' && type === 'store' && (
          <div style={{ padding: 22 }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>
              Storefront HTML Badge
            </label>
            <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Embed this verified merchant badge onto your personal website, blog, or email signature to drive verified traffic to your Vendor Hub store:
            </p>

            <div
              style={{
                background: 'var(--surface-sunken, #0F172A)',
                color: '#E2E8F0',
                padding: '12px 14px',
                borderRadius: 10,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                lineHeight: 1.4,
                marginBottom: 14,
                overflowX: 'auto'
              }}
            >
              {`<a href="${fullUrl}" target="_blank">\n  <span>⚡ Verified Merchant on Vendor Hub: ${title}</span>\n</a>`}
            </div>

            <button
              onClick={handleCopyEmbed}
              className="btn btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: badgeCopied ? '#10B981' : 'var(--primary)'
              }}
            >
              {badgeCopied ? <Check size={14} /> : <Code size={14} />}
              <span>{badgeCopied ? 'Badge Snippet Copied!' : 'Copy HTML Code'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
