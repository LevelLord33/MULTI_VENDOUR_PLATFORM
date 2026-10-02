import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../common/Navbar';
import ContactVendorModal from './ContactVendorModal';
import ShareModal from '../common/ShareModal';
import {
  ShoppingCart, SlidersHorizontal, Package, Heart,
  Zap, Check, RotateCcw, LayoutGrid, List, ArrowRightLeft,
  X, Truck, Star, ShieldCheck, Store, ArrowRight, Flame, Sparkles,
  Share2, MessageSquare, MapPin, ExternalLink, Clock
} from 'lucide-react';
import { CATEGORIES, seedVendors } from '../../data/seedData';
import { rankProductsFairly } from '../../utils/fairRanking';
import { useRecentlyAccessed } from '../../contexts/RecentlyAccessedContext';
import { api } from '../../services/api';
import '../../styles/marketplace.css';

const CATEGORY_ICONS = {
  'All': '🛍️', 'Electronics': '📱', 'Fashion': '👗', 'Grocery': '🛒',
  'Home & Living': '🏠', 'Sports': '⚽', 'Beauty': '💄',
};

// ── 1. Filter Reducer for stock marketplace filtering ──
const FILTER_ACTIONS = {
  SET_SEARCH: 'SET_SEARCH',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SORT: 'SET_SORT',
  TOGGLE_IN_STOCK: 'TOGGLE_IN_STOCK',
  TOGGLE_FAST_DELIVERY: 'TOGGLE_FAST_DELIVERY',
  SET_CONDITION: 'SET_CONDITION',
  RESET: 'RESET',
};

const initialFilterState = {
  search: '',
  category: 'All',
  sortBy: 'smart_discovery',
  inStockOnly: false,
  fastDeliveryOnly: false,
  condition: 'All',
};

function filterReducer(state, action) {
  switch (action.type) {
    case FILTER_ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    case FILTER_ACTIONS.SET_CATEGORY:
      return { ...state, category: action.payload };
    case FILTER_ACTIONS.SET_SORT:
      return { ...state, sortBy: action.payload };
    case FILTER_ACTIONS.TOGGLE_IN_STOCK:
      return { ...state, inStockOnly: !state.inStockOnly };
    case FILTER_ACTIONS.TOGGLE_FAST_DELIVERY:
      return { ...state, fastDeliveryOnly: !state.fastDeliveryOnly };
    case FILTER_ACTIONS.SET_CONDITION:
      return { ...state, condition: action.payload };
    case FILTER_ACTIONS.RESET:
      return initialFilterState;
    default:
      return state;
  }
}

