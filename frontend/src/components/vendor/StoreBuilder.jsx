import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  Store, Palette, Globe, Image, Sparkles, CheckCircle2,
  ExternalLink, Copy, Eye, Smartphone, Monitor, AlertCircle,
  Award, ShieldCheck, Tag, Megaphone, ArrowRight, Save,
  RotateCcw, Check, Star, RefreshCw, X, Box
} from 'lucide-react';
import '../../styles/vendor.css';
import '../../styles/storeBuilder.css';

// ── Curated Color Theme Presets ──
const THEME_PRESETS = [
  { id: 'indigo', name: 'Electric Indigo', hex: '#4F46E5', accent: '#EEF2FF', dark: '#312E81' },
  { id: 'emerald', name: 'Royal Emerald', hex: '#059669', accent: '#D1FAE5', dark: '#064E3B' },
  { id: 'rose', name: 'Velvet Rose', hex: '#E11D48', accent: '#FFE4E6', dark: '#881337' },
  { id: 'amber', name: 'Cyber Amber', hex: '#D97706', accent: '#FEF3C7', dark: '#78350F' },
  { id: 'purple', name: 'Amethyst Purple', hex: '#7C3AED', accent: '#EDE9FE', dark: '#4C1D95' },
  { id: 'sky', name: 'Ocean Cyan', hex: '#0284C7', accent: '#E0F2FE', dark: '#0C4A6E' },
];

// ── Curated Banner Background Presets ──
const BANNER_PRESETS = [
  {
    id: 'tech',
    label: 'Modern Tech & Electronics',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
  },
  {
    id: 'fashion',
    label: 'Fashion & Boutique Apparel',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop',
  },
  {
    id: 'grocery',
    label: 'Organic Farm Grocery',
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop',
  },
  {
    id: 'home',
    label: 'Minimalist Home Living',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=300&fit=crop',
  },
  {
    id: 'luxury',
    label: 'Dark Sleek Gradient',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=300&fit=crop',
  },
  {
    id: 'vibrant',
    label: 'Vibrant Geometric Grid',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop',
  },
];

