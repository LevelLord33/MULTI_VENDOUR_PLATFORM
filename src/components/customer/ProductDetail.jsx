import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import {
  ShoppingCart, MapPin, Store, CheckCircle, Package, Tag, ChevronRight,
  Plus, Minus
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. useContext hooks
  const { getProductById, getApprovedProducts } = useProducts();
  const { addToCart } = useCart();
  const { getVendorById } = useAuth();
  const { addToast } = useToast();

  const product = getProductById(id);

  // 2. useState hooks
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [prevId, setPrevId] = useState(id);

  // Adjust state during render when URL id changes (React recommended pattern)
  if (prevId !== id) {
    setPrevId(id);
    setActiveImg(0);
    setQty(1);
  }

  // 3. useRef for DOM element references
  const mainImgRef = useRef(null);

  // 4. useEffect hooks for scroll reset and document title synchronization
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Vendour-Mart`;
    }
  }, [product]);

  // 5. useMemo hooks for expensive derived calculations
  const vendor = useMemo(() => {
    return product ? getVendorById(product.vendorId) : null;
  }, [product, getVendorById]);

  const specsEntries = useMemo(() => {
    if (!product?.specifications) return [];
    return Object.entries(product.specifications);
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getApprovedProducts()
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, getApprovedProducts]);

  // 6. useCallback hooks for event handlers
  const handleAddToCart = useCallback(() => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addToCart(product, 1);
    }
    addToast(`${qty}x ${product.name} added to cart!`, 'success');
  }, [product, qty, addToCart, addToast]);

  const handleBuyNow = useCallback(() => {
    handleAddToCart();
    navigate('/shop/cart');
  }, [handleAddToCart, navigate]);

  const handleThumbnailClick = useCallback((index) => {
    setActiveImg(index);
    if (mainImgRef.current) {
      mainImgRef.current.style.opacity = '0.4';
      setTimeout(() => {
        if (mainImgRef.current) mainImgRef.current.style.opacity = '1';
      }, 120);
    }
  }, []);

  if (!product || product.status !== 'approved') {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="empty-state">
          <Package size={64} className="empty-state-icon" />
          <h3>Product not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="container product-detail-page">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: 600 }}>
            ← Shop
          </button>
          <ChevronRight size={14} />
          <span>{product.category}</span>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images */}
          <div className="product-images-col">
            <img
              ref={mainImgRef}
              src={product.images[activeImg]}
              alt={product.name}
              className="product-main-img"
              style={{ transition: 'opacity 0.15s ease' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop'; }}
            />
            {product.images.length > 1 && (
              <div className="product-thumb-list">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`View ${i + 1}`}
                    className={`product-thumb ${activeImg === i ? 'active' : ''}`}
                    onClick={() => handleThumbnailClick(i)}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=150&h=150&fit=crop'; }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info-col">
            {/* Category & Condition */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="product-category-tag">
                <Tag size={12} /> {product.category}
              </span>
              {product.condition && product.condition !== 'N/A' && (
                <span className="badge badge-approved">{product.condition}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="product-title">{product.name}</h1>

            {/* Brand */}
            {product.brand && product.brand !== 'N/A' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                <Store size={14} /> Brand: <strong style={{ color: 'var(--text-primary)' }}>{product.brand}</strong>
              </div>
            )}

            {/* Price */}
            <div>
              <div className="product-price-big">
                <span className="currency">₹</span>
                {product.price.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                Inclusive of all local taxes · Verified pricing
              </div>
            </div>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {product.quantity > 0 ? (
                <>
                  <CheckCircle size={18} color="var(--success)" />
                  <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.9rem' }}>
                    In Stock ({product.quantity} available)
                  </span>
                </>
              ) : (
                <span style={{ color: 'var(--danger)', fontWeight: 600 }}>Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-num">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart} disabled={product.quantity === 0} style={{ flex: 1, minWidth: 160 }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                className="btn btn-lg"
                style={{ flex: 1, minWidth: 160, background: '#F59E0B', color: 'white', border: 'none', borderRadius: 12, padding: '14px 20px', fontWeight: 700 }}
                onClick={handleBuyNow}
                disabled={product.quantity === 0}
              >
                Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="card">
              <div className="card-body">
                <h4 style={{ marginBottom: 10 }}>Description</h4>
                <p style={{ lineHeight: 1.8, fontSize: '0.9rem' }}>{product.description}</p>
              </div>
            </div>

            {/* Specifications */}
            {specsEntries.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h4 style={{ marginBottom: 14 }}>Specifications</h4>
                  <table className="product-spec-table">
                    <tbody>
                      {specsEntries.map(([key, val]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td style={{ fontWeight: 600 }}>{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vendor Info */}
            {vendor && (
              <div>
                <h4 style={{ marginBottom: 12 }}>Sold by</h4>
                <div
                  className="vendor-info-card"
                  onClick={() => navigate(`/shop/vendor/${vendor.id}`)}
                  style={{ cursor: 'pointer', transition: 'var(--transition)' }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <img
                    src={vendor.avatar}
                    alt={vendor.businessName}
                    className="vendor-info-avatar"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName)}&background=4F46E5&color=fff`; }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="vendor-info-name">{vendor.businessName}</div>
                    <div className="vendor-info-loc">
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {vendor.location}
                    </div>
                  </div>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/shop/vendor/${vendor.id}`); }}
                  >
                    View Store
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: 20 }}>More in {product.category}</h3>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  className="product-card"
                  onClick={() => navigate(`/shop/product/${rel.id}`)}
                >
                  <div className="product-card-img-wrap">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="product-card-img"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'; }}
                    />
                  </div>
                  <div className="product-card-body">
                    <div className="product-card-name" style={{ fontSize: '0.85rem' }}>{rel.name}</div>
                    <div className="product-card-price">₹{rel.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart · India's Smart Local Marketplace
      </footer>
    </div>
  );
}
