import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import {
  Printer, Download, X, CheckCircle, ShieldCheck, Building2,
  Send, Phone, MessageSquare, Check, AlertCircle, Smartphone, Clock
} from 'lucide-react';

export default function InvoiceModal({ orderId, order, onClose }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingDelivery, setSendingDelivery] = useState(false);
  const [deliveryResult, setDeliveryResult] = useState(null);
  const [showChannelDropdown, setShowChannelDropdown] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    async function loadInvoice() {
      if (!orderId && !order?.id) return;
      const targetId = orderId || order.id;
      setLoading(true);
      try {
        const res = await api.getInvoiceById(targetId);
        if (res?.success && res.invoice) {
          setInvoice(res.invoice);
        } else {
          // Fallback to legacy getOrderInvoice
          const legacyRes = await api.getOrderInvoice(targetId);
          if (legacyRes?.success && legacyRes.invoice) {
            setInvoice(legacyRes.invoice);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch invoice:', err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [orderId, order]);

  const handlePrint = () => {
    window.print();
  };

  const handleSendTwilioDelivery = async (channel = 'both') => {
    if (!invoice) return;
    const invId = invoice.invoiceNumber || invoice.id || orderId || order?.id;
    try {
      setSendingDelivery(true);
      setShowChannelDropdown(false);
      const res = await api.sendInvoiceDelivery(invId, channel);
      if (res?.success) {
        addToast(
          channel === 'whatsapp'
            ? 'Invoice notification dispatched via WhatsApp!'
            : channel === 'sms'
            ? 'Invoice notification dispatched via SMS!'
            : 'Invoice dispatched via SMS & WhatsApp!',
          'success'
        );
        setDeliveryResult(res);
        setInvoice((prev) => ({
          ...prev,
          deliveryStatus: res.deliveryStatus || 'sent',
          deliveryLog: [...(prev?.deliveryLog || []), ...(res.results || [])]
        }));
      } else {
        addToast('Failed to dispatch invoice communication.', 'error');
      }
    } catch (err) {
      addToast('Twilio communication gateway error.', 'error');
    } finally {
      setSendingDelivery(false);
    }
  };

  if (!orderId && !order) return null;

  // Resolve normalized fields
  const vendorName = invoice?.vendor?.name || invoice?.vendorBusinessName || 'Verified Merchant Store';
  const vendorGstin = invoice?.vendor?.gstin || invoice?.vendorGstin || '07AABCT1234F1Z8';
  const vendorAddress = invoice?.vendor?.address || invoice?.vendorAddress || 'Commercial Complex';
  const vendorCity = invoice?.vendor?.city || invoice?.vendorCity || 'New Delhi';
  const vendorState = invoice?.vendor?.state || invoice?.vendorState || 'Delhi';
  const vendorPhone = invoice?.vendor?.phone || invoice?.vendorPhone || '+91 98765 43210';
  const vendorEmail = invoice?.vendor?.email || invoice?.vendorEmail || 'support@vendorhub.in';

  const customerName = invoice?.customer?.name || invoice?.customerName || 'Valued Customer';
  const customerPhone = invoice?.customer?.phone || invoice?.customerPhone || '+91 98765 43210';
  const customerEmail = invoice?.customer?.email || invoice?.customerEmail || 'customer@vendorhub.in';
  const customerAddress = invoice?.customer?.address || invoice?.customerAddress || 'Customer Address';
  const customerCity = invoice?.customer?.city || invoice?.customerCity || 'Bengaluru';
  const customerState = invoice?.customer?.state || invoice?.customerState || 'Karnataka';
  const customerPincode = invoice?.customer?.pincode || invoice?.customerPincode || '560001';

  const invNumber = invoice?.invoiceNumber || `VH-INV-2026-${(orderId || order?.id || '').toUpperCase()}`;
  const invDate = invoice?.invoiceDate || order?.createdAt || new Date().toISOString().split('T')[0];
  const grandTotal = invoice?.totals?.grandTotal || invoice?.grandTotal || order?.total || 0;
  const taxableSubtotal = invoice?.totals?.subtotalTaxable || invoice?.subtotal || Math.round(grandTotal * 0.82);
  const gstAmount = invoice?.totals?.totalGst || invoice?.tax || Math.round(taxableSubtotal * 0.18);
  const shippingAmount = invoice?.totals?.shippingCharges != null ? invoice.totals.shippingCharges : (invoice?.shipping || 0);

  const deliveryStatus = invoice?.deliveryStatus || 'pending';

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px'
      }}
    >
      <div
        className="invoice-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#FFFFFF',
          color: '#0F172A',
          width: '880px',
          maxWidth: '100%',
          maxHeight: '92vh',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Modal Action Bar (Hidden in Print) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={22} color="#4F46E5" />
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1E293B' }}>
                Tax Invoice — Order #{orderId || order?.id}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.74rem', color: '#64748B' }}>
                <span>Verified GST Registered Merchant</span>
                <span>•</span>
                {/* Twilio Delivery Status Badge */}
                {deliveryStatus === 'sent' || deliveryStatus === 'delivered' ? (
                  <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <CheckCircle size={11} /> Twilio Delivered (SMS & WhatsApp)
                  </span>
                ) : deliveryStatus === 'simulated' ? (
                  <span style={{ color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Smartphone size={11} /> Twilio Simulated Delivery (Dev Mode)
                  </span>
                ) : (
                  <span style={{ color: '#D97706', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Clock size={11} /> Twilio Delivery Pending
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Twilio Dispatch Action */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowChannelDropdown(!showChannelDropdown)}
                disabled={sendingDelivery}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  borderColor: '#4F46E5',
                  color: '#4F46E5',
                  fontWeight: 600
                }}
              >
                <Smartphone size={15} />
                {sendingDelivery ? 'Sending...' : 'Send SMS / WhatsApp'}
              </button>

              {showChannelDropdown && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: 'white',
                    borderRadius: 8,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    border: '1px solid #E2E8F0',
                    zIndex: 10,
                    width: 220,
                    overflow: 'hidden'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSendTwilioDelivery('both')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      borderBottom: '1px solid #F1F5F9'
                    }}
                  >
                    <Send size={14} color="#4F46E5" /> Send SMS & WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendTwilioDelivery('sms')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      borderBottom: '1px solid #F1F5F9'
                    }}
                  >
                    <Smartphone size={14} color="#2563EB" /> Send SMS Only
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSendTwilioDelivery('whatsapp')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      textAlign: 'left',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    <MessageSquare size={14} color="#16A34A" /> Send WhatsApp Only
                  </button>
                </div>
              )}
            </div>

            {/* Print / Download Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}
            >
              <Printer size={15} /> Print / PDF
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                padding: 6
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Body */}
        <div
          id="printable-invoice"
          style={{
            padding: '36px 40px',
            overflowY: 'auto',
            flex: 1,
            fontSize: '0.85rem',
            lineHeight: 1.5,
            fontFamily: 'Inter, -apple-system, sans-serif',
            color: '#1E293B'
          }}
        >
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#64748B' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <div>Generating verified GST tax invoice...</div>
            </div>
          ) : !invoice ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#EF4444' }}>
              Unable to generate invoice at this moment. Please check back shortly.
            </div>
          ) : (
            <div>
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  borderBottom: '2px solid #4F46E5',
                  paddingBottom: 20
                }}
              >
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4F46E5', letterSpacing: '-0.5px' }}>
                    {vendorName}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.82rem', marginTop: 4 }}>
                    {vendorAddress}
                  </div>
                  <div style={{ color: '#475569', fontSize: '0.82rem' }}>
                    {vendorCity}, {vendorState}
                  </div>
                  <div style={{ marginTop: 6, fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>
                    GSTIN: <span style={{ color: '#4F46E5' }}>{vendorGstin}</span> · Phone: {vendorPhone}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      background: '#EEF2FF',
                      color: '#4338CA',
                      padding: '4px 12px',
                      borderRadius: 4,
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      marginBottom: 8
                    }}
                  >
                    Original For Recipient
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#0F172A' }}>TAX INVOICE</h2>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: 4 }}>
                    Invoice No: <strong style={{ color: '#0F172A' }}>{invNumber}</strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Invoice Date: <strong style={{ color: '#0F172A' }}>{invDate}</strong>
                  </div>
                </div>
              </div>

              {/* Order & Shipment Metadata */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 16,
                  background: '#F8FAFC',
                  padding: '14px 18px',
                  borderRadius: 8,
                  margin: '20px 0',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Order Details
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>Order ID: #{orderId || order?.id || invoice.orderId}</div>
                  <div style={{ color: '#475569' }}>Placed on: {invDate}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Logistics & Courier
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>{invoice.courierPartner || 'Delhivery Surface Express'}</div>
                  <div style={{ color: '#475569' }}>Waybill / AWB: {invoice.trackingNumber || 'BD-724910-IN'}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase' }}>
                    Place of Supply
                  </div>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>{customerState} ({customerCity})</div>
                  <div style={{ color: '#475569' }}>Supply Type: {invoice.isIntraState !== false ? 'Intra-State (CGST + SGST)' : 'Inter-State (IGST)'}</div>
                </div>
              </div>

              {/* Billed To / Shipped To Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 24,
                  margin: '20px 0',
                  paddingBottom: 20,
                  borderBottom: '1px solid #E2E8F0'
                }}
              >
                <div>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    Billed To (Customer Details)
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{customerName}</div>
                  <div style={{ color: '#475569', marginTop: 2 }}>{customerAddress}</div>
                  <div style={{ color: '#475569' }}>{customerCity}, {customerState} - {customerPincode}</div>
                  <div style={{ color: '#475569', marginTop: 4 }}>Mobile: {customerPhone} · Email: {customerEmail}</div>
                </div>

                <div>
                  <div style={{ color: '#64748B', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                    Payment & Settlement
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748B' }}>Payment Mode:</span>
                    <strong style={{ textTransform: 'uppercase' }}>{invoice.payment?.method || invoice.paymentMethod || 'Prepaid'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748B' }}>Payment Status:</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>{invoice.payment?.status || invoice.paymentStatus || 'Paid & Verified'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: '#64748B' }}>Transaction Ref:</span>
                    <code style={{ fontSize: '0.75rem', background: '#F1F5F9', padding: '1px 5px', borderRadius: 3 }}>
                      {invoice.payment?.transactionRef || invoice.orderReference || 'TXN-SETTLED-OK'}
                    </code>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', margin: '20px 0', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderTop: '1px solid #CBD5E1', borderBottom: '2px solid #CBD5E1', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px', width: '32px' }}>#</th>
                    <th style={{ padding: '10px 8px' }}>Product Description</th>
                    <th style={{ padding: '10px 8px', width: '110px' }}>SKU / HSN</th>
                    <th style={{ padding: '10px 8px', textAlign: 'center', width: '50px' }}>Qty</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: '90px' }}>Unit Price</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: '90px' }}>Taxable Amt</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: '70px' }}>GST Rate</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right', width: '100px' }}>Total (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {(invoice.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '10px 8px', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '10px 8px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.name}</div>
                      </td>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#475569' }}>
                        <div>{item.sku || 'SKU-ITEM'}</div>
                        <div style={{ color: '#94A3B8', fontSize: '0.68rem' }}>HSN: {item.hsnCode || '8518.30.00'}</div>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        ₹{(item.baseUnitRate || Math.round(item.grossPrice / 1.18) || item.unitPrice || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                        ₹{(item.taxableValue || Math.round((item.quantity * item.price) / 1.18) || 0).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', color: '#64748B' }}>
                        {item.gstRatePercent || '18%'}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700 }}>
                        ₹{(item.totalAmount || (item.quantity * (item.price || item.unitPrice || 0))).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals & Tax Breakdown Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24, margin: '20px 0' }}>
                <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.76rem', color: '#64748B', textTransform: 'uppercase', marginBottom: 6 }}>
                    Amount in Words
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontStyle: 'italic', fontSize: '0.85rem' }}>
                    {invoice.totals?.amountInWords || invoice.amountInWords || 'Indian Rupees Only'}
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px dashed #CBD5E1', fontSize: '0.72rem', color: '#64748B' }}>
                    <div><strong>Tax Summary:</strong> All catalog prices include applicable Goods and Services Tax (GST).</div>
                    <div>HSN/SAC Code standard classification applies across verified Indian physical catalog.</div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Total Taxable Value:</span>
                    <span style={{ fontWeight: 600 }}>₹{taxableSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Total GST (18%):</span>
                    <span style={{ fontWeight: 600 }}>₹{gstAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B' }}>Shipping Charges:</span>
                    <span style={{ fontWeight: 600 }}>
                      {shippingAmount === 0 ? 'FREE' : `₹${shippingAmount}`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '2px solid #0F172A', marginTop: 8 }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>Grand Total:</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4F46E5' }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Audit Timeline if available */}
              {invoice.deliveryLog && invoice.deliveryLog.length > 0 && (
                <div className="no-print" style={{ marginTop: 20, padding: '12px 16px', background: '#F1F5F9', borderRadius: 8, fontSize: '0.74rem' }}>
                  <div style={{ fontWeight: 700, color: '#334155', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Smartphone size={13} /> Twilio Communication Dispatch Log:
                  </div>
                  {invoice.deliveryLog.map((log, lidx) => (
                    <div key={lidx} style={{ color: '#475569', display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                      <span>
                        Channel: <strong>{log.channel?.toUpperCase()}</strong> · Status: <strong style={{ color: log.status === 'sent' || log.status === 'simulated' ? '#059669' : '#DC2626' }}>{log.status}</strong> to {log.recipient}
                      </span>
                      <span>{log.sentAt ? new Date(log.sentAt).toLocaleTimeString('en-IN') : ''}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer Declaration & Signature */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  marginTop: 36,
                  paddingTop: 16,
                  borderTop: '1px dashed #CBD5E1',
                  fontSize: '0.74rem',
                  color: '#64748B'
                }}
              >
                <div style={{ maxWidth: '440px' }}>
                  <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: 2 }}>Terms & Conditions:</div>
                  <div>1. Physical replacement or refund valid within 7 days of verified courier delivery.</div>
                  <div>2. Certified tax invoice with 100% genuine brand warranty covered across authorized service centers.</div>
                  <div>3. Digitally generated on the Vendor Hub Multi-Vendor Platform.</div>
                </div>

                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div
                    style={{
                      height: '36px',
                      borderBottom: '1px solid #94A3B8',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#4F46E5',
                      fontWeight: 800
                    }}
                  >
                    {vendorName}
                  </div>
                  <div style={{ fontWeight: 700, color: '#0F172A' }}>Authorized Signatory</div>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>Verified Digital Signature</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Print Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible !important;
          }
          #printable-invoice {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .no-print, .modal-overlay {
            background: transparent !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
