import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useComparison } from '../../contexts/ComparisonContext';
import Navbar from '../common/Navbar';
import ContactVendorModal from './ContactVendorModal';
import ShareModal from '../common/ShareModal';
import {
  ShoppingCart, MapPin, Store, CheckCircle, Package, Tag, ChevronRight,
  Plus, Minus, ShieldCheck, Truck, RotateCcw, HelpCircle, Star, Copy, Check,
  MessageSquare, Gift, AlertTriangle, Sparkles, Send, Award, Clock, ArrowRightLeft,
  Share2
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 1. Context hooks
  const { getProductById, getApprovedProducts, addProductReview, addProductInquiry } = useProducts();
  const { addToCart } = useCart();
  const { getVendorById, user } = useAuth();
  const { addToast } = useToast();
  const { toggleCompare, isInCompare } = useComparison();

  const product = getProductById(id);

  // 2. State hooks
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [prevId, setPrevId] = useState(id);

  // Variant & Customization states
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [engravingText, setEngravingText] = useState('');
  const [isGiftWrap, setIsGiftWrap] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);

  // Pincode & Tabs
  const [pincode, setPincode] = useState('560001');
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'shipping' | 'reviews' | 'qa'
  const [copiedSku, setCopiedSku] = useState(false);

  // Inquiry & Review states
  const [inquiryText, setInquiryText] = useState('');
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Synchronize variants when product changes
  useEffect(() => {
    if (product) {
      if (product.variants?.colors?.length > 0) {
        setSelectedColor(product.variants.colors[0]);
      } else {
        setSelectedColor(null);
      }
      if (product.variants?.options?.length > 0) {
        setSelectedOption(product.variants.options[0]);
      } else {
        setSelectedOption(null);
      }
      if (product.variants?.customization?.warrantyPlans?.length > 0) {
        setSelectedWarranty(product.variants.customization.warrantyPlans[0]);
      } else {
        setSelectedWarranty(null);
      }
      setEngravingText('');
      setIsGiftWrap(false);
    }
  }, [product?.id]);

  if (prevId !== id) {
    setPrevId(id);
    setActiveImg(0);
    setQty(1);
  }

  // 3. Refs
  const mainImgRef = useRef(null);

  // 4. Effects
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Vendor Hub`;
    }
  }, [product]);

  // 5. Memos
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

  // More products from the exact same vendor (Storefront Discovery)
  const vendorOtherProducts = useMemo(() => {
    if (!product) return [];
    return getApprovedProducts()
      .filter((p) => p.vendorId === product.vendorId && p.id !== product.id)
      .slice(0, 4);
  }, [product, getApprovedProducts]);

  // Fair Exposure: Alternative high-quality products from emerging merchants
  const emergingAlternativeProducts = useMemo(() => {
    if (!product) return [];
    return getApprovedProducts()
      .filter((p) => p.vendorId !== product.vendorId &&
        (['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(p.vendorId) || p.isFairExposureBoosted) &&
        (p.stock || p.quantity || 0) > 0
      )
      .slice(0, 4);
  }, [product, getApprovedProducts]);

  // Stock & Pricing Memos
  const activeStock = useMemo(() => {
    if (!product) return 0;
    if (selectedOption && typeof selectedOption.stock === 'number') {
      return selectedOption.stock;
    }
    return product.stock != null ? product.stock : (product.quantity || 0);
  }, [product, selectedOption]);

  const isLowStock = useMemo(() => {
    const threshold = product?.lowStockThreshold || 5;
    return activeStock > 0 && activeStock <= threshold;
  }, [activeStock, product]);

  const isOutOfStock = activeStock <= 0;

  const currentUnitPrice = useMemo(() => {
    if (!product) return 0;
    const base = product.price || 0;
    const optDelta = selectedOption?.priceDelta || 0;
    const warrantyDelta = selectedWarranty?.price || 0;
    const giftWrapDelta = isGiftWrap ? (product.variants?.customization?.giftWrapPrice || 99) : 0;
    return base + optDelta + warrantyDelta + giftWrapDelta;
  }, [product, selectedOption, selectedWarranty, isGiftWrap]);

  const totalCalculatedPrice = useMemo(() => {
    return currentUnitPrice * qty;
  }, [currentUnitPrice, qty]);

  const totalMrp = useMemo(() => {
    if (!product) return 0;
    const baseMrp = product.mrp || Math.round((product.price || 0) * 1.25);
    const optDelta = selectedOption?.priceDelta || 0;
    return (baseMrp + optDelta) * qty;
  }, [product, selectedOption, qty]);

  const reviewsList = useMemo(() => {
    return product?.reviews || [];
  }, [product]);

  const averageRating = useMemo(() => {
    if (!reviewsList.length) return 4.8;
    const sum = reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const inquiriesList = useMemo(() => {
    return product?.inquiries || [];
  }, [product]);

  // 6. Callbacks
  const handleCopySku = useCallback(() => {
    if (product?.sku) {
      navigator.clipboard?.writeText(product.sku);
      setCopiedSku(true);
      addToast(`Copied SKU: ${product.sku}`, 'info');
      setTimeout(() => setCopiedSku(false), 2000);
    }
  }, [product, addToast]);

  const handleAddToCart = useCallback(() => {
    if (!product || isOutOfStock) return;
    
    const variantPayload = {
      color: selectedColor?.name || '',
      colorHex: selectedColor?.hex || '',
      option: selectedOption?.label || '',
      priceDelta: selectedOption?.priceDelta || 0,
    };

    const customizationPayload = {
      engraving: engravingText.trim() || undefined,
      giftWrap: isGiftWrap,
      giftWrapPrice: isGiftWrap ? (product.variants?.customization?.giftWrapPrice || 99) : 0,
      warranty: selectedWarranty?.label || undefined,
      warrantyPrice: selectedWarranty?.price || 0,
    };

    addToCart(
      {
        ...product,
        price: currentUnitPrice,
        stock: activeStock,
      },
      qty,
      variantPayload,
      customizationPayload
    );

    addToast(`Added ${qty}x ${product.name} to your physical order cart!`, 'success');
  }, [
    product, isOutOfStock, selectedColor, selectedOption, engravingText,
    isGiftWrap, selectedWarranty, currentUnitPrice, activeStock, qty, addToCart, addToast
  ]);

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

  const handlePincodeCheck = useCallback((e) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeVerified(true);
      addToast(`Courier serviceability confirmed for pincode ${pincode}`, 'success');
    } else {
      addToast('Please enter a valid 6-digit postal pincode', 'danger');
    }
  }, [pincode, addToast]);

  const handleSubmitInquiry = useCallback((e) => {
    e.preventDefault();
    if (!inquiryText.trim()) return;
    setIsSubmittingInquiry(true);
    const author = user?.name || 'Verified Customer';
    addProductInquiry(product.id, inquiryText.trim(), author);
    setInquiryText('');
    setIsSubmittingInquiry(false);
    addToast('Your question was submitted to the seller! You will see it listed below.', 'success');
  }, [inquiryText, user, product, addProductInquiry, addToast]);

  const handleSubmitReview = useCallback((e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      addToast('Please provide a title and feedback review.', 'danger');
      return;
    }
    const reviewData = {
      customerName: user?.name || 'Verified Buyer',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    addProductReview(product.id, reviewData);
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
    addToast('Review submitted successfully! Thank you for rating this physical product.', 'success');
  }, [reviewRating, reviewTitle, reviewComment, user, product, addProductReview, addToast]);

  if (!product || product.status !== 'approved') {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="empty-state">
          <Package size={64} className="empty-state-icon" />
          <h3>Physical Product Not Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            This item is either discontinued, awaiting warehouse inventory audit, or unavailable.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>
            Back to Marketplace
          </button>
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
            ← Marketplace
          </button>
          <ChevronRight size={14} />
          <span>{product.category}</span>
          <ChevronRight size={14} />
          {product.brand && (
            <>
              <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{product.brand}</span>
              <ChevronRight size={14} />
            </>
          )}
          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{product.name}</span>
        </div>

        <div className="product-detail-grid">
          {/* Images Column */}
          <div className="product-images-col">
            <div style={{ position: 'relative' }}>
              <img
                ref={mainImgRef}
                src={product.images[activeImg] || product.images[0]}
                alt={product.name}
                className="product-main-img"
                style={{ transition: 'opacity 0.15s ease' }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop'; }}
              />
              {/* Floating Stock Badge */}
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                {isOutOfStock ? (
                  <span className="badge badge-rejected" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="badge badge-pending" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, boxShadow: 'var(--shadow-sm)', animation: 'pulse 2s infinite' }}>
                    ⚡ Only {activeStock} Left
                  </span>
                ) : (
                  <span className="badge badge-approved" style={{ padding: '6px 12px', fontSize: '0.8rem', fontWeight: 700, boxShadow: 'var(--shadow-sm)' }}>
                    ✓ In Stock ({activeStock})
                  </span>
                )}
              </div>
            </div>

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

            {/* Warehouse Dispatch Badge */}
            <div style={{ marginTop: 20, padding: 16, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                <Truck size={18} color="var(--primary)" />
                <div>
                  <strong>{product.shipping?.dispatchTime || 'Dispatches within 24 Hours'}</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Via {product.shipping?.courierPartners?.join(', ') || 'BlueDart, Delhivery, DTDC'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                <RotateCcw size={18} color="var(--success)" />
                <div>
                  <strong>{product.shipping?.returnWindowDays || 7} Days Physical Return / Replacement</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    100% money back guarantee if damaged or defective
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                <ShieldCheck size={18} color="#D97706" />
                <div>
                  <strong>Authentic Physical Inventory</strong>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                    Sealed box with original GST tax invoice & brand warranty
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Column */}
          <div className="product-info-col">
            {/* Badges and SKU */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span className="product-category-tag">
                  <Tag size={12} /> {product.category}
                </span>
                {product.condition && (
                  <span className="badge" style={{ background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' }}>
                    Condition: {product.condition}
                  </span>
                )}
                {product.brand && (
                  <span className="badge" style={{ background: '#F3F4F6', color: '#374151' }}>
                    Brand: {product.brand}
                  </span>
                )}
              </div>

              {/* SKU tag with copy */}
              {product.sku && (
                <button
                  type="button"
                  onClick={handleCopySku}
                  title="Click to copy physical SKU number"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 6,
                    padding: '3px 8px',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: 'var(--text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer'
                  }}
                >
                  {copiedSku ? <Check size={12} color="var(--success)" /> : <Copy size={12} />}
                  <span>SKU: {product.sku}</span>
                </button>
              )}
            </div>

            {/* Product Title */}
            <h1 className="product-title" style={{ fontSize: '1.65rem', lineHeight: 1.3 }}>
              {product.name}
            </h1>

            {/* Rating Stars & Q&A shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FEF3C7', padding: '3px 8px', borderRadius: 6, color: '#B45309', fontWeight: 700 }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>{averageRating}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.85rem' }}
              >
                {reviewsList.length} verified buyer reviews
              </button>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <button
                type="button"
                onClick={() => setActiveTab('qa')}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <HelpCircle size={14} /> {inquiriesList.length} Q&As answered
              </button>
            </div>

            {/* Pricing Section */}
            <div style={{ background: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <div className="product-price-big" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  <span className="currency" style={{ fontSize: '1.4rem' }}>₹</span>
                  {currentUnitPrice.toLocaleString('en-IN')}
                </div>
                {totalMrp > currentUnitPrice && (
                  <>
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                      ₹{totalMrp.toLocaleString('en-IN')}
                    </span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 700, fontSize: '0.85rem', padding: '2px 8px', borderRadius: 4 }}>
                      {product.discountPercent || Math.round(((totalMrp - currentUnitPrice) / totalMrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} color="var(--success)" />
                <span>Inclusive of all GST taxes · Free standard shipping on orders over ₹499</span>
              </div>
            </div>

            {/* VARIANTS PICKER: Colors */}
            {product.variants?.colors?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    Color Finish: <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{selectedColor?.name}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {product.variants.colors.map((c) => {
                    const isSelected = selectedColor?.name === c.name;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 14px',
                          borderRadius: 10,
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? '#EEF2FF' : 'var(--surface)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          fontSize: '0.85rem',
                          fontWeight: isSelected ? 600 : 400
                        }}
                      >
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            background: c.hex,
                            border: '1px solid rgba(0,0,0,0.2)',
                            display: 'inline-block'
                          }}
                        />
                        <span>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VARIANTS PICKER: Options (Storage / Size / Tier) */}
            {product.variants?.options?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    Select Option / Edition:
                  </span>
                  {selectedOption && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {selectedOption.stock != null ? `${selectedOption.stock} units available` : 'In Stock'}
                    </span>
                  )}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                  {product.variants.options.map((opt) => {
                    const isSelected = selectedOption?.label === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => setSelectedOption(opt)}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                          background: isSelected ? '#EEF2FF' : 'var(--surface)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 3,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.85rem', fontWeight: isSelected ? 700 : 600, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>
                          {opt.priceDelta > 0 ? `+₹${opt.priceDelta.toLocaleString('en-IN')}` : 'Base Price'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PHYSICAL CUSTOMIZATION & ADD-ONS */}
            {product.variants?.customization && (
              <div style={{ background: 'var(--surface)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <Sparkles size={15} color="var(--primary)" />
                  <span>Physical Customization & Protection Add-ons</span>
                </div>

                {/* Laser Engraving */}
                {product.variants.customization.allowEngraving && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4, color: 'var(--text-secondary)' }}>
                      Personalized Laser Engraving (Free):
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                      placeholder={product.variants.customization.engravingPlaceholder || 'e.g. Rahul S. / Custom Initial'}
                      maxLength={30}
                      value={engravingText}
                      onChange={(e) => setEngravingText(e.target.value)}
                    />
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3 }}>
                      Engraved directly on the physical casing before packaging dispatch.
                    </div>
                  </div>
                )}

                {/* Gift Wrap */}
                {product.variants.customization.allowGiftWrap && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={isGiftWrap}
                      onChange={(e) => setIsGiftWrap(e.target.checked)}
                      style={{ width: 16, height: 16, accentColor: 'var(--primary)' }}
                    />
                    <Gift size={16} color="#EC4899" />
                    <span>
                      Add Premium Gift Wrapping & Ribbon (+₹{product.variants.customization.giftWrapPrice || 99})
                    </span>
                  </label>
                )}

                {/* Warranty Plans */}
                {product.variants.customization.warrantyPlans?.length > 0 && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-secondary)' }}>
                      Protection & Warranty Plan:
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {product.variants.customization.warrantyPlans.map((w) => {
                        const isSelected = selectedWarranty?.label === w.label;
                        return (
                          <label
                            key={w.label}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 12px',
                              borderRadius: 8,
                              border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                              background: isSelected ? '#EEF2FF' : 'var(--surface-2)',
                              cursor: 'pointer',
                              fontSize: '0.82rem'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <input
                                type="radio"
                                name="warrantyPlan"
                                checked={isSelected}
                                onChange={() => setSelectedWarranty(w)}
                                style={{ accentColor: 'var(--primary)' }}
                              />
                              <ShieldCheck size={14} color={isSelected ? 'var(--primary)' : 'var(--text-muted)'} />
                              <span style={{ fontWeight: isSelected ? 600 : 400 }}>{w.label}</span>
                            </div>
                            <span style={{ fontWeight: 700, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                              {w.price === 0 ? 'Included' : `+₹${w.price.toLocaleString('en-IN')}`}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Real-time Inventory Alerts */}
            {isOutOfStock ? (
              <div style={{ padding: '12px 16px', background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 8, color: '#991B1B', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', fontWeight: 600 }}>
                <AlertTriangle size={18} />
                <span>Currently Out of Stock. Vendor inventory will be replenished soon.</span>
              </div>
            ) : isLowStock ? (
              <div style={{ padding: '10px 14px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 8, color: '#92400E', display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600 }}>
                <Clock size={16} />
                <span>Hurry! Only {activeStock} physical units left in store stock. Order now to secure priority dispatch.</span>
              </div>
            ) : null}

            {/* Quantity Selector */}
            {!isOutOfStock && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div className="qty-control">
                  <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span className="qty-num">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty((q) => Math.min(activeStock, q + 1))}>
                    <Plus size={14} />
                  </button>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  (Max {activeStock} per customer)
                </span>
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                style={{ flex: 1, minWidth: 160 }}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button
                className="btn btn-lg"
                style={{ flex: 1, minWidth: 160, background: '#F59E0B', color: 'white', border: 'none', borderRadius: 12, padding: '14px 20px', fontWeight: 700 }}
                onClick={handleBuyNow}
                disabled={isOutOfStock}
              >
                Buy Now (₹{totalCalculatedPrice.toLocaleString('en-IN')})
              </button>
              {product && (
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => toggleCompare(product)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    background: isInCompare(product.id) ? '#EEF2FF' : 'white',
                    color: isInCompare(product.id) ? '#4F46E5' : 'var(--text-primary)',
                    borderColor: isInCompare(product.id) ? '#4F46E5' : 'var(--border)',
                    fontWeight: 700
                  }}
                  title="Compare with products from different vendors"
                >
                  <ArrowRightLeft size={18} />
                  {isInCompare(product.id) ? 'Comparing (Click to Remove)' : 'Compare with Other Sellers'}
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline btn-lg"
                onClick={() => setShowShareModal(true)}
                title="Share this product link & QR code"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  fontWeight: 700
                }}
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </div>

            {/* Pincode Delivery Estimator */}
            <div style={{ background: 'var(--surface-2)', padding: '14px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>
                <MapPin size={15} color="var(--primary)" />
                <span>Check Delivery & Courier Availability</span>
              </div>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  className="form-control"
                  style={{ maxWidth: 160, fontSize: '0.85rem' }}
                  placeholder="Enter 6-digit Pincode"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setPincodeVerified(false); }}
                />
                <button type="submit" className="btn btn-outline btn-sm">
                  Check
                </button>
              </form>
              {pincodeVerified && (
                <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--success)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle size={14} />
                    <strong>Express Delivery by {new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    • Cash on Delivery available at pincode {pincode}
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    • Physical courier partner: {product.shipping?.courierPartners?.[0] || 'BlueDart Air'}
                  </div>
                </div>
              )}
            </div>

            {/* Sold by Physical Vendor Storefront Card */}
            {vendor && (
              <div>
                <h4 style={{ marginBottom: 10, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Sold by Verified Retailer
                </h4>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="vendor-info-name">{vendor.businessName}</span>
                      <Award size={15} color="#D97706" title="Verified Storefront" />
                      {['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(vendor.id) && (
                        <span style={{ fontSize: '0.66rem', fontWeight: 800, padding: '2px 8px', borderRadius: 999, background: '#FEF3C7', color: '#B45309', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                          <Sparkles size={10} /> Emerging Merchant
                        </span>
                      )}
                    </div>
                    <div className="vendor-info-loc">
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {vendor.location} • <span style={{ fontWeight: 600 }}>{vendor.businessType || 'Verified Merchant'}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span>★ {vendor.storeRating || 4.8} Store Rating</span>
                      <span>•</span>
                      <span>{vendor.totalOrdersFulfilled || 250}+ Fulfilled</span>
                      <span>•</span>
                      <span style={{ color: 'var(--success)' }}>{vendor.onTimeDispatchRate || '99%'} On-Time Dispatch</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={(e) => { e.stopPropagation(); setShowContactModal(true); }}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
                    >
                      <MessageSquare size={13} /> Message Merchant
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/store/${vendor.storeSlug || vendor.id}`); }}
                    >
                      Visit Official Storefront →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── TABBED DETAILS SECTION (Specs, Shipping, Reviews, Q&A) ── */}
        <div style={{ marginTop: 48, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', overflowX: 'auto' }}>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              style={{
                padding: '16px 24px',
                border: 'none',
                background: activeTab === 'specs' ? 'var(--surface)' : 'transparent',
                fontWeight: activeTab === 'specs' ? 700 : 500,
                color: activeTab === 'specs' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'specs' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.9rem'
              }}
            >
              <Package size={16} /> Physical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              style={{
                padding: '16px 24px',
                border: 'none',
                background: activeTab === 'shipping' ? 'var(--surface)' : 'transparent',
                fontWeight: activeTab === 'shipping' ? 700 : 500,
                color: activeTab === 'shipping' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'shipping' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.9rem'
              }}
            >
              <Truck size={16} /> Shipping & Return Policy
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '16px 24px',
                border: 'none',
                background: activeTab === 'reviews' ? 'var(--surface)' : 'transparent',
                fontWeight: activeTab === 'reviews' ? 700 : 500,
                color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.9rem'
              }}
            >
              <Star size={16} /> Verified Buyer Reviews ({reviewsList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('qa')}
              style={{
                padding: '16px 24px',
                border: 'none',
                background: activeTab === 'qa' ? 'var(--surface)' : 'transparent',
                fontWeight: activeTab === 'qa' ? 700 : 500,
                color: activeTab === 'qa' ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: activeTab === 'qa' ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.9rem'
              }}
            >
              <HelpCircle size={16} /> Product Q&A ({inquiriesList.length})
            </button>
          </div>

          {/* Tab Content Body */}
          <div style={{ padding: 28 }}>
            {/* 1. SPECS TAB */}
            {activeTab === 'specs' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <h3 style={{ marginBottom: 12, fontSize: '1.1rem' }}>Product Description</h3>
                  <p style={{ lineHeight: 1.8, fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                    {product.description}
                  </p>
                </div>

                <div>
                  <h3 style={{ marginBottom: 14, fontSize: '1.1rem' }}>Technical & Physical Specifications</h3>
                  <table className="product-spec-table">
                    <tbody>
                      <tr>
                        <td>Manufacturer SKU</td>
                        <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{product.sku || 'N/A'}</td>
                      </tr>
                      {product.brand && (
                        <tr>
                          <td>Brand / Manufacturer</td>
                          <td style={{ fontWeight: 600 }}>{product.brand}</td>
                        </tr>
                      )}
                      {product.shipping?.weight && (
                        <tr>
                          <td>Package Dead Weight</td>
                          <td style={{ fontWeight: 600 }}>{product.shipping.weight}</td>
                        </tr>
                      )}
                      {specsEntries.map(([k, v]) => (
                        <tr key={k}>
                          <td>{k}</td>
                          <td style={{ fontWeight: 600 }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. SHIPPING & RETURN POLICY TAB */}
            {activeTab === 'shipping' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
                <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <Truck size={22} color="var(--primary)" />
                    <h4 style={{ margin: 0 }}>Courier Dispatch Logistics</h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <li><strong>Dispatch Guarantee:</strong> {product.shipping?.dispatchTime || 'Ships within 24 hours of confirmation'}</li>
                    <li><strong>Delivery Estimate:</strong> {product.shipping?.estimatedDays || '2 to 4 business days nationwide'}</li>
                    <li><strong>Physical Weight:</strong> {product.shipping?.weight || '500 g'}</li>
                    <li><strong>Courier Integration:</strong> Shipped via {product.shipping?.courierPartners?.join(', ') || 'BlueDart, Delhivery, DTDC'}. Real-time tracking ID provided upon warehouse pickup.</li>
                  </ul>
                </div>

                <div style={{ padding: 20, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <RotateCcw size={22} color="var(--success)" />
                    <h4 style={{ margin: 0 }}>Return & Replacement Policy</h4>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <li><strong>Return Window:</strong> {product.shipping?.returnWindowDays || 7} Days from the physical delivery date.</li>
                    <li><strong>Eligibility:</strong> Item must be returned in original packaging with serial number intact and tax invoice.</li>
                    <li><strong>Doorstep Reverse Pickup:</strong> Free reverse pickup arranged at your delivery address.</li>
                    <li><strong>Refund Process:</strong> Immediate replacement dispatched or refund credited within 48 hours of return inspection.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. VERIFIED BUYER REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'center', padding: '12px 20px', background: '#FEF3C7', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: '2rem', fontWeight: 800, color: '#B45309' }}>{averageRating}</div>
                      <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                        {[...Array(5)].map((_, idx) => (
                          <Star key={idx} size={14} fill="#F59E0B" color="#F59E0B" />
                        ))}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: 4 }}>
                        {reviewsList.length} reviews
                      </div>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Verified Customer Feedback</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        All reviews are submitted by authenticated customers with physical delivery confirmation.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setShowReviewForm((prev) => !prev)}
                  >
                    {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                  </button>
                </div>

                {/* Review Submission Form */}
                {showReviewForm && (
                  <form onSubmit={handleSubmitReview} style={{ background: 'var(--surface-2)', padding: 20, borderRadius: 'var(--radius-md)', marginBottom: 24, border: '1px solid var(--border)' }}>
                    <h4 style={{ marginBottom: 14, fontSize: '1rem' }}>Share your feedback for SKU {product.sku}</h4>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 }}>Rating Score:</label>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 8,
                              border: reviewRating === s ? '2px solid #F59E0B' : '1px solid var(--border)',
                              background: reviewRating >= s ? '#FEF3C7' : 'var(--surface)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              fontWeight: 700
                            }}
                          >
                            <Star size={14} fill={reviewRating >= s ? '#F59E0B' : 'none'} color="#F59E0B" />
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Review Title:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Excellent build quality, swift courier delivery!"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>Detailed Review:</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Describe the physical packaging, authenticity, functionality, and delivery experience..."
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Verified Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {reviewsList.map((rev) => (
                    <div key={rev.id} style={{ padding: 18, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{rev.customerName}</span>
                          {rev.verified && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}>
                              <CheckCircle size={11} /> Verified Purchase
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={13} fill={i < rev.rating ? '#F59E0B' : 'none'} color="#F59E0B" />
                        ))}
                      </div>
                      <h5 style={{ margin: '0 0 6px 0', fontSize: '0.92rem' }}>{rev.title}</h5>
                      <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PRODUCT Q&A / INQUIRIES TAB */}
            {activeTab === 'qa' && (
              <div>
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ marginBottom: 6 }}>Ask a Question About this Item (SKU: {product.sku})</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 14 }}>
                    Questions are answered directly by the official seller: <strong>{vendor?.businessName || 'Authorized Vendor'}</strong>.
                  </p>
                  <form onSubmit={handleSubmitInquiry} style={{ display: 'flex', gap: 10 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Does this include manufacturer seal or extra accessories?"
                      value={inquiryText}
                      onChange={(e) => setInquiryText(e.target.value)}
                      required
                      style={{ flex: 1 }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={isSubmittingInquiry} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Send size={15} /> Ask Seller
                    </button>
                  </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {inquiriesList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', background: 'var(--surface-2)', borderRadius: 8 }}>
                      No questions asked yet for this SKU. Be the first to ask!
                    </div>
                  ) : (
                    inquiriesList.map((qa) => (
                      <div key={qa.id} style={{ padding: 18, background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                          <span style={{ background: '#E0E7FF', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', padding: '2px 8px', borderRadius: 4 }}>
                            Q
                          </span>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{qa.question}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              Asked by {qa.customerName} on {qa.date}
                            </div>
                          </div>
                        </div>

                        {qa.answer ? (
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, paddingLeft: 8, borderLeft: '3px solid var(--primary)' }}>
                            <span style={{ background: '#DCFCE7', color: '#15803D', fontWeight: 800, fontSize: '0.8rem', padding: '2px 8px', borderRadius: 4 }}>
                              A
                            </span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{qa.answer}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 3 }}>
                                Answered by <strong>{vendor?.businessName || 'Seller'}</strong> {qa.answeredAt ? `on ${qa.answeredAt}` : ''}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: 28 }}>
                            Awaiting response from {vendor?.businessName || 'the seller'}...
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── More from This Merchant (Product-First Storefront Discovery Journey) ── */}
        {vendorOtherProducts.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Store size={18} color="var(--primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    More from {vendor?.businessName || 'This Merchant'}
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Explore other genuine warehouse inventory dispatched by {vendor?.businessName || 'this merchant'}
                </span>
              </div>
              <Link
                to={`/store/${vendor?.storeSlug || product.vendorId}`}
                style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>View Full Storefront (15 Items)</span>
                <span>→</span>
              </Link>
            </div>
            <div className="product-grid">
              {vendorOtherProducts.map((rel) => (
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
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className="badge badge-approved" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                        In Stock ({rel.stock || rel.quantity || 10})
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body">
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      SKU: {rel.sku || 'VM-PHYSICAL'}
                    </div>
                    <div className="product-card-name" style={{ fontSize: '0.9rem', marginTop: 2 }}>{rel.name}</div>
                    <div className="product-card-price" style={{ marginTop: 4 }}>₹{rel.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fair Exposure: Alternative Products from Emerging Merchants ── */}
        {emergingAlternativeProducts.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#D97706" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    Discover Alternative Products from Emerging Merchants
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Hand-picked, high-quality selections from rising local merchants across India (Fair Exposure)
                </span>
              </div>
              <Link to="/stores" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                Explore All Stores →
              </Link>
            </div>
            <div className="product-grid">
              {emergingAlternativeProducts.map((alt) => (
                <div
                  key={alt.id}
                  className="product-card"
                  onClick={() => navigate(`/shop/product/${alt.id}`)}
                >
                  <div className="product-card-img-wrap">
                    <img
                      src={alt.images[0]}
                      alt={alt.name}
                      className="product-card-img"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'; }}
                    />
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        <Sparkles size={9} /> Emerging Merchant
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body">
                    <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {alt.vendorName || 'Verified Merchant'}
                    </div>
                    <div className="product-card-name" style={{ fontSize: '0.9rem', marginTop: 2 }}>{alt.name}</div>
                    <div className="product-card-price" style={{ marginTop: 4 }}>₹{alt.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Related Category Products ── */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>More in {product.category}</h3>
              <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                View All →
              </Link>
            </div>
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
                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                      <span className="badge badge-approved" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                        In Stock
                      </span>
                    </div>
                  </div>
                  <div className="product-card-body">
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      SKU: {rel.sku || 'VM-PHYSICAL'}
                    </div>
                    <div className="product-card-name" style={{ fontSize: '0.9rem', marginTop: 2 }}>{rel.name}</div>
                    <div className="product-card-price" style={{ marginTop: 4 }}>₹{rel.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Vendor Inquiry Modal */}
        <ContactVendorModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          vendor={vendor}
          product={product}
        />

        {/* Share Product Modal */}
        {product && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            type="product"
            title={product.name}
            subtitle={`₹${product.price?.toLocaleString('en-IN')} • 100% Genuine Physical Inventory`}
            url={`/shop/product/${product.id}`}
            image={product.image || product.images?.[0]}
            badge="Verified Stock"
          />
        )}
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 48, fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Multi-Vendor Marketplace · Courier Fulfillment Integrated
      </footer>
    </div>
  );
}
