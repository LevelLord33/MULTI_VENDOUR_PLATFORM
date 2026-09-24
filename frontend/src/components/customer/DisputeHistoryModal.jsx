import { X, CheckCircle, Clock, AlertTriangle, XCircle, Store, Shield, User, FileText } from 'lucide-react';
import '../../styles/marketplace.css';

const STATUS_THEME = {
  Open: { color: '#D97706', bg: '#FEF3C7', icon: <Clock size={14} />, label: 'Open · Awaiting Merchant Review' },
  'Under Review': { color: '#7C3AED', bg: '#EDE9FE', icon: <Clock size={14} />, label: 'Under Review by Admin' },
  'Vendor Responded': { color: '#2563EB', bg: '#DBEAFE', icon: <Store size={14} />, label: 'Vendor Responded · Under Review' },
  Resolved: { color: '#16A34A', bg: '#DCFCE7', icon: <CheckCircle size={14} />, label: 'Dispute Resolved' },
  Rejected: { color: '#DC2626', bg: '#FEE2E2', icon: <XCircle size={14} />, label: 'Dispute Rejected' },
};

export default function DisputeHistoryModal({ dispute, onClose }) {
  if (!dispute) return null;

  const currentStatusTheme = STATUS_THEME[dispute.status] || STATUS_THEME.Open;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal"
        style={{
          maxWidth: '720px',
          width: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Dispute #{dispute.disputeId}</h3>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '3px 10px',
                  borderRadius: 9999,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: currentStatusTheme.color,
                  background: currentStatusTheme.bg,
                }}
              >
                {currentStatusTheme.icon} {dispute.status}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Order #{dispute.orderId} · Raised on {new Date(dispute.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Item Summary Banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--surface-2, #F8FAFC)', border: '1px solid var(--border, #E2E8F0)', borderRadius: 10, padding: 12, marginBottom: 20 }}>
          <img
            src={dispute.item?.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=120&h=120&fit=crop'}
            alt={dispute.item?.name}
            style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', background: 'white' }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{dispute.item?.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Category: <strong>{dispute.category}</strong> · Seller: <strong>{dispute.vendorName}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary)' }}>
              ₹{dispute.item?.price?.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Qty: {dispute.item?.quantity || 1}
            </div>
          </div>
        </div>

        {/* 1. Customer's Claim */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, color: '#1E293B' }}>
            <User size={16} color="#4F46E5" />
            <span>Customer Claim & Reason:</span>
          </div>
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, padding: 14, fontSize: '0.88rem', lineHeight: 1.5, color: '#334155' }}>
            {dispute.description}
          </div>

          {/* Customer Evidence */}
          {dispute.evidence?.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
                Customer Uploaded Evidence ({dispute.evidence.length}):
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {dispute.evidence.map((ev, i) => (
                  <a key={i} href={ev.fileUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <img
                      src={ev.fileUrl}
                      alt={ev.fileName}
                      style={{ width: 80, height: 80, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Vendor's Response */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem', marginBottom: 6, color: '#1E293B' }}>
            <Store size={16} color="#2563EB" />
            <span>Vendor Explanation ({dispute.vendorName}):</span>
          </div>
          {dispute.vendorResponse ? (
            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: 14, fontSize: '0.88rem', lineHeight: 1.5, color: '#1E3A8A' }}>
              <div>{dispute.vendorResponse.explanation}</div>
              <div style={{ fontSize: '0.75rem', color: '#60A5FA', marginTop: 8 }}>
                Submitted on {new Date(dispute.vendorResponse.respondedAt).toLocaleString('en-IN')}
              </div>

              {dispute.vendorResponse.evidence?.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1E40AF', marginBottom: 6 }}>
                    Vendor Merchant Proof:
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {dispute.vendorResponse.evidence.map((ev, i) => (
                      <a key={i} href={ev.fileUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={ev.fileUrl}
                          alt={ev.fileName}
                          style={{ width: 72, height: 72, borderRadius: 6, objectFit: 'cover', border: '1px solid #93C5FD' }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--surface-2)', border: '1px dashed var(--border)', borderRadius: 8, padding: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              ⏳ The vendor has not yet submitted an explanation. They have been notified to provide physical dispatch documentation.
            </div>
          )}
        </div>

        {/* 3. Admin Decision & Resolution Note */}
        {dispute.adminResolution && (
          <div style={{ marginBottom: 20, background: dispute.status === 'Resolved' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${dispute.status === 'Resolved' ? '#BBF7D0' : '#FECACA'}`, borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.92rem', color: dispute.status === 'Resolved' ? '#166534' : '#991B1B', marginBottom: 6 }}>
              <Shield size={18} />
              <span>Platform Admin Final Determination: {dispute.adminResolution.decision}</span>
            </div>
            <div style={{ fontSize: '0.88rem', color: dispute.status === 'Resolved' ? '#14532D' : '#7F1D1D', lineHeight: 1.5 }}>
              {dispute.adminResolution.resolutionNote}
            </div>
            {dispute.adminResolution.refundAction && dispute.adminResolution.refundAction !== 'None' && (
              <div style={{ marginTop: 8, fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>
                Action: {dispute.adminResolution.refundAction} (₹{dispute.adminResolution.refundAmount?.toLocaleString('en-IN')})
              </div>
            )}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
              Audited by: {dispute.adminResolution.adminName || 'Marketplace Trust & Safety Admin'} · {new Date(dispute.adminResolution.resolvedAt).toLocaleDateString('en-IN')}
            </div>
          </div>
        )}

        {/* 4. Complete Audit Trail Timeline */}
        {dispute.auditTrail?.length > 0 && (
          <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 12 }}>
              📜 Chronological Audit Trail ({dispute.auditTrail.length} Events)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dispute.auditTrail.map((log, idx) => (
                <div key={idx} style={{ display: 'flex', gap: 10, fontSize: '0.82rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4F46E5', marginTop: 5, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#1E293B' }}>
                        {log.performedBy?.name} ({log.performedBy?.role})
                      </strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ color: '#475569', marginTop: 2 }}>{log.notes}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
