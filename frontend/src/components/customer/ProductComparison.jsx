import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useComparison } from '../../contexts/ComparisonContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import {
  ArrowLeft, ArrowRightLeft, Trash2, ShoppingCart, CheckCircle,
  XCircle, Truck, RotateCcw, ShieldCheck, Star, Store, MapPin,
  AlertTriangle, Sparkles, ExternalLink, Info, Check, Plus
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function ProductComparison() {
  const { compareList, removeFromCompare, clearCompare } = useComparison();
  const { addToCart } = useCart();
  const { getVendorById } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [highlightDifferences, setHighlightDifferences] = useState(false);

  useEffect(() => {
    document.title = `Product Comparison (${compareList.length} items) | Vendor Hub`;
    window.scrollTo(0, 0);
  }, [compareList.length]);

  // Check category compatibility
  const categories = useMemo(() => {
    return Array.from(new Set(compareList.map((p) => p.category).filter(Boolean)));
  }, [compareList]);

  const isCompatible = categories.length <= 1;

  // Aggregate all unique specification keys across all products
  const allSpecKeys = useMemo(() => {
    const keys = new Set();
    compareList.forEach((p) => {
      if (p.specifications) {
        Object.keys(p.specifications).forEach((k) => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [compareList]);

  // Handler for adding to cart
  const handleAddToCart = useCallback(
    (product) => {
      const stockAvailable = product.stock !== undefined ? product.stock : (product.quantity || 0);
      if (stockAvailable <= 0) {
        addToast('Selected product is currently out of stock.', 'error');
        return;
      }

      const defaultColor = product.variants?.colors?.[0]?.name || null;
      const defaultOption = product.variants?.options?.[0]?.label || null;

      addToCart(product, 1, { color: defaultColor, option: defaultOption });
      addToast(`Added "${product.name}" to cart!`, 'success');
    },
    [addToCart, addToast]
  );

  return (
    <div className="page-wrapper" style={{ background: 'var(--bg-secondary, #F8FAFC)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 80px', width: '100%' }}>
        {/* Navigation Breadcrumb & Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => navigate('/shop')}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <ArrowLeft size={16} /> Back to Shop
            </button>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <ArrowRightLeft size={24} color="#4F46E5" />
                Smart Product Comparison
              </h1>
              <p style={{ margin: '4px 0 0', color: 'var(--text-muted, #64748B)', fontSize: '0.88rem' }}>
                Compare key specifications, vendor ratings, shipping policies, and prices across multiple sellers.
              </p>
            </div>
          </div>

          {compareList.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none', background: 'white', padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border, #E2E8F0)' }}>
                <input
                  type="checkbox"
                  checked={highlightDifferences}
                  onChange={(e) => setHighlightDifferences(e.target.checked)}
                  style={{ accentColor: '#4F46E5', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 600 }}>Highlight Differences</span>
              </label>

              <button
                onClick={clearCompare}
                className="btn btn-secondary btn-sm"
                style={{ color: '#DC2626', borderColor: '#FECACA', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={15} /> Clear All ({compareList.length})
              </button>
            </div>
          )}
        </div>

        {/* Category Compatibility Warning if user forced items from different categories */}
        {!isCompatible && compareList.length > 1 && (
          <div style={{ background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 10, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertTriangle size={20} color="#D97706" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.86rem', color: '#92400E' }}>
              <strong>Mixed Categories Warning:</strong> You are comparing items across different categories ({categories.join(', ')}). For the most accurate comparison of technical specifications, select items within the same category.
            </div>
          </div>
        )}

        {/* Empty State or < 2 Products Warning */}
        {compareList.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border, #E2E8F0)', padding: '64px 20px', textAlign: 'center', maxWidth: 640, margin: '40px auto' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <ArrowRightLeft size={36} color="#4F46E5" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>No products selected for comparison</h2>
            <p style={{ color: 'var(--text-muted, #64748B)', fontSize: '0.92rem', marginBottom: 24, lineHeight: 1.5 }}>
              Browse the customer marketplace and click the <strong>"Compare"</strong> button on any 2 to 4 products to compare their prices, specifications, and vendor ratings side-by-side.
            </p>
            <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Explore Products to Compare
            </button>
          </div>
        ) : compareList.length === 1 ? (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid var(--border, #E2E8F0)', padding: '32px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Info size={22} color="#4F46E5" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Select at least one more product to compare</h3>
                <p style={{ margin: '2px 0 0', color: 'var(--text-muted, #64748B)', fontSize: '0.85rem' }}>
                  Product comparison requires 2 to 4 products. Add another item from the same category to see side-by-side differences.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/shop')} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Plus size={15} /> Add Another Product from Shop
            </button>
          </div>
        ) : null}

        {/* ── Responsive Comparison Matrix Table ── */}
        {compareList.length >= 2 && (
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              border: '1px solid var(--border, #E2E8F0)',
              overflowX: 'auto',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: `${220 + compareList.length * 280}px` }}>
              <thead>
                <tr style={{ background: 'var(--surface-2, #F8FAFC)', borderBottom: '2px solid var(--border, #E2E8F0)' }}>
                  <th style={{ width: '220px', padding: '20px', textAlign: 'left', verticalAlign: 'top', color: 'var(--text-muted, #64748B)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Products ({compareList.length}/4)
                  </th>
                  {compareList.map((p) => {
                    const vendor = getVendorById(p.vendorId);
                    const stockAvailable = p.stock !== undefined ? p.stock : (p.quantity || 0);

                    return (
                      <th
                        key={p.id}
                        style={{
                          width: `${100 / compareList.length}%`,
                          minWidth: '280px',
                          padding: '20px',
                          textAlign: 'left',
                          verticalAlign: 'top',
                          position: 'relative',
                          borderLeft: '1px solid var(--border, #E2E8F0)',
                        }}
                      >
                        {/* Remove Action */}
                        <button
                          onClick={() => removeFromCompare(p.id)}
                          title="Remove from comparison"
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: '#FEE2E2',
                            border: 'none',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#DC2626',
                            transition: 'all 0.2s',
                          }}
                        >
                          <XCircle size={18} />
                        </button>

                        {/* Image */}
                        <div
                          style={{
                            height: '180px',
                            borderRadius: '10px',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            marginBottom: '14px',
                            padding: '8px',
                          }}
                        >
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300&h=300&fit=crop'}
                            alt={p.name}
                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        {/* Category & Badge */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                            {p.category}
                          </span>
                          <span style={{ fontSize: '0.72rem', background: '#F1F5F9', padding: '2px 6px', borderRadius: 4, fontFamily: 'monospace' }}>
                            {p.sku || `VM-${p.id}`}
                          </span>
                        </div>

                        {/* Product Title */}
                        <Link
                          to={`/shop/product/${p.id}`}
                          style={{
                            fontWeight: 700,
                            fontSize: '1rem',
                            color: 'var(--text-primary, #0F172A)',
                            textDecoration: 'none',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.35,
                            marginBottom: 8,
                          }}
                        >
                          {p.name}
                        </Link>

                        {/* Price Display */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4F46E5' }}>
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                          {p.mrp && p.mrp > p.price && (
                            <>
                              <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                                ₹{p.mrp?.toLocaleString('en-IN')}
                              </span>
                              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16A34A', background: '#DCFCE7', padding: '1px 6px', borderRadius: 4 }}>
                                {p.discountPercent || Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>

                        {/* Add to Cart CTA */}
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={stockAvailable <= 0}
                          className="btn btn-primary btn-sm btn-full"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 14px' }}
                        >
                          <ShoppingCart size={15} />
                          {stockAvailable > 0 ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {/* ── Section: Vendor & Storefront ── */}
                <tr style={{ background: '#F8FAFC' }}>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4F46E5', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                    🏢 Vendor & Storefront Information
                  </td>
                </tr>

                {/* Vendor Name */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Vendor Name
                  </td>
                  {compareList.map((p) => {
                    const v = getVendorById(p.vendorId);
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Store size={16} color="#4F46E5" />
                          <Link to={`/shop/vendor/${p.vendorId}`} style={{ fontWeight: 700, color: '#1E293B', textDecoration: 'none' }}>
                            {v?.businessName || 'Verified Merchant'}
                          </Link>
                        </div>
                        {v?.location && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748B', fontSize: '0.78rem', marginTop: 3 }}>
                            <MapPin size={12} /> {v.location}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Vendor Rating */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Store Trust Rating
                  </td>
                  {compareList.map((p) => {
                    const v = getVendorById(p.vendorId);
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF3C7', padding: '3px 8px', borderRadius: 6, fontWeight: 700, color: '#B45309' }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          {v?.storeRating || 4.8} / 5.0
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 4 }}>
                          {v?.totalOrdersFulfilled || 1200}+ Orders Fulfilled
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* ── Section: Product Ratings & Availability ── */}
                <tr style={{ background: '#F8FAFC' }}>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4F46E5', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                    ⭐ Product Review & Stock Availability
                  </td>
                </tr>

                {/* Product Rating */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Customer Rating
                  </td>
                  {compareList.map((p) => {
                    const reviews = p.reviews || [];
                    const avgRating =
                      reviews.length > 0
                        ? (reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length).toFixed(1)
                        : (p.rating || 4.7);

                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ display: 'flex', color: '#F59E0B' }}>
                            {[1, 2, 3, 4, 5].map((st) => (
                              <Star key={st} size={14} fill={st <= Math.round(avgRating) ? '#F59E0B' : 'none'} />
                            ))}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{avgRating}</span>
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 3 }}>
                          ({reviews.length || 18} verified buyer ratings)
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Warehouse Stock */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Stock Availability
                  </td>
                  {compareList.map((p) => {
                    const stock = p.stock !== undefined ? p.stock : (p.quantity || 0);
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        {stock > 0 ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#16A34A', fontWeight: 700 }}>
                            <CheckCircle size={16} />
                            <span>In Stock ({stock} units ready)</span>
                          </div>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#DC2626', fontWeight: 700 }}>
                            <XCircle size={16} />
                            <span>Temporarily Out of Stock</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* ── Section: Shipping & Delivery ── */}
                <tr style={{ background: '#F8FAFC' }}>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4F46E5', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                    🚚 Delivery & Logistics Details
                  </td>
                </tr>

                {/* Dispatch Time */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Dispatch Time
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                      <div style={{ fontWeight: 600 }}>{p.shipping?.dispatchTime || 'Ships within 24 hours'}</div>
                      <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 2 }}>
                        Est. Delivery: {p.shipping?.estimatedDays || '2 - 4 business days'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Courier Partners */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Courier Logistics
                  </td>
                  {compareList.map((p) => {
                    const partners = p.shipping?.courierPartners || ['BlueDart Express', 'Delhivery'];
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Truck size={15} color="#4F46E5" />
                          <span>{partners.join(', ')}</span>
                        </div>
                        <div style={{ color: '#16A34A', fontSize: '0.78rem', fontWeight: 600, marginTop: 4 }}>
                          {p.shipping?.codAvailable ? '✓ Cash on Delivery (COD) Available' : 'Prepaid Orders Only'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* ── Section: Return & Warranty Policy ── */}
                <tr style={{ background: '#F8FAFC' }}>
                  <td colSpan={compareList.length + 1} style={{ padding: '10px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4F46E5', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                    🛡️ Return & Warranty Guarantees
                  </td>
                </tr>

                {/* Return Policy */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Return Policy
                  </td>
                  {compareList.map((p) => {
                    const v = getVendorById(p.vendorId);
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0F172A' }}>
                          <RotateCcw size={15} color="#4F46E5" />
                          <span>{p.shipping?.returnWindowDays || 7}-Day Hassle-Free Replacement</span>
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 3 }}>
                          {v?.returnPolicy || 'Physically inspected & verified replacement supported'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Warranty */}
                <tr>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#64748B', fontSize: '0.85rem' }}>
                    Warranty & Invoice
                  </td>
                  {compareList.map((p) => {
                    const v = getVendorById(p.vendorId);
                    return (
                      <td key={p.id} style={{ padding: '14px 20px', borderLeft: '1px solid #E2E8F0', fontSize: '0.88rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#0F172A' }}>
                          <ShieldCheck size={16} color="#16A34A" />
                          <span>Brand Manufacturer Warranty</span>
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.78rem', marginTop: 3 }}>
                          {v?.warrantyPolicy || 'GST Tax Invoice & Brand Warranty Included'}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* ── Section: Specifications Comparison Matrix ── */}
                {allSpecKeys.length > 0 && (
                  <>
                    <tr style={{ background: '#F8FAFC' }}>
                      <td colSpan={compareList.length + 1} style={{ padding: '10px 20px', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#4F46E5', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' }}>
                        ⚙️ Detailed Technical Specifications
                      </td>
                    </tr>

                    {allSpecKeys.map((specKey) => {
                      // Check if values differ across products
                      const values = compareList.map((p) => p.specifications?.[specKey] || '—');
                      const hasDifferences = new Set(values).size > 1;

                      const rowStyle = highlightDifferences && hasDifferences
                        ? { background: '#FEF3C7', transition: 'background 0.2s' }
                        : {};

                      return (
                        <tr key={specKey} style={rowStyle}>
                          <td style={{ padding: '12px 20px', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>
                            {specKey}
                            {highlightDifferences && hasDifferences && (
                              <span style={{ display: 'block', fontSize: '0.7rem', color: '#B45309', fontWeight: 700 }}>
                                (Differs)
                              </span>
                            )}
                          </td>
                          {compareList.map((p) => {
                            const specVal = p.specifications?.[specKey] || '—';
                            return (
                              <td
                                key={p.id}
                                style={{
                                  padding: '12px 20px',
                                  borderLeft: '1px solid #E2E8F0',
                                  fontSize: '0.88rem',
                                  fontWeight: specVal !== '—' ? 600 : 400,
                                  color: specVal !== '—' ? '#0F172A' : '#94A3B8',
                                }}
                              >
                                {specVal}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </>
                )}

                {/* Bottom Sticky Action Row */}
                <tr style={{ background: '#F8FAFC', borderTop: '2px solid #E2E8F0' }}>
                  <td style={{ padding: '18px 20px', fontWeight: 700, color: '#64748B', fontSize: '0.85rem' }}>
                    Purchase Option
                  </td>
                  {compareList.map((p) => {
                    const stock = p.stock !== undefined ? p.stock : (p.quantity || 0);
                    return (
                      <td key={p.id} style={{ padding: '18px 20px', borderLeft: '1px solid #E2E8F0' }}>
                        <div style={{ marginBottom: 8, fontSize: '1.15rem', fontWeight: 800, color: '#4F46E5' }}>
                          ₹{p.price?.toLocaleString('en-IN')}
                        </div>
                        <button
                          onClick={() => handleAddToCart(p)}
                          disabled={stock <= 0}
                          className="btn btn-primary btn-sm btn-full"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          <ShoppingCart size={15} /> Add to Cart
                        </button>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
