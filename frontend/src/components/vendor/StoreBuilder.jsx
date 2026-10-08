import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { apiService } from '../../services/api';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  Store, Palette, Globe, Image, Sparkles, CheckCircle2,
  ExternalLink, Copy, Eye, Smartphone, Monitor, AlertCircle,
  Award, ShieldCheck, Tag, Megaphone, ArrowRight, Save,
  RotateCcw, Check, Star, RefreshCw, X, Box, Clock, ShieldAlert,
  Send, Layers, CheckCircle
} from 'lucide-react';
import '../../styles/vendor.css';
import '../../styles/storeBuilder.css';

// ── 1-Click Quick-Start Niche Templates for Merchants ──
const QUICK_TEMPLATES = [
  {
    id: 'tech',
    title: '⚡ Tech & Electronics',
    tagline: 'Certified premium gadgets, official manufacturer warranty & express dispatch',
    category: 'Electronics',
    themePreset: 'indigo',
    themeColor: '#4F46E5',
    banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
    announcement: '⚡ Same-Day Courier Dispatch across India & 1-Year Direct Brand Warranty!',
    description: 'Welcome to our verified flagship tech outlet. We specialize in authentic consumer electronics, accessories, smart devices, and computer peripherals sourced directly from authorized brand distributors.'
  },
  {
    id: 'fashion',
    title: '👗 Fashion & Boutique',
    tagline: 'Curated designer apparel, luxury streetwear & seasonal runway collections',
    category: 'Fashion',
    themePreset: 'rose',
    themeColor: '#E11D48',
    banner: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=300&fit=crop',
    announcement: '✨ New season arrivals! Complimentary 7-day size exchanges on all apparel.',
    description: 'Discover bespoke clothing, tailored ethnic wear, and modern everyday essentials. Every garment is crafted with sustainable fabrics and checked for quality finishing.'
  },
  {
    id: 'grocery',
    title: '🥬 Fresh Organic Grocery',
    tagline: '100% Farm-fresh organic produce, pantry staples & daily essentials',
    category: 'Grocery & Gourmet',
    themePreset: 'emerald',
    themeColor: '#059669',
    banner: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=300&fit=crop',
    announcement: '🌱 Cold-chain morning dispatch: Orders placed before 10 AM deliver same day!',
    description: 'We partner directly with certified organic growers and local cooperatives. Enjoy pure unadulterated honey, cold-pressed oils, grains, and nutrient-dense farm harvests.'
  },
  {
    id: 'home',
    title: '🛋️ Modern Home & Living',
    tagline: 'Minimalist furniture, handcrafted accents & contemporary interior decor',
    category: 'Home & Living',
    themePreset: 'amber',
    themeColor: '#D97706',
    banner: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&h=300&fit=crop',
    announcement: '🏡 Free white-glove doorstep delivery & assembly on furniture orders over ₹2,500.',
    description: 'Transform your living spaces with ergonomic modern furnishings, ceramic tableware, organic linen, and ambient lighting crafted for enduring elegance.'
  },
  {
    id: 'artisan',
    title: '🎨 Artisan & Handmade',
    tagline: 'Authentic Indian handicrafts, traditional textiles & heritage artifacts',
    category: 'Art & Crafts',
    themePreset: 'purple',
    themeColor: '#7C3AED',
    banner: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=300&fit=crop',
    announcement: '🎨 100% Handcrafted by generational master artisans. Ethical & zero plastic packaging.',
    description: 'Directly supporting grassroots artisans and weavers. Each creation carries stories of ancient craft traditions, handloom weaves, brassware, and pottery.'
  },
  {
    id: 'beauty',
    title: '✨ Beauty & Wellness',
    tagline: 'Dermatologically tested clean skincare, ayurvedic formulations & self-care',
    category: 'Beauty & Wellness',
    themePreset: 'rose',
    themeColor: '#E11D48',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=300&fit=crop',
    announcement: '✨ Complimentary deluxe miniature serum sample with orders above ₹1,199!',
    description: 'Nourish your skin and senses with clean, cruelty-free botanicals, pure essential oils, and clinically-validated active dermatological formulations.'
  }
];

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
  const { user, updateVendorStore, submitVendorStorefront, checkSlugAvailability } = useAuth();
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
  const [storeStatus, setStoreStatus] = useState('draft');
  const [storeApprovalStatus, setStoreApprovalStatus] = useState('none');
  const [storeRejectionReason, setStoreRejectionReason] = useState('');
  const [storeSubmittedAt, setStoreSubmittedAt] = useState(null);
  const [storeApprovedAt, setStoreApprovedAt] = useState(null);
  const [businessAddress, setBusinessAddress] = useState('');
  const [location, setLocation] = useState('');
  const [mobile, setMobile] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // UI helpers
  const [slugError, setSlugError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [celebrateOpen, setCelebrateOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial vendor data from context and backend API
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
      setStoreStatus(user.storeStatus || 'draft');
      setStoreApprovalStatus(user.storeApprovalStatus || (user.storeStatus === 'published' ? 'approved' : 'none'));
      setStoreRejectionReason(user.storeRejectionReason || '');
      setStoreSubmittedAt(user.storeSubmittedAt || null);
      setStoreApprovedAt(user.storeApprovedAt || null);
      setBusinessAddress(user.businessAddress || '');
      setLocation(user.location || '');
      setMobile(user.mobile || '');
    }
  }, [user]);

  // Sync backend storefront approval status on mount
  useEffect(() => {
    if (user?.id) {
      apiService.getVendorStorefront(user.id).then((res) => {
        if (res && res.success && res.storefront) {
          const sf = res.storefront;
          if (sf.storeStatus) setStoreStatus(sf.storeStatus);
          if (sf.storeApprovalStatus) setStoreApprovalStatus(sf.storeApprovalStatus);
          if (sf.storeRejectionReason) setStoreRejectionReason(sf.storeRejectionReason);
          if (sf.storeSubmittedAt) setStoreSubmittedAt(sf.storeSubmittedAt);
          if (sf.storeApprovedAt) setStoreApprovedAt(sf.storeApprovedAt);
        }
      }).catch(() => {});
    }
  }, [user?.id]);

  useEffect(() => {
    document.title = 'Vendor Storefront Studio | Vendor Hub';
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

  // 1-Click Apply Niche Quick Template
  const handleApplyTemplate = (tpl) => {
    setSelectedTemplate(tpl.id);
    setTagline(tpl.tagline);
    setDescription(tpl.description);
    setBanner(tpl.banner);
    setThemePreset(tpl.themePreset);
    setThemeColor(tpl.themeColor);
    setAnnouncement(tpl.announcement);
    setAnnouncementActive(true);
    addToast(`Applied "${tpl.title}" template! Tailor details as needed.`, 'success');
  };

  // Save Storefront Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    const payload = {
      businessName: storeName.trim(),
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
      businessAddress: businessAddress.trim(),
      location: location.trim(),
      mobile: mobile.trim(),
      action: 'save_draft'
    };

    try {
      if (submitVendorStorefront) {
        await submitVendorStorefront(user?.id, payload);
      } else {
        updateVendorStore(user?.id, { ...payload, storeStatus: 'draft' });
      }
      setStoreStatus('draft');
      setStoreApprovalStatus('none');
      addToast('Storefront draft saved successfully!', 'success');
    } catch {
      addToast('Draft saved locally.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  // Submit Storefront for Admin Permission & Approval
  const handleSubmitForAdminApproval = async () => {
    if (slugError) {
      addToast('Please resolve the store URL error first.', 'danger');
      setActiveTab('identity');
      return;
    }
    if (!storeName.trim()) {
      addToast('Store Business Name is required.', 'danger');
      setActiveTab('identity');
      return;
    }

    setIsSaving(true);
    const payload = {
      businessName: storeName.trim(),
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
      businessAddress: businessAddress.trim(),
      location: location.trim(),
      mobile: mobile.trim(),
      action: 'submit_for_approval'
    };

    try {
      let res = null;
      if (submitVendorStorefront) {
        res = await submitVendorStorefront(user?.id, payload);
      } else {
        res = await apiService.submitVendorStorefront(user?.id, payload, user);
      }
      setStoreStatus('pending_approval');
      setStoreApprovalStatus('pending');
      setStoreSubmittedAt(new Date().toISOString());
      setCelebrateOpen(true);
      addToast('🚀 Storefront uploaded! Awaiting Admin review to activate on Customer Portal.', 'success');
    } catch (err) {
      setStoreStatus('pending_approval');
      setCelebrateOpen(true);
      addToast('Storefront uploaded for Admin review.', 'success');
    } finally {
      setIsSaving(false);
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
            <div className="vendor-topbar-title">Vendor Storefront Studio</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Create, design, and upload your shopping storefront with Admin permission workflow
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
              className="btn btn-outline btn-sm"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save size={15} /> Save Draft
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSubmitForAdminApproval}
              disabled={isSaving}
              style={{
                background: storeStatus === 'published' ? '#059669' : themeColor,
                borderColor: storeStatus === 'published' ? '#059669' : themeColor
              }}
            >
              <Send size={15} /> {storeStatus === 'published' ? 'Update Live Store' : 'Upload for Admin Approval'}
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
                  {(storeStatus === 'published' || storeStatus === 'approved') ? (
                    <>
                      <CheckCircle2 size={13} /> Published & Live
                    </>
                  ) : storeStatus === 'pending_approval' ? (
                    <>
                      <Clock size={13} /> Awaiting Admin Approval
                    </>
                  ) : storeStatus === 'rejected' ? (
                    <>
                      <ShieldAlert size={13} /> Revision Requested
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
                onClick={handleSubmitForAdminApproval}
                disabled={isSaving}
                style={{
                  background: (storeStatus === 'published' || storeStatus === 'approved') ? '#059669' : themeColor,
                  borderColor: (storeStatus === 'published' || storeStatus === 'approved') ? '#059669' : themeColor
                }}
              >
                <Send size={14} /> {(storeStatus === 'published' || storeStatus === 'approved') ? 'Update Live Store' : 'Upload for Admin Approval'}
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
            <button
              type="button"
              className={`builder-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
              style={{
                borderColor: activeTab === 'upload' ? 'var(--primary)' : undefined,
                fontWeight: activeTab === 'upload' ? 700 : undefined
              }}
            >
              <Sparkles size={16} /> 5. Upload & Admin Approval
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

              {/* ── 1-Click Quick-Start Niche Templates ── */}
              <div style={{ background: 'var(--surface-2)', padding: 18, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.96rem', color: 'var(--text)' }}>
                      <Sparkles size={16} color="var(--primary)" /> Quick-Start Niche Templates (1-Click Setup)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      New merchant? Select your retail category to auto-fill high-converting banners, branding palettes, and story copy instantly.
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                    Fast Onboarding
                  </span>
                </div>

                <div className="template-grid">
                  {QUICK_TEMPLATES.map((tpl) => (
                    <div
                      key={tpl.id}
                      className={`template-card ${selectedTemplate === tpl.id ? 'active' : ''}`}
                      onClick={() => handleApplyTemplate(tpl)}
                    >
                      <div>
                        <div className="template-title">
                          {tpl.title}
                        </div>
                        <div className="template-tagline">
                          {tpl.tagline}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                        <span className="template-badge">{tpl.category}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          {selectedTemplate === tpl.id ? '✓ Selected' : 'Apply Preset →'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                    onClick={() => setActiveTab('upload')}
                    style={{ background: themeColor, borderColor: themeColor }}
                  >
                    Continue to Upload & Admin Approval <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 5: UPLOAD & ADMIN APPROVAL ── */}
          {activeTab === 'upload' && (
            <div className="builder-card">
              <div className="builder-card-header">
                <h3 className="builder-card-title">
                  <Sparkles size={18} color="var(--primary)" /> 5. Storefront Upload & Admin Permission
                </h3>
                <p className="builder-card-subtitle">
                  Upload your branded storefront to the platform administration for catalog verification. Once approved, your store will immediately go live on the Customer Portal.
                </p>
              </div>

              {/* ── Live Approval Status Banner ── */}
              {storeStatus === 'pending_approval' && (
                <div className="approval-banner pending">
                  <Clock size={28} color="#2563EB" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E40AF', marginBottom: 4 }}>
                      ⏳ Storefront Submitted — Awaiting Admin Approval
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#1E3A8A', lineHeight: 1.5, marginBottom: 12 }}>
                      Your storefront configuration has been uploaded to the Admin Review Queue. Platform administrators review merchant storefronts to maintain consumer trust and product safety. Once approved, your storefront will immediately be activated on the public Customer Portal.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.78rem', color: '#3B82F6', background: 'rgba(59, 130, 246, 0.15)', padding: '3px 8px', borderRadius: 4, fontWeight: 600 }}>
                        Submitted: {storeSubmittedAt ? new Date(storeSubmittedAt).toLocaleString() : 'Recently'}
                      </span>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ background: 'white', color: '#1E40AF', borderColor: '#BFDBFE' }}
                        onClick={() => {
                          apiService.getVendorStorefront(user?.id).then((res) => {
                            if (res?.storefront) {
                              setStoreStatus(res.storefront.storeStatus || 'pending_approval');
                              setStoreApprovalStatus(res.storefront.storeApprovalStatus || 'pending');
                              addToast('Status refreshed: ' + res.storefront.storeStatus, 'info');
                            }
                          });
                        }}
                      >
                        <RefreshCw size={13} /> Refresh Status
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {(storeStatus === 'published' || storeStatus === 'approved') && (
                <div className="approval-banner approved">
                  <CheckCircle size={28} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#065F46', marginBottom: 4 }}>
                      🟢 Approved by Admin — Live on Customer Portal!
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#064E3B', lineHeight: 1.5, marginBottom: 12 }}>
                      Your storefront is fully verified and live. Customers can discover your store on the Customer Portal (/stores) and shop your catalog directly at <strong>vendorhub.in/store/{storeSlug}</strong>.
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <Link
                        to={`/store/${storeSlug}`}
                        target="_blank"
                        className="btn btn-sm btn-primary"
                        style={{ background: '#059669', borderColor: '#059669' }}
                      >
                        <ExternalLink size={13} /> Open Live Storefront
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ background: 'white' }}
                        onClick={handleCopyStoreLink}
                      >
                        <Copy size={13} /> Copy Shareable URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {storeStatus === 'rejected' && (
                <div className="approval-banner rejected">
                  <ShieldAlert size={28} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#991B1B', marginBottom: 4 }}>
                      ⚠️ Revision Requested by Admin
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#7F1D1D', lineHeight: 1.5, marginBottom: 10 }}>
                      The administrator reviewed your storefront and requested adjustments:
                    </div>
                    <div style={{ background: 'rgba(254, 226, 226, 0.8)', border: '1px solid #FECACA', borderRadius: 6, padding: '8px 12px', fontSize: '0.85rem', color: '#7F1D1D', fontWeight: 600, marginBottom: 12 }}>
                      "{storeRejectionReason || 'Please review your store identity, description, and catalog items before resubmitting.'}"
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#991B1B' }}>
                      Please update the required information in Tabs 1–4 above, then click <strong>"Upload & Resubmit for Admin Approval"</strong> below.
                    </div>
                  </div>
                </div>
              )}

              {storeStatus === 'draft' && (
                <div className="approval-banner draft">
                  <Layers size={28} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#92400E', marginBottom: 4 }}>
                      📝 Draft Mode — Ready to Upload for Admin Approval
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#78350F', lineHeight: 1.5 }}>
                      Your storefront design is currently saved as a private draft. To make it visible on the Customer Portal (/stores), submit it for Admin Permission below.
                    </div>
                  </div>
                </div>
              )}

              {/* ── Storefront Readiness Checklist ── */}
              <div style={{ marginTop: 24, marginBottom: 24 }}>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={18} color="var(--primary)" /> Storefront Launch Readiness Checklist
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Store Business Name</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{storeName || 'Not configured'}</div>
                    </div>
                    {storeName ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
                  </div>

                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Custom Store URL</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>/store/{storeSlug}</div>
                    </div>
                    {storeSlug && !slugError ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
                  </div>

                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Hero Banner & Theme</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Theme: {themePreset.toUpperCase()}</div>
                    </div>
                    {banner ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
                  </div>

                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Location & Contact</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{location || businessAddress || 'Not set'}</div>
                    </div>
                    {(location || businessAddress) ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#F59E0B" />}
                  </div>

                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Top Announcement Bar</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{announcementActive ? 'Enabled' : 'Disabled'}</div>
                    </div>
                    {announcementActive ? <CheckCircle2 size={18} color="#10B981" /> : <CheckCircle2 size={18} color="#94A3B8" />}
                  </div>

                  <div className="checklist-card">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Showcase Products</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{featuredProductIds.length} items highlighted</div>
                    </div>
                    {featuredProductIds.length > 0 ? <CheckCircle2 size={18} color="#10B981" /> : <CheckCircle2 size={18} color="#94A3B8" />}
                  </div>
                </div>
              </div>

              {/* ── Workflow Explainer Card ── */}
              <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={16} color="var(--primary)" /> How Storefront Admin Permission Works
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>1. Submit Storefront:</strong> You upload your visual branding, custom URL, and store identity in this studio.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>2. Admin Verification:</strong> Platform administrators review merchant credentials to maintain safe commerce.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>3. Live on Customer Portal:</strong> Once approved, your store appears on /stores and is instantly shoppable.
                  </div>
                </div>
              </div>

              {/* ── Action Buttons ── */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setActiveTab('featured')}
                >
                  Back to Featured Products
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setPreviewOpen(true)}
                  >
                    <Eye size={15} /> Preview Storefront
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                  >
                    <Save size={15} /> Save Draft
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmitForAdminApproval}
                    disabled={isSaving}
                    style={{
                      background: (storeStatus === 'published' || storeStatus === 'approved') ? '#059669' : themeColor,
                      borderColor: (storeStatus === 'published' || storeStatus === 'approved') ? '#059669' : themeColor,
                      padding: '10px 20px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)'
                    }}
                  >
                    <Send size={16} />
                    {storeStatus === 'pending_approval'
                      ? '🚀 Re-Submit Updated Storefront'
                      : (storeStatus === 'published' || storeStatus === 'approved')
                      ? '🚀 Update Live Storefront'
                      : '🚀 Upload & Submit for Admin Approval'}
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

      {/* ── CELEBRATION / SUBMISSION MODAL ── */}
      {celebrateOpen && (
        <div className="preview-modal-backdrop" onClick={() => setCelebrateOpen(false)}>
          <div className="celebrate-modal" onClick={(e) => e.stopPropagation()}>
            <div
              className="celebrate-icon-box"
              style={{
                background: (storeStatus === 'published' || storeStatus === 'approved')
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : 'linear-gradient(135deg, #4F46E5, #3B82F6)',
                boxShadow: (storeStatus === 'published' || storeStatus === 'approved')
                  ? '0 10px 25px rgba(16, 185, 129, 0.35)'
                  : '0 10px 25px rgba(79, 70, 229, 0.35)'
              }}
            >
              {(storeStatus === 'published' || storeStatus === 'approved') ? (
                <Sparkles size={36} />
              ) : (
                <Clock size={36} />
              )}
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--text)' }}>
              {(storeStatus === 'published' || storeStatus === 'approved')
                ? '🎉 Storefront Approved & Live!'
                : '🚀 Storefront Uploaded for Admin Permission!'}
            </h3>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 18px 0', lineHeight: 1.5 }}>
              {(storeStatus === 'published' || storeStatus === 'approved')
                ? 'Your branded storefront is officially active on the public Customer Portal (/stores) and ready to receive customer orders.'
                : 'Your storefront has been successfully uploaded to the Platform Admin Review Queue. Once the administrator grants approval, your storefront will immediately go live on the Customer Portal (/stores).'}
            </p>

            <div style={{ background: 'var(--surface-2)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border)', marginBottom: 20, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                <span className={`builder-status-pill ${storeStatus}`}>
                  {(storeStatus === 'published' || storeStatus === 'approved') ? 'Approved & Live' : 'Pending Admin Permission'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                Customer Storefront URL:
              </div>
              <div style={{ fontWeight: 700, color: themeColor, fontFamily: 'monospace', fontSize: '0.92rem' }}>
                vendorhub.in/store/{storeSlug}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setCelebrateOpen(false);
                  setPreviewOpen(true);
                }}
              >
                <Eye size={15} /> Preview Storefront
              </button>
              {(storeStatus === 'published' || storeStatus === 'approved') ? (
                <Link
                  to={`/store/${storeSlug}`}
                  target="_blank"
                  className="btn btn-primary"
                  style={{ background: '#059669', borderColor: '#059669' }}
                  onClick={() => setCelebrateOpen(false)}
                >
                  <ExternalLink size={15} /> Visit Customer Store
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ background: themeColor, borderColor: themeColor }}
                  onClick={() => {
                    setCelebrateOpen(false);
                    navigate('/vendor/dashboard');
                  }}
                >
                  Back to Vendor Hub
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
