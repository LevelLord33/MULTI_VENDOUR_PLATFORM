import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useMarketing } from '../../contexts/MarketingContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useLanguage } from '../../contexts/LanguageContext';
import Navbar from '../common/Navbar';
import UpiQrCode from './UpiQrCode';
import {
  ShoppingCart, Trash2, Plus, Minus, MapPin, CheckCircle, Package,
  Truck, ShieldCheck, Gift, Sparkles, ArrowRight, ArrowLeft, Clock,
  AlertCircle, QrCode, Banknote, CreditCard, Copy, Check, Smartphone,
  Lock, RefreshCw, Key, Tag
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function Cart() {
  // 1. useContext hooks
  const { cart, cartTotal, cartCount, removeFromCart, updateCartQuantity, placeOrder, appliedCoupon, couponDiscount, applyCoupon, removeCoupon } = useCart();
  const { validateCoupon } = useMarketing();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 2. useState hooks
  const [shippingMethod, setShippingMethod] = useState('Standard'); // 'Standard' | 'Express'
  const [paymentMethod, setPaymentMethod] = useState('UPI_QR'); // 'UPI_QR' | 'COD' | 'CARD'
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    phone: user?.mobile || '',
    address: user?.address || '',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001'
  });
  const [ordering, setOrdering] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // QR / UPI specific states
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);
  const [verifyingQr, setVerifyingQr] = useState(false);
  const [upiTimer, setUpiTimer] = useState(599); // 9m 59s
  const [vpaInput, setVpaInput] = useState('');
  const [vpaStatus, setVpaStatus] = useState(null); // null | 'verifying' | 'verified'

  // COD specific states
  const [codAgreed, setCodAgreed] = useState(true);

  // Card specific states
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: user?.name || ''
  });

  // Marketing & Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // 3. useRef hook
  const addressInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = `Cart (${cartCount}) | Vendor Hub`;
  }, [cartCount]);

  // UPI validity countdown timer
  useEffect(() => {
    if (paymentMethod !== 'UPI_QR' || upiTimer <= 0) return;
    const interval = setInterval(() => {
      setUpiTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [paymentMethod, upiTimer]);

  // 5. useMemo hooks
  const shippingFee = useMemo(() => {
    if (shippingMethod === 'Express') return 199;
    return cartTotal > 999 ? 0 : 79;
  }, [shippingMethod, cartTotal]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - (couponDiscount || 0) + shippingFee);
  }, [cartTotal, couponDiscount, shippingFee]);

  const handleApplyCoupon = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    const res = await validateCoupon(couponInput.trim(), cartTotal, null, cart);
    setApplyingCoupon(false);
    if (res && res.valid && res.coupon) {
      applyCoupon(res.coupon);
      addToast(res.message || `Coupon ${res.coupon.code} applied!`, 'success');
      setCouponInput('');
    } else {
      addToast(res?.message || 'Invalid or expired coupon code.', 'error');
    }
  }, [couponInput, cartTotal, cart, validateCoupon, applyCoupon, addToast]);

  const freeShippingThreshold = 999;
  const freeShippingProgress = useMemo(() => {
    if (cartTotal >= freeShippingThreshold) return 100;
    return Math.min(100, Math.round((cartTotal / freeShippingThreshold) * 100));
  }, [cartTotal]);

  const hasGiftWrapOrEngraving = useMemo(() => {
    return cart.some((i) => i.customization?.giftWrap || i.customization?.engraving);
  }, [cart]);

  // 6. useCallback hooks
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleCopyUpi = useCallback(() => {
    navigator.clipboard?.writeText('vendorhub.pay@okhdfcbank');
    setCopiedUpi(true);
    addToast('UPI ID copied to clipboard: vendorhub.pay@okhdfcbank', 'info');
    setTimeout(() => setCopiedUpi(false), 2000);
  }, [addToast]);

  const handleVerifyQr = useCallback(async () => {
    setVerifyingQr(true);
    await new Promise((r) => setTimeout(r, 1100));
    setVerifyingQr(false);
    setQrVerified(true);
    addToast('UPI QR payment authorized & verified by bank gateway!', 'success');
  }, [addToast]);

  const handleVerifyVpa = useCallback(async (e) => {
    e.preventDefault();
    if (!vpaInput.includes('@')) {
      addToast('Please enter a valid UPI VPA ID (e.g. yourname@okhdfcbank)', 'danger');
      return;
    }
    setVpaStatus('verifying');
    await new Promise((r) => setTimeout(r, 900));
    setVpaStatus('verified');
    setQrVerified(true);
    addToast(`Payment request sent to ${vpaInput}! Authorized.`, 'success');
  }, [vpaInput, addToast]);

  const handleCardChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'number') {
      const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').slice(0, 16);
      const parts = [];
      for (let i = 0; i < v.length; i += 4) {
        parts.push(v.substring(i, i + 4));
      }
      setCardData((prev) => ({ ...prev, number: parts.join(' ') }));
    } else if (name === 'expiry') {
      const v = value.replace(/[^0-9]/g, '').slice(0, 4);
      const formatted = v.length > 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
      setCardData((prev) => ({ ...prev, expiry: formatted }));
    } else if (name === 'cvv') {
      setCardData((prev) => ({ ...prev, cvv: value.replace(/[^0-9]/g, '').slice(0, 3) }));
    } else {
      setCardData((prev) => ({ ...prev, [name]: value }));
    }
  }, []);

  const handlePlaceOrder = useCallback(async (e) => {
    e.preventDefault();
    if (!formData.address.trim() || !formData.fullName.trim() || !formData.pincode.trim()) {
      addToast('Please fill in complete physical delivery address details', 'danger');
      if (addressInputRef.current) addressInputRef.current.focus();
      return;
    }

    if (formData.pincode.length !== 6 || !/^\d+$/.test(formData.pincode)) {
      addToast('Please enter a valid 6-digit postal pincode', 'danger');
      return;
    }

    if (paymentMethod === 'CARD') {
      if (cardData.number.replace(/\s/g, '').length < 15 || !cardData.expiry || cardData.cvv.length < 3) {
        addToast('Please provide complete card details (Number, MM/YY, CVV)', 'danger');
        return;
      }
    }

    if (paymentMethod === 'COD' && !codAgreed) {
      addToast('Please agree to verify parcel before providing COD OTP', 'danger');
      return;
    }

    setOrdering(true);
    // Simulate payment authorization & inventory allocation
    await new Promise((r) => setTimeout(r, 900));

    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
    const generatedUpiRef = `UPI-${Math.floor(10000000 + Math.random() * 90000000)}-IN`;

    const orderPayload = {
      shippingMethod,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending (Pay on Delivery)' : 'Paid',
      paymentDetails: {
        method: paymentMethod,
        status: paymentMethod === 'COD' ? 'Pending (Pay on Delivery)' : 'Paid',
        codOtp: paymentMethod === 'COD' ? generatedOtp : null,
        amountToCollect: paymentMethod === 'COD' ? finalTotal : 0,
        upiId: paymentMethod === 'UPI_QR' ? (vpaInput || 'vendorhub.pay@okhdfcbank') : null,
        upiRef: paymentMethod === 'UPI_QR' ? generatedUpiRef : null,
        cardLast4: paymentMethod === 'CARD' ? (cardData.number.replace(/\s/g, '').slice(-4) || '4242') : null,
        cardNetwork: paymentMethod === 'CARD' ? 'Visa' : null,
        paidAt: paymentMethod === 'COD' ? null : new Date().toISOString(),
      },
      fullName: formData.fullName,
      phone: formData.phone,
      couponDiscount: couponDiscount || 0,
      couponCode: appliedCoupon?.code || null,
      address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    };

    const created = placeOrder(user?.id || 'guest', orderPayload);
    setConfirmedOrder(created);
    setOrdering(false);
    addToast(
      paymentMethod === 'COD'
        ? 'Physical COD order placed! Doorstep delivery OTP generated.'
        : 'Physical order placed! Pre-paid & warehouse inventory reserved.',
      'success'
    );
  }, [formData, shippingMethod, paymentMethod, cardData, codAgreed, vpaInput, finalTotal, user, placeOrder, addToast]);

  // If order was just placed, display fulfillment confirmation
  if (confirmedOrder) {
    const isCOD = confirmedOrder.paymentMethod === 'COD';

    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="container" style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 640, margin: '0 auto', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 36, boxShadow: 'var(--shadow-md)', textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, background: isCOD ? '#FEF3C7' : '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              {isCOD ? (
                <Banknote size={44} color="#D97706" />
              ) : (
                <CheckCircle size={44} color="var(--success)" />
              )}
            </div>

            <span style={{ display: 'inline-block', background: isCOD ? '#FEF3C7' : '#EEF2FF', color: isCOD ? '#92400E' : 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: 12 }}>
              {isCOD
                ? 'Cash on Delivery Scheduled · Stock Allocated'
                : 'Physical Stock Allocated · Payment Authorized'}
            </span>

            <h2 style={{ fontSize: '1.8rem', marginBottom: 8 }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 24 }}>
              Your physical order <strong>#{confirmedOrder.id}</strong> has been transmitted to our warehouse fulfillment team.
            </p>

            {/* If Cash on Delivery: Display Doorstep Delivery OTP Card */}
            {isCOD && (
              <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: 'var(--radius-md)', padding: 18, marginBottom: 20, textAlign: 'center' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <Key size={16} /> Tamper-Proof Doorstep Delivery OTP
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: 8, color: '#B45309', margin: '6px 0' }}>
                  {confirmedOrder.paymentDetails?.codOtp || '4829'}
                </div>
                <p style={{ fontSize: '0.82rem', color: '#78350F', margin: 0, lineHeight: 1.4 }}>
                  Please keep exact amount ₹<strong>{confirmedOrder.total?.toLocaleString('en-IN')}</strong> in cash or UPI ready. Share this OTP with courier agent <strong>only after</strong> inspecting parcel integrity.
                </p>
              </div>
            )}

            {/* Courier Dispatch Card */}
            <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20, textAlign: 'left', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>COURIER PARTNER</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
                  {confirmedOrder.courierPartner}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TRACKING NUMBER</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, fontFamily: 'monospace' }}>
                  {confirmedOrder.trackingNumber}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>DELIVERY ADDRESS</span>
                <span style={{ fontSize: '0.85rem', maxWidth: 320, textAlign: 'right' }}>
                  {confirmedOrder.address}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYMENT METHOD</span>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {confirmedOrder.paymentMethod === 'COD'
                    ? '💵 Cash on Delivery (Doorstep)'
                    : confirmedOrder.paymentMethod === 'UPI_QR'
                    ? '📱 UPI / Dynamic QR Code'
                    : '💳 Credit / Debit Card'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PAYMENT STATUS</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 6,
                    background: isCOD ? '#FEF3C7' : '#D1FAE5',
                    color: isCOD ? '#92400E' : '#065F46'
                  }}
                >
                  {isCOD ? 'Pending (Pay on Delivery)' : `PAID (${confirmedOrder.paymentDetails?.upiRef || 'Authorized'})`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL AMOUNT</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{confirmedOrder.total?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate('/shop/orders')}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <Package size={18} /> View & Track My Orders
              </button>
              <button
                className="btn btn-outline btn-lg"
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
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

      <div className="page-header" style={{ padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 600 }}>{t('customerShop', 'Marketplace')}</Link>
            <span>/</span>
            <span>{t('shoppingCart', 'Shopping Cart')}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{t('shoppingCart', 'Physical Cart & Fulfillment')}</h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {cartCount} {t('cartItemsCount', 'physical items in your cart')}
          </p>
        </div>
      </div>

      <div className="container" style={{ padding: '24px 24px 60px' }}>
        {cart.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '60px 20px' }}>
            <div className="empty-state-icon"><ShoppingCart size={64} /></div>
            <h3>{t('cartEmpty', 'Your Cart is Currently Empty')}</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 24px' }}>
              {t('cartEmptyDesc', 'Explore our catalog to add electronics, fashion, groceries, and home goods.')}
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
              {t('exploreCatalog', 'Explore Marketplace Catalog')}
            </button>
          </div>
        ) : (
          <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 32, alignItems: 'start' }}>
            {/* Left Column: Itemized Physical Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Free Shipping Progress Indicator */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '0.85rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <Truck size={16} color="var(--primary)" />
                    {cartTotal >= freeShippingThreshold ? (
                      <strong style={{ color: 'var(--success)' }}>You unlocked FREE Standard Shipping! 🎉</strong>
                    ) : (
                      <span>Add ₹{(freeShippingThreshold - cartTotal).toLocaleString('en-IN')} more to unlock FREE Standard Shipping!</span>
                    )}
                  </span>
                  <span style={{ fontWeight: 700, color: 'var(--text-muted)' }}>{freeShippingProgress}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${freeShippingProgress}%`,
                      height: '100%',
                      background: freeShippingProgress >= 100 ? 'var(--success)' : 'var(--primary)',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              {cart.map((item) => {
                const key = item.cartItemId || item.productId;
                const maxStock = item.maxStock || item.stock || 15;

                return (
                  <div
                    key={key}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-md)',
                      padding: 18,
                      display: 'grid',
                      gridTemplateColumns: '90px 1fr auto',
                      gap: 18,
                      alignItems: 'start'
                    }}
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--surface-2)' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'; }}
                    />

                    {/* Item Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <Link
                          to={`/shop/product/${item.productId}`}
                          style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none' }}
                        >
                          {item.name}
                        </Link>
                      </div>

                      {/* SKU Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'monospace', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
                          SKU: {item.sku || 'VM-PHYSICAL'}
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
                          Physical Stock Verified
                        </span>
                      </div>

                      {/* Selected Variants */}
                      {item.selectedVariant && (item.selectedVariant.color || item.selectedVariant.option) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                          {item.selectedVariant.color && (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEF2FF', color: 'var(--primary)', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>
                              {item.selectedVariant.colorHex && (
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: item.selectedVariant.colorHex, display: 'inline-block', border: '1px solid rgba(0,0,0,0.1)' }} />
                              )}
                              Color: {item.selectedVariant.color}
                            </span>
                          )}
                          {item.selectedVariant.option && (
                            <span style={{ background: '#F3F4F6', color: '#374151', padding: '3px 8px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>
                              {item.selectedVariant.option}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Customization Details */}
                      {item.customization && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                          {item.customization.engraving && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <Sparkles size={13} color="var(--primary)" />
                              <span>Laser Engraving: <em>"{item.customization.engraving}"</em></span>
                            </div>
                          )}
                          {item.customization.giftWrap && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#BE185D' }}>
                              <Gift size={13} />
                              <span>Gift Wrapping Included (+₹{item.customization.giftWrapPrice || 99})</span>
                            </div>
                          )}
                          {item.customization.warranty && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#B45309' }}>
                              <ShieldCheck size={13} />
                              <span>{item.customization.warranty}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Unit Price and Subtotal */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Item Total: <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Quantity Control & Remove */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
                      <button
                        type="button"
                        onClick={() => removeFromCart(key)}
                        title="Remove item from physical order"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', transition: 'color 0.15s' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--danger)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="qty-control">
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateCartQuantity(key, item.quantity - 1)}
                        >
                          <Minus size={13} />
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button
                          type="button"
                          className="qty-btn"
                          onClick={() => updateCartQuantity(key, Math.min(maxStock, item.quantity + 1))}
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Max {maxStock} units
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Physical Shipping & Checkout Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Shipping Method Selector */}
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 18 }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem' }}>{t('courierMethod', 'Courier Dispatch Method')}</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      borderRadius: 8,
                      border: shippingMethod === 'Standard' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: shippingMethod === 'Standard' ? '#EEF2FF' : 'var(--surface-2)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === 'Standard'}
                        onChange={() => setShippingMethod('Standard')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{t('standardShipping', 'Delhivery Surface Express')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. 3-5 Days Nationwide</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: cartTotal > 999 ? 'var(--success)' : 'inherit' }}>
                      {cartTotal > 999 ? 'FREE' : '₹79'}
                    </span>
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 12,
                      borderRadius: 8,
                      border: shippingMethod === 'Express' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: shippingMethod === 'Express' ? '#EEF2FF' : 'var(--surface-2)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="radio"
                        name="shippingOption"
                        checked={shippingMethod === 'Express'}
                        onChange={() => setShippingMethod('Express')}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700 }}>{t('expressShipping', 'BlueDart Priority Air')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Guaranteed 1-2 Days Express</div>
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      ₹199
                    </span>
                  </label>
                </div>
              </div>

              {/* Order Summary & Address Checkout Card */}
              <div className="order-summary-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 22 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem' }}>{t('orderSummary', 'Physical Order Summary')}</h3>

                <div className="order-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('subtotal', 'Items Subtotal')} ({cartCount})</span>
                  <span style={{ fontWeight: 600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="order-summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t('courierShipping', 'Courier Shipping')}</span>
                  <span style={{ fontWeight: 600, color: shippingFee === 0 ? 'var(--success)' : 'inherit' }}>
                    {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="order-summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: '0.9rem', color: '#16A34A', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Tag size={14} />
                      <span>Coupon ({appliedCoupon.code})</span>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', fontSize: '0.72rem', textDecoration: 'underline', padding: '0 2px' }}
                      >
                        Remove
                      </button>
                    </div>
                    <span>-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {/* Coupon Code Input */}
                <div style={{ margin: '12px 0', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8, border: '1px dashed var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-secondary)' }}>
                    <Sparkles size={13} color="var(--primary)" />
                    <span>Have a Promo Code or Voucher?</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. TECH20, STYLE15"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      style={{ fontSize: '0.8rem', padding: '6px 10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleApplyCoupon}
                      disabled={!couponInput.trim() || applyingCoupon}
                      style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', padding: '6px 14px' }}
                    >
                      {applyingCoupon ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  {appliedCoupon && (
                    <div style={{ marginTop: 6, fontSize: '0.75rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={13} />
                      <span>{appliedCoupon.title || appliedCoupon.code} applied!</span>
                    </div>
                  )}
                </div>

                <div className="order-summary-row total" style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 14, marginTop: 10, borderTop: '2px solid var(--border)', fontSize: '1.15rem', fontWeight: 800 }}>
                  <span>{t('totalAmount', 'Total Amount')}</span>
                  <span style={{ color: 'var(--primary)' }}>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>

                {/* Delivery Address Form Fields */}
                <form onSubmit={handlePlaceOrder} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem' }}>
                    <MapPin size={15} color="var(--primary)" />
                    <span>{t('deliveryAddress', 'Physical Delivery Destination')}</span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('recipientName', 'Recipient Full Name')}:
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-control"
                      style={{ fontSize: '0.85rem' }}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajesh Sharma"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                        {t('mobilePhone', 'Mobile Phone')}:
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                        {t('pincode', 'Postal Pincode')}:
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6 digits"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                      {t('streetAddress', 'Street Address / Flat / Floor')}:
                    </label>
                    <textarea
                      ref={addressInputRef}
                      name="address"
                      className="form-control"
                      style={{ fontSize: '0.85rem', minHeight: 60 }}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="House/Plot #, Building name, Landmark..."
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                        {t('city', 'City')}:
                      </label>
                      <input
                        type="text"
                        name="city"
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>
                        {t('state', 'State')}:
                      </label>
                      <input
                        type="text"
                        name="state"
                        className="form-control"
                        style={{ fontSize: '0.85rem' }}
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  {/* Payment Options Section */}
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem' }}>
                        <CreditCard size={15} color="var(--primary)" />
                        <span>{t('paymentOptions', 'Payment Options')}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>100% Encrypted & Safe</span>
                    </div>

                    {/* 3 Payment Mode Buttons */}
                    <div className="payment-methods-grid">
                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'UPI_QR' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('UPI_QR')}
                      >
                        <QrCode size={20} color={paymentMethod === 'UPI_QR' ? 'var(--primary)' : 'currentColor'} />
                        <span>{t('payUpiQr', 'UPI & QR Code')}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--success)', fontWeight: 700 }}>{t('payUpiQrSubtitle', 'Instant 0 Fee')}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'COD' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('COD')}
                      >
                        <Banknote size={20} color={paymentMethod === 'COD' ? '#D97706' : 'currentColor'} />
                        <span>{t('payCod', 'Cash on Delivery')}</span>
                        <span style={{ fontSize: '0.68rem', color: '#B45309', fontWeight: 700 }}>{t('payCodSubtitle', 'Pay on Arrival')}</span>
                      </button>

                      <button
                        type="button"
                        className={`payment-tab-btn ${paymentMethod === 'CARD' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('CARD')}
                      >
                        <CreditCard size={20} color={paymentMethod === 'CARD' ? 'var(--primary)' : 'currentColor'} />
                        <span>{t('payCards', 'Cards / Banking')}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700 }}>{t('payCardsSubtitle', 'Visa, RuPay, MC')}</span>
                      </button>
                    </div>

                    {/* Active Payment View */}
                    {paymentMethod === 'UPI_QR' && (
                      <div className="qr-scan-box" style={{ marginTop: 10 }}>
                        {/* Supported UPI Apps Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Scan with:</span>
                          <span className="upi-app-badge" style={{ color: '#0F9D58' }}>Google Pay</span>
                          <span className="upi-app-badge" style={{ color: '#5F259F' }}>PhonePe</span>
                          <span className="upi-app-badge" style={{ color: '#00B9F5' }}>Paytm</span>
                          <span className="upi-app-badge" style={{ color: '#0070BA' }}>BHIM</span>
                          <span className="upi-app-badge" style={{ color: '#000000' }}>CRED UPI</span>
                        </div>

                        {/* Interactive QR Code Display */}
                        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                          <UpiQrCode
                            amount={finalTotal}
                            upiId="vendorhub.pay@okhdfcbank"
                            merchantName="VendorHub Logistics"
                            orderRef={`VH${Date.now().toString().slice(-6)}`}
                            size={160}
                          />
                        </div>

                        {/* UPI ID & One-click Copy */}
                        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>UPI ID:</span>
                          <code style={{ background: 'var(--surface-2)', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                            vendorhub.pay@okhdfcbank
                          </code>
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', fontWeight: 600 }}
                            title="Copy UPI ID"
                          >
                            {copiedUpi ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                            <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>

                        {/* Countdown Timer */}
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          <Clock size={13} />
                          <span>QR valid for: <strong>{Math.floor(upiTimer / 60)}:{(upiTimer % 60).toString().padStart(2, '0')}</strong></span>
                        </div>

                        {/* QR Verification simulator & Alternative VPA Entry */}
                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {qrVerified ? (
                            <div style={{ background: '#DCFCE7', color: '#166534', padding: '8px 12px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                              <CheckCircle size={16} /> UPI Payment Received & Verified! Ready to place order.
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-outline btn-sm btn-full"
                              onClick={handleVerifyQr}
                              disabled={verifyingQr}
                              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                            >
                              {verifyingQr ? (
                                <>
                                  <RefreshCw size={14} className="spin" />
                                  <span>Verifying with UPI Bank Gateway...</span>
                                </>
                              ) : (
                                <>
                                  <Smartphone size={14} />
                                  <span>Simulate QR Scan & Verify Payment</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Direct VPA ID field */}
                          <div style={{ marginTop: 4 }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <input
                                type="text"
                                className="form-control"
                                style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                                placeholder="Or enter your UPI ID (e.g. user@oksbi)"
                                value={vpaInput}
                                onChange={(e) => setVpaInput(e.target.value)}
                              />
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={handleVerifyVpa}
                                disabled={!vpaInput || vpaStatus === 'verifying'}
                                style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}
                              >
                                {vpaStatus === 'verifying' ? 'Requesting...' : vpaStatus === 'verified' ? 'Authorized ✓' : 'Pay via UPI App'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'COD' && (
                      <div className="cod-box" style={{ marginTop: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{ background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12, fontSize: '0.72rem', fontWeight: 800 }}>
                            ELIGIBLE FOR FREE COD
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>
                            Available for pincode {formData.pincode || '110001'}
                          </span>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: '#166534', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                          Pay with <strong>Cash</strong> or <strong>Courier UPI QR</strong> upon physical arrival at your doorstep. No advance payment required.
                        </p>

                        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 6, padding: '8px 12px', fontSize: '0.78rem', color: '#92400E', marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                          <Key size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                          <span>
                            <strong>Tamper-Proof Delivery OTP:</strong> A 4-digit security code will be generated upon placing this order. Share it with the delivery executive only after verifying the package.
                          </span>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.8rem', color: '#14532D', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={codAgreed}
                            onChange={(e) => setCodAgreed(e.target.checked)}
                            style={{ marginTop: 3, accentColor: 'var(--primary)' }}
                          />
                          <span>
                            I agree to keep <strong>₹{finalTotal.toLocaleString('en-IN')}</strong> ready at delivery and inspect the outer carton before sharing OTP.
                          </span>
                        </label>
                      </div>
                    )}

                    {paymentMethod === 'CARD' && (
                      <div style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 14, marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Card Details</span>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#1D4ED8', background: 'white', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>VISA</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#DC2626', background: 'white', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>MC</span>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#047857', background: 'white', padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)' }}>RuPay</span>
                          </div>
                        </div>

                        <input
                          type="text"
                          name="number"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                          value={cardData.number}
                          onChange={handleCardChange}
                          maxLength={19}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <input
                            type="text"
                            name="expiry"
                            className="form-control"
                            style={{ fontSize: '0.85rem' }}
                            placeholder="MM / YY"
                            value={cardData.expiry}
                            onChange={handleCardChange}
                            maxLength={5}
                          />
                          <input
                            type="password"
                            name="cvv"
                            className="form-control"
                            style={{ fontSize: '0.85rem' }}
                            placeholder="CVV"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            maxLength={3}
                          />
                        </div>

                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          placeholder="Name on Card"
                          value={cardData.name}
                          onChange={handleCardChange}
                        />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          <Lock size={12} color="var(--success)" />
                          <span>Bank-grade 256-bit SSL encrypted & PCI-DSS compliant.</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full btn-lg"
                    style={{ marginTop: 14, fontWeight: 700 }}
                    disabled={ordering}
                  >
                    {ordering
                      ? 'Processing Order & Reserving...'
                      : paymentMethod === 'COD'
                      ? `${t('placeCodOrder', 'Confirm Cash on Delivery Order')} (₹${finalTotal.toLocaleString('en-IN')})`
                      : paymentMethod === 'UPI_QR'
                      ? `${t('placeUpiOrder', 'Place Physical Order via UPI QR')} (₹${finalTotal.toLocaleString('en-IN')})`
                      : `${t('placeCardOrder', 'Pay & Place Physical Order')} (₹${finalTotal.toLocaleString('en-IN')})`}
                  </button>
                </form>

                <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="var(--success)" />
                  <span>100% Buyer Protection · 7-Day Replacement Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Physical Logistics & Courier Network
      </footer>
    </div>
  );
}
