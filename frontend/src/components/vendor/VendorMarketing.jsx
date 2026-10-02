import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useMarketing } from '../../contexts/MarketingContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import { api } from '../../services/api';
import {
  Megaphone, Tag, Sparkles, Percent, Ticket, Image as ImageIcon,
  CheckCircle2, Plus, Trash2, Pause, Play, Copy, ExternalLink,
  Calendar, Check, AlertCircle, ShoppingBag, Eye, DollarSign,
  TrendingUp, Award, Layers, ArrowUpRight, RefreshCw, X, ShieldCheck, Package
} from 'lucide-react';
import '../../styles/vendor.css';

const BANNER_PRESETS = [
  {
    label: 'Tech & Electronics',
    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=350&fit=crop',
    title: 'Monsoon Audio & Tech Mega Sale',
    subtitle: 'Up to 35% Off Premium Headphones & Genuine Sound Gear'
  },
  {
    label: 'Fashion & Footwear',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=350&fit=crop',
    title: 'Festive Runway Showcase',
    subtitle: 'Flat 20% Off Handpicked Designer Apparel & Courier Express'
  },
  {
    label: 'Home & Craft',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&h=350&fit=crop',
    title: 'Artisan Living & Decor Fair',
    subtitle: 'Sustainable Natural Wood & Ceramic Collectibles'
  },
  {
    label: 'Flash Sale Splash',
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=350&fit=crop',
    title: 'Exclusive Midnight Flash Clearance',
    subtitle: 'Limited Units · Extra ₹200 Cashback on Pre-Paid Orders'
  }
];

