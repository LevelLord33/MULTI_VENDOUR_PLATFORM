import { useState, useEffect, useReducer, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import {
  ShoppingCart, SlidersHorizontal, Package, Heart,
  Zap, Check, RotateCcw, LayoutGrid, List
} from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import '../../styles/marketplace.css';

const CATEGORY_ICONS = {
  'All': '🛍️', 'Electronics': '📱', 'Fashion': '👗', 'Grocery': '🛒',
  'Home & Living': '🏠', 'Sports': '⚽', 'Beauty': '💄',
};

// ── 1. Filter Reducer for complex multi-parameter filter state ──
const FILTER_ACTIONS = {
  SET_SEARCH: 'SET_SEARCH',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SORT: 'SET_SORT',
  TOGGLE_IN_STOCK: 'TOGGLE_IN_STOCK',
  SET_CONDITION: 'SET_CONDITION',
  RESET: 'RESET',
};

const initialFilterState = {
  search: '',
  category: 'All',
  sortBy: 'newest',
  inStockOnly: false,
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
    case FILTER_ACTIONS.SET_CONDITION:
      return { ...state, condition: action.payload };
    case FILTER_ACTIONS.RESET:
      return initialFilterState;
    default:
      return state;
  }
}

export default function ProductListing() {
  // ── 2. useContext hooks for global domain state ──
  const { getApprovedProducts } = useProducts();
  const { addToCart } = useCart();
  const { getVendorById } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // ── 3. useReducer for predictable filter transitions ──
  const [filterState, dispatchFilter] = useReducer(filterReducer, initialFilterState);

  // ── 4. useState for local UI preferences ──
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'compact'
  const [wishlist, setWishlist] = useState({});

  // ── 5. useRef for DOM elements, debounce timers, and keyboard targets ──
  const debounceTimerRef = useRef(null);
  const productsTopRef = useRef(null);

  const approved = getApprovedProducts();

  // ── 6. useMemo for expensive operations & derived metrics ──
  // Calculate counts per category dynamically
  const categoryCounts = useMemo(() => {
    const counts = { All: approved.length };
    CATEGORIES.forEach((cat) => {
      if (cat !== 'All') {
        counts[cat] = approved.filter((p) => p.category === cat).length;
      }
    });
    return counts;
  }, [approved]);

  // Memoize filtered and sorted product list
  const filtered = useMemo(() => {
    let list = [...approved];

    // Category filter
    if (filterState.category !== 'All') {
      list = list.filter((p) => p.category === filterState.category);
    }

    // Search query filter (matches name, category, brand, description)
    if (filterState.search) {
      const q = filterState.search.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // In-stock only filter
    if (filterState.inStockOnly) {
      list = list.filter((p) => p.quantity > 0);
    }

    // Condition filter
    if (filterState.condition !== 'All') {
      list = list.filter((p) => p.condition === filterState.condition);
    }

    // Sorting
    if (filterState.sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (filterState.sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return list;
  }, [approved, filterState]);

  // ── 7. useCallback to memoize callbacks passed to handlers ──
  const handleAddToCart = useCallback((e, product) => {
    e.stopPropagation();
    addToCart(product);
    addToast(`${product.name} added to cart!`, 'success');
  }, [addToCart, addToast]);

  const toggleWishlist = useCallback((e, productId) => {
    e.stopPropagation();
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  }, []);

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

  // ── 8. useEffect for side effects (keyboard shortcuts, doc title, cleanup) ──
  useEffect(() => {
    // Dynamic document title update
    const activeLabel = filterState.category === 'All' ? 'Explore Products' : filterState.category;
    document.title = `${activeLabel} (${filtered.length}) | Vendour-Mart`;

    return () => {
      // Clear any pending debounce timers on unmount
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filterState.category, filtered.length]);

  // Keyboard shortcut listener: Pressing '/' focuses search, 'Escape' clears search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.querySelector('.navbar-search input');
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape' && filterState.search) {
        dispatchFilter({ type: FILTER_ACTIONS.SET_SEARCH, payload: '' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filterState.search]);

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
                {cat}
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
                <span style={{ color: '#FCD34D', fontWeight: 700, fontSize: '0.85rem' }}>NEW ARRIVALS · 10 PRODUCTS PER CATEGORY</span>
              </div>
              <h2 style={{ color: 'white', fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
                Discover Products from Local Vendors
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                {approved.length} approved products across {CATEGORIES.length - 1} categories — optimized with React 19 performance hooks
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>{approved.length}+</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Live Products</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '16px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'white' }}>6</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem' }}>Categories (10 ea)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container" style={{ padding: '28px 24px' }} ref={productsTopRef}>
        {/* Toolbar */}
        <div className="section-title" style={{ flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2>
              {filterState.category === 'All' ? 'All Products' : filterState.category}
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 10 }}>
                ({filtered.length})
              </span>
            </h2>
            {filterState.search && (
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Results for "<strong>{filterState.search}</strong>" · Press <kbd style={{ padding: '1px 5px', background: '#e2e8f0', borderRadius: 4, fontSize: '0.75rem' }}>ESC</kbd> to clear
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
              {filterState.inStockOnly && <Check size={14} />} In Stock Only
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
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
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
            {(filterState.search || filterState.category !== 'All' || filterState.inStockOnly || filterState.sortBy !== 'newest') && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={handleResetFilters}
                title="Reset all filters"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
              >
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={64} /></div>
            <h3>No products found</h3>
            <p>{filterState.search ? `No results for "${filterState.search}"` : 'No products in this category match your criteria'}</p>
            <button className="btn btn-outline" onClick={handleResetFilters}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`product-grid ${viewMode === 'compact' ? 'compact-grid' : ''}`}>
            {filtered.map((product) => {
              const vendor = getVendorById(product.vendorId);
              const isWishlisted = !!wishlist[product.id];
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
                    <div className="product-card-badge">
                      <span className="badge badge-new">{product.condition === 'New' ? '✨ New' : product.condition}</span>
                    </div>
                    <button
                      className="product-card-wishlist"
                      onClick={(e) => toggleWishlist(e, product.id)}
                      style={{ color: isWishlisted ? 'var(--danger)' : undefined }}
                    >
                      <Heart size={15} fill={isWishlisted ? 'var(--danger)' : 'none'} />
                    </button>
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-vendor">{vendor?.businessName || 'Vendour-Mart'}</div>
                    <div className="product-card-name">{product.name}</div>
                    <div className="product-card-price">
                      <span className="currency">₹</span>
                      {product.price.toLocaleString('en-IN')}
                    </div>
                    <div className="product-card-stock">
                      {product.quantity > 0 ? (
                        <span style={{ color: 'var(--success)' }}>✓ {product.quantity} in stock</span>
                      ) : (
                        <span style={{ color: 'var(--danger)' }}>Out of stock</span>
                      )}
                    </div>
                    <button
                      className="product-card-add-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={product.quantity === 0}
                    >
                      <ShoppingCart size={15} /> Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart · India's Smart Local Marketplace
      </footer>
    </div>
  );
}
