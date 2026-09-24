import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { useDisputes } from '../../contexts/DisputeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import DisputeModal from './DisputeModal';
import DisputeHistoryModal from './DisputeHistoryModal';
import ContactVendorModal from './ContactVendorModal';
import Navbar from '../common/Navbar';
import {
  Clock, CheckCircle, Truck, ShoppingBag, Package, MapPin,
  RotateCcw, MessageSquare, Star, Copy, Check, ChevronDown, ChevronUp,
  AlertTriangle, ShieldCheck, HelpCircle, X, QrCode, Banknote, CreditCard, Key
} from 'lucide-react';
import '../../styles/marketplace.css';

const STATUS_CONFIG = {
  Placed: { label: 'Stock Reserved', color: '#6366F1', bg: '#EEF2FF', icon: <Package size={14} /> },
  Confirmed: { label: 'Packaging Verified', color: '#3B82F6', bg: '#DBEAFE', icon: <Clock size={14} /> },
  Dispatched: { label: 'In Transit with Courier', color: '#D97706', bg: '#FEF3C7', icon: <Truck size={14} /> },
  'Out for Delivery': { label: 'Out for Delivery', color: '#F97316', bg: '#FFEDD5', icon: <Truck size={14} /> },
  Delivered: { label: 'Physically Delivered', color: '#10B981', bg: '#D1FAE5', icon: <CheckCircle size={14} /> },
  Processing: { label: 'Fulfillment Active', color: '#6366F1', bg: '#EEF2FF', icon: <Package size={14} /> },
};

