import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useProducts } from '../../contexts/ProductContext';
import {
  Store, Star, ShieldCheck, MapPin, Phone, Mail,
  Share2, Copy, Check, ExternalLink, Download, X, QrCode, Sparkles,
  Package, ShoppingBag, ArrowRight
} from 'lucide-react';

export default function VendorBusinessCardModal({ vendor, onClose, isOpen = true }) {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();
  const { getApprovedProducts } = useProducts();
  const navigate = useNavigate();

  if (!isOpen || !vendor) return null;

  const allProducts = getApprovedProducts() || [];
  const vId = vendor.id || vendor._id;
  const vSlug = vendor.storeSlug;
  let vendorProducts = allProducts.filter((p) =>
    (vId && (p.vendorId === vId || String(p.vendorId) === String(vId))) ||
    (vSlug && p.vendorSlug === vSlug)
  );
  if (vendorProducts.length === 0) {
    vendorProducts = allProducts.slice(0, 4);
  }

  const storeUrl = `${window.location.origin}/store/${vendor.storeSlug || vendor.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(storeUrl)}&margin=6&color=1E1B4B`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      addToast('Storefront link copied to clipboard! 📋', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast('Unable to copy link.', 'error');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vendor.businessName} — Verified Merchant on Vendor Hub`,
          text: `Check out ${vendor.businessName} on Vendor Hub. ${vendor.tagline || 'Genuine products with direct brand warranty.'}`,
          url: storeUrl
        });
      } catch (e) {
        if (e.name !== 'AbortError') handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${vendor.businessName}`,
      `ORG:${vendor.businessName};Vendor Hub Verified Merchant`,
      `TITLE:${vendor.ownerName || 'Merchant Partner'}`,
      `TEL;TYPE=WORK,VOICE:+91${vendor.mobile || '9876543210'}`,
      `EMAIL;TYPE=WORK:${vendor.email || 'store@vendorhub.in'}`,
      `ADR;TYPE=WORK:;;${vendor.businessAddress || ''};${vendor.location || 'India'};;;India`,
      `URL:${storeUrl}`,
      `NOTE:${vendor.tagline || ''} | GSTIN: ${vendor.gstin || ''}`,
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(vendor.storeSlug || 'vendor')}-contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('Contact card (.vcf) downloaded! 📇', 'success');
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const avatarUrl = vendor.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName || 'Store')}&background=4F46E5&color=fff&size=180`;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2100,
        padding: '20px'
      }}
    >
      <div
        className="business-card-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '460px',
          maxWidth: '100%',
          borderRadius: '24px',
          background: 'var(--surface)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid var(--border)'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            color: 'white',
            width: 32,
            height: 32,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 20
          }}
        >
          <X size={18} />
        </button>

        {/* Digital Card Top Banner */}
        <div
          style={{
            height: '110px',
            background: vendor.banner
              ? `linear-gradient(rgba(15, 23, 42, 0.4), rgba(15, 23, 42, 0.7)), url(${vendor.banner}) center/cover no-repeat`
              : `linear-gradient(135deg, ${vendor.themeColor || '#4F46E5'} 0%, #1E1B4B 100%)`,
            position: 'relative'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '20px',
              background: 'rgba(255,255,255,0.22)',
              backdropFilter: 'blur(8px)',
              padding: '4px 12px',
              borderRadius: 20,
              color: 'white',
              fontSize: '0.72rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              zIndex: 5
            }}
          >
            <Sparkles size={12} /> Digital Merchant vCard
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          {/* Avatar and Rating Row - Overlapping Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginTop: -42,
              marginBottom: 14,
              position: 'relative',
              zIndex: 10
            }}
          >
            <img
              src={avatarUrl}
              alt={vendor.businessName}
              style={{
                width: 78,
                height: 78,
                borderRadius: 18,
                border: '4px solid var(--surface, #ffffff)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                background: '#ffffff',
                objectFit: 'cover',
                flexShrink: 0,
                aspectRatio: '1 / 1',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName || 'Store')}&background=4F46E5&color=fff&size=160`;
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#FEF3C7',
                  color: '#92400E',
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}
              >
                <Star size={13} fill="#D97706" color="#D97706" />
                <span>{vendor.storeRating || 4.8}</span>
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: '#EEF2FF',
                  color: 'var(--primary)'
                }}
              >
                {vendor.category || 'Verified Store'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{vendor.businessName}</h3>
                {vendor.isVerified !== false && (
                  <ShieldCheck size={18} color="#10B981" title="Verified Merchant" />
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Owner: {vendor.ownerName || 'Verified Partner'} · {vendor.category || 'General Retail'}
              </div>
            </div>
          </div>

          <p style={{ margin: '12px 0 16px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {vendor.tagline || 'Authorized merchant with verified physical catalog and express courier dispatch.'}
          </p>

          {/* Details Grid */}
          <div
            style={{
              background: 'var(--surface-2)',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              fontSize: '0.78rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
              <span style={{ color: 'var(--text-secondary)' }}>
                {vendor.businessAddress ? `${vendor.businessAddress}, ` : ''}{vendor.location || 'India'}
                {vendor.deliveryRadiusKm ? ` (Serves ${vendor.deliveryRadiusKm} km radius)` : ''}
              </span>
            </div>
            {vendor.mobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>+91 {vendor.mobile}</span>
              </div>
            )}
            {vendor.gstin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)' }}>
                  GSTIN: <strong style={{ color: 'var(--text-primary)' }}>{vendor.gstin}</strong>
                </span>
              </div>
            )}
          </div>

          {/* QR Code & Scan Section */}
          <div
            style={{
              margin: '18px 0',
              padding: '16px',
              border: '1.5px dashed var(--border)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'var(--surface)'
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 10,
                overflow: 'hidden',
                background: 'white',
                padding: 4,
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0
              }}
            >
              <img
                src={qrCodeUrl}
                alt="Storefront QR Code"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Scan to Open Store</div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Scan this QR code with any mobile camera or UPI scanner to launch this verified storefront instantly.
              </div>
              <div
                style={{
                  fontSize: '0.72rem',
                  color: 'var(--primary)',
                  fontWeight: 600,
                  marginTop: 6,
                  wordBreak: 'break-all'
                }}
              >
                /store/{vendor.storeSlug || vendor.id}
              </div>
            </div>
          </div>

          {/* Verified Store Inventory Preview */}
          {vendorProducts.length > 0 && (
            <div style={{ margin: '14px 0 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-primary)' }}>
                  <Package size={14} color="var(--primary)" /> In-Stock Physical Inventory
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {vendorProducts.length} verified items
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(115px, 1fr))', gap: 8, maxHeight: 150, overflowY: 'auto' }}>
                {vendorProducts.slice(0, 4).map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      window.scrollTo(0, 0);
                      navigate(`/shop/product/${prod.id}`);
                    }}
                    title={`${prod.name} (Click to view)`}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      padding: 6,
                      background: 'var(--surface-sunken, rgba(0,0,0,0.02))',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 3,
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    <img
                      src={prod.images?.[0] || prod.image}
                      alt={prod.name}
                      style={{ width: '100%', height: 48, objectFit: 'cover', borderRadius: 4 }}
                    />
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {prod.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)' }}>
                      ₹{prod.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 10 }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
                window.scrollTo(0, 0);
                navigate(`/store/${vendor.storeSlug || vendor.id}`);
              }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700 }}
            >
              <Store size={16} /> Open Store Items
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.82rem' }}
            >
              {copied ? <Check size={15} color="var(--success)" /> : <Share2 size={15} />}
              {copied ? 'Copied!' : 'Share Store Link'}
            </button>
          </div>

          <div style={{ marginTop: 8 }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleDownloadVCard}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}
            >
              <Download size={14} /> Save Contact Card (.vcf)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
