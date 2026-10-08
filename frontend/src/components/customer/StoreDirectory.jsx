import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import ShareModal from '../common/ShareModal';
import VendorBusinessCardModal from '../common/VendorBusinessCardModal';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { checkDeliveryCoverage } from '../../utils/geoUtils';
import { seedVendors, seedProducts } from '../../data/seedData';
import {
  Store, Search, Star, ShieldCheck, MapPin, Package,
  ArrowRight, Share2, Sparkles, Filter, CheckCircle2,
  Truck, Award, ChevronRight, RefreshCw, Layers, ExternalLink,
  Flame, Compass, Building2, QrCode, Navigation, Shield
} from 'lucide-react';
import '../../styles/marketplace.css';

const INDIAN_CITIES = [
  'All Cities', 'New Delhi', 'Mumbai', 'Bengaluru', 'Kolkata',
  'Hyderabad', 'Chennai', 'Jaipur', 'Pune', 'Kochi', 'Chandigarh'
];

const BUSINESS_TYPES = [
  'All Types', 'Private Limited', 'Partnership', 'Sole Proprietorship', 'LLP'
];

export default function StoreDirectory() {
  const { t } = useLanguage();
  const { customerLocation, setCustomerLocation, vendors } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedBusinessType, setSelectedBusinessType] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'emerging' | 'nearby' | 'top_rated' | 'featured'
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'orders' | 'name'
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [deliversOnly, setDeliversOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Modals
  const [shareTarget, setShareTarget] = useState(null);
  const [cardVendor, setCardVendor] = useState(null);

  useEffect(() => {
    document.title = 'Explore Verified Stores & Local Merchants | Vendor Hub';
  }, []);

  // Fetch Stores & Categories
  const fetchStoreDirectory = useCallback(async () => {
    setLoading(true);
    try {
      const cityParam = selectedCity !== 'All Cities' ? selectedCity : '';
      const bTypeParam = selectedBusinessType !== 'All Types' ? selectedBusinessType : '';

      const [storesRes, catsRes] = await Promise.all([
        api.getStores({
          search: searchQuery,
          category: selectedCategory === 'All' ? '' : selectedCategory,
          city: cityParam,
          businessType: bTypeParam,
          emergingOnly: activeTab === 'emerging' ? 'true' : '',
          featured: activeTab === 'featured' ? 'true' : '',
          sortBy,
          verifiedOnly: verifiedOnly ? 'true' : '',
          customerCity: customerLocation,
          deliversOnly: deliversOnly ? 'true' : '',
          minRating: minRating > 0 ? String(minRating) : ''
        }),
        api.getStoreCategories()
      ]);

      if (storesRes && storesRes.success && storesRes.stores && storesRes.stores.length > 0) {
        let storeList = storesRes.stores;
        if (activeTab === 'nearby') {
          storeList = storeList.filter((s) => checkDeliveryCoverage(s, customerLocation).delivers);
        } else if (activeTab === 'top_rated') {
          storeList = storeList.filter((s) => (s.storeRating || 0) >= 4.5);
        }
        setStores(storeList);
      } else {
        // Fallback to active vendors (only approved or published stores on customer portal)
        const vendorPool = (vendors && vendors.length > 0) ? vendors : seedVendors;
        let fallback = vendorPool
          .filter(v => (v.storeStatus === 'published' || v.storeStatus === 'approved' || v.storeApprovalStatus === 'approved') && !['draft', 'pending_approval', 'rejected'].includes(v.storeStatus) && v.storeApprovalStatus !== 'pending' && v.storeApprovalStatus !== 'rejected')
          .map((v) => {
          const vProds = seedProducts.filter(p => p.vendorId === v.id);
          return {
            id: v.id,
            businessName: v.businessName,
            storeSlug: v.storeSlug || v.id,
            tagline: v.tagline,
            ownerName: v.ownerName,
            location: v.location,
            businessType: v.businessType || 'Private Limited',
            avatar: v.avatar,
            banner: v.banner,
            themeColor: v.themeColor,
            isVerified: v.isVerified !== false,
            isEmerging: Boolean(v.isEmerging || (v.totalOrdersFulfilled || 0) < 350),
            deliveryRadiusKm: v.deliveryRadiusKm || 25,
            gstin: v.gstin,
            storeRating: v.storeRating || 4.8,
            totalOrdersFulfilled: v.totalOrdersFulfilled || 200,
            onTimeDispatchRate: v.onTimeDispatchRate || '99%',
            announcement: v.announcement,
            returnPolicy: v.returnPolicy,
            warrantyPolicy: v.warrantyPolicy,
            category: v.category || 'General Retail',
            totalProducts: vProds.length || 15,
            isFeatured: Boolean(v.isFeatured),
            sampleProducts: vProds.slice(0, 4)
          };
        });

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          fallback = fallback.filter(s => s.businessName.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
        }
        if (selectedCategory !== 'All') {
          fallback = fallback.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        }
        if (cityParam) {
          fallback = fallback.filter(s => s.location.toLowerCase().includes(cityParam.toLowerCase()));
        }
        if (bTypeParam) {
          fallback = fallback.filter(s => s.businessType.toLowerCase().includes(bTypeParam.toLowerCase()));
        }
        if (verifiedOnly) {
          fallback = fallback.filter(s => s.isVerified);
        }
        if (deliversOnly) {
          fallback = fallback.filter(s => checkDeliveryCoverage(s, customerLocation).delivers);
        }
        if (minRating > 0) {
          fallback = fallback.filter(s => (s.storeRating || 0) >= minRating);
        }
        if (activeTab === 'emerging') {
          fallback = fallback.filter(s => s.isEmerging);
        } else if (activeTab === 'featured') {
          fallback = fallback.filter(s => s.isFeatured);
        } else if (activeTab === 'nearby') {
          fallback = fallback.filter(s => checkDeliveryCoverage(s, customerLocation).delivers);
        } else if (activeTab === 'top_rated') {
          fallback = fallback.filter(s => (s.storeRating || 0) >= 4.5);
        }
        setStores(fallback);
      }

      if (catsRes && catsRes.success) {
        setCategories(catsRes.categories || []);
      }
    } catch (err) {
      console.error('Failed to load store directory:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedCity, selectedBusinessType, activeTab, sortBy, verifiedOnly, customerLocation, deliversOnly, minRating]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStoreDirectory();
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchStoreDirectory]);

  // Emerging stores subset for dedicated highlight
  const emergingStores = useMemo(() => {
    return stores.filter((s) => s.isEmerging);
  }, [stores]);

  // Featured stores subset
  const featuredStores = useMemo(() => {
    return stores.filter((s) => s.isFeatured).slice(0, 4);
  }, [stores]);

  return (
    <div className="page-wrapper" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />

      <main className="container" style={{ padding: '32px 20px 80px', maxWidth: 1300 }}>
        {/* ── Hero Search Header ── */}
        <div
          style={{
            position: 'relative',
            borderRadius: 20,
            padding: '44px 36px',
            marginBottom: 36,
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            color: '#fff',
            overflow: 'hidden',
            boxShadow: '0 20px 35px -10px rgba(49, 46, 129, 0.35)'
          }}
        >
          {/* Subtle geometric circles */}
          <div style={{ position: 'absolute', top: -50, right: -50, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(6px)', fontSize: '0.78rem', fontWeight: 700, marginBottom: 16 }}>
              <Sparkles size={14} color="#FBBF24" />
              <span>Verified Physical Merchants & Warehouse Stock</span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1.15, margin: '0 0 12px', letterSpacing: '-0.02em', color: '#fff' }}>
              Explore Verified Storefronts & Brands
            </h1>
            <p style={{ fontSize: '1rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0 0 24px', lineHeight: 1.5 }}>
              Shop authentic physical inventory backed by verified GSTIN merchants, express BlueDart/Delhivery courier dispatch, and manufacturer warranty.
            </p>

            {/* Big Search Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#fff',
                borderRadius: 14,
                padding: '6px 12px 6px 18px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                gap: 12,
                maxWidth: 620
              }}
            >
              <Search size={20} color="#6366F1" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search store name, category, city (e.g. 'TechZone', 'Delhi', 'Fashion')..."
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  padding: '10px 0',
                  fontSize: '0.95rem',
                  color: '#0F172A',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Trust metrics row */}
            <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap', fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="#34D399" /> 100% Physically Verified Stock
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Truck size={16} color="#38BDF8" /> 98.8% On-Time Courier Dispatch
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color="#FBBF24" /> GST Tax Invoice Included
              </span>
            </div>
          </div>
        </div>

        {/* ── Featured Stores Spotlight ── */}
        {featuredStores.length > 0 && !searchQuery && selectedCategory === 'All' && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} color="#F59E0B" fill="#F59E0B" />
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                    Featured Verified Stores
                  </h2>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Top-rated physical merchants with fast dispatch and highest customer fulfillment
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
              {featuredStores.map((store) => (
                <div
                  key={store.id}
                  className="card"
                  style={{
                    borderRadius: 16,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1.5px solid var(--border)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  {/* Banner */}
                  <div style={{ height: 110, position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={store.banner}
                      alt={store.businessName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#FBBF24',
                        padding: '3px 8px',
                        borderRadius: 999,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      <Star size={12} fill="#FBBF24" /> {store.storeRating}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '0 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Avatar overlap */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -26, marginBottom: 12 }}>
                      <img
                        src={store.avatar}
                        alt={store.businessName}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          objectFit: 'cover',
                          border: '3px solid var(--surface)',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                          background: '#fff'
                        }}
                      />
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: '#EEF2FF', color: 'var(--primary)' }}>
                        {store.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        {store.businessName}
                      </h3>
                      {store.isVerified && (
                        <ShieldCheck size={16} color="var(--primary)" title="Verified Physical Merchant" />
                      )}
                    </div>

                    <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, minHeight: 34 }}>
                      {store.tagline}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 14 }}>
                      <MapPin size={13} />
                      <span>{store.location}</span>
                      <span>•</span>
                      <span>{store.totalOrdersFulfilled}+ orders</span>
                    </div>

                    {/* Announcement Strip */}
                    <div style={{ background: 'var(--surface-sunken, rgba(0,0,0,0.03))', padding: '6px 10px', borderRadius: 8, fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 14, border: '1px solid var(--border)' }}>
                      {store.announcement}
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <button
                        onClick={() => navigate(`/store/${store.storeSlug}`)}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        <span>Visit Store</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => setShareTarget({ type: 'store', title: store.businessName, subtitle: store.tagline, url: `/store/${store.storeSlug}`, image: store.avatar, badge: 'Verified Merchant' })}
                        className="btn btn-outline"
                        title="Share Store"
                        style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                      >
                        <Share2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Discovery Navigation Tabs ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === 'all' ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === 'all' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'all' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none'
              }}
            >
              <Compass size={15} />
              All Verified Stores
              <span style={{ fontSize: '0.72rem', background: activeTab === 'all' ? 'rgba(255,255,255,0.25)' : 'var(--border)', padding: '1px 6px', borderRadius: 999 }}>
                {stores.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('nearby')}
              style={{
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === 'nearby' ? '#10B981' : 'var(--surface)',
                color: activeTab === 'nearby' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'nearby' ? '0 2px 8px rgba(16,185,129,0.3)' : 'none'
              }}
              title="Stores serving your current delivery zone"
            >
              <Navigation size={15} />
              Nearby to Me
            </button>

            <button
              onClick={() => setActiveTab('emerging')}
              style={{
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === 'emerging' ? 'linear-gradient(135deg, #F59E0B, #D97706)' : 'var(--surface)',
                color: activeTab === 'emerging' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'emerging' ? '0 2px 8px rgba(245,158,11,0.3)' : 'none'
              }}
            >
              <Flame size={15} />
              New & Emerging
            </button>

            <button
              onClick={() => setActiveTab('top_rated')}
              style={{
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === 'top_rated' ? '#8B5CF6' : 'var(--surface)',
                color: activeTab === 'top_rated' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'top_rated' ? '0 2px 8px rgba(139,92,246,0.3)' : 'none'
              }}
            >
              <Star size={15} fill={activeTab === 'top_rated' ? '#fff' : 'none'} />
              Top Rated (4.5+ ★)
            </button>

            <button
              onClick={() => setActiveTab('featured')}
              style={{
                border: 'none',
                padding: '8px 18px',
                borderRadius: 8,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === 'featured' ? 'var(--primary)' : 'var(--surface)',
                color: activeTab === 'featured' ? '#fff' : 'var(--text-secondary)',
                boxShadow: activeTab === 'featured' ? '0 2px 8px rgba(99,102,241,0.3)' : 'none'
              }}
            >
              <Award size={15} />
              Featured Stores
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated (★)</option>
              <option value="orders">Orders Fulfilled</option>
              <option value="name">Store Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* ── Multi-Dimensional Filters: Location, Business Type, Delivery Radius ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Customer Location Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
            <Navigation size={14} color="#10B981" />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>My Area:</span>
            <select
              value={customerLocation.split(',')[0]}
              onChange={(e) => setCustomerLocation(`${e.target.value}, India`)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {INDIAN_CITIES.filter((c) => c !== 'All Cities').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* City / Location Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
            <MapPin size={15} color="var(--primary)" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {INDIAN_CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Business Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
            <Building2 size={15} color="var(--primary)" />
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--surface)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <option value="0">All Ratings</option>
              <option value="4.5">4.5+ ★ Stars</option>
              <option value="4.0">4.0+ ★ Stars</option>
            </select>
          </div>

          {/* Delivers to Me Only */}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={deliversOnly}
              onChange={(e) => setDeliversOnly(e.target.checked)}
              style={{ accentColor: '#10B981', width: 15, height: 15 }}
            />
            <span style={{ color: deliversOnly ? '#10B981' : undefined }}>Delivers to My Area</span>
          </label>

          {/* Verified Only Checkbox */}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              style={{ accentColor: 'var(--primary)', width: 15, height: 15 }}
            />
            <span>Verified Only</span>
          </label>

          {/* Reset Filters button */}
          {(selectedCategory !== 'All' || selectedCity !== 'All Cities' || selectedBusinessType !== 'All Types' || searchQuery || verifiedOnly || activeTab !== 'all') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedCity('All Cities');
                setSelectedBusinessType('All Types');
                setSearchQuery('');
                setVerifiedOnly(false);
                setActiveTab('all');
              }}
              style={{ border: 'none', background: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: '4px 8px' }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── Category Filter Pills ── */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 24, maxWidth: '100%' }}>
          {['All', 'Electronics & Gadgets', 'Fashion & Apparel', 'Organic Grocery & Staples', 'Home & Kitchen Essentials', 'Sports, Fitness & Outdoor', 'Ayurvedic Beauty & Wellness', 'Handcrafted Arts & Heritage Decor', 'Modern Workspaces & Living', 'Live Botanicals & Exotic Foliage', 'Pro Audio & Studio Sound'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--border)',
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                background: selectedCategory === cat ? 'var(--primary)' : 'var(--surface)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {cat === 'All' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        {/* ── Stores Grid ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <RefreshCw size={28} className="spin" style={{ margin: '0 auto 12px' }} />
            <div>Loading verified physical stores...</div>
          </div>
        ) : stores.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Store size={48} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>No Stores Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>
              No verified merchants match your search "{searchQuery}" or category filter "{selectedCategory}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn btn-primary btn-sm"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {stores.map((store) => (
              <div
                key={store.id}
                className="card"
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1px solid var(--border)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Banner & Avatar - Clickable */}
                <div
                  onClick={() => navigate(`/store/${store.storeSlug || store.id}`)}
                  style={{ height: 120, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                  title={`Open ${store.businessName} Storefront`}
                >
                  <img
                    src={store.banner}
                    alt={store.businessName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />

                  {/* Rating Tag */}
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      background: 'rgba(0,0,0,0.7)',
                      color: '#FBBF24',
                      padding: '3px 8px',
                      borderRadius: 999,
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    <Star size={12} fill="#FBBF24" /> {store.storeRating}
                  </span>

                  <span
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 10,
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}
                  >
                    {store.totalOrdersFulfilled}+ fulfilled
                  </span>
                </div>

                <div style={{ padding: '0 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header Row */}
                  <div
                    onClick={() => navigate(`/store/${store.storeSlug || store.id}`)}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: -28, marginBottom: 12, cursor: 'pointer' }}
                    title={`Open ${store.businessName} Storefront`}
                  >
                    <img
                      src={store.avatar}
                      alt={store.businessName}
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        objectFit: 'cover',
                        border: '3px solid var(--surface)',
                        background: '#fff',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                        flexShrink: 0,
                        aspectRatio: '1 / 1',
                        display: 'block'
                      }}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(store.businessName)}&background=4F46E5&color=fff`;
                      }}
                    />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 6, background: '#EEF2FF', color: 'var(--primary)' }}>
                      {store.category}
                    </span>
                  </div>

                  <div
                    onClick={() => navigate(`/store/${store.storeSlug || store.id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap', cursor: 'pointer' }}
                    title={`Open ${store.businessName} Storefront`}
                  >
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {store.businessName}
                    </h3>
                    {store.isVerified && (
                      <ShieldCheck size={17} color="var(--primary)" title="Verified Physical Merchant" />
                    )}
                    {store.isEmerging && (
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Flame size={11} /> Emerging
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={13} /> {store.location}</span>
                    <span>•</span>
                    <span style={{ background: 'var(--surface-sunken)', padding: '1px 6px', borderRadius: 4, fontSize: '0.7rem' }}>{store.businessType}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{store.totalProducts || 15} Products</span>
                  </div>

                  <p style={{ margin: '0 0 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45, minHeight: 36 }}>
                    {store.tagline}
                  </p>

                  {/* Sample Stock Thumbnails - Direct Product Links */}
                  {store.sampleProducts && store.sampleProducts.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>
                        Popular In-Stock Merchandise
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {store.sampleProducts.slice(0, 3).map((prod) => (
                          <div
                            key={prod.id}
                            title={`${prod.name} (₹${prod.price?.toLocaleString('en-IN')}) — Click to view`}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/shop/product/${prod.id}`);
                            }}
                            style={{
                              flex: 1,
                              borderRadius: 8,
                              border: '1px solid var(--border)',
                              overflow: 'hidden',
                              background: 'var(--surface-sunken, rgba(0,0,0,0.02))',
                              position: 'relative',
                              cursor: 'pointer',
                              transition: 'transform 0.1s ease'
                            }}
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              style={{ width: '100%', height: 50, objectFit: 'cover' }}
                            />
                            <div style={{ padding: '2px 4px', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              ₹{prod.price?.toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Delivery coverage indicator */}
                  {(() => {
                    const coverage = checkDeliveryCoverage(store, customerLocation);
                    return (
                      <div style={{ marginBottom: 12 }}>
                        {coverage.delivers ? (
                          <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: 6, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <CheckCircle2 size={12} /> Delivers to your area ({coverage.targetCity}) within {store.deliveryRadiusKm || 25} km
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.72rem', background: 'var(--surface-sunken)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: 6 }}>
                            📍 Radius: {store.deliveryRadiusKm || 25} km · Pan-India Dispatch
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => {
                        window.scrollTo(0, 0);
                        navigate(`/store/${store.storeSlug || store.id}`);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                    >
                      <span>Visit Storefront</span>
                      <ArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => setCardVendor(store)}
                      className="btn btn-outline"
                      title="View Digital Business Card & Store QR"
                      style={{ padding: '8px 12px' }}
                    >
                      <QrCode size={16} />
                    </button>
                    <button
                      onClick={() => setShareTarget({
                        type: 'store',
                        title: store.businessName,
                        subtitle: store.tagline,
                        url: `/store/${store.storeSlug}`,
                        image: store.avatar,
                        badge: 'Verified Merchant'
                      })}
                      className="btn btn-outline"
                      title="Share Store Link & QR Code"
                      style={{ padding: '8px 12px' }}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Universal Share Modal */}
      {shareTarget && (
        <ShareModal
          isOpen={Boolean(shareTarget)}
          onClose={() => setShareTarget(null)}
          type={shareTarget.type}
          title={shareTarget.title}
          subtitle={shareTarget.subtitle}
          url={shareTarget.url}
          image={shareTarget.image}
          badge={shareTarget.badge}
        />
      )}

      {/* Digital Business Card & QR Modal */}
      {cardVendor && (
        <VendorBusinessCardModal
          isOpen={Boolean(cardVendor)}
          onClose={() => setCardVendor(null)}
          vendor={cardVendor}
        />
      )}
    </div>
  );
}
