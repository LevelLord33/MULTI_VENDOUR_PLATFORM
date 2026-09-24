import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useMarketing } from '../../contexts/MarketingContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import Navbar from '../common/Navbar';
import ContactVendorModal from './ContactVendorModal';
import ShareModal from '../common/ShareModal';
import {
  MapPin, Phone, Mail, Store, ShoppingCart, ArrowLeft, Package,
  Truck, ShieldCheck, RotateCcw, Star, CheckCircle, Search, Clock, Award,
  ExternalLink, Copy, Sparkles, Shield, Check, X, AlertCircle, Edit3,
  Tag, Ticket, MessageSquare, Flame, ArrowRight
} from 'lucide-react';
import { seedVendors } from '../../data/seedData';
import '../../styles/marketplace.css';

export default function VendorProfile() {
  const { id, slug } = useParams();
  const lookupKey = slug || id;
  const navigate = useNavigate();

  // 1. useContext hooks
  const { user, getVendorByIdOrSlug } = useAuth();
  const { getApprovedProducts } = useProducts();
  const { addToCart } = useCart();
  const { getPromotionsByVendor, getFeaturedProducts } = useMarketing();
  const { addToast } = useToast();

  const vendor = getVendorByIdOrSlug(lookupKey);

  // 2. useState hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // 3. useRef hook
  const searchInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lookupKey]);

  useEffect(() => {
    if (vendor) {
      const pageTitle = `${vendor.businessName} — Official Verified Storefront | Vendor Hub`;
      document.title = pageTitle;
      api.recordStoreVisit(vendor.id);

      // Dynamic SEO Meta Description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `${vendor.businessName} on Vendor Hub: ${vendor.tagline || '100% genuine physical inventory'}. Located in ${vendor.location || 'India'}. Fast courier fulfillment, GST invoice & verified brand warranty.`;

      // JSON-LD Structured Data Schema for Search Engines
      let scriptTag = document.getElementById('store-jsonld-schema');
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'store-jsonld-schema';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Store',
        name: vendor.businessName,
        description: vendor.tagline,
        url: window.location.href,
        telephone: vendor.mobile ? `+91-${vendor.mobile}` : '+91-9876543210',
        address: {
          '@type': 'PostalAddress',
          streetAddress: vendor.businessAddress || 'Main Market Road',
          addressLocality: vendor.location || 'India'
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: vendor.storeRating || 4.8,
          reviewCount: Math.round((vendor.totalOrdersFulfilled || 1240) * 0.28)
        }
      });
    }

    return () => {
      const scriptTag = document.getElementById('store-jsonld-schema');
      if (scriptTag) scriptTag.remove();
    };
  }, [vendor]);

  // Brand Accent Color & Theme
  const brandColor = vendor?.themeColor || '#4F46E5';
  const isStoreOwner = user?.type === 'vendor' && user?.id === vendor?.id;
  const isDraftMode = vendor?.storeStatus === 'draft';

  // 5. useMemo hooks
  const allVendorProducts = useMemo(() => {
    if (!vendor?.id) return [];
    return getApprovedProducts().filter((p) => p.vendorId === vendor.id);
  }, [getApprovedProducts, vendor?.id]);

  // Promotions from Marketing Center
  const vendorPromotions = useMemo(() => {
    return vendor?.id ? getPromotionsByVendor(vendor.id) : [];
  }, [vendor?.id, getPromotionsByVendor]);

  const activeCoupons = useMemo(() => {
    return vendorPromotions.filter((p) => p.type === 'coupon' && p.status === 'active');
  }, [vendorPromotions]);

  const activeBanners = useMemo(() => {
    return vendorPromotions.filter((p) => p.type === 'promotional_banner' && p.status === 'active');
  }, [vendorPromotions]);

  // Featured Products by Store Owner (synced with Marketing Center)
  const pinnedIds = useMemo(() => {
    if (!vendor?.id) return [];
    const livePinned = getFeaturedProducts(vendor.id);
    return livePinned && livePinned.length > 0 ? livePinned : (vendor.featuredProductIds || []);
  }, [vendor?.id, vendor?.featuredProductIds, getFeaturedProducts]);

  const featuredProducts = useMemo(() => {
    if (pinnedIds.length === 0) return [];
    return allVendorProducts.filter((p) => pinnedIds.includes(p.id));
  }, [allVendorProducts, pinnedIds]);

  const storeCategories = useMemo(() => {
    const cats = new Set(allVendorProducts.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [allVendorProducts]);

  const filteredProducts = useMemo(() => {
    return allVendorProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'All' || product.category === selectedCategory;
      const stock = product.stock != null ? product.stock : (product.quantity || 0);
      const matchesStock = !inStockOnly || stock > 0;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [allVendorProducts, searchQuery, selectedCategory, inStockOnly]);

  const storeStats = useMemo(() => {
    const totalItems = allVendorProducts.length;
    const totalInventoryUnits = allVendorProducts.reduce(
      (acc, p) => acc + (p.stock != null ? p.stock : (p.quantity || 0)),
      0
    );
    return { totalItems, totalInventoryUnits };
  }, [allVendorProducts]);

  // 6. useCallback hooks
  const handleQuickAdd = useCallback((product, e) => {
    e.stopPropagation();
    const stock = product.stock != null ? product.stock : (product.quantity || 0);
    if (stock <= 0) {
      addToast('This item is currently out of stock.', 'danger');
      return;
    }
    const defaultColor = product.variants?.colors?.[0]?.name || '';
    const defaultOption = product.variants?.options?.[0]?.label || '';
    addToCart(product, 1, { color: defaultColor, option: defaultOption });
    addToast(`Added ${product.name} (SKU: ${product.sku || 'N/A'}) to cart!`, 'success');
  }, [addToCart, addToast]);

  const handleCopyStoreLink = () => {
    setShowShareModal(true);
  };

  // Not Found State
  if (!vendor) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div className="empty-state">
            <Store size={64} className="empty-state-icon" />
            <h3>Storefront Not Found</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
              The requested store "{lookupKey}" does not exist or has been removed from the platform.
            </p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Back to Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draft Gate: Non-owner visitor trying to access a draft store
  if (isDraftMode && !isStoreOwner) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center', maxWidth: 640 }}>
          <div className="card" style={{ padding: 40 }}>
            <div style={{ width: 64, height: 64, background: '#FEF3C7', color: '#92400E', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Clock size={32} />
            </div>
            <h2 style={{ margin: '0 0 10px 0' }}>{vendor.businessName} is Opening Soon!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: 24 }}>
              This merchant is currently customizing their storefront catalog in the Vendor Store Builder. Check back soon for authentic inventory and fast courier fulfillment.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/shop')}>
                Explore Marketplace Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── STORE OWNER PREVIEW BANNER (IF IN DRAFT) ── */}
      {isDraftMode && isStoreOwner && (
        <div
          style={{
            background: '#FEF3C7',
            borderBottom: '1px solid #FDE68A',
            color: '#92400E',
            padding: '10px 20px',
            fontSize: '0.85rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} />
            <span>
              <strong>Store Owner Preview Mode (Draft)</strong> — Your store is not yet published to customers.
            </span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            style={{ padding: '4px 12px', fontSize: '0.78rem' }}
            onClick={() => navigate('/vendor/store-builder')}
          >
            <Edit3 size={13} /> Open Store Builder
          </button>
        </div>
      )}

      {/* ── TOP ANNOUNCEMENT STRIP (IF ENABLED) ── */}
      {vendor.announcementActive !== false && vendor.announcement && (
        <div
          style={{
            background: brandColor,
            color: 'white',
            textAlign: 'center',
            padding: '9px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>📣</span>
          <span>{vendor.announcement}</span>
        </div>
      )}

      {/* ── STORE HERO BANNER ── */}
      <div
        style={{
          position: 'relative',
          background: vendor.banner
            ? `linear-gradient(rgba(15, 23, 42, 0.72), rgba(15, 23, 42, 0.88)), url(${vendor.banner}) center/cover no-repeat`
            : `linear-gradient(135deg, ${brandColor}, #0F172A)`,
          color: 'white',
          padding: '44px 0 36px 0',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="container">
          {/* Navigation & Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <button
              onClick={() => navigate('/shop')}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: 8,
                padding: '6px 14px',
                color: 'white',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
                backdropFilter: 'blur(4px)',
              }}
            >
              <ArrowLeft size={16} /> All Marketplace Stores
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(6px)',
                  padding: '5px 12px',
                  borderRadius: 8,
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                vendorhub.in/store/<strong>{vendor.storeSlug || vendor.id}</strong>
              </div>
              <button
                type="button"
                onClick={handleCopyStoreLink}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <Copy size={13} /> Share Store
              </button>
              {!isStoreOwner && (
                <button
                  type="button"
                  onClick={() => setShowContactModal(true)}
                  style={{
                    background: 'rgba(255,255,255,0.25)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <MessageSquare size={13} /> Contact Merchant
                </button>
              )}
              {isStoreOwner && (
                <button
                  type="button"
                  onClick={() => navigate('/vendor/store-builder')}
                  style={{
                    background: brandColor,
                    border: '1px solid rgba(255,255,255,0.4)',
                    color: 'white',
                    padding: '6px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  <Edit3 size={13} /> Edit Store
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
            {/* Store Profile Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              <img
                src={vendor.avatar}
                alt={vendor.businessName}
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 20,
                  objectFit: 'cover',
                  border: '4px solid rgba(255,255,255,0.5)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                  background: 'white',
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName)}&background=4F46E5&color=fff`;
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  {/* Verified Merchant Badge */}
                  <button
                    type="button"
                    onClick={() => setShowTrustModal(true)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: '#F59E0B',
                      color: '#78350F',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)',
                    }}
                    title="Click to view verified GSTIN and physical warehouse verification"
                  >
                    <ShieldCheck size={14} /> Verified Vendor
                  </button>
                  <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem' }}>
                    GSTIN: {vendor.gstin || '07AABCV9999Z1Z0'}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem' }}>
                    Est. {new Date(vendor.joinedDate).getFullYear()}
                  </span>
                </div>

                <h1 style={{ color: 'white', fontSize: '2.2rem', margin: '2px 0 6px 0', fontWeight: 800 }}>
                  {vendor.businessName}
                </h1>

                {/* Tagline */}
                {vendor.tagline && (
                  <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: 8, fontWeight: 500, maxWidth: 680 }}>
                    {vendor.tagline}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={14} /> {vendor.businessAddress}, {vendor.location}
                  </span>
                  <span>•</span>
                  <span>Physical Retail Outlet & Dispatch Hub</span>
                </div>
              </div>
            </div>

            {/* Warehouse Metrics Pills */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 18px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: '#FCD34D', fontWeight: 800, fontSize: '1.2rem' }}>
                  <Star size={16} fill="#FCD34D" /> {vendor.storeRating || 4.8}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Store Rating</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 18px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>
                  {vendor.totalOrdersFulfilled || 1200}+
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Orders Fulfilled</div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', padding: '12px 18px', borderRadius: 12, textAlign: 'center' }}>
                <div style={{ color: '#4ADE80', fontWeight: 800, fontSize: '1.2rem' }}>
                  {vendor.onTimeDispatchRate || '98.8%'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>On-Time Dispatch</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '32px 24px' }}>
        {/* ── ACTIVE PROMOTIONAL STORE BANNER ── */}
        {activeBanners.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            {activeBanners.map((banner) => (
              <div
                key={banner.id}
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.75)), url(${banner.bannerUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  color: 'white',
                  padding: '36px 32px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{
                    background: brandColor,
                    color: 'white',
                    padding: '3px 10px',
                    borderRadius: 4,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em'
                  }}>
                    {banner.badgeText || 'SPECIAL OFFER'}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 8px 0', textShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p style={{ fontSize: '0.95rem', opacity: 0.95, maxWidth: 650, margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    {banner.subtitle}
                  </p>
                )}
                {banner.buttonText && (
                  <button
                    type="button"
                    className="btn btn-sm"
                    style={{
                      background: 'white',
                      color: '#0F172A',
                      fontWeight: 700,
                      width: 'fit-content',
                      border: 'none',
                      padding: '8px 18px',
                      borderRadius: 8
                    }}
                  >
                    {banner.buttonText} →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ACTIVE COUPONS & VOUCHERS BAR ── */}
        {activeCoupons.length > 0 && (
          <div style={{ marginBottom: 32, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Tag size={18} color={brandColor} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>
                Store Coupons & Discounts (Click to copy code)
              </h4>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {activeCoupons.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    navigator.clipboard.writeText(c.code);
                    addToast(`Copied coupon "${c.code}"! Apply at checkout.`, 'success');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'var(--surface-2)',
                    border: '1.5px dashed var(--border)',
                    padding: '8px 14px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <Ticket size={16} color={brandColor} />
                  <div>
                    <div style={{ fontWeight: 800, color: brandColor, fontSize: '0.85rem' }}>
                      {c.code}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT OFF`}
                      {c.minOrderValue > 0 ? ` on ₹${c.minOrderValue.toLocaleString()}+` : ''}
                    </div>
                  </div>
                  <Copy size={13} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FEATURED PRODUCTS SHOWCASE SECTION ── */}
        {featuredProducts.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={18} fill="#D97706" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                    Handpicked by Store Owner
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Curated flagship merchandise with priority courier packaging
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {featuredProducts.length} Featured Items
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
              {featuredProducts.map((product) => {
                const stock = product.stock != null ? product.stock : (product.quantity || 0);
                const isOut = stock <= 0;

                return (
                  <div
                    key={product.id}
                    className="product-card"
                    style={{ border: `1.5px solid ${brandColor}33`, boxShadow: 'var(--shadow-sm)' }}
                    onClick={() => navigate(`/shop/product/${product.id}`)}
                  >
                    <div className="product-card-img-wrap">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-card-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
                        }}
                      />
                      <div style={{ position: 'absolute', top: 10, left: 10, background: brandColor, color: 'white', fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                        ⭐ Staff Pick
                      </div>
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <span className={`badge badge-${isOut ? 'rejected' : 'approved'}`} style={{ fontSize: '0.72rem' }}>
                          {isOut ? 'Out of Stock' : `${stock} in Stock`}
                        </span>
                      </div>
                    </div>

                    <div className="product-card-body">
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        SKU: {product.sku || 'N/A'}
                      </div>
                      <div className="product-card-name" style={{ marginTop: 4, fontWeight: 700 }}>
                        {product.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                        <div className="product-card-price" style={{ color: brandColor }}>
                          <span className="currency">₹</span>
                          {product.price.toLocaleString('en-IN')}
                        </div>
                        {product.mrp && product.mrp > product.price && (
                          <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <button
                        className="product-card-add-btn"
                        disabled={isOut}
                        style={{
                          background: isOut ? '#9CA3AF' : brandColor,
                          opacity: isOut ? 0.6 : 1,
                          marginTop: 10,
                        }}
                        onClick={(e) => handleQuickAdd(product, e)}
                      >
                        <ShoppingCart size={14} /> {isOut ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Storefront Policy Badges Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <Truck size={24} color={brandColor} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Fast Courier Dispatch</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Via {vendor.shippingPartners?.join(', ') || 'BlueDart, Delhivery'}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <RotateCcw size={24} color="var(--success)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Direct Replacement</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {vendor.returnPolicy || '7 Days Replacement Guaranteed'}
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <ShieldCheck size={24} color="#D97706" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>Authentic Physical Inventory</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {vendor.warrantyPolicy || 'Official Invoice & Warranty Included'}
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 32, alignItems: 'start' }}>
          {/* Left Sidebar: Merchant Profile & Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <h4 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Store size={18} color={brandColor} /> Storefront Details
                </h4>
                <div className="divider" />

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 4 }}>
                    Store Description
                  </div>
                  <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                    {vendor.description || 'Authorized physical retail merchant maintaining authentic inventory and priority dispatch on Vendor Hub.'}
                  </p>
                </div>

                <div className="divider" />

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Store size={16} color={brandColor} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>RETAIL ADDRESS</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.businessAddress}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <MapPin size={16} color={brandColor} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>LOCATION</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.location}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Phone size={16} color={brandColor} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>STORE CONTACT</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>+91 {vendor.mobile}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Mail size={16} color={brandColor} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>EMAIL</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{vendor.email}</div>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* Inventory Summary Widget */}
                <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, textAlign: 'center' }}>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: brandColor }}>
                      {storeStats.totalItems}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unique Products</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>
                      {storeStats.totalInventoryUnits}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Units in Stock</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Main Column: Product Catalog with Filters */}
          <div>
            {/* Catalog Controls: Search, Category, In-Stock */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {/* Search in Store */}
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                  <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    className="form-control"
                    style={{ paddingLeft: 36, fontSize: '0.85rem' }}
                    placeholder={`Search products or SKU in ${vendor.businessName}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* In-Stock Filter Checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, padding: '0 8px' }}>
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ width: 16, height: 16, accentColor: brandColor }}
                  />
                  <span>In-Stock Only</span>
                </label>
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
                {storeCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedCategory === cat ? `1px solid ${brandColor}` : '1px solid var(--border)',
                      background: selectedCategory === cat ? brandColor : 'var(--surface-2)',
                      color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                Catalog Listings ({filteredProducts.length})
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Showing verified products ready for dispatch
              </span>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <Package size={52} className="empty-state-icon" />
                <h3>No Matching Physical Items</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
                  No stock items match your search or filter criteria in this store.
                </p>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                    setInStockOnly(false);
                  }}
                >
                  Reset Catalog Filters
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => {
                  const stock = product.stock != null ? product.stock : (product.quantity || 0);
                  const isLow = stock > 0 && stock <= (product.lowStockThreshold || 5);
                  const isOut = stock <= 0;

                  return (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => navigate(`/shop/product/${product.id}`)}
                    >
                      <div className="product-card-img-wrap">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="product-card-img"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop';
                          }}
                        />

                        {/* Stock Overlay Badge */}
                        <div style={{ position: 'absolute', top: 10, right: 10 }}>
                          {isOut ? (
                            <span className="badge badge-rejected" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="badge badge-pending" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                              ⚡ Only {stock} Left
                            </span>
                          ) : (
                            <span className="badge badge-approved" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                              In Stock
                            </span>
                          )}
                        </div>

                        {/* Fast Dispatch Tag */}
                        <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)', color: 'white', fontSize: '0.68rem', padding: '2px 6px', borderRadius: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={10} /> 24h Dispatch
                        </div>
                      </div>

                      <div className="product-card-body">
                        {/* SKU and Brand */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            SKU: {product.sku || 'VM-PHYSICAL'}
                          </span>
                          {product.brand && (
                            <span style={{ fontWeight: 600 }}>{product.brand}</span>
                          )}
                        </div>

                        {/* Title */}
                        <div className="product-card-name" style={{ marginTop: 4 }}>
                          {product.name}
                        </div>

                        {/* Price & MRP */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
                          <div className="product-card-price" style={{ color: brandColor }}>
                            <span className="currency">₹</span>
                            {product.price.toLocaleString('en-IN')}
                          </div>
                          {product.mrp && product.mrp > product.price && (
                            <span style={{ fontSize: '0.78rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart button */}
                        <button
                          className="product-card-add-btn"
                          disabled={isOut}
                          style={{
                            background: isOut ? '#9CA3AF' : brandColor,
                            opacity: isOut ? 0.6 : 1,
                            cursor: isOut ? 'not-allowed' : 'pointer',
                            marginTop: 10
                          }}
                          onClick={(e) => handleQuickAdd(product, e)}
                        >
                          <ShoppingCart size={14} /> {isOut ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Explore Other Local Merchants (Vendor-First Discovery Journey) ── */}
        <div style={{ marginTop: 48, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Store size={18} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Explore Other Verified Merchants on Vendor Hub
                </h3>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Discover other authentic physical sellers across India with warehouse stock and direct warranties
              </p>
            </div>
            <Link
              to="/stores"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--primary)',
                textDecoration: 'none'
              }}
            >
              <span>View All 10 Stores Directory</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 8 }}>
            {seedVendors.filter(v => v.id !== vendor?.id).map((v) => (
              <div
                key={v.id}
                onClick={() => navigate(`/store/${v.storeSlug || v.id}`)}
                style={{
                  minWidth: 220,
                  maxWidth: 240,
                  flex: '0 0 auto',
                  background: 'var(--surface-2, #F8FAFC)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 14,
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, border-color 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={v.avatar}
                    alt={v.businessName}
                    style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.businessName}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {v.location ? v.location.split(',')[0] : 'India'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.3, height: 28, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {v.tagline}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', marginTop: 4 }}>
                  <span style={{ color: '#D97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
                    ★ {v.storeRating || 4.8}
                  </span>
                  {['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(v.id) ? (
                    <span style={{ background: '#FEF3C7', color: '#B45309', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.66rem', display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                      <Flame size={10} /> Emerging
                    </span>
                  ) : (
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '1px 6px', borderRadius: 4, fontWeight: 700, fontSize: '0.66rem' }}>
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── VERIFIED VENDOR TRUST CREDENTIALS MODAL ── */}
      {showTrustModal && (
        <div
          className="preview-modal-backdrop"
          onClick={() => setShowTrustModal(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: 520,
              width: '100%',
              padding: 28,
              border: '1px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              style={{ position: 'absolute', top: 14, right: 14 }}
              onClick={() => setShowTrustModal(false)}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Verified Merchant Credentials</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Platform Authenticated Physical Retail Partner
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: '0.88rem' }}>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registered Business:</span>
                <strong>{vendor.businessName}</strong>
              </div>

              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Verified GSTIN:</span>
                <code style={{ fontWeight: 700, color: brandColor }}>{vendor.gstin || '07AABCV9999Z1Z0'}</code>
              </div>

              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Physical Warehouse:</span>
                <span style={{ textAlign: 'right', fontWeight: 600 }}>{vendor.businessAddress}, {vendor.location}</span>
              </div>

              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Dispatch Reliability:</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>{vendor.onTimeDispatchRate || '98.8%'} On-Time</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6 }}>
                  Verified Merchant Guarantee:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li>All listed items are physically stocked in registered warehouses.</li>
                  <li>Official tax invoice and manufacturer warranty included with every dispatch.</li>
                  <li>7-day physical return or replacement policy honored.</li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowTrustModal(false)}
                style={{ background: brandColor, borderColor: brandColor }}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Vendor Inquiry Modal */}
      {vendor && (
        <ContactVendorModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          vendor={vendor}
        />
      )}

      {/* Share Store Modal */}
      {vendor && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          type="store"
          title={vendor.businessName}
          subtitle={vendor.tagline}
          url={`/store/${vendor.storeSlug || vendor.id}`}
          image={vendor.avatar}
          badge="Verified Merchant"
        />
      )}

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 48, fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Verified Retail Storefront · Physical Inventory Network
      </footer>
    </div>
  );
}
