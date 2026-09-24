import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../common/Navbar';
import {
  ShoppingCart, SlidersHorizontal, Package, Heart,
  Zap, Check, RotateCcw, LayoutGrid, List, ArrowRightLeft,
  X, Truck, Star, ShieldCheck, Store, ArrowRight, Flame, Sparkles
} from 'lucide-react';
import { CATEGORIES, seedVendors } from '../../data/seedData';
import { rankProductsFairly } from '../../utils/fairRanking';
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
  const { getVendorById } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // ── 3. useReducer for filter state ──
  const [filterState, dispatchFilter] = useReducer(filterReducer, initialFilterState);

  // ── 4. useState for UI preferences & comparison ──
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState({});
  const { compareList, isInCompare, toggleCompare, clearCompare, removeFromCompare } = useComparison();
  const [showCompareModal, setShowCompareModal] = useState(false);

  // ── 5. useRef for DOM elements & debouncers ──
  const debounceTimerRef = useRef(null);
  const productsTopRef = useRef(null);

  const approved = getApprovedProducts();

  // ── 6. useMemo for derived collections ──
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

  const toggleWishlist = useCallback((e, productId) => {
    e.stopPropagation();
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  }, []);

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
            const count = categoryCounts[cat] || 0;
            return (
              <button
                key={cat}
                className={`cat-btn ${filterState.category === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {getCategoryLabel(cat)}
                <span style={{ fontSize: '0.72rem', opacity: 0.7, marginLeft: 2, background: filterState.category === cat ? 'var(--primary-light)' : 'var(--surface-2)', color: filterState.category === cat ? 'white' : 'var(--text-secondary)', padding: '1px 6px', borderRadius: '10px' }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Banner */}
      {filterState.category === 'All' && !filterState.search && (
        <div style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', padding: '32px 0', marginBottom: 0 }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Zap size={18} color="#FCD34D" fill="#FCD34D" />
                <span style={{ color: '#FCD34D', fontWeight: 700, fontSize: '0.85rem' }}>PHYSICAL PRODUCT MARKETPLACE · REAL INVENTORY ONLY</span>
              </div>
              <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
                Shop Physical Products from Verified Vendor Stores
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', margin: '0 0 14px' }}>
                {approved.length} products with live warehouse stock tracking, fast courier dispatch & verified brand warranties
              </p>
              <Link
                to="/stores"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 14px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  textDecoration: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <span>🏬 Explore Verified Stores Directory</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{approved.reduce((acc, p) => acc + (p.stock || p.quantity || 0), 0)}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}>Units in Stock</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>24h</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}>Dispatch Hub</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ padding: '28px 24px' }} ref={productsTopRef}>
        {/* ── Explore Vendors Spotlight Strip ── */}
        <div style={{ marginBottom: 28, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Store size={18} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Explore Verified Vendors & Emerging Merchants
                </h3>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Discover 10 physical storefronts across India with genuine warehouse stock and direct brand warranties
              </p>
            </div>
            <Link
              to="/stores"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.82rem',
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
            {seedVendors.map((v) => (
              <div
                key={v.id}
                onClick={() => navigate(`/store/${v.storeSlug || v.id}`)}
                style={{
                  minWidth: 210,
                  maxWidth: 230,
                  flex: '0 0 auto',
                  background: 'var(--surface-2, #F8FAFC)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: 12,
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
                    style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {v.businessName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {v.location ? v.location.split(',')[0] : 'India'}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem' }}>
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

        {/* Toolbar */}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {/* Quick in-stock toggle */}
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

            {/* Fast Courier Dispatch toggle */}
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

            {/* Sort selection */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <SlidersHorizontal size={16} color="var(--text-muted)" />
              <select
                className="form-input form-select"
                value={filterState.sortBy}
                onChange={(e) => dispatchFilter({ type: FILTER_ACTIONS.SET_SORT, payload: e.target.value })}
                style={{ width: 'auto', padding: '8px 36px 8px 12px', fontSize: '0.85rem' }}
              >
                <option value="smart_discovery">✨ Smart Discovery (Fair Exposure)</option>
                <option value="newest">{t('sort_newest', 'Newest Stock')}</option>
                <option value="price-asc">{t('sort_price_asc', 'Price: Low to High')}</option>
                <option value="price-desc">{t('sort_price_desc', 'Price: High to Low')}</option>
                <option value="stock-desc">{t('sort_rating', 'Highest Stock First')}</option>
              </select>
            </div>

            {/* View Mode Toggle */}
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

            {/* Reset button if filtered */}
            {(filterState.search || filterState.category !== 'All' || filterState.inStockOnly || filterState.fastDeliveryOnly || filterState.sortBy !== 'newest') && (
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
              const isWishlisted = !!wishlist[product.id];
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
                        onClick={(e) => toggleWishlist(e, product.id)}
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

      {/* Footer */}
      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Multi-Vendor Marketplace · All Rights Reserved
      </footer>
    </div>
  );
}
