import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  Package, Truck, CheckCircle, Clock, MapPin, Search,
  RotateCcw, ShieldCheck, Send, Check, X, AlertTriangle, Eye
} from 'lucide-react';
import '../../styles/vendor.css';

export default function VendorOrders() {
  // 1. useContext hooks
  const { user } = useAuth();
  const { getVendorOrders, updateShipmentStatus, resolveReturn } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // 2. useState hooks
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [courierName, setCourierName] = useState('BlueDart Express');
  const [waybillTracking, setWaybillTracking] = useState('');
  const [dispatchNote, setDispatchNote] = useState('Package safely dispatched from merchant warehouse.');

  // Return resolution state
  const [returnModalOrder, setReturnModalOrder] = useState(null);
  const [returnDecision, setReturnDecision] = useState('approved');
  const [returnVendorNote, setReturnVendorNote] = useState('');

  // 3. useRef hook
  const searchInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    document.title = 'Order Fulfillment & Dispatch | Vendor Hub';
  }, []);

  // 5. useMemo hooks
  const vendorOrders = useMemo(() => {
    if (!user?.id) return [];
    return getVendorOrders(user.id);
  }, [user, getVendorOrders]);

  const filteredOrders = useMemo(() => {
    return vendorOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.trackingNumber && order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.address && order.address.toLowerCase().includes(searchQuery.toLowerCase())) ||
        order.items.some((it) => it.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        filterStatus === 'All'
          ? true
          : filterStatus === 'Returns'
          ? !!order.returnRequest
          : order.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [vendorOrders, searchQuery, filterStatus]);

  const fulfillmentMetrics = useMemo(() => {
    const total = vendorOrders.length;
    const awaitingPackaging = vendorOrders.filter((o) => o.status === 'Placed').length;
    const readyForPickup = vendorOrders.filter((o) => o.status === 'Confirmed').length;
    const inTransit = vendorOrders.filter((o) => o.status === 'Dispatched' || o.status === 'Out for Delivery').length;
    const delivered = vendorOrders.filter((o) => o.status === 'Delivered').length;
    const pendingReturns = vendorOrders.filter((o) => o.returnRequest && o.returnRequest.status === 'pending').length;

    return { total, awaitingPackaging, readyForPickup, inTransit, delivered, pendingReturns };
  }, [vendorOrders]);

  // 6. useCallback hooks
  const handleConfirmOrder = useCallback((orderId) => {
    updateShipmentStatus(orderId, 'Confirmed', {
      location: 'Merchant Warehouse Pack Station',
      note: 'Item verified, physical barcode scanned, and sealed in tamper-proof courier package.',
    });
    addToast(`Order #${orderId} marked Confirmed & Packed!`, 'success');
  }, [updateShipmentStatus, addToast]);

  const openDispatchModal = useCallback((order) => {
    setDispatchModalOrder(order);
    setCourierName(order.courierPartner || 'BlueDart Express');
    setWaybillTracking(order.trackingNumber || `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`);
    setDispatchNote('Package handed over to physical courier pickup agent.');
  }, []);

  const handleConfirmDispatch = useCallback((e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    updateShipmentStatus(dispatchModalOrder.id, 'Dispatched', {
      courierPartner: courierName,
      trackingNumber: waybillTracking,
      location: 'Local Carrier Sorting Hub',
      note: dispatchNote || 'Package handed over to courier. In transit to destination city.',
    });

    addToast(`Order #${dispatchModalOrder.id} dispatched via ${courierName}! Tracking updated for buyer.`, 'success');
    setDispatchModalOrder(null);
  }, [dispatchModalOrder, courierName, waybillTracking, dispatchNote, updateShipmentStatus, addToast]);

  const handleMarkDelivered = useCallback((orderId) => {
    updateShipmentStatus(orderId, 'Delivered', {
      location: 'Customer Address Doorstep',
      note: 'Package successfully delivered and signed by customer.',
    });
    addToast(`Order #${orderId} marked Physically Delivered!`, 'success');
  }, [updateShipmentStatus, addToast]);

  const openReturnModal = useCallback((order) => {
    setReturnModalOrder(order);
    setReturnDecision('approved');
    setReturnVendorNote('Physical return verified. Free doorstep pickup has been scheduled.');
  }, []);

  const handleResolveReturnSubmit = useCallback((e) => {
    e.preventDefault();
    if (!returnModalOrder) return;

    resolveReturn(returnModalOrder.id, returnDecision, returnVendorNote);
    addToast(`Return request for Order #${returnModalOrder.id} ${returnDecision.toUpperCase()}!`, 'success');
    setReturnModalOrder(null);
  }, [returnModalOrder, returnDecision, returnVendorNote, resolveReturn, addToast]);

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Orders & Courier Fulfillment</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Physical inventory dispatch center for <strong>{user?.businessName}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content">
          {/* Fulfillment KPIs */}
          <div className="stats-grid" style={{ marginBottom: 24 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                <Package size={22} />
              </div>
              <div>
                <div className="stat-value">{fulfillmentMetrics.awaitingPackaging}</div>
                <div className="stat-label">To Pack & Verify</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                <Clock size={22} />
              </div>
              <div>
                <div className="stat-value">{fulfillmentMetrics.readyForPickup}</div>
                <div className="stat-label">Ready for Courier Pickup</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FEF3C7', color: '#D97706' }}>
                <Truck size={22} />
              </div>
              <div>
                <div className="stat-value">{fulfillmentMetrics.inTransit}</div>
                <div className="stat-label">In Transit / Out for Delivery</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#D1FAE5', color: '#059669' }}>
                <CheckCircle size={22} />
              </div>
              <div>
                <div className="stat-value">{fulfillmentMetrics.delivered}</div>
                <div className="stat-label">Delivered Successfully</div>
              </div>
            </div>

            {fulfillmentMetrics.pendingReturns > 0 && (
              <div className="stat-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.08)' }}>
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626' }}>
                  <RotateCcw size={22} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: '#DC2626' }}>
                    {fulfillmentMetrics.pendingReturns}
                  </div>
                  <div className="stat-label" style={{ color: '#991B1B' }}>
                    Return Requests Pending
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter & Search Bar */}
          <div className="card" style={{ padding: 18, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Full-width Search Input */}
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                ref={searchInputRef}
                type="text"
                className="form-control"
                style={{ paddingLeft: 42, height: 42, fontSize: '0.875rem' }}
                placeholder="Search orders by Order ID, tracking waybill, customer name, destination, or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 4 }}>
                Filter by Status:
              </span>
              {['All', 'Placed', 'Confirmed', 'Dispatched', 'Delivered', 'Returns'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: filterStatus === st ? '1px solid var(--primary)' : '1px solid var(--border)',
                    background: filterStatus === st ? 'var(--primary)' : 'var(--surface-2)',
                    color: filterStatus === st ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: filterStatus === st ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {st === 'Returns' ? `Returns (${fulfillmentMetrics.pendingReturns})` : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table / List */}
          {filteredOrders.length === 0 ? (
            <div className="empty-state card" style={{ padding: 48 }}>
              <Package size={56} className="empty-state-icon" />
              <h3>No Orders Found</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                No customer orders match the current filter or search criteria.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {filteredOrders.map((order) => {
                const hasReturn = !!order.returnRequest;

                return (
                  <div key={order.id} className="card" style={{ padding: 22 }}>
                    {/* Header: Order ID, Date, Status */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <strong style={{ fontSize: '1.05rem' }}>Order #{order.id}</strong>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 12,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background:
                                order.status === 'Delivered'
                                  ? '#D1FAE5'
                                  : order.status === 'Dispatched'
                                  ? '#FEF3C7'
                                  : order.status === 'Confirmed'
                                  ? '#DBEAFE'
                                  : '#EEF2FF',
                              color:
                                order.status === 'Delivered'
                                  ? '#065F46'
                                  : order.status === 'Dispatched'
                                  ? '#92400E'
                                  : order.status === 'Confirmed'
                                  ? '#1E40AF'
                                  : '#3730A3',
                            }}
                          >
                            {order.status}
                          </span>

                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 12,
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              background: order.paymentMethod === 'COD' ? '#FEF3C7' : '#D1FAE5',
                              color: order.paymentMethod === 'COD' ? '#92400E' : '#065F46',
                              border: order.paymentMethod === 'COD' ? '1px solid #FCD34D' : '1px solid #A7F3D0'
                            }}
                          >
                            {order.paymentMethod === 'COD'
                              ? `💵 COD (Collect ₹${order.total?.toLocaleString('en-IN')})`
                              : '✓ Prepaid (UPI QR)'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                          Placed on: {order.createdAt} · Shipping: <strong>{order.shippingMethod || 'Standard'}</strong> · Payment: <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}</strong>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ORDER VALUE</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                          ₹{order.total?.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div style={{ padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.88rem' }}>
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{item.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              SKU: <strong>{item.sku || 'VM-PHYSICAL'}</strong>
                              {item.selectedVariant?.color && ` · Color: ${item.selectedVariant.color}`}
                              {item.selectedVariant?.option && ` · Option: ${item.selectedVariant.option}`}
                              {item.customization?.engraving && ` · Engraving: "${item.customization.engraving}"`}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div>Qty: <strong>{item.quantity}</strong></div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address & Courier Tracking Info */}
                    <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <MapPin size={15} color="var(--primary)" />
                        <span><strong>Ship to:</strong> {order.address}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span>Courier: <strong>{order.courierPartner || 'Delhivery Surface'}</strong></span>
                        <span>•</span>
                        <span>Waybill #: <code style={{ fontWeight: 700 }}>{order.trackingNumber || 'Pending'}</code></span>
                      </div>
                    </div>

                    {/* Return Request Banner */}
                    {hasReturn && (
                      <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: '#FEF3C7', border: '1px solid #FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#92400E' }}>
                            Customer Return/Replacement Requested: {order.returnRequest.requestedAction.toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#78350F' }}>
                            Reason: {order.returnRequest.reason} {order.returnRequest.note ? `("${order.returnRequest.note}")` : ''}
                          </div>
                        </div>

                        {order.returnRequest.status === 'pending' ? (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{ background: '#D97706', color: 'white', fontWeight: 600 }}
                            onClick={() => openReturnModal(order)}
                          >
                            Resolve Return Request
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: order.returnRequest.status === 'approved' ? '#047857' : '#B91C1C' }}>
                            Resolution: {order.returnRequest.status.toUpperCase()}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Vendor Fulfillment Action Buttons */}
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10, flexWrap: 'wrap' }}>
                      {order.status === 'Placed' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleConfirmOrder(order.id)}
                        >
                          <CheckCircle size={14} /> Confirm & Mark Packed
                        </button>
                      )}

                      {(order.status === 'Placed' || order.status === 'Confirmed') && (
                        <button
                          type="button"
                          className="btn btn-sm"
                          style={{ background: '#F59E0B', color: 'white', border: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
                          onClick={() => openDispatchModal(order)}
                        >
                          <Truck size={14} /> Dispatch with Courier
                        </button>
                      )}

                      {order.status === 'Dispatched' && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => handleMarkDelivered(order.id)}
                        >
                          <CheckCircle size={14} /> Mark Delivered
                        </button>
                      )}

                      {order.status === 'Delivered' && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--success)', fontSize: '0.85rem', fontWeight: 600 }}>
                          <CheckCircle size={16} /> Physical Delivery Completed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── COURIER DISPATCH MODAL ── */}
      {dispatchModalOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 480, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Truck size={20} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Dispatch Physical Order</h3>
              </div>
              <button onClick={() => setDispatchModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              Dispatching Order <strong>#{dispatchModalOrder.id}</strong> to recipient: <em>{dispatchModalOrder.address}</em>
            </p>

            <form onSubmit={handleConfirmDispatch} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Courier Logistics Partner:
                </label>
                <select
                  className="form-control"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                >
                  <option>BlueDart Express Air</option>
                  <option>Delhivery Surface Express</option>
                  <option>DTDC Prime Express</option>
                  <option>FedEx Surface Logistics</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Airway Waybill / Tracking Number:
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}
                  value={waybillTracking}
                  onChange={(e) => setWaybillTracking(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Dispatch Status Note:
                </label>
                <input
                  type="text"
                  className="form-control"
                  style={{ fontSize: '0.85rem' }}
                  value={dispatchNote}
                  onChange={(e) => setDispatchNote(e.target.value)}
                  placeholder="e.g. Dispatched from Delhi Central Hub via BlueDart"
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setDispatchModalOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Dispatch & Transmit Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── RESOLVE RETURN MODAL ── */}
      {returnModalOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 480, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <RotateCcw size={20} color="#D97706" />
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Resolve Return / Replacement</h3>
              </div>
              <button onClick={() => setReturnModalOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleResolveReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6 }}>
                  Decision:
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="decision"
                      checked={returnDecision === 'approved'}
                      onChange={() => setReturnDecision('approved')}
                    />
                    <span style={{ color: 'var(--success)', fontWeight: 700 }}>Approve Request</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="decision"
                      checked={returnDecision === 'rejected'}
                      onChange={() => setReturnDecision('rejected')}
                    />
                    <span style={{ color: 'var(--danger)', fontWeight: 700 }}>Decline Request</span>
                  </label>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>
                  Merchant Note to Buyer:
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={returnVendorNote}
                  onChange={(e) => setReturnVendorNote(e.target.value)}
                  placeholder="Provide instructions for courier pickup or reason for decline..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setReturnModalOrder(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