export default function ProductListing() {
  // ── 2. useContext hooks ──
  const { getApprovedProducts } = useProducts();
  const { addToCart } = useCart();
  const { getVendorById, vendors: authVendors, wishlist: userWishlist, toggleWishlist: toggleUserWishlist } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // ── 3. useReducer for filter state ──
  const [filterState, dispatchFilter] = useReducer(filterReducer, initialFilterState);

  // ── 4. useState for UI preferences, vendor-first mode & modals ──
  const initialMode = searchParams.get('mode') === 'products' ? 'products' : 'vendors';
  const [browseMode, setBrowseMode] = useState(initialMode); // 'vendors' (DEFAULT!) | 'products'
  const [viewMode, setViewMode] = useState('grid');
  const { compareList, isInCompare, toggleCompare, clearCompare, removeFromCompare } = useComparison();
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [contactVendor, setContactVendor] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);
  const { recentProducts, recentStores, clearRecent } = useRecentlyAccessed();

  // ── 5. useRef for DOM elements & debouncers ──
  const debounceTimerRef = useRef(null);
  const productsTopRef = useRef(null);

  const approved = getApprovedProducts();

  // All vendors combined (seedVendors + live authVendors)
  const allVendors = useMemo(() => {
    const map = new Map();
    seedVendors.forEach((v) => map.set(v.id, v));
    if (Array.isArray(authVendors)) {
      authVendors.forEach((v) => map.set(v.id, { ...map.get(v.id), ...v }));
    }
    return Array.from(map.values());
  }, [authVendors]);

  // Compute enriched vendors with active products & search matches
  const enrichedVendors = useMemo(() => {
    return allVendors.map((vendor) => {
      const vProds = approved.filter((p) => p.vendorId === vendor.id);
      let matchingProds = vProds;
      if (filterState.search) {
        const q = filterState.search.toLowerCase().trim();
        matchingProds = vProds.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.brand && p.brand.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q)
        );
      }
      return {
        ...vendor,
        category: vendor.category || (vProds[0]?.category) || 'General Retail',
        totalProductsInStock: vProds.length,
        matchingProductsCount: matchingProds.length,
        sampleProducts: (matchingProds.length > 0 ? matchingProds : vProds).slice(0, 5)
      };
    });
  }, [allVendors, approved, filterState.search]);

  // Filtered vendors for Vendor-First mode
  const filteredVendors = useMemo(() => {
    let list = [...enrichedVendors];

    // Category filter
    if (filterState.category !== 'All') {
      const targetCat = filterState.category.toLowerCase();
      list = list.filter((v) =>
        (v.category && v.category.toLowerCase().includes(targetCat)) ||
        targetCat.includes(v.category?.toLowerCase() || '') ||
        v.sampleProducts.some((p) => p.category?.toLowerCase() === targetCat)
      );
    }

    // Search query filter
    if (filterState.search) {
      const q = filterState.search.toLowerCase().trim();
      list = list.filter((v) =>
        v.businessName.toLowerCase().includes(q) ||
        v.tagline.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        v.matchingProductsCount > 0
      );
    }

    // In-stock physical inventory filter
    if (filterState.inStockOnly) {
      list = list.filter((v) =>
        v.sampleProducts.some((p) => (p.stock || p.quantity || 0) > 0)
      );
    }

    // Fast courier dispatch filter
    if (filterState.fastDeliveryOnly) {
      list = list.filter((v) =>
        v.onTimeDispatchRate?.includes('9') || v.announcement?.toLowerCase().includes('same-day')
      );
    }

    return list;
  }, [enrichedVendors, filterState]);

  // Store counts per category
  const categoryStoreCounts = useMemo(() => {
    const counts = { All: allVendors.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        const catClean = cat.toLowerCase();
        counts[cat] = allVendors.filter((v) => {
          const vProds = approved.filter((p) => p.vendorId === v.id);
          const vCat = (v.category || vProds[0]?.category || '').toLowerCase();
          return vCat.includes(catClean) || catClean.includes(vCat) || vProds.some((p) => p.category?.toLowerCase() === catClean);
        }).length;
      }
    });
    return counts;
  }, [allVendors, approved]);

  // ── 6. useMemo for derived product collections ──
  const categoryCounts = useMemo(() => {
    const counts = { All: approved.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = approved.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [approved]);

  // Filtered physical products
  const filtered = useMemo(() => {
    let list = [...approved];

    // Category filter
    if (filterState.category !== 'All') {
      list = list.filter((p) => p.category === filterState.category);
    }

    // Search query filter
    if (filterState.search) {
      const q = filterState.search.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // In-stock physical inventory filter
    if (filterState.inStockOnly) {
      list = list.filter((p) => (p.stock || p.quantity || 0) > 0);
    }

    // Fast courier dispatch filter
    if (filterState.fastDeliveryOnly) {
      list = list.filter((p) => p.shipping?.dispatchTime?.includes('24 hours'));
    }

    // Condition filter
    if (filterState.condition !== 'All') {
      list = list.filter((p) => p.condition === filterState.condition);
    }

    // Sorting & Smart Discovery Fair Exposure Ranking
    const vendorMap = {};
    seedVendors.forEach((v) => { vendorMap[v.id] = v; });

    let sortParam = filterState.sortBy;
    if (sortParam === 'price-asc') sortParam = 'price_asc';
    else if (sortParam === 'price-desc') sortParam = 'price_desc';
    else if (sortParam === 'newest') sortParam = 'newest';

    if (filterState.sortBy === 'stock-desc') {
      list.sort((a, b) => (b.stock || b.quantity || 0) - (a.stock || a.quantity || 0));
      return list;
    }

    return rankProductsFairly(list, {
      query: filterState.search,
      vendorMap,
      sortBy: sortParam
    });
  }, [approved, filterState]);

  // ── 7. useCallback hooks for event handlers ──
  const handleAddToCart = useCallback((e, product) => {
    e.stopPropagation();
    const stockAvailable = product.stock !== undefined ? product.stock : product.quantity;
    if (stockAvailable <= 0) {
      addToast('Item is out of stock in vendor warehouse.', 'error');
      return;
    }

    // Choose default variant options if available
    const defaultColor = product.variants?.colors?.[0]?.name || null;
    const defaultOption = product.variants?.options?.[0]?.label || null;

    addToCart(product, 1, { color: defaultColor, option: defaultOption });
    addToast(`${product.name} added to cart!`, 'success');
  }, [addToCart, addToast]);

  const handleToggleWishlist = useCallback(async (e, product) => {
    e.stopPropagation();
    const res = await toggleUserWishlist(product.id);
    if (res?.isWishlisted) {
      addToast(`Saved "${product.name}" to wishlist`, 'success');
    } else {
      addToast(`Removed "${product.name}" from wishlist`, 'info');
    }
  }, [toggleUserWishlist, addToast]);

  const handleToggleCompare = useCallback((e, product) => {
    e.stopPropagation();
    toggleCompare(product);
  }, [toggleCompare]);

  const handleSearchChange = useCallback((value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      dispatchFilter({ type: FILTER_ACTIONS.SET_SEARCH, payload: value });
    }, 150);
  }, []);

  const handleCategorySelect = useCallback((cat) => {
    dispatchFilter({ type: FILTER_ACTIONS.SET_CATEGORY, payload: cat });
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    dispatchFilter({ type: FILTER_ACTIONS.RESET });
  }, []);

  // ── 8. useEffect for side effects ──
  useEffect(() => {
    const activeLabel = filterState.category === 'All' ? 'Products & Stock' : filterState.category;
    document.title = `${activeLabel} (${filtered.length} items in stock) | Vendor Hub`;

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filterState.category, filtered.length]);

  // Record impressions for fair exposure system
  useEffect(() => {
    if (filtered.length > 0) {
      const topIds = filtered.slice(0, 20).map((p) => p.id);
      const topVendorIds = [...new Set(filtered.slice(0, 20).map((p) => p.vendorId))];
      api.recordExposure({
        type: 'impression',
        productIds: topIds,
        vendorIds: topVendorIds
      }).catch(() => { });
    }
  }, [filtered.length, filterState.category, filterState.sortBy]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('.navbar-search input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        if (showCompareModal) {
          setShowCompareModal(false);
        } else if (filterState.search) {
          dispatchFilter({ type: FILTER_ACTIONS.SET_SEARCH, payload: '' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filterState.search, showCompareModal]);

  const getCategoryLabel = (cat) => {
    if (!cat) return '';
    const clean = cat.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_');
    return t('cat_' + clean, t('cat_' + cat.toLowerCase().split(' ')[0], cat));
  };

  return (
    <div className="page-wrapper">
      <Navbar searchQuery={filterState.search} onSearchChange={handleSearchChange} />

      {/* Category Bar */}
      <div className="category-bar">
        <div className="category-bar-inner">
          {CATEGORIES.map((cat) => {
            const count = browseMode === 'vendors' ? (categoryStoreCounts[cat] || 0) : (categoryCounts[cat] || 0);
            const badgeLabel = browseMode === 'vendors' ? `${count} ${count === 1 ? 'store' : 'stores'}` : `${count}`;
            return (
              <button
                key={cat}
                className={`cat-btn ${filterState.category === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {getCategoryLabel(cat)}
                <span style={{ fontSize: '0.72rem', opacity: 0.8, marginLeft: 2, background: filterState.category === cat ? 'var(--primary-light)' : 'var(--surface-2)', color: filterState.category === cat ? 'white' : 'var(--text-secondary)', padding: '1px 7px', borderRadius: '10px' }}>
                  {badgeLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Banner - Vendor First Platform */}
      {filterState.category === 'All' && !filterState.search && (
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 45%, #312E81 100%)',
          padding: '40px 0',
          marginBottom: 0,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Ambient Glow */}
          <div style={{
            position: 'absolute',
            top: -60,
            right: 80,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28, position: 'relative', zIndex: 2 }}>
            <div style={{ maxWidth: 700 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', background: 'rgba(252, 211, 77, 0.12)', border: '1px solid rgba(252, 211, 77, 0.3)', borderRadius: 9999, marginBottom: 12 }}>
                <Zap size={14} color="#FCD34D" fill="#FCD34D" />
                <span style={{ color: '#FCD34D', fontWeight: 800, fontSize: '0.74rem', letterSpacing: '0.05em' }}>
                  VENDOR-FIRST MARKETPLACE · AUTHENTIC PHYSICAL MERCHANTS
                </span>
              </div>
              <h1 style={{ color: 'white', fontSize: '2rem', fontWeight: 900, marginBottom: 12, lineHeight: 1.25, letterSpacing: '-0.02em' }}>
                Discover Verified Vendors First, Not Just Random SKUs
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.94rem', margin: '0 0 20px', lineHeight: 1.6 }}>
                Unlike generic platforms that mask real merchant origins, Vendor Hub connects you directly with verified local physical stores. Verify warehouse credentials, inspect authentic catalogs, and shop with complete transparency.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setBrowseMode('vendors')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 20px',
                    borderRadius: 10,
                    background: browseMode === 'vendors' ? '#FCD34D' : 'rgba(255, 255, 255, 0.12)',
                    color: browseMode === 'vendors' ? '#1E1B4B' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: browseMode === 'vendors' ? '0 4px 14px rgba(252, 211, 77, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Store size={16} />
                  <span>Explore Stores ({filteredVendors.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBrowseMode('products')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 20px',
                    borderRadius: 10,
                    background: browseMode === 'products' ? '#FCD34D' : 'rgba(255, 255, 255, 0.12)',
                    color: browseMode === 'products' ? '#1E1B4B' : '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    boxShadow: browseMode === 'products' ? '0 4px 14px rgba(252, 211, 77, 0.35)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Package size={16} />
                  <span>Browse Products ({filtered.length})</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginTop: 18, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.12)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#A5B4FC', fontWeight: 600 }}>
                  <ShieldCheck size={14} color="#34D399" /> 100% Escrow Protected
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#A5B4FC', fontWeight: 600 }}>
                  <Truck size={14} color="#FCD34D" /> Direct Warehouse Dispatch
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.76rem', color: '#A5B4FC', fontWeight: 600 }}>
                  <Sparkles size={14} color="#F472B6" /> Fair Exposure Algorithm
                </span>
              </div>
            </div>

            {/* Quick KPI Stat Boxes */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '18px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.16)', minWidth: 120 }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{allVendors.length}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.74rem', fontWeight: 600, marginTop: 4 }}>Verified Stores</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '18px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.16)', minWidth: 120 }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{approved.length}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.74rem', fontWeight: 600, marginTop: 4 }}>Tested SKUs</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', borderRadius: 14, padding: '18px 24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.16)', minWidth: 120 }}>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#34D399', lineHeight: 1.1 }}>24h</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.74rem', fontWeight: 600, marginTop: 4 }}>Avg Dispatch</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ padding: '28px 24px' }} ref={productsTopRef}>
        {/* Browse Mode Switcher & Quick Filters Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          {/* Mode Switcher */}
          <div className="browse-mode-tabs">
            <button
              type="button"
              className={`browse-mode-tab ${browseMode === 'vendors' ? 'active' : ''}`}
              onClick={() => {
                setBrowseMode('vendors');
                setSearchParams({ mode: 'vendors' });
              }}
            >
              <Store size={16} />
              <span>Browse by Stores & Vendors</span>
              <span style={{ fontSize: '0.72rem', background: browseMode === 'vendors' ? 'rgba(255,255,255,0.25)' : 'var(--surface-2)', padding: '2px 7px', borderRadius: 8 }}>
                {filteredVendors.length} stores
              </span>
            </button>
            <button
              type="button"
              className={`browse-mode-tab ${browseMode === 'products' ? 'active' : ''}`}
              onClick={() => {
                setBrowseMode('products');
                setSearchParams({ mode: 'products' });
              }}
            >
              <Package size={16} />
              <span>Browse Individual Items</span>
              <span style={{ fontSize: '0.72rem', background: browseMode === 'products' ? 'rgba(255,255,255,0.25)' : 'var(--surface-2)', padding: '2px 7px', borderRadius: 8 }}>
                {filtered.length} items
              </span>
            </button>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => dispatchFilter({ type: FILTER_ACTIONS.TOGGLE_IN_STOCK })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: filterState.inStockOnly ? '1.5px solid var(--success)' : '1px solid var(--border)',
                background: filterState.inStockOnly ? '#D1FAE5' : 'var(--surface)',
                color: filterState.inStockOnly ? '#065F46' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {filterState.inStockOnly && <Check size={14} />} {t('inStockOnly', 'In Stock Only')}
            </button>

            <button
              onClick={() => dispatchFilter({ type: FILTER_ACTIONS.TOGGLE_FAST_DELIVERY })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: filterState.fastDeliveryOnly ? '1.5px solid #3B82F6' : '1px solid var(--border)',
                background: filterState.fastDeliveryOnly ? '#DBEAFE' : 'var(--surface)',
                color: filterState.fastDeliveryOnly ? '#1D4ED8' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              <Truck size={14} /> {t('fastDeliveryOnly', 'Fast Dispatch (24h)')}
            </button>

            {browseMode === 'products' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={16} color="var(--text-muted)" />
                <select
                  className="form-input form-select"
                  value={filterState.sortBy}
                  onChange={(e) => dispatchFilter({ type: FILTER_ACTIONS.SET_SORT, payload: e.target.value })}
                  style={{ width: 'auto', padding: '8px 36px 8px 12px', fontSize: '0.85rem' }}
                >
                  <option value="smart_discovery">✨ Smart Discovery</option>
                  <option value="newest">{t('sort_newest', 'Newest Stock')}</option>
                  <option value="price-asc">{t('sort_price_asc', 'Price: Low to High')}</option>
                  <option value="price-desc">{t('sort_price_desc', 'Price: High to Low')}</option>
                  <option value="stock-desc">{t('sort_rating', 'Highest Stock First')}</option>
                </select>

                <div style={{ display: 'inline-flex', background: 'var(--surface-2)', borderRadius: '8px', padding: '2px', border: '1px solid var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: viewMode === 'grid' ? 'white' : 'transparent',
                      color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('compact')}
                    title="Compact View"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                      background: viewMode === 'compact' ? 'white' : 'transparent',
                      color: viewMode === 'compact' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: viewMode === 'compact' ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            )}

            {(filterState.search || filterState.category !== 'All' || filterState.inStockOnly || filterState.fastDeliveryOnly || filterState.sortBy !== 'smart_discovery') && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleResetFilters}
                title="Reset all filters"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw size={13} /> {t('resetFilters', 'Reset')}
              </button>
            )}
          </div>
        </div>

        {/* ── RECENTLY ACCESSED (STORES & PRODUCTS) ── */}
        {(recentProducts.length > 0 || recentStores.length > 0) && (
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 28,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color="var(--primary)" />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  Recently Accessed
                </span>
                <span style={{ fontSize: '0.72rem', background: '#EEF2FF', color: 'var(--primary)', padding: '2px 8px', borderRadius: 999, fontWeight: 700 }}>
                  {recentProducts.length + recentStores.length} items
                </span>
              </div>
              <button
                type="button"
                onClick={clearRecent}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Clear History
              </button>
            </div>

            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 6 }}>
              {recentStores.map((s) => (
                <div
                  key={`store-${s.id || s.storeSlug}`}
                  onClick={() => navigate(`/store/${s.storeSlug || s.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 14px',
                    borderRadius: 12,
                    background: 'var(--surface-2, #F8FAFC)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <img
                    src={s.avatar}
                    alt={s.businessName}
                    style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {s.businessName}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Store size={10} /> Storefront
                    </div>
                  </div>
                </div>
              ))}

              {recentProducts.map((p) => (
                <div
                  key={`prod-${p.id}`}
                  onClick={() => navigate(`/shop/product/${p.id}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 14px',
                    borderRadius: 12,
                    background: 'var(--surface-2, #F8FAFC)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 34, height: 34, borderRadius: 8, objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', maxWidth: 140, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{p.price?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ── 1. VENDOR-FIRST VIEW (DEFAULT EXPERIENCE) ───────────── */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {browseMode === 'vendors' ? (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Store size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {filterState.category === 'All' ? 'Verified Merchant Stores' : `${getCategoryLabel(filterState.category)} Merchants`}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: 10 }}>
                    ({filteredVendors.length} stores available)
                  </span>
                </h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                {filterState.search ? (
                  <>Showing verified vendor storefronts carrying items matching "<strong>{filterState.search}</strong>"</>
                ) : (
                  <>Select any storefront to explore its catalog, policies, and direct brand warranties</>
                )}
              </p>
            </div>

            {filteredVendors.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Store size={64} /></div>
                <h3>No verified vendor stores match your selection</h3>
                <p>Try resetting your category or search filter to explore all verified merchants.</p>
                <button className="btn btn-primary" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="vendors-showcase-container">
                {filteredVendors.map((vendor) => {
                  return (
                    <div key={vendor.id} className="vendor-showcase-card">
                      {/* Banner */}
                      <div
                        className="vendor-showcase-banner"
                        style={{ backgroundImage: `url(${vendor.banner || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop'})` }}
                      >
                        <div className="vendor-showcase-banner-badges">
                          <span style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, border: '1px solid rgba(255,255,255,0.2)' }}>
                            <ShieldCheck size={13} color="#10B981" /> Verified Merchant
                          </span>
                          <span style={{ background: 'rgba(79,70,229,0.85)', backdropFilter: 'blur(8px)', color: 'white', padding: '4px 10px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700 }}>
                            {vendor.category}
                          </span>
                        </div>
                      </div>

                      <div className="vendor-showcase-body">
                        {/* Header row */}
                        <div className="vendor-showcase-header-row">
                          <div className="vendor-showcase-identity">
                            <img
                              src={vendor.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&h=120&fit=crop'}
                              alt={vendor.businessName}
                              className="vendor-showcase-avatar"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName)}&background=4F46E5&color=fff`;
                              }}
                            />
                            <div className="vendor-showcase-info">
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                <h3 style={{ margin: 0 }}>
                                  <Link to={`/store/${vendor.storeSlug || vendor.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    {vendor.businessName}
                                  </Link>
                                </h3>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    background: '#EEF2FF',
                                    color: 'var(--primary)',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                  }}
                                >
                                  <ShieldCheck size={13} color="var(--primary)" />
                                  Verified Store
                                </span>
                              </div>
                              <p>{vendor.tagline || 'Verified merchant storefront with live warehouse inventory'}</p>
                            </div>
                          </div>

                          <div className="vendor-showcase-header-actions">
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setShareTarget({
                                title: vendor.businessName,
                                subtitle: vendor.tagline,
                                url: `/store/${vendor.storeSlug || vendor.id}`,
                                image: vendor.avatar,
                                badge: 'Verified Store'
                              })}
                              title="Share Store"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <Share2 size={14} /> Share
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => setContactVendor(vendor)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--surface)', borderColor: 'var(--border)' }}
                            >
                              <MessageSquare size={14} /> Contact
                            </button>
                            <Link
                              to={`/store/${vendor.storeSlug || vendor.id}`}
                              className="btn btn-primary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none', fontWeight: 700 }}
                            >
                              <span>Enter Storefront</span>
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>

                        {/* Trust & Location metrics */}
                        <div className="vendor-showcase-metrics">
                          <span className="vendor-showcase-metric-item" style={{ color: '#D97706' }}>
                            <Star size={14} fill="#F59E0B" color="#F59E0B" />
                            <span>{vendor.storeRating || 4.8} / 5.0 Rating</span>
                          </span>
                          <span>•</span>
                          <span className="vendor-showcase-metric-item">
                            <MapPin size={14} color="var(--primary)" />
                            <span>{vendor.location || 'India'}</span>
                          </span>
                          <span>•</span>
                          <span className="vendor-showcase-metric-item" style={{ color: 'var(--success)' }}>
                            <Truck size={14} />
                            <span>{vendor.onTimeDispatchRate || '99%'} Express Dispatch</span>
                          </span>
                          <span>•</span>
                          <span className="vendor-showcase-metric-item">
                            <Package size={14} />
                            <span>{vendor.totalProductsInStock || 15} Products in Stock</span>
                          </span>
                          <span>•</span>
                          <span className="vendor-showcase-metric-item" style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                            GSTIN: {vendor.gstin || '07AABCT1234F1Z8'}
                          </span>
                        </div>

                        {/* Product Shelf - The User's Core Request: Showing the Products of that Vendor */}
                        <div className="vendor-shelf-container">
                          <div className="vendor-shelf-header">
                            <div className="vendor-shelf-title">
                              <Sparkles size={14} color="var(--primary)" />
                              <span>Featured Products From This Store ({vendor.sampleProducts?.length || 0})</span>
                            </div>
                            <Link
                              to={`/store/${vendor.storeSlug || vendor.id}`}
                              style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              View all {vendor.totalProductsInStock || 15} items <ArrowRight size={13} />
                            </Link>
                          </div>

                          <div className="vendor-shelf-grid">
                            {vendor.sampleProducts?.map((product) => {
                              const stock = product.stock !== undefined ? product.stock : (product.quantity || 0);
                              const isOutOfStock = stock <= 0;
                              const discountPct = product.originalPrice && product.originalPrice > product.price
                                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                                : 0;

                              return (
                                <div
                                  key={product.id}
                                  className="vendor-shelf-item"
                                  onClick={() => navigate(`/shop/product/${product.id}`)}
                                >
                                  <img
                                    src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'}
                                    alt={product.name}
                                    className="vendor-shelf-item-img"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop';
                                    }}
                                  />
                                  <div className="vendor-shelf-item-title" title={product.name}>
                                    {product.name}
                                  </div>

                                  <div className="vendor-shelf-item-price-row">
                                    <span className="vendor-shelf-item-price">
                                      ₹{product.price.toLocaleString('en-IN')}
                                    </span>
                                    {product.originalPrice && product.originalPrice > product.price && (
                                      <span className="vendor-shelf-item-original">
                                        ₹{product.originalPrice.toLocaleString('en-IN')}
                                      </span>
                                    )}
                                    {discountPct > 0 && (
                                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '1px 5px', borderRadius: 4 }}>
                                        {discountPct}% OFF
                                      </span>
                                    )}
                                  </div>

                                  <div className="vendor-shelf-item-footer">
                                    <span style={{ fontSize: '0.72rem', color: isOutOfStock ? 'var(--danger)' : 'var(--text-muted)' }}>
                                      {isOutOfStock ? 'Sold Out' : `${stock} in stock`}
                                    </span>
                                    <button
                                      type="button"
                                      className="btn btn-primary btn-sm"
                                      style={{ padding: '4px 8px', fontSize: '0.75rem', borderRadius: 6 }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToCart(e, product);
                                      }}
                                      disabled={isOutOfStock}
                                    >
                                      <ShoppingCart size={12} /> Add
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════ */
          /* ── 2. INDIVIDUAL PRODUCTS GRID VIEW ────────────────────── */
          /* ═══════════════════════════════════════════════════════════ */
          <div>
            {/* Vendor-First Suggestion Banner */}
            <div style={{ background: 'var(--surface-2)', border: '1px dashed var(--primary)', borderRadius: 12, padding: '12px 18px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Store size={18} color="var(--primary)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                  💡 Prefer to discover verified storefronts and collections first?
                </span>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setBrowseMode('vendors')}
                style={{ padding: '6px 14px', fontSize: '0.8rem' }}
              >
                Switch to Stores & Vendors View →
              </button>
            </div>

            <div className="section-title" style={{ flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2>
                  {filterState.category === 'All' ? t('cat_all', 'All Products') : getCategoryLabel(filterState.category)}
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 10 }}>
                    ({filtered.length} {t('inStock', 'available')})
                  </span>
                </h2>
                {filterState.search && (
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Results for "<strong>{filterState.search}</strong>" · Ranked via Smart Discovery & Fair Exposure
                  </p>
                )}
              </div>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Package size={64} /></div>
                <h3>No products found in physical inventory</h3>
                <p>{filterState.search ? `No results for "${filterState.search}"` : 'No products in this category match your criteria'}</p>
                <button className="btn btn-outline" onClick={handleResetFilters}>
                  {t('resetFilters', 'Clear Filters')}
                </button>
              </div>
            ) : (
              <div className={`product-grid ${viewMode === 'compact' ? 'compact-grid' : ''}`}>
                {filtered.map((product) => {
                  const vendor = getVendorById(product.vendorId);
                  const isWishlisted = Array.isArray(userWishlist) && userWishlist.includes(product.id);
                  const isCompared = compareList.some((p) => p.id === product.id);
                  const stock = product.stock !== undefined ? product.stock : (product.quantity || 0);
                  const isLowStock = stock > 0 && stock <= 5;
                  const isOutOfStock = stock <= 0;

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
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'; }}
                        />

                        {/* Stock Alert Badge */}
                        <div className="product-card-badge" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {isOutOfStock ? (
                            <span className="badge badge-rejected" style={{ fontWeight: 800 }}>{t('outOfStock', 'Out of Stock')}</span>
                          ) : isLowStock ? (
                            <span className="badge badge-pending" style={{ fontWeight: 800, background: '#FEF3C7', color: '#B45309' }}>
                              ⚡ {t('lowStock', 'Only')} {stock} {t('unitsLeft', 'left!')}
                            </span>
                          ) : (
                            <span className="badge badge-approved" style={{ fontWeight: 700 }}>
                              ✓ {t('inStock', 'In Stock')} ({stock})
                            </span>
                          )}
                          {product.discountPercent > 0 && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#EF4444', color: 'white', padding: '2px 6px', borderRadius: 4, width: 'fit-content' }}>
                              {product.discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        {/* Action buttons on top right */}
                        <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <button
                            className="product-card-wishlist"
                            onClick={(e) => handleToggleWishlist(e, product)}
                            style={{ color: isWishlisted ? 'var(--danger)' : undefined }}
                            title={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                          >
                            <Heart size={15} fill={isWishlisted ? 'var(--danger)' : 'none'} />
                          </button>
                          <button
                            className="product-card-wishlist"
                            onClick={(e) => handleToggleCompare(e, product)}
                            style={{
                              color: isCompared ? 'white' : 'var(--text-secondary)',
                              background: isCompared ? 'var(--primary, #4F46E5)' : 'white',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                            title={isCompared ? 'Remove from comparison' : 'Compare product (select 2-4)'}
                          >
                            <ArrowRightLeft size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="product-card-body">
                        {/* SKU & Brand */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{product.sku || `SKU-${product.id}`}</span>
                          <span style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>{product.brand}</span>
                        </div>

                        {/* Product Name */}
                        <div className="product-card-name" title={product.name}>{product.name}</div>

                        {/* Vendor Store Tag & Fair Exposure Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, flexWrap: 'wrap', margin: '4px 0 2px' }}>
                          <div
                            style={{ fontSize: '0.74rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/store/${vendor?.storeSlug || product.vendorId}`);
                            }}
                            title="Sold by verified merchant. Click to open storefront."
                          >
                            <Store size={12} />
                            <span>Sold by {vendor?.businessName || product.vendorName || 'Verified Merchant'}</span>
                          </div>
                          {(product._fairDiscovery?.isEmerging || ['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(product.vendorId)) && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                              <Flame size={10} /> Emerging
                            </span>
                          )}
                        </div>

                        {/* Rating & Review Count */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#D97706', fontWeight: 700 }}>
                            <Star size={12} fill="#D97706" color="#D97706" />
                            {product.rating || 4.5}
                          </span>
                          <span>•</span>
                          <span>{product.reviewsCount || product.reviews?.length || 1} ratings</span>
                        </div>

                        {/* Price & MRP */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                          <div className="product-card-price">
                            <span className="currency">₹</span>
                            {product.price.toLocaleString('en-IN')}
                          </div>
                          {product.mrp && product.mrp > product.price && (
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Dispatch & Stock Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          <Truck size={12} color="var(--success)" />
                          <span>{product.shipping?.dispatchTime || 'Ships in 24 hrs'}</span>
                        </div>

                        {/* Action buttons: Add to Cart and Compare */}
                        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                          <button
                            className="product-card-add-btn"
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={isOutOfStock}
                            style={{ flex: 1, opacity: isOutOfStock ? 0.6 : 1, cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
                          >
                            <ShoppingCart size={15} />
                            {isOutOfStock ? t('outOfStock', 'Sold Out') : t('addToCart', 'Add to Cart')}
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={(e) => handleToggleCompare(e, product)}
                            style={{
                              background: isCompared ? '#EEF2FF' : 'var(--surface-2, #F8FAFC)',
                              color: isCompared ? '#4F46E5' : 'var(--text-secondary, #475569)',
                              border: isCompared ? '1.5px solid #4F46E5' : '1px solid var(--border, #E2E8F0)',
                              padding: '0 10px',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              borderRadius: 8,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            title={isCompared ? 'Remove from comparison' : 'Compare product with other vendors'}
                          >
                            <ArrowRightLeft size={13} />
                            {isCompared ? 'Comparing' : 'Compare'}
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
      </div>

      {/* ── Floating Comparison Drawer ── */}
      {compareList.length > 0 && (
        <div style={{
          position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          background: '#0F172A', color: 'white',
          padding: '10px 20px', borderRadius: 9999, zIndex: 990,
          boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', gap: 14, maxWidth: '94vw', flexWrap: 'wrap',
          border: '1px solid rgba(255,255,255,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowRightLeft size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>
              Compare ({compareList.length}/4)
            </span>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {compareList.map((p) => (
              <div key={p.id} style={{ position: 'relative' }}>
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  style={{ width: 34, height: 34, borderRadius: 6, objectFit: 'cover', border: '1.5px solid white', background: 'white' }}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromCompare(p.id); }}
                  title="Remove item"
                  style={{
                    position: 'absolute', top: -4, right: -4, width: 16, height: 16,
                    borderRadius: '50%', background: '#EF4444', color: 'white',
                    border: 'none', cursor: 'pointer', fontSize: '0.65rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              className="btn btn-sm"
              onClick={() => navigate('/shop/compare')}
              style={{
                background: '#FCD34D', color: '#0F172A', fontWeight: 800,
                padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.82rem'
              }}
            >
              Compare Now ({compareList.length}) →
            </button>
            <button
              onClick={clearCompare}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.65)', cursor: 'pointer', fontSize: '0.78rem', textDecoration: 'underline' }}
            >
              Clear All
            </button>
          </div>
        </div>
      )}

      {/* ── Product Comparison Modal ── */}
      {showCompareModal && (
        <div className="modal-overlay" onClick={() => setShowCompareModal(false)}>
          <div
            className="modal"
            style={{ maxWidth: '960px', width: '95vw', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ArrowRightLeft size={22} color="var(--primary)" />
                <h3 style={{ margin: 0 }}>Physical Product Specifications Comparison</h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `160px repeat(${compareList.length}, 1fr)`, gap: 16, fontSize: '0.85rem' }}>
              {/* Header row */}
              <div style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Item</div>
              {compareList.map((p) => (
                <div key={p.id} style={{ textAlign: 'center' }}>
                  <img src={p.images[0]} alt={p.name} style={{ width: '100%', height: 130, objectFit: 'contain', borderRadius: 8, background: 'var(--surface-2)', marginBottom: 8 }} />
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary-dark)', marginBottom: 8 }}>
                    ₹{p.price.toLocaleString('en-IN')}
                  </div>
                  <button
                    className="btn btn-primary btn-sm btn-full"
                    onClick={(e) => handleAddToCart(e, p)}
                    disabled={(p.stock || p.quantity || 0) <= 0}
                  >
                    <ShoppingCart size={13} /> Add to Cart
                  </button>
                </div>
              ))}

              {/* SKU */}
              <div style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>Inventory SKU</div>
              {compareList.map((p) => (
                <div key={p.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)', fontFamily: 'monospace', fontWeight: 600 }}>
                  {p.sku || `VM-${p.id}`}
                </div>
              ))}

              {/* Physical Stock */}
              <div style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>Warehouse Stock</div>
              {compareList.map((p) => {
                const stock = p.stock !== undefined ? p.stock : (p.quantity || 0);
                return (
                  <div key={p.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)', fontWeight: 700, color: stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
                    {stock > 0 ? `✓ ${stock} units in stock` : 'Out of stock'}
                  </div>
                );
              })}

              {/* Brand & Vendor */}
              <div style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>Brand & Store</div>
              {compareList.map((p) => {
                const v = getVendorById(p.vendorId);
                return (
                  <div key={p.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                    <div><strong>Brand:</strong> {p.brand}</div>
                    <div style={{ color: 'var(--primary)', marginTop: 2 }}>{v?.businessName}</div>
                  </div>
                );
              })}

              {/* Shipping & Return */}
              <div style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>Dispatch & Return</div>
              {compareList.map((p) => (
                <div key={p.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  <div>{p.shipping?.dispatchTime || 'Within 24 hours'}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 2 }}>
                    {p.shipping?.returnWindowDays || 7}-day replacement policy
                  </div>
                </div>
              ))}

              {/* Specifications preview */}
              <div style={{ fontWeight: 700, color: 'var(--text-secondary)', padding: '8px 0', borderTop: '1px solid var(--border)' }}>Key Specs</div>
              {compareList.map((p) => (
                <div key={p.id} style={{ padding: '8px 0', borderTop: '1px solid var(--border)' }}>
                  {p.specifications && Object.entries(p.specifications).slice(0, 4).map(([k, v]) => (
                    <div key={k} style={{ marginBottom: 4, fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{k}: </span>
                      <strong>{v}</strong>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact Vendor Modal */}
      {contactVendor && (
        <ContactVendorModal
          isOpen={!!contactVendor}
          onClose={() => setContactVendor(null)}
          vendor={contactVendor}
        />
      )}

      {/* Share Modal */}
      {shareTarget && (
        <ShareModal
          isOpen={!!shareTarget}
          onClose={() => setShareTarget(null)}
          type="store"
          title={shareTarget.title}
          subtitle={shareTarget.subtitle}
          url={shareTarget.url}
          image={shareTarget.image}
          badge={shareTarget.badge}
        />
      )}

      {/* Footer */}
      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Multi-Vendor Marketplace · All Rights Reserved
      </footer>
    </div>
  );
}
