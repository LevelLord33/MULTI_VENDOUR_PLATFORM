import { useState, useMemo } from 'react';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar, ProductReviewCard } from './AdminDashboard';
import {
  Clock, CheckCircle, XCircle, Package, Search, Filter,
  Layers, DollarSign, Boxes, ArrowUpDown, X, CheckCheck
} from 'lucide-react';
import '../../styles/vendor.css';

/* ── Shared Filter Toolbar & Summary Cards ── */
function ProductManagementHeader({
  title,
  icon,
  badgeText,
  badgeBg,
  badgeColor,
  products,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  onBulkApprove,
  isPendingView = false
}) {
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const totalStock = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock != null ? p.stock : (p.quantity || 0)), 0);
  }, [products]);

  const totalValue = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.price || 0) * (p.stock != null ? p.stock : (p.quantity || 1)), 0);
  }, [products]);

  return (
    <>
      {/* Topbar */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: badgeBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
          <div>
            <div className="vendor-topbar-title" style={{ fontSize: '1.15rem' }}>{title}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Physical product specifications, compliance review & marketplace catalogue control
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {isPendingView && onBulkApprove && products.length > 0 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={onBulkApprove}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                border: 'none',
                fontWeight: 700
              }}
            >
              <CheckCheck size={16} /> Approve All Filtered ({products.length})
            </button>
          )}

          <span style={{
            background: badgeBg,
            color: badgeColor,
            padding: '5px 14px',
            borderRadius: 9999,
            fontWeight: 700,
            fontSize: '0.82rem',
            border: `1px solid ${badgeColor}33`,
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            {badgeText}
          </span>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div style={{ padding: '24px 28px 0' }}>
        <div className="stats-grid" style={{ marginBottom: 20 }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              <Package size={22} />
            </div>
            <div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Catalog Items in View</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#ECFDF5', color: '#10B981' }}>
              <Boxes size={22} />
            </div>
            <div>
              <div className="stat-value">{totalStock.toLocaleString('en-IN')}</div>
              <div className="stat-label">Physical Warehouse Units</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
              <DollarSign size={22} />
            </div>
            <div>
              <div className="stat-value">₹{totalValue.toLocaleString('en-IN')}</div>
              <div className="stat-label">Cumulative Retail Valuation</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#F3E8FF', color: '#9333EA' }}>
              <Layers size={22} />
            </div>
            <div>
              <div className="stat-value">{categories.length > 1 ? categories.length - 1 : 0}</div>
              <div className="stat-label">Active Market Categories</div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '16px 20px',
          marginBottom: 24,
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
            {/* Search Input */}
            <div style={{
              flex: 1,
              minWidth: 260,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 14px'
            }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search SKU name, brand, SKU code, or vendor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.88rem',
                  color: 'var(--text-primary)'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ArrowUpDown size={16} color="var(--text-muted)" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: '0.84rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="newest">Sort: Default / Order</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock_desc">Highest Stock Units</option>
              </select>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: 4 }}>
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    border: isSelected ? '1px solid #9333EA' : '1px solid var(--border)',
                    background: isSelected ? 'rgba(147, 51, 234, 0.1)' : 'var(--surface-2)',
                    color: isSelected ? '#9333EA' : 'var(--text-secondary)',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.78rem',
                    padding: '4px 12px',
                    borderRadius: 20,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Pending Products ─────────────────────── */
export function PendingProducts() {
  const { getPendingProducts, approveProduct, rejectProduct } = useProducts();
  const { addToast } = useToast();
  const rawPending = getPendingProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredPending = useMemo(() => {
    let list = [...rawPending];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.vendorId && p.vendorId.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'stock_desc') {
      list.sort((a, b) => (b.stock || b.quantity || 0) - (a.stock || a.quantity || 0));
    }

    return list;
  }, [rawPending, searchQuery, selectedCategory, sortBy]);

  const handleApprove = (id) => {
    approveProduct(id);
    addToast('Product approved for marketplace catalog!', 'success');
  };

  const handleReject = (id) => {
    rejectProduct(id);
    addToast('Product rejected', 'error');
  };

  const handleBulkApprove = () => {
    if (filteredPending.length === 0) return;
    filteredPending.forEach((p) => approveProduct(p.id));
    addToast(`Successfully approved ${filteredPending.length} pending physical SKUs!`, 'success');
  };

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <ProductManagementHeader
          title="Pending Physical SKUs"
          icon={<Clock size={22} color="#D97706" />}
          badgeText={`${rawPending.length} Awaiting Quality Review`}
          badgeBg="#FEF3C7"
          badgeColor="#92400E"
          products={filteredPending}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onBulkApprove={handleBulkApprove}
          isPendingView={true}
        />

        <div className="admin-content" style={{ paddingTop: 0 }}>
          {filteredPending.length === 0 ? (
            <div className="empty-state card" style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                {rawPending.length === 0 ? 'All physical SKUs reviewed' : 'No products match your search/filter'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {rawPending.length === 0
                  ? 'All vendor product submissions have been processed and approved or rejected.'
                  : 'Try changing your search keywords or resetting the category filter.'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  style={{ marginTop: 14 }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredPending.map((p) => (
              <ProductReviewCard key={p.id} product={p} onApprove={handleApprove} onReject={handleReject} showActions />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Approved Products ────────────────────── */
export function ApprovedProducts() {
  const { getApprovedProducts } = useProducts();
  const rawApproved = getApprovedProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredApproved = useMemo(() => {
    let list = [...rawApproved];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.vendorId && p.vendorId.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'stock_desc') {
      list.sort((a, b) => (b.stock || b.quantity || 0) - (a.stock || a.quantity || 0));
    }

    return list;
  }, [rawApproved, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <ProductManagementHeader
          title="Approved Physical Products"
          icon={<CheckCircle size={22} color="#059669" />}
          badgeText={`${rawApproved.length} Live on Marketplace`}
          badgeBg="#D1FAE5"
          badgeColor="#065F46"
          products={filteredApproved}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="admin-content" style={{ paddingTop: 0 }}>
          {filteredApproved.length === 0 ? (
            <div className="empty-state card" style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Package size={56} className="empty-state-icon" style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                {rawApproved.length === 0 ? 'No approved products in catalog' : 'No approved products match query'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {rawApproved.length === 0
                  ? 'Approve pending vendor products to publish them to customer storefronts.'
                  : 'Try searching for another term or selecting all categories.'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  style={{ marginTop: 14 }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredApproved.map((p) => (
              <ProductReviewCard key={p.id} product={p} onApprove={() => {}} onReject={() => {}} showActions={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Rejected Products ────────────────────── */
export function RejectedProducts() {
  const { getRejectedProducts, approveProduct } = useProducts();
  const { addToast } = useToast();
  const rawRejected = getRejectedProducts();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  const filteredRejected = useMemo(() => {
    let list = [...rawRejected];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.vendorId && p.vendorId.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price_asc') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'stock_desc') {
      list.sort((a, b) => (b.stock || b.quantity || 0) - (a.stock || a.quantity || 0));
    }

    return list;
  }, [rawRejected, searchQuery, selectedCategory, sortBy]);

  const handleReApprove = (id) => {
    approveProduct(id);
    addToast('Product re-approved and added back to marketplace catalog!', 'success');
  };

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <ProductManagementHeader
          title="Rejected Products Archive"
          icon={<XCircle size={22} color="#DC2626" />}
          badgeText={`${rawRejected.length} Disapproved Listings`}
          badgeBg="#FEE2E2"
          badgeColor="#991B1B"
          products={filteredRejected}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <div className="admin-content" style={{ paddingTop: 0 }}>
          {filteredRejected.length === 0 ? (
            <div className="empty-state card" style={{ padding: '48px 24px', textAlign: 'center', background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <Package size={56} className="empty-state-icon" style={{ margin: '0 auto 16px', color: 'var(--text-muted)' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
                {rawRejected.length === 0 ? 'No rejected products' : 'No rejected products match query'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                {rawRejected.length === 0
                  ? 'No vendor product submissions have been rejected.'
                  : 'Try searching for another term or selecting all categories.'}
              </p>
              {(searchQuery || selectedCategory !== 'All') && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  style={{ marginTop: 14 }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            filteredRejected.map((p) => (
              <div key={p.id}>
                <ProductReviewCard product={p} onApprove={handleReApprove} onReject={() => {}} showActions={false} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-14px 0 20px', paddingRight: 20 }}>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleReApprove(p.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                  >
                    <CheckCircle size={15} /> Re-approve into Live Catalog
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