export default function StoreBuilder() {
  const { user, updateVendorStore, checkSlugAvailability } = useAuth();
  const { getVendorProducts } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Active Builder Tab
  const [activeTab, setActiveTab] = useState('identity');

  // Form State initialized with user properties
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [avatar, setAvatar] = useState('');
  const [banner, setBanner] = useState('');
  const [themeColor, setThemeColor] = useState('#4F46E5');
  const [themePreset, setThemePreset] = useState('indigo');
  const [announcement, setAnnouncement] = useState('');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [featuredProductIds, setFeaturedProductIds] = useState([]);
  const [storeStatus, setStoreStatus] = useState('published');
  const [businessAddress, setBusinessAddress] = useState('');
  const [location, setLocation] = useState('');
  const [mobile, setMobile] = useState('');

  // UI helpers
  const [slugError, setSlugError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial vendor data
  useEffect(() => {
    if (user) {
      setStoreName(user.businessName || '');
      setStoreSlug(user.storeSlug || (user.id ? `store-${user.id}` : 'mystore'));
      setTagline(user.tagline || 'Official verified physical retail outlet');
      setDescription(user.description || '');
      setAvatar(user.avatar || '');
      setBanner(user.banner || BANNER_PRESETS[0].url);
      setThemeColor(user.themeColor || '#4F46E5');
      setThemePreset(user.themePreset || 'indigo');
      setAnnouncement(user.announcement || '⚡ Same-Day Courier Dispatch across India & 1-Year Direct Brand Warranty!');
      setAnnouncementActive(user.announcementActive !== false);
      setFeaturedProductIds(user.featuredProductIds || []);
      setStoreStatus(user.storeStatus || 'published');
      setBusinessAddress(user.businessAddress || '');
      setLocation(user.location || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  useEffect(() => {
    document.title = 'Vendor Store Builder | Vendor Hub';
  }, []);

  // Approved Vendor Products for Featured Picker
  const vendorProducts = useMemo(() => {
    if (!user?.id) return [];
    return getVendorProducts(user.id);
  }, [user?.id, getVendorProducts]);

  // Validate Slug
  const handleSlugChange = (val) => {
    const cleaned = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setStoreSlug(cleaned);
    if (!cleaned) {
      setSlugError('Store URL slug cannot be empty.');
    } else if (cleaned.length < 3) {
      setSlugError('Slug must be at least 3 characters.');
    } else if (!checkSlugAvailability(cleaned, user?.id)) {
      setSlugError('This custom store URL is already taken by another merchant.');
    } else {
      setSlugError('');
    }
  };

  // Toggle Featured Product
  const toggleFeaturedProduct = (productId) => {
    setFeaturedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 6) {
        addToast('You can select up to 6 featured products.', 'info');
        return prev;
      }
      return [...prev, productId];
    });
  };

  // Select Preset Color
  const handleSelectPresetColor = (preset) => {
    setThemePreset(preset.id);
    setThemeColor(preset.hex);
  };

  // Save Store Settings Helper
  const saveStoreData = useCallback((newStatus = null) => {
    if (slugError) {
      addToast('Please resolve the store URL error first.', 'danger');
      return false;
    }
    setIsSaving(true);

    const updatedData = {
      businessName: storeName,
      storeSlug: storeSlug.trim() || `store-${user?.id}`,
      tagline: tagline.trim(),
      description: description.trim(),
      avatar: avatar.trim(),
      banner: banner.trim(),
      themeColor,
      themePreset,
      announcement: announcement.trim(),
      announcementActive,
      featuredProductIds,
      storeStatus: newStatus || storeStatus,
      businessAddress: businessAddress.trim(),
      location: location.trim(),
      mobile: mobile.trim(),
      isVerified: true,
    };

    updateVendorStore(user?.id, updatedData);
    setIsSaving(false);
    return true;
  }, [
    slugError, storeName, storeSlug, user?.id, tagline, description,
    avatar, banner, themeColor, themePreset, announcement, announcementActive,
    featuredProductIds, storeStatus, businessAddress, location, mobile,
    updateVendorStore, addToast
  ]);

  // Handle Save Draft
  const handleSaveDraft = () => {
    setStoreStatus('draft');
    if (saveStoreData('draft')) {
      addToast('Store draft saved successfully!', 'success');
    }
  };

  // Handle Publish Store
  const handlePublishStore = () => {
    setStoreStatus('published');
    if (saveStoreData('published')) {
      setCelebrateOpen(true);
      addToast('🚀 Your branded store is now LIVE to customers!', 'success');
    }
  };

  // Copy Store Link
  const handleCopyStoreLink = () => {
    const fullUrl = `${window.location.origin}/store/${storeSlug}`;
    navigator.clipboard.writeText(fullUrl);
    addToast('Store link copied to clipboard!', 'success');
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Vendor Store Builder</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Design, customize, and publish your branded storefront with GoDaddy-style control
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setPreviewOpen(true)}
            >
              <Eye size={15} /> Live Preview
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handlePublishStore}
              disabled={isSaving}
            >
              <Sparkles size={15} /> Publish Store
            </button>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="store-builder-container">
          {/* ── Top Header Banner Card ── */}
          <div className="builder-header">
            <div className="builder-header-left">
              <div className="builder-header-title-row">
                <h2 className="builder-header-title">
                  <Store size={22} color="var(--primary)" />
                  {storeName || 'My Branded Store'}
                </h2>
                <span className={`builder-status-pill ${storeStatus}`}>
                  {storeStatus === 'published' ? (
                    <>
                      <CheckCircle2 size={13} /> Published & Live
                    </>
                  ) : (
                    <>
                      <AlertCircle size={13} /> Draft Mode
                    </>
                  )}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF3C7', color: '#92400E', padding: '3px 8px', borderRadius: 6, fontSize: '0.74rem', fontWeight: 700 }}>
                  <Award size={13} /> Verified Merchant Badge Active
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                <div className="builder-url-chip">
                  <span>URL:</span>
                  <span>vendorhub.in/store/<strong>{storeSlug}</strong></span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.78rem' }}
                  onClick={handleCopyStoreLink}
                  title="Copy direct customer store URL"
                >
                  <Copy size={13} /> Copy Link
                </button>
                <Link
                  to={`/store/${storeSlug}`}
                  target="_blank"
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <ExternalLink size={13} /> Visit Store
                </Link>
              </div>
            </div>

            <div className="builder-header-actions">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save size={14} /> Save Draft
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handlePublishStore}
                disabled={isSaving}
                style={{ background: themeColor, borderColor: themeColor }}
              >
                <Sparkles size={14} /> Publish Store Changes
              </button>
            </div>
          </div>

          {/* ── Tabs Navigation ── */}
          <div className="builder-tabs">
            <button
              type="button"
              className={`builder-tab-btn ${activeTab === 'identity' ? 'active' : ''}`}
              onClick={() => setActiveTab('identity')}
            >
              <Globe size={16} /> 1. Store Identity & Custom URL
            </button>
            <button
              type="button"
              className={`builder-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
              onClick={() => setActiveTab('branding')}
            >
              <Palette size={16} /> 2. Branding & Theme Colors
            </button>
            <button
              type="button"
              className={`builder-tab-btn ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <Megaphone size={16} /> 3. Announcements & Story
            </button>
            <button
              type="button"
              className={`builder-tab-btn ${activeTab === 'featured' ? 'active' : ''}`}
              onClick={() => setActiveTab('featured')}
            >
              <Star size={16} /> 4. Featured Products ({featuredProductIds.length})
            </button>
          </div>

          {/* ── TAB 1: IDENTITY & CUSTOM URL ── */}
          {activeTab === 'identity' && (
            <div className="builder-card">
              <div className="builder-card-header">
                <h3 className="builder-card-title">
                  <Globe size={18} color="var(--primary)" /> Store Identity & Custom URL
                </h3>
                <p className="builder-card-subtitle">
                  Configure your store's public name, unique GoDaddy-style URL slug, and physical retail contact details.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                {/* Store Name */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Store Business Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g., TechZone Electronics"
                    required
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    The official branded name displayed to all customers across the platform.
                  </div>
                </div>

                {/* Custom URL Slug */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Custom Branded Store URL *
                  </label>
                  <div className="slug-input-wrapper">
                    <span className="slug-prefix">vendorhub.in/store/</span>
                    <input
                      type="text"
                      className="slug-input"
                      value={storeSlug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="my-brand"
                    />
                  </div>
                  {slugError ? (
                    <div style={{ fontSize: '0.78rem', color: '#EF4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <AlertCircle size={12} /> {slugError}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.78rem', color: '#10B981', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={12} /> Custom URL available and ready to share!
                    </div>
                  )}
                </div>

                {/* Tagline */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Store Catchphrase / Tagline
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g., India's Premier Destination for Genuine Electronics & Audio Gear"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Shown prominently on your store header beneath the business title.
                  </div>
                </div>

                {/* Physical Pickup Address */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Physical Warehouse / Store Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    placeholder="e.g., 14, Electronics Street, Nehru Place"
                  />
                </div>

                {/* City & State */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    City & State
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., New Delhi, Delhi"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('branding')}
                >
                  Continue to Branding & Colors <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 2: BRANDING & THEME COLORS ── */}
          {activeTab === 'branding' && (
            <div className="builder-card">
              <div className="builder-card-header">
                <h3 className="builder-card-title">
                  <Palette size={18} color="var(--primary)" /> Branding, Banner & Theme Engine
                </h3>
                <p className="builder-card-subtitle">
                  Give your storefront a distinct corporate identity with custom brand colors, high-resolution hero banners, and official logos.
                </p>
              </div>

              {/* Theme Color Presets */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: 8 }}>
                  Brand Primary Accent Color
                </label>
                <div className="color-presets-grid">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={`color-preset-card ${themePreset === preset.id ? 'active' : ''}`}
                      onClick={() => handleSelectPresetColor(preset)}
                    >
                      <div className="color-circle" style={{ background: preset.hex }}>
                        {themePreset === preset.id && <Check size={14} />}
                      </div>
                      <div>
                        <div className="color-preset-name">{preset.name}</div>
                        <div className="color-preset-hex">{preset.hex}</div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Custom Hex Picker */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                    Or select a custom brand hex:
                  </span>
                  <input
                    type="color"
                    value={themeColor}
                    onChange={(e) => {
                      setThemeColor(e.target.value);
                      setThemePreset('custom');
                    }}
                    style={{ width: 44, height: 36, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: 120, fontFamily: 'monospace', fontSize: '0.85rem' }}
                    value={themeColor}
                    onChange={(e) => {
                      setThemeColor(e.target.value);
                      setThemePreset('custom');
                    }}
                  />
                </div>
              </div>

              {/* Hero Banner Presets */}
              <div style={{ marginBottom: 28 }}>
                <label className="form-label" style={{ fontWeight: 700, marginBottom: 8 }}>
                  Hero Banner Background Preset
                </label>
                <div className="banner-presets-grid">
                  {BANNER_PRESETS.map((b) => (
                    <div
                      key={b.id}
                      className={`banner-preset-card ${banner === b.url ? 'active' : ''}`}
                      onClick={() => setBanner(b.url)}
                    >
                      <img src={b.url} alt={b.label} />
                      <div className="banner-preset-label">{b.label}</div>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: 12 }}>
                  <label className="form-label" style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    Or enter a custom high-resolution banner image URL:
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={banner}
                    onChange={(e) => setBanner(e.target.value)}
                    placeholder="https://example.com/my-store-banner.jpg"
                  />
                </div>
              </div>

              {/* Store Logo */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Store Logo / Brand Avatar URL
                  </label>
                  <input
                    type="url"
                    className="form-control"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Recommended size: 400x400 square PNG or JPG.
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <img
                    src={avatar}
                    alt="Logo Preview"
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: `2px solid ${themeColor}`,
                      boxShadow: 'var(--shadow-sm)',
                      background: 'var(--surface)'
                    }}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(storeName || 'V')}&background=${themeColor.replace('#', '')}&color=fff`;
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Logo Live Preview</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Appears on your store header, products, and checkout.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveTab('identity')}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('content')}
                >
                  Continue to Story & Announcements <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 3: CONTENT & ANNOUNCEMENTS ── */}
          {activeTab === 'content' && (
            <div className="builder-card">
              <div className="builder-card-header">
                <h3 className="builder-card-title">
                  <Megaphone size={18} color="var(--primary)" /> Store Story & Announcements
                </h3>
                <p className="builder-card-subtitle">
                  Engage customers with prominent storefront promotions, your authentic business story, and dispatch guarantees.
                </p>
              </div>

              {/* Announcement Bar */}
              <div style={{ background: 'var(--surface-2)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Megaphone size={18} color={themeColor} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Top Announcement Strip</span>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={announcementActive}
                      onChange={(e) => setAnnouncementActive(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: themeColor }}
                    />
                    Enable Announcement Banner
                  </label>
                </div>

                <input
                  type="text"
                  className="form-control"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="e.g., ⚡ Same-Day Courier Dispatch across India & 1-Year Direct Brand Warranty!"
                  disabled={!announcementActive}
                />

                {announcementActive && (
                  <div
                    style={{
                      marginTop: 12,
                      padding: '8px 14px',
                      background: themeColor,
                      color: 'white',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>📣 Preview:</span>
                    <span>{announcement || 'No announcement message entered yet.'}</span>
                  </div>
                )}
              </div>

              {/* Store Description / About Us */}
              <div className="form-group">
                <label className="form-label" style={{ fontWeight: 700 }}>
                  Store Story & Warehouse Guarantee
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Share your merchant origin story, physical retail outlet history, warehouse quality control measures, and direct manufacturer warranties..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveTab('branding')}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('featured')}
                >
                  Continue to Featured Products <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── TAB 4: FEATURED PRODUCTS ── */}
          {activeTab === 'featured' && (
            <div className="builder-card">
              <div className="builder-card-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <h3 className="builder-card-title">
                      <Star size={18} color="#F59E0B" /> Curate Featured Products Showcase
                    </h3>
                    <p className="builder-card-subtitle">
                      Choose up to 6 of your catalog items to highlight prominently in a dedicated hero grid on your storefront.
                    </p>
                  </div>
                  <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: 9999, fontSize: '0.78rem', fontWeight: 700 }}>
                    {featuredProductIds.length} of 6 Selected
                  </span>
                </div>
              </div>

              {vendorProducts.length === 0 ? (
                <div className="empty-state" style={{ padding: 40 }}>
                  <Box size={40} className="empty-state-icon" />
                  <h4>No physical products listed yet</h4>
                  <p>Add products to your catalog to feature them on your storefront.</p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/vendor/add-product')}
                  >
                    Add Physical Product
                  </button>
                </div>
              ) : (
                <div className="featured-picker-grid">
                  {vendorProducts.map((p) => {
                    const isSelected = featuredProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`featured-picker-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleFeaturedProduct(p.id)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          style={{ accentColor: themeColor, width: 16, height: 16 }}
                        />
                        <img
                          src={p.images?.[0]}
                          alt={p.name}
                          className="featured-picker-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop';
                          }}
                        />
                        <div className="featured-picker-info">
                          <div className="featured-picker-name">{p.name}</div>
                          <div className="featured-picker-price">₹{p.price?.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            SKU: {p.sku || 'N/A'} · Stock: {p.stock || p.quantity || 0}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveTab('content')}
                >
                  Back
                </button>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye size={15} /> Live Preview Store
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePublishStore}
                    style={{ background: themeColor, borderColor: themeColor }}
                  >
                    <Sparkles size={15} /> Publish Store
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LIVE INTERACTIVE DEVICE PREVIEW MODAL ── */}
      {previewOpen && (
        <div className="preview-modal-backdrop" onClick={() => setPreviewOpen(false)}>
          <div className="preview-modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="preview-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Store size={18} color="var(--primary)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Live Storefront Preview — {storeName}
                </span>
                <span className={`builder-status-pill ${storeStatus}`}>
                  {storeStatus}
                </span>
              </div>

              {/* Device Selector */}
              <div className="device-toggle-group">
                <button
                  type="button"
                  className={`device-btn ${previewDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor size={14} /> Desktop
                </button>
                <button
                  type="button"
                  className={`device-btn ${previewDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone size={14} /> Mobile
                </button>
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setPreviewOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Simulated Storefront Viewport */}
            <div className="preview-viewport-wrap">
              <div className={`preview-frame ${previewDevice}`}>
                {/* Simulated Announcement Bar */}
                {announcementActive && (
                  <div
                    style={{
                      background: themeColor,
                      color: 'white',
                      textAlign: 'center',
                      padding: '8px 12px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    {announcement}
                  </div>
                )}

                {/* Simulated Hero Banner */}
                <div
                  style={{
                    position: 'relative',
                    background: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.85)), url(${banner}) center/cover no-repeat`,
                    color: 'white',
                    padding: previewDevice === 'mobile' ? '24px 16px' : '40px 24px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <img
                      src={avatar}
                      alt={storeName}
                      style={{
                        width: previewDevice === 'mobile' ? 60 : 80,
                        height: previewDevice === 'mobile' ? 60 : 80,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: '3px solid rgba(255,255,255,0.4)',
                        background: 'var(--surface)',
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(storeName || 'V')}&background=${themeColor.replace('#', '')}&color=fff`;
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ background: '#F59E0B', color: '#78350F', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 800 }}>
                          <Award size={11} /> Verified Merchant
                        </span>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem' }}>
                          GSTIN: {user?.gstin || '07AABCT1234F1Z8'}
                        </span>
                      </div>
                      <h2 style={{ color: 'white', fontSize: previewDevice === 'mobile' ? '1.25rem' : '1.8rem', margin: 0, fontWeight: 800 }}>
                        {storeName}
                      </h2>
                      <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                        {tagline}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Products in Preview */}
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Star size={16} fill="#F59E0B" color="#F59E0B" />
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>Handpicked by Store Owner</h4>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: previewDevice === 'mobile' ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                    {featuredProductIds.length === 0 ? (
                      <div style={{ gridColumn: '1 / -1', padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        No featured products chosen yet. Select items in Tab 4.
                      </div>
                    ) : (
                      vendorProducts
                        .filter((p) => featuredProductIds.includes(p.id))
                        .slice(0, 6)
                        .map((p) => (
                          <div
                            key={p.id}
                            style={{
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              padding: 10,
                              background: 'var(--surface)',
                            }}
                          >
                            <img
                              src={p.images?.[0]}
                              alt={p.name}
                              style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 6, marginBottom: 8 }}
                            />
                            <div style={{ fontWeight: 600, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.name}
                            </div>
                            <div style={{ color: themeColor, fontWeight: 700, fontSize: '0.85rem', marginTop: 2 }}>
                              ₹{p.price?.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CELEBRATION PUBLISH MODAL ── */}
      {celebrateOpen && (
        <div className="preview-modal-backdrop" onClick={() => setCelebrateOpen(false)}>
          <div className="celebrate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="celebrate-icon-box">
              <Sparkles size={36} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text)' }}>
              🎉 Storefront Published!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: '0 0 20px 0' }}>
              Your branded store is officially published and live across the Vendor Hub marketplace ecosystem.
            </p>

            <div style={{ background: 'var(--surface-2)', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 24 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Your Custom Customer Store URL:
              </div>
              <div style={{ fontWeight: 700, color: themeColor, fontFamily: 'monospace', fontSize: '0.95rem' }}>
                vendorhub.in/store/{storeSlug}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCopyStoreLink}
              >
                <Copy size={15} /> Copy Store URL
              </button>
              <Link
                to={`/store/${storeSlug}`}
                target="_blank"
                className="btn btn-primary"
                style={{ background: themeColor, borderColor: themeColor }}
                onClick={() => setCelebrateOpen(false)}
              >
                <ExternalLink size={15} /> View Live Storefront
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