export default function Orders() {
  // 1. useContext hooks
  const { getCustomerOrders, requestReturn, createProductSupportTicket } = useCart();
  const { user } = useAuth();
  const { addProductReview } = useProducts();
  const { addToast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // 2. useState hooks
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [copiedTracking, setCopiedTracking] = useState(null);

  // Dispute modals state
  const { disputes, getDisputeForOrder } = useDisputes();
  const [disputeModalOrder, setDisputeModalOrder] = useState(null);
  const [disputeModalItem, setDisputeModalItem] = useState(null);
  const [viewDispute, setViewDispute] = useState(null);
  const [orderFilter, setOrderFilter] = useState('All');

  // Modal states: 'return' | 'support' | 'review' | null
  const [activeModal, setActiveModal] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [contactOrder, setContactOrder] = useState(null);
  const [contactItem, setContactItem] = useState(null);

  const openContactModal = useCallback((order, item) => {
    setContactOrder(order);
    setContactItem(item);
  }, []);

  // Return form state
  const [returnReason, setReturnReason] = useState('Damaged/Defective Product');
  const [requestedAction, setRequestedAction] = useState('replacement');
  const [returnNote, setReturnNote] = useState('');

  // Support form state
  const [supportIssueType, setSupportIssueType] = useState('Setup & Usage Assistance');
  const [supportMessage, setSupportMessage] = useState('');

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // 3. useRef hook
  const modalInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.title = 'My Orders & Physical Tracking | Vendor Hub';
  }, []);

  // 5. useMemo hooks
  const rawOrders = useMemo(() => {
    if (!user) return [];
    return getCustomerOrders(user.id);
  }, [getCustomerOrders, user]);

  const sortedOrders = useMemo(() => {
    return [...rawOrders].reverse();
  }, [rawOrders]);

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'All') return sortedOrders;
    if (orderFilter === 'Disputed') {
      return sortedOrders.filter((o) => disputes.some((d) => d.orderId === o.id));
    }
    return sortedOrders.filter((o) => o.status === orderFilter);
  }, [sortedOrders, orderFilter, disputes]);

  const disputedOrdersCount = useMemo(() => {
    return sortedOrders.filter((o) => disputes.some((d) => d.orderId === o.id)).length;
  }, [sortedOrders, disputes]);

  // 6. useCallback hooks
  const handleCopyTracking = useCallback((trackingNumber) => {
    if (trackingNumber) {
      navigator.clipboard?.writeText(trackingNumber);
      setCopiedTracking(trackingNumber);
      addToast(`Copied tracking number: ${trackingNumber}`, 'info');
      setTimeout(() => setCopiedTracking(null), 2000);
    }
  }, [addToast]);

  const toggleTimeline = useCallback((orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  }, []);

  const openReturnModal = useCallback((order, item) => {
    setActiveOrder(order);
    setActiveItem(item);
    setReturnReason('Damaged/Defective Product');
    setRequestedAction('replacement');
    setReturnNote('');
    setActiveModal('return');
  }, []);

  const openSupportModal = useCallback((order, item) => {
    setActiveOrder(order);
    setActiveItem(item);
    setSupportIssueType('Setup & Usage Assistance');
    setSupportMessage('');
    setActiveModal('support');
  }, []);

  const openReviewModal = useCallback((order, item) => {
    setActiveOrder(order);
    setActiveItem(item);
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setActiveModal('review');
  }, []);

  const handleReturnSubmit = useCallback((e) => {
    e.preventDefault();
    if (!activeOrder) return;
    requestReturn(activeOrder.id, {
      reason: returnReason,
      requestedAction,
      note: returnNote,
    });
    addToast(`Return/Replacement initiated for Order #${activeOrder.id}! Store vendor notified.`, 'success');
    setActiveModal(null);
  }, [activeOrder, returnReason, requestedAction, returnNote, requestReturn, addToast]);

  const handleSupportSubmit = useCallback((e) => {
    e.preventDefault();
    if (!activeOrder || !activeItem || !supportMessage.trim()) return;
    createProductSupportTicket(activeOrder.id, activeItem.productId, {
      productName: activeItem.name,
      issueType: supportIssueType,
      message: supportMessage,
    });
    addToast('Support ticket logged with physical merchant!', 'success');
    setActiveModal(null);
  }, [activeOrder, activeItem, supportMessage, supportIssueType, createProductSupportTicket, addToast]);

  const handleReviewSubmit = useCallback((e) => {
    e.preventDefault();
    if (!activeItem || !reviewTitle.trim() || !reviewComment.trim()) return;
    addProductReview(activeItem.productId, {
      customerName: user?.name || 'Verified Buyer',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    });
    addToast(`Review submitted for ${activeItem.name}! Thank you.`, 'success');
    setActiveModal(null);
  }, [activeItem, reviewTitle, reviewComment, user, reviewRating, addProductReview, addToast]);

  return (
    <div className="page-wrapper">
      <Navbar />

      <div className="page-header" style={{ padding: '24px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 8 }}>
            <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 600 }}>Marketplace</Link>
            <span>/</span>
            <span>My Orders & Shipments</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{t('myOrdersTitle', 'Orders & Shipment Tracking')}</h1>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {sortedOrders.length} physical order{sortedOrders.length !== 1 ? 's' : ''} on record
              </p>
            </div>

            {/* Filter buttons: All Orders / Disputed */}
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className={`btn btn-sm ${orderFilter === 'All' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setOrderFilter('All')}
                style={{ borderRadius: 20, fontSize: '0.8rem', padding: '5px 14px' }}
              >
                {t('filterAll', 'All Orders')} ({sortedOrders.length})
              </button>
              <button
                className={`btn btn-sm ${orderFilter === 'Disputed' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setOrderFilter('Disputed')}
                style={{
                  borderRadius: 20,
                  fontSize: '0.8rem',
                  padding: '5px 14px',
                  color: orderFilter === 'Disputed' ? 'white' : '#DC2626',
                  borderColor: '#FCA5A5',
                  background: orderFilter === 'Disputed' ? '#DC2626' : undefined,
                }}
              >
                <AlertTriangle size={13} style={{ marginRight: 4, display: 'inline' }} />
                Disputed Orders ({disputedOrdersCount})
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 8, paddingBottom: 60 }}>
        {filteredOrders.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '60px 20px' }}>
            <div className="empty-state-icon"><ShoppingBag size={64} /></div>
            <h3>{orderFilter === 'Disputed' ? 'No Disputed Orders' : 'No Physical Orders Placed Yet'}</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: 420, margin: '0 auto 24px' }}>
              {orderFilter === 'Disputed'
                ? 'You do not have any active or previous dispute claims for this filter.'
                : 'When you purchase physical stock items from merchant stores, their dispatch tracking and replacement window will appear here.'}
            </p>
            {orderFilter === 'Disputed' ? (
              <button className="btn btn-outline" onClick={() => setOrderFilter('All')}>
                View All Orders
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/shop')}>
                Browse Verified Storefronts
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {filteredOrders.map((order) => {
              const statusMeta = STATUS_CONFIG[order.status] || STATUS_CONFIG.Placed;
              const isExpanded = expandedOrderId === order.id;
              const hasReturn = !!order.returnRequest;

              return (
                <div
                  key={order.id}
                  className="order-card"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {/* Order Top Header Bar */}
                  <div
                    style={{
                      padding: '18px 24px',
                      background: 'var(--surface-2)',
                      borderBottom: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 16
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          Order #{order.id}
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            background: statusMeta.bg,
                            color: statusMeta.color
                          }}
                        >
                          {statusMeta.icon} {statusMeta.label}
                        </span>

                        {/* Payment Method & Status Pill */}
                        {order.paymentMethod === 'COD' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 9px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#FEF3C7',
                              color: '#92400E',
                              border: '1px solid #FCD34D'
                            }}
                          >
                            <Banknote size={13} /> Cash on Delivery (Pay ₹{order.total?.toLocaleString('en-IN')})
                          </span>
                        ) : order.paymentMethod === 'CARD' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 9px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#EEF2FF',
                              color: '#4338CA',
                              border: '1px solid #C7D2FE'
                            }}
                          >
                            <CreditCard size={13} /> Card (Paid)
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '3px 9px',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#D1FAE5',
                              color: '#065F46',
                              border: '1px solid #A7F3D0'
                            }}
                          >
                            <QrCode size={13} /> UPI QR (Paid)
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        Placed on {order.createdAt} · Courier Partner: <strong>{order.courierPartner || 'Delhivery Surface'}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {/* Active Dispute on Order level (if any) */}
                      {(() => {
                        const orderDispute = disputes.find((d) => d.orderId === order.id);
                        if (orderDispute) {
                          return (
                            <button
                              type="button"
                              className="btn btn-sm"
                              onClick={() => setViewDispute(orderDispute)}
                              style={{
                                background: '#FEF2F2',
                                color: '#DC2626',
                                border: '1.5px solid #FCA5A5',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '6px 12px',
                                fontWeight: 700,
                                borderRadius: 8,
                                cursor: 'pointer'
                              }}
                            >
                              <AlertTriangle size={14} />
                              Dispute: {orderDispute.status}
                            </button>
                          );
                        }
                        return (
                          <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => {
                              setDisputeModalOrder(order);
                              setDisputeModalItem(order.items?.[0] || null);
                            }}
                            style={{
                              background: '#FFF1F2',
                              color: '#BE123C',
                              border: '1px solid #FECDD3',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              padding: '6px 12px',
                              fontWeight: 600,
                              borderRadius: 8,
                              cursor: 'pointer'
                            }}
                          >
                            <AlertTriangle size={14} /> {t('raiseDispute', 'Raise Dispute')}
                          </button>
                        );
                      })()}

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL AMOUNT</div>
                        <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                          ₹{order.total?.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => toggleTimeline(order.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px' }}
                      >
                        <Truck size={14} />
                        <span>{isExpanded ? t('hideTracking', 'Hide Live Tracking') : t('trackShipment', 'Track Shipment')}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Tracking Number & Courier Bar */}
                  {order.trackingNumber && (
                    <div
                      style={{
                        padding: '12px 24px',
                        background: '#F8FAFC',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.82rem',
                        flexWrap: 'wrap',
                        gap: 12
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ color: 'var(--text-muted)' }}>Waybill Tracking #:</span>
                        <code style={{ background: 'white', padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border)', fontWeight: 700, color: 'var(--primary)' }}>
                          {order.trackingNumber}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopyTracking(order.trackingNumber)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}
                          title="Copy tracking number"
                        >
                          {copiedTracking === order.trackingNumber ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Method: <strong>{order.shippingMethod || 'Standard Surface'}</strong>
                        </span>
                        <span>•</span>
                        <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ShieldCheck size={14} /> Dispatch Guarantee Active
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Return / Replacement Status Alert (if present) */}
                  {hasReturn && (
                    <div
                      style={{
                        padding: '12px 24px',
                        background: order.returnRequest.status === 'approved' ? '#DCFCE7' : order.returnRequest.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <RotateCcw size={16} />
                        <span>
                          <strong>Return/Replacement Status:</strong> {order.returnRequest.status.toUpperCase()} ({order.returnRequest.reason})
                        </span>
                      </div>
                      {order.returnRequest.vendorNote && (
                        <div style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>
                          Merchant Note: "{order.returnRequest.vendorNote}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* EXPANDABLE SHIPMENT TIMELINE */}
                  {isExpanded && (
                    <div style={{ padding: '24px', background: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Truck size={16} color="var(--primary)" />
                        <span>Live Courier & Dispatch Milestones</span>
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'relative', paddingLeft: 24, borderLeft: '2px solid var(--primary)' }}>
                        {(order.shipmentTimeline || [
                          { status: 'Order Placed', timestamp: order.createdAt, location: 'Online Checkout', note: 'Order confirmed and inventory allocated.' }
                        ]).map((step, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            {/* Milestone Dot */}
                            <div
                              style={{
                                position: 'absolute',
                                left: -31,
                                top: 2,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                border: '2px solid white'
                              }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 6 }}>
                              <strong style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>{step.status}</strong>
                              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{step.timestamp}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                              <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> {step.location}
                            </div>
                            {step.note && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2, fontStyle: 'italic' }}>
                                {step.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Itemized Order Rows */}
                  <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '70px 1fr auto',
                          gap: 16,
                          alignItems: 'center',
                          paddingBottom: idx !== order.items.length - 1 ? 16 : 0,
                          borderBottom: idx !== order.items.length - 1 ? '1px solid var(--border)' : 'none'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                        />

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <Link
                              to={`/shop/product/${item.productId}`}
                              style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', textDecoration: 'none' }}
                            >
                              {item.name}
                            </Link>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                              SKU: {item.sku || 'VM-PHYSICAL'}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <span>Qty: <strong>{item.quantity}</strong></span>
                            <span>•</span>
                            <span>Unit Price: <strong>₹{item.price.toLocaleString('en-IN')}</strong></span>
                            {item.selectedVariant?.color && (
                              <>
                                <span>•</span>
                                <span>Color: {item.selectedVariant.color}</span>
                              </>
                            )}
                            {item.selectedVariant?.option && (
                              <>
                                <span>•</span>
                                <span>Option: {item.selectedVariant.option}</span>
                              </>
                            )}
                          </div>

                          {/* Contextual Actions on Delivered/Shipped items */}
                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            {/* Dispute Action for Item */}
                            {(() => {
                              const itemDispute = getDisputeForOrder(order.id, item.productId);
                              if (itemDispute) {
                                return (
                                  <button
                                    type="button"
                                    className="btn btn-sm"
                                    onClick={() => setViewDispute(itemDispute)}
                                    style={{
                                      fontSize: '0.76rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 4,
                                      padding: '4px 10px',
                                      background: '#FEF2F2',
                                      color: '#B91C1C',
                                      border: '1px solid #FCA5A5',
                                      fontWeight: 700,
                                      borderRadius: 6
                                    }}
                                  >
                                    <AlertTriangle size={13} /> Dispute: {itemDispute.status}
                                  </button>
                                );
                              }
                              return (
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => {
                                    setDisputeModalOrder(order);
                                    setDisputeModalItem(item);
                                  }}
                                  style={{
                                    fontSize: '0.76rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    padding: '4px 10px',
                                    color: '#DC2626',
                                    borderColor: '#FECACA'
                                  }}
                                  title="Raise formal dispute for this item"
                                >
                                  <AlertTriangle size={13} /> Raise Dispute
                                </button>
                              );
                            })()}

                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => openReviewModal(order, item)}
                              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px' }}
                            >
                              <Star size={13} color="#F59E0B" /> Rate Product
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => openSupportModal(order, item)}
                              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px' }}
                            >
                              <HelpCircle size={13} /> Support Ticket
                            </button>

                            <button
                              type="button"
                              className="btn btn-outline btn-sm"
                              onClick={() => openContactModal(order, item)}
                              style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', color: 'var(--primary)', borderColor: 'var(--primary)' }}
                            >
                              <MessageSquare size={13} /> Message Merchant
                            </button>

                            {!hasReturn && (
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                onClick={() => openReturnModal(order, item)}
                                style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', color: '#B45309', borderColor: '#FCD34D' }}
                              >
                                <RotateCcw size={13} /> Return / Replace
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Destination & Payment Summary Footer */}
                  <div
                    style={{
                      padding: '14px 24px',
                      background: 'var(--surface-2)',
                      borderTop: '1px solid var(--border)',
                      fontSize: '0.82rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
                      <MapPin size={14} color="var(--primary)" />
                      <span><strong>Fulfillment Destination:</strong> {order.address}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                      {order.paymentMethod === 'COD' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ color: '#92400E', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                            <Banknote size={14} /> Cash on Delivery:
                          </span>
                          <span>Pay ₹{order.total?.toLocaleString('en-IN')} on arrival</span>
                          {order.paymentDetails?.codOtp && (
                            <span
                              style={{
                                background: '#FEF3C7',
                                color: '#92400E',
                                border: '1px solid #FCD34D',
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontWeight: 800,
                                fontFamily: 'monospace',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4
                              }}
                              title="Share this OTP with courier agent only upon delivery"
                            >
                              <Key size={11} /> OTP: {order.paymentDetails.codOtp}
                            </span>
                          )}
                        </div>
                      ) : order.paymentMethod === 'CARD' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)' }}>
                          <CreditCard size={14} color="var(--primary)" />
                          <span>Prepaid via Card Ending in <strong>{order.paymentDetails?.cardLast4 || '4242'}</strong></span>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#065F46' }}>
                          <QrCode size={14} />
                          <span>Prepaid via UPI QR · Ref: <code style={{ fontWeight: 700 }}>{order.paymentDetails?.upiRef || 'UPI-OK'}</code></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── RETURN / REPLACEMENT MODAL ── */}
      {activeModal === 'return' && activeOrder && activeItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 500, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Request Physical Return / Replacement</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              Item: <strong>{activeItem.name}</strong> (SKU: {activeItem.sku || 'N/A'}) from Order #{activeOrder.id}
            </p>

            <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Resolution Preference:
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="reqAction"
                      checked={requestedAction === 'replacement'}
                      onChange={() => setRequestedAction('replacement')}
                    />
                    <span>Doorstep Replacement (Same SKU)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="reqAction"
                      checked={requestedAction === 'refund'}
                      onChange={() => setRequestedAction('refund')}
                    />
                    <span>Full Refund to Original Payment</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Reason for Return:
                </label>
                <select
                  className="form-control"
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option>Damaged/Defective Product on Delivery</option>
                  <option>Wrong SKU or Finish Dispatched</option>
                  <option>Missing Accessories or Parts in Package</option>
                  <option>Product Does Not Match Listing Specs</option>
                  <option>Package Box Severely Tampered</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Detailed Observation Note:
                </label>
                <textarea
                  ref={modalInputRef}
                  className="form-control"
                  rows={3}
                  placeholder="Explain the physical defect or issue for warehouse inspection..."
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Return Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PRODUCT SUPPORT TICKET MODAL ── */}
      {activeModal === 'support' && activeOrder && activeItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 500, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <HelpCircle size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Product Support Ticket</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              Direct inquiry to merchant for <strong>{activeItem.name}</strong> (Order #{activeOrder.id})
            </p>

            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Issue Category:
                </label>
                <select
                  className="form-control"
                  value={supportIssueType}
                  onChange={(e) => setSupportIssueType(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option>Setup & Usage Assistance</option>
                  <option>Missing Warranty Card or Invoice</option>
                  <option>Courier Tracking Delay Inquiry</option>
                  <option>Manufacturer Service Center Guidance</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Message to Seller:
                </label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Describe your question or support need..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Log Support Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── WRITE REVIEW MODAL ── */}
      {activeModal === 'review' && activeItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 500, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Star size={20} color="#F59E0B" fill="#F59E0B" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Write a Product Review</h3>
              </div>
              <button onClick={() => setActiveModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              Reviewing physical item: <strong>{activeItem.name}</strong>
            </p>

            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                  Star Rating:
                </label>
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

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Headline / Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Excellent build quality and fast courier delivery!"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Review Comments:
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Share details about physical packaging, quality, durability, and fulfillment..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setActiveModal(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Dispute Modal (Customer Raising Dispute) ── */}
      {disputeModalOrder && (
        <DisputeModal
          order={disputeModalOrder}
          preselectedItem={disputeModalItem}
          onClose={() => {
            setDisputeModalOrder(null);
            setDisputeModalItem(null);
          }}
          onSuccess={(newDispute) => {
            setViewDispute(newDispute);
          }}
        />
      )}

      {/* ── Dispute History Modal (Viewing Dispute Details & Decisions) ── */}
      {viewDispute && (
        <DisputeHistoryModal
          dispute={viewDispute}
          onClose={() => setViewDispute(null)}
        />
      )}

      {/* ── Contact Merchant Modal ── */}
      {contactOrder && (
        <ContactVendorModal
          isOpen={!!contactOrder}
          onClose={() => {
            setContactOrder(null);
            setContactItem(null);
          }}
          order={contactOrder}
          product={
            contactItem
              ? {
                  id: contactItem.productId,
                  name: contactItem.name,
                  price: contactItem.price,
                  image: contactItem.image,
                  sku: contactItem.sku,
                  category: 'General'
                }
              : null
          }
          vendor={{
            id: contactItem?.vendorId || contactOrder?.items?.[0]?.vendorId || 'v1',
            businessName: contactItem?.vendorName || contactOrder?.items?.[0]?.vendorName || 'Verified Merchant'
          }}
        />
      )}

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 48, fontSize: '0.85rem' }}>
        © 2024 Vendor Hub · Physical Logistics & Courier Network
      </footer>
    </div>
  );
}