export default function VendorMarketing() {
  const { user } = useAuth();
  const { getVendorProducts } = useProducts();
  const {
    getPromotionsByVendor,
    createPromotion,
    deletePromotion,
    togglePromotionStatus,
    updateFeaturedProducts,
    getFeaturedProducts
  } = useMarketing();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'coupons' | 'bundles' | 'campaigns' | 'banners' | 'featured'
  const [copiedCode, setCopiedCode] = useState(null);

  // Bundles State
  const [bundles, setBundles] = useState([]);
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [bundleForm, setBundleForm] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: 15,
    selectedProductIds: []
  });

  const fetchBundles = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await api.getBundles({ vendorId: user.id });
      if (res?.success && Array.isArray(res.bundles)) {
        setBundles(res.bundles);
      }
    } catch (err) {
      console.warn('Failed to fetch bundles:', err?.message);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  // Coupon Creation Form Modal
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    title: '',
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 999,
    maxDiscount: 1000,
    usageLimit: 100,
    endDate: '2026-12-31',
    description: ''
  });

  // Promotional Banner Form Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState({
    title: 'Festive Super Sale',
    subtitle: 'Exclusive discounts on verified physical stock with fast courier dispatch',
    bannerUrl: BANNER_PRESETS[0].url,
    bannerPlacement: 'store_top',
    bannerLink: `/store/${user?.storeSlug || 'techzone'}`,
    buttonText: 'Claim Festive Deals',
    badgeText: 'LIMITED RUN'
  });

  // Featured Products Pinning State
  const initialPinned = useMemo(() => {
    return user?.id ? getFeaturedProducts(user.id) : [];
  }, [user?.id, getFeaturedProducts]);

  const [pinnedProductIds, setPinnedProductIds] = useState(initialPinned);
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setPinnedProductIds(getFeaturedProducts(user.id));
    }
  }, [user?.id, getFeaturedProducts]);

  useEffect(() => {
    document.title = 'Marketing & Promotions Command | Vendor Hub';
  }, []);

  const vendorPromotions = useMemo(() => {
    return user?.id ? getPromotionsByVendor(user.id) : [];
  }, [user?.id, getPromotionsByVendor]);

  const vendorProducts = useMemo(() => {
    return user?.id ? getVendorProducts(user.id) : [];
  }, [user?.id, getVendorProducts]);

  // Derived metrics
  const activeCoupons = useMemo(() => {
    return vendorPromotions.filter((p) => p.type === 'coupon' && p.status === 'active');
  }, [vendorPromotions]);

  const activeBanners = useMemo(() => {
    return vendorPromotions.filter((p) => p.type === 'promotional_banner' && p.status === 'active');
  }, [vendorPromotions]);

  const activeCampaigns = useMemo(() => {
    return vendorPromotions.filter((p) => p.type === 'discount_campaign' && p.status === 'active');
  }, [vendorPromotions]);

  const totalRedemptions = useMemo(() => {
    return vendorPromotions.reduce((acc, p) => acc + (p.usageCount || 0), 0);
  }, [vendorPromotions]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Coupon code "${code}" copied to clipboard!`, 'info');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleGenerateCode = () => {
    const prefixes = ['SAVE', 'FESTIVE', 'DEAL', 'MEGA', 'EXTRA', 'VIP'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const num = [10, 15, 20, 25, 30, 50, 100, 200][Math.floor(Math.random() * 8)];
    setCouponForm((prev) => ({ ...prev, code: `${prefix}${num}` }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.title || !couponForm.code) {
      addToast('Please enter both a title and code.', 'error');
      return;
    }

    await createPromotion({
      ...couponForm,
      type: 'coupon',
      vendorId: user?.id
    });

    setIsCouponModalOpen(false);
    setCouponForm({
      title: '',
      code: '',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 999,
      maxDiscount: 1000,
      usageLimit: 100,
      endDate: '2026-12-31',
      description: ''
    });
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.bannerUrl) {
      addToast('Please enter a banner title and image URL.', 'error');
      return;
    }

    await createPromotion({
      ...bannerForm,
      type: 'promotional_banner',
      vendorId: user?.id
    });

    setIsBannerModalOpen(false);
  };

  const handleToggleProductPin = (productId) => {
    setPinnedProductIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  const handleSaveFeatured = async () => {
    if (!user?.id) return;
    setIsSavingFeatured(true);
    await updateFeaturedProducts(user.id, pinnedProductIds);
    setIsSavingFeatured(false);
  };

  const brandColor = user?.themeColor || '#4F46E5';

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Vendor Marketing Center</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Promotions, discount vouchers, featured showcases & store banners for <strong>{user?.businessName}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => {
                const url = `${window.location.origin}/store/${user?.storeSlug || 'techzone'}`;
                window.open(url, '_blank');
              }}
            >
              <ExternalLink size={15} /> Live Storefront
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsCouponModalOpen(true)}
              style={{ background: brandColor, borderColor: brandColor }}
            >
              <Plus size={15} /> Create Voucher
            </button>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content">
          {/* Sub-Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12, overflowX: 'auto' }}>
            {[
              { id: 'overview', label: 'Overview & Performance', icon: <TrendingUp size={16} /> },
              { id: 'coupons', label: `Coupons & Vouchers (${vendorPromotions.filter(p => p.type === 'coupon').length})`, icon: <Ticket size={16} /> },
              { id: 'bundles', label: `Combo Bundles (${bundles.length})`, icon: <Package size={16} /> },
              { id: 'campaigns', label: `Discount Campaigns (${activeCampaigns.length})`, icon: <Percent size={16} /> },
              { id: 'banners', label: `Store Banners (${activeBanners.length})`, icon: <ImageIcon size={16} /> },
              { id: 'featured', label: `Featured Collection (${pinnedProductIds.length})`, icon: <Award size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: activeTab === tab.id ? `2px solid ${brandColor}` : '1px solid var(--border)',
                  background: activeTab === tab.id ? `${brandColor}15` : 'var(--surface)',
                  color: activeTab === tab.id ? brandColor : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s'
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* ═════════════════ 1. OVERVIEW TAB ═════════════════ */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                    <Ticket size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Coupons</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeCoupons.length}</div>
                    <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>Available for checkout</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <Percent size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Total Redemptions</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{totalRedemptions}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Times vouchers applied</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Active Banners</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{activeBanners.length}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Storefront displays</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FDF2F8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DB2777' }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Featured SKUs</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{pinnedProductIds.length}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pinned to store collection</div>
                  </div>
                </div>
              </div>

              {/* Quick Launchpad Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: 8, borderRadius: 8, background: '#EEF2FF', color: '#4F46E5' }}>
                        <Ticket size={20} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Voucher Generator</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      Launch percentage or flat rupee discounts for customers. Set minimum order thresholds (e.g. ₹999) to boost average cart order value.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => { setActiveTab('coupons'); setIsCouponModalOpen(true); }}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Plus size={14} /> New Coupon Code
                  </button>
                </div>

                <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: 8, borderRadius: 8, background: '#FEF3C7', color: '#D97706' }}>
                        <ImageIcon size={20} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Storefront Banner Studio</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      Feature high-converting promotion headers at the top of your public store page. Use curated photography presets or custom graphic links.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => { setActiveTab('banners'); setIsBannerModalOpen(true); }}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Plus size={14} /> Design Store Banner
                  </button>
                </div>

                <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <div style={{ padding: 8, borderRadius: 8, background: '#FDF2F8', color: '#DB2777' }}>
                        <Award size={20} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Curated Featured Shelf</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 16 }}>
                      Choose your top margin or flagship inventory to pin in the "Featured Collection" shelf right below your store header.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => setActiveTab('featured')}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Layers size={14} /> Curate Featured Products
                  </button>
                </div>
              </div>

              {/* Active Campaigns Table Summary */}
              <div className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={18} color={brandColor} /> Active Marketing Campaigns & Codes
                  </h3>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => setActiveTab('coupons')}
                    style={{ fontSize: '0.8rem' }}
                  >
                    View All Coupons →
                  </button>
                </div>

                {vendorPromotions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
                    <Megaphone size={40} style={{ opacity: 0.3, marginBottom: 10 }} />
                    <p>No active promotions configured yet. Create your first coupon or promo banner above!</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table className="vendor-table" style={{ width: '100%', fontSize: '0.85rem' }}>
                      <thead>
                        <tr>
                          <th>Campaign / Code</th>
                          <th>Type</th>
                          <th>Discount</th>
                          <th>Min Order</th>
                          <th>Redemptions</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vendorPromotions.map((promo) => (
                          <tr key={promo.id}>
                            <td>
                              <div style={{ fontWeight: 700 }}>{promo.title}</div>
                              {promo.code && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                  <code style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.75rem' }}>
                                    {promo.code}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(promo.code)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
                                    title="Copy code"
                                  >
                                    {copiedCode === promo.code ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                                  </button>
                                </div>
                              )}
                            </td>
                            <td>
                              <span style={{ textTransform: 'capitalize', fontSize: '0.78rem', background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 4 }}>
                                {promo.type.replace('_', ' ')}
                              </span>
                            </td>
                            <td>
                              {promo.type === 'coupon' || promo.type === 'discount_campaign' ? (
                                <strong style={{ color: '#16A34A' }}>
                                  {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `₹${promo.discountValue} FLAT`}
                                </strong>
                              ) : 'N/A'}
                            </td>
                            <td>{promo.minOrderValue > 0 ? `₹${promo.minOrderValue.toLocaleString()}` : 'None'}</td>
                            <td>
                              <strong>{promo.usageCount || 0}</strong>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}> / {promo.usageLimit || 100}</span>
                            </td>
                            <td>
                              <span style={{
                                padding: '3px 8px',
                                borderRadius: 12,
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: promo.status === 'active' ? '#DCFCE7' : '#FEF3C7',
                                color: promo.status === 'active' ? '#166534' : '#92400E'
                              }}>
                                {promo.status.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  type="button"
                                  onClick={() => togglePromotionStatus(promo.id)}
                                  className="btn btn-ghost btn-xs"
                                  title={promo.status === 'active' ? 'Pause' : 'Activate'}
                                >
                                  {promo.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deletePromotion(promo.id)}
                                  className="btn btn-ghost btn-xs"
                                  style={{ color: 'var(--danger)' }}
                                  title="Delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═════════════════ 2. COUPONS & VOUCHERS TAB ═════════════════ */}
          {activeTab === 'coupons' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Customer Coupon Codes & Vouchers</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Codes shoppers can enter at checkout to unlock percentage or flat currency discounts.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsCouponModalOpen(true)}
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  <Plus size={16} /> Create New Voucher
                </button>
              </div>

              {/* Interactive Coupon Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {vendorPromotions
                  .filter((p) => p.type === 'coupon')
                  .map((coupon) => (
                    <div
                      key={coupon.id}
                      style={{
                        background: 'var(--surface)',
                        border: '1.5px dashed var(--border)',
                        borderRadius: 14,
                        padding: 20,
                        position: 'relative',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        {/* Header badge */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: 12,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: coupon.status === 'active' ? '#DCFCE7' : '#FEF3C7',
                            color: coupon.status === 'active' ? '#166534' : '#92400E'
                          }}>
                            {coupon.status === 'active' ? '● LIVE AT CHECKOUT' : 'PAUSED'}
                          </span>

                          <div style={{ display: 'flex', gap: 4 }}>
                            <button
                              type="button"
                              onClick={() => togglePromotionStatus(coupon.id)}
                              className="btn btn-ghost btn-xs"
                              title={coupon.status === 'active' ? 'Pause' : 'Activate'}
                            >
                              {coupon.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => deletePromotion(coupon.id)}
                              className="btn btn-ghost btn-xs"
                              style={{ color: 'var(--danger)' }}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Big discount headline */}
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: brandColor, marginBottom: 4 }}>
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} FLAT OFF`}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 6 }}>{coupon.title}</div>
                        {coupon.description && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.4 }}>
                            {coupon.description}
                          </div>
                        )}

                        {/* Details pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                          <span style={{ background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Min Order: ₹{coupon.minOrderValue?.toLocaleString() || 0}
                          </span>
                          {coupon.maxDiscount > 0 && (
                            <span style={{ background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Max Cap: ₹{coupon.maxDiscount?.toLocaleString()}
                            </span>
                          )}
                          <span style={{ background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Expires: {coupon.endDate}
                          </span>
                        </div>
                      </div>

                      {/* Ticket footer with copy code */}
                      <div style={{
                        paddingTop: 12,
                        borderTop: '1px dashed var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <code style={{
                            background: '#EEF2FF',
                            color: '#4F46E5',
                            padding: '4px 10px',
                            borderRadius: 6,
                            fontSize: '0.9rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em'
                          }}>
                            {coupon.code}
                          </code>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => handleCopy(coupon.code)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                          >
                            {copiedCode === coupon.code ? <Check size={12} color="#16A34A" /> : <Copy size={12} />}
                            <span>{copiedCode === coupon.code ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <strong>{coupon.usageCount || 0}</strong> uses
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ═════════════════ 2B. PRODUCT BUNDLES TAB ═════════════════ */}
          {activeTab === 'bundles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Product Combo Bundles & Deals</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Bundle high-synergy products together with special discounts to boost average order value.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setBundleForm({
                      title: '',
                      description: '',
                      discountType: 'percentage',
                      discountValue: 15,
                      selectedProductIds: vendorProducts.slice(0, 2).map((p) => p.id)
                    });
                    setIsBundleModalOpen(true);
                  }}
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  <Plus size={16} /> Create Combo Bundle
                </button>
              </div>

              {bundles.length === 0 ? (
                <div className="card" style={{ padding: 48, textAlign: 'center' }}>
                  <Package size={48} color="var(--primary)" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>No Combo Bundles Created Yet</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 20px' }}>
                    Create paired product deals with discounts. Bundles appear directly on product pages and your public storefront.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setBundleForm({
                        title: '',
                        description: '',
                        discountType: 'percentage',
                        discountValue: 15,
                        selectedProductIds: vendorProducts.slice(0, 2).map((p) => p.id)
                      });
                      setIsBundleModalOpen(true);
                    }}
                  >
                    <Plus size={14} /> Create First Bundle
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
                  {bundles.map((bundle) => {
                    const savings = (bundle.originalPrice || 0) - (bundle.bundlePrice || 0);
                    const isActive = bundle.status === 'active';

                    return (
                      <div
                        key={bundle._id || bundle.id}
                        className="card"
                        style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                            <div>
                              <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800 }}>
                                {bundle.title}
                              </h4>
                              <span style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: 6,
                                background: isActive ? '#D1FAE5' : '#FEF3C7',
                                color: isActive ? '#065F46' : '#92400E'
                              }}>
                                {isActive ? '● Live on Store' : '○ Draft'}
                              </span>
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, background: '#10B981', color: '#fff', padding: '3px 8px', borderRadius: 6 }}>
                              {bundle.discountPercentage}% OFF
                            </span>
                          </div>

                          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0 0 16px' }}>
                            {bundle.description || 'Exclusive bundle offer'}
                          </p>

                          {/* Items included */}
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                            {bundle.items?.map((it, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <img
                                  src={it.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                                  alt={it.name}
                                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                                />
                                {idx < bundle.items.length - 1 && (
                                  <span style={{ fontWeight: 800, color: 'var(--primary)' }}>+</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                            <div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bundle Price</div>
                              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
                                ₹{bundle.bundlePrice?.toLocaleString('en-IN')}
                                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: 6 }}>
                                  ₹{bundle.originalPrice?.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                            {savings > 0 && (
                              <div style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                                Buyer Saves ₹{savings.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={async () => {
                                const newStatus = isActive ? 'draft' : 'active';
                                await api.updateBundle(bundle._id || bundle.id, { status: newStatus });
                                addToast(`Bundle set to ${newStatus}`, 'info');
                                fetchBundles();
                              }}
                            >
                              {isActive ? <Pause size={13} /> : <Play size={13} />}
                              <span>{isActive ? 'Pause' : 'Activate'}</span>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                              onClick={async () => {
                                if (window.confirm(`Delete bundle "${bundle.title}"?`)) {
                                  await api.deleteBundle(bundle._id || bundle.id);
                                  addToast('Bundle deleted', 'info');
                                  fetchBundles();
                                }
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════ 3. CAMPAIGNS TAB ═════════════════ */}
          {activeTab === 'campaigns' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Seasonal Sales & Discount Campaigns</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Site-wide or category markdowns with promotional badge overlays.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsCouponModalOpen(true)}
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  <Plus size={16} /> Launch New Campaign
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                {vendorPromotions
                  .filter((p) => p.type === 'discount_campaign')
                  .map((camp) => (
                    <div key={camp.id} className="card" style={{ padding: 22 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{
                          background: '#ECFDF5',
                          color: '#059669',
                          padding: '3px 8px',
                          borderRadius: 4,
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {camp.badgeText || 'CAMPAIGN'}
                        </span>
                        <button
                          type="button"
                          onClick={() => deletePromotion(camp.id)}
                          className="btn btn-ghost btn-xs"
                          style={{ color: 'var(--danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem' }}>{camp.title}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, margin: '0 0 14px 0' }}>
                        {camp.description || 'Promotional festival clearance active.'}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                        <span>Target: <strong>{camp.applicableCategory || 'All'}</strong></span>
                        <span>Discount: <strong style={{ color: '#16A34A' }}>{camp.discountValue}%</strong></span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ═════════════════ 4. BANNERS TAB ═════════════════ */}
          {activeTab === 'banners' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Storefront Promotional Banners</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Visual hero banners that appear on your storefront page to highlight offers.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setIsBannerModalOpen(true)}
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  <Plus size={16} /> New Store Banner
                </button>
              </div>

              {/* Banners List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {vendorPromotions
                  .filter((p) => p.type === 'promotional_banner')
                  .map((banner) => (
                    <div key={banner.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                      {/* Live Banner Preview Display */}
                      <div
                        style={{
                          height: 180,
                          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url(${banner.bannerUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          padding: '24px 32px',
                          color: 'white',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ background: '#4F46E5', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                            {banner.badgeText || 'SPECIAL OFFER'}
                          </span>
                          <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Placement: {banner.bannerPlacement}</span>
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 6px 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                          {banner.title}
                        </h2>
                        <p style={{ fontSize: '0.9rem', opacity: 0.9, maxWidth: 640, margin: 0 }}>
                          {banner.subtitle}
                        </p>
                      </div>

                      {/* Banner controls */}
                      <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Status: <strong style={{ color: banner.status === 'active' ? '#16A34A' : '#D97706' }}>{banner.status.toUpperCase()}</strong>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-xs"
                            onClick={() => togglePromotionStatus(banner.id)}
                          >
                            {banner.status === 'active' ? 'Pause Display' : 'Resume Display'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            style={{ color: 'var(--danger)' }}
                            onClick={() => deletePromotion(banner.id)}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ═════════════════ 5. FEATURED COLLECTION TAB ═════════════════ */}
          {activeTab === 'featured' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Curate Storefront Featured Collection</h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Pin select products to showcase at the top of your public store. Pinned: <strong>{pinnedProductIds.length}</strong> SKUs.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveFeatured}
                  disabled={isSavingFeatured}
                  style={{ background: brandColor, borderColor: brandColor, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <CheckCircle2 size={16} />
                  <span>{isSavingFeatured ? 'Saving to Database...' : 'Save Featured Selection'}</span>
                </button>
              </div>

              {/* Product selector grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {vendorProducts.map((product) => {
                  const isPinned = pinnedProductIds.includes(product.id);
                  return (
                    <div
                      key={product.id}
                      onClick={() => handleToggleProductPin(product.id)}
                      style={{
                        background: 'var(--surface)',
                        border: isPinned ? `2px solid ${brandColor}` : '1px solid var(--border)',
                        borderRadius: 12,
                        padding: 14,
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 12,
                        alignItems: 'center',
                        position: 'relative',
                        transition: 'all 0.15s',
                        boxShadow: isPinned ? '0 4px 12px rgba(79, 70, 229, 0.15)' : 'none'
                      }}
                    >
                      <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                        alt={product.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {product.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          SKU: {product.sku || product.id}
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>
                          ₹{product.price?.toLocaleString()}
                        </div>
                      </div>

                      <div style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        border: isPinned ? `2px solid ${brandColor}` : '2px solid var(--border)',
                        background: isPinned ? brandColor : 'transparent',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {isPinned && <Check size={14} />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE COUPON MODAL ── */}
      {isCouponModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            maxWidth: 580,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 28,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: 8, borderRadius: 8, background: '#EEF2FF', color: '#4F46E5' }}>
                  <Ticket size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Create Customer Discount Voucher</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCouponModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Voucher Title / Campaign Name:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Festival Mega Sound Discount"
                  value={couponForm.title}
                  onChange={(e) => setCouponForm({ ...couponForm, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, alignItems: 'flex-end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Coupon Code (Uppercase Alphanumeric):
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TECH25"
                    value={couponForm.code}
                    onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                    required
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleGenerateCode}
                  style={{ height: 38 }}
                >
                  <Sparkles size={14} /> Generate
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Discount Type:
                  </label>
                  <select
                    className="form-control"
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                  >
                    <option value="percentage">% Percentage Off</option>
                    <option value="fixed">₹ Fixed Currency Off</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Discount Amount:
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Min Order Subtotal (₹):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    placeholder="e.g. 999"
                    value={couponForm.minOrderValue}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Max Discount Cap (₹):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="0"
                    placeholder="e.g. 1000"
                    value={couponForm.maxDiscount}
                    onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Expiry Date:
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={couponForm.endDate}
                    onChange={(e) => setCouponForm({ ...couponForm, endDate: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    Usage Limit (Times):
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={couponForm.usageLimit}
                    onChange={(e) => setCouponForm({ ...couponForm, usageLimit: e.target.value })}
                  />
                </div>
              </div>

              {/* Live Ticket Preview */}
              <div style={{
                marginTop: 8,
                padding: 16,
                background: 'var(--surface-2)',
                borderRadius: 10,
                border: '1px dashed var(--border)'
              }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
                  Live Voucher Preview:
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: brandColor }}>
                      {couponForm.discountType === 'percentage' ? `${couponForm.discountValue}% OFF` : `₹${couponForm.discountValue} FLAT OFF`}
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{couponForm.title || 'Voucher Headline'}</div>
                  </div>
                  <code style={{ background: '#EEF2FF', color: '#4F46E5', padding: '4px 10px', borderRadius: 4, fontWeight: 800 }}>
                    {couponForm.code || 'CODE'}
                  </code>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsCouponModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  Save & Publish Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE BANNER MODAL ── */}
      {isBannerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 20
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 16,
            maxWidth: 620,
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: 28,
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ padding: 8, borderRadius: 8, background: '#FEF3C7', color: '#D97706' }}>
                  <ImageIcon size={20} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Design Promotional Store Banner</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Banner Headline:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Grand Festive Electronics Fiesta"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Subtitle / Promo Pitch:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Up to 40% Off Genuine Audio, Smartwatches & Gear + Direct Brand Warranty"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Curated High-Res Image Presets (Click to choose):
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginBottom: 8 }}>
                  {BANNER_PRESETS.map((p) => (
                    <div
                      key={p.label}
                      onClick={() => setBannerForm({
                        ...bannerForm,
                        bannerUrl: p.url,
                        title: p.title,
                        subtitle: p.subtitle
                      })}
                      style={{
                        padding: 8,
                        borderRadius: 8,
                        border: bannerForm.bannerUrl === p.url ? `2px solid ${brandColor}` : '1px solid var(--border)',
                        background: 'var(--surface-2)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600
                      }}
                    >
                      {p.label}
                    </div>
                  ))}
                </div>
                <input
                  type="url"
                  className="form-control"
                  placeholder="Or enter custom image URL"
                  value={bannerForm.bannerUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerUrl: e.target.value })}
                  required
                />
              </div>

              {/* Live Preview */}
              <div
                style={{
                  height: 140,
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.75)), url(${bannerForm.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '16px 20px',
                  color: 'white',
                  marginTop: 6
                }}
              >
                <span style={{ background: '#4F46E5', color: 'white', padding: '2px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 800, width: 'fit-content', marginBottom: 4 }}>
                  {bannerForm.badgeText}
                </span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{bannerForm.title}</div>
                <div style={{ fontSize: '0.78rem', opacity: 0.85 }}>{bannerForm.subtitle}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsBannerModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: brandColor, borderColor: brandColor }}
                >
                  Save & Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Product Bundle Modal */}
      {isBundleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsBundleModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Create Product Combo Bundle</h3>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsBundleModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (bundleForm.selectedProductIds.length < 2) {
                  addToast('Please select at least 2 products to create a combo bundle', 'danger');
                  return;
                }

                const selectedProducts = vendorProducts.filter((p) => bundleForm.selectedProductIds.includes(p.id));
                const origPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);

                let bundlePrice = origPrice;
                let discountPct = 0;
                if (bundleForm.discountType === 'percentage') {
                  discountPct = Number(bundleForm.discountValue) || 10;
                  bundlePrice = Math.round(origPrice * (1 - discountPct / 100));
                } else {
                  const fixedAmt = Number(bundleForm.discountValue) || 100;
                  bundlePrice = Math.max(0, origPrice - fixedAmt);
                  discountPct = origPrice > 0 ? Math.round((fixedAmt / origPrice) * 100) : 0;
                }

                const payload = {
                  vendorId: user.id,
                  title: bundleForm.title.trim(),
                  description: bundleForm.description.trim(),
                  items: selectedProducts.map((p) => ({
                    productId: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.images?.[0] || p.image || '',
                    quantity: 1
                  })),
                  originalPrice: origPrice,
                  bundlePrice: bundlePrice,
                  discountPercentage: discountPct,
                  discountType: bundleForm.discountType,
                  discountValue: Number(bundleForm.discountValue),
                  status: 'active'
                };

                const res = await api.createBundle(payload);
                if (res?.success) {
                  addToast('Bundle created and published to storefront!', 'success');
                  setIsBundleModalOpen(false);
                  fetchBundles();
                } else {
                  addToast('Failed to create bundle', 'danger');
                }
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Bundle Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Creator Audio + Pop Filter Starter Kit"
                  value={bundleForm.title}
                  onChange={(e) => setBundleForm({ ...bundleForm, title: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Description / Value Proposition:
                </label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Explain why these items work perfectly together..."
                  value={bundleForm.description}
                  onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                  Select Products to Include ({bundleForm.selectedProductIds.length} selected):
                </label>
                <div style={{ maxHeight: 180, overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {vendorProducts.map((prod) => {
                    const isChecked = bundleForm.selectedProductIds.includes(prod.id);
                    return (
                      <label
                        key={prod.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 8px',
                          borderRadius: 6,
                          background: isChecked ? '#EEF2FF' : 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.82rem'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const newIds = e.target.checked
                              ? [...bundleForm.selectedProductIds, prod.id]
                              : bundleForm.selectedProductIds.filter((id) => id !== prod.id);
                            setBundleForm({ ...bundleForm, selectedProductIds: newIds });
                          }}
                          style={{ accentColor: brandColor }}
                        />
                        <img
                          src={prod.images?.[0] || prod.image || ''}
                          alt={prod.name}
                          style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover' }}
                        />
                        <span style={{ flex: 1, fontWeight: isChecked ? 700 : 500 }}>{prod.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{prod.price?.toLocaleString('en-IN')}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                    Discount Type:
                  </label>
                  <select
                    className="form-control"
                    value={bundleForm.discountType}
                    onChange={(e) => setBundleForm({ ...bundleForm, discountType: e.target.value })}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Currency (₹)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                    Discount Value:
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={bundleForm.discountValue}
                    onChange={(e) => setBundleForm({ ...bundleForm, discountValue: e.target.value })}
                  />
                </div>
              </div>

              {/* Price Preview */}
              {bundleForm.selectedProductIds.length >= 2 && (() => {
                const sel = vendorProducts.filter((p) => bundleForm.selectedProductIds.includes(p.id));
                const orig = sel.reduce((acc, p) => acc + (p.price || 0), 0);
                const val = Number(bundleForm.discountValue) || 0;
                const bundlePr = bundleForm.discountType === 'percentage'
                  ? Math.round(orig * (1 - val / 100))
                  : Math.max(0, orig - val);
                const saved = orig - bundlePr;

                return (
                  <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span>Items Total (Original):</span>
                      <strong style={{ textDecoration: 'line-through' }}>₹{orig.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 700, marginBottom: 4 }}>
                      <span>Customer Savings:</span>
                      <span>-₹{saved.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: 6 }}>
                      <span>Combo Price:</span>
                      <span>₹{bundlePr.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setIsBundleModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: brandColor, borderColor: brandColor }}>
                  Publish Bundle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
