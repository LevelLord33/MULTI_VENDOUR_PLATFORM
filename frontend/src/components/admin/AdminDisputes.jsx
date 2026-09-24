import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDisputes } from '../../contexts/DisputeContext';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from './AdminDashboard';
import {
  ShieldAlert, CheckCircle, Clock, XCircle, Search, Filter,
  Store, User, RotateCcw, AlertTriangle, FileText, Check, X,
  ExternalLink, ArrowRight, ShieldCheck, Scale
} from 'lucide-react';
import '../../styles/vendor.css';

const STATUS_FILTERS = ['All', 'Open', 'Under Review', 'Vendor Responded', 'Resolved', 'Rejected'];

const CATEGORIES = [
  'All',
  'Product not received',
  'Damaged product',
  'Wrong product',
  'Refund issue',
  'Other',
];

export default function AdminDisputes() {
  const { vendors } = useAuth();
  const { disputes, updateDisputeStatusAdmin } = useDisputes();
  const { addToast } = useToast();

  // Filters
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selected dispute for adjudication modal
  const [adjudicatingDispute, setAdjudicatingDispute] = useState(null);
  const [resolutionStatus, setResolutionStatus] = useState('Resolved');
  const [resolutionNote, setResolutionNote] = useState('');
  const [refundAction, setRefundAction] = useState('Full Refund');
  const [refundAmount, setRefundAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = 'Marketplace Dispute Adjudication | Admin Console';
  }, []);

  // Filtered disputes
  const filteredDisputes = useMemo(() => {
    return disputes.filter((d) => {
      const matchStatus = selectedStatus === 'All' || d.status === selectedStatus;
      const matchVendor = selectedVendor === 'All' || d.vendorId === selectedVendor;
      const matchCategory = selectedCategory === 'All' || d.category === selectedCategory;

      const matchDate =
        !dateFilter ||
        d.createdAt.startsWith(dateFilter);

      const matchSearch =
        d.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.item?.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchStatus && matchVendor && matchCategory && matchDate && matchSearch;
    });
  }, [disputes, selectedStatus, selectedVendor, selectedCategory, dateFilter, searchQuery]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = disputes.length;
    const open = disputes.filter((d) => d.status === 'Open').length;
    const underReview = disputes.filter((d) => d.status === 'Under Review').length;
    const vendorResponded = disputes.filter((d) => d.status === 'Vendor Responded').length;
    const resolved = disputes.filter((d) => d.status === 'Resolved').length;
    const rejected = disputes.filter((d) => d.status === 'Rejected').length;
    return { total, open, underReview, vendorResponded, resolved, rejected };
  }, [disputes]);

  const handleOpenAdjudicate = (dispute) => {
    setAdjudicatingDispute(dispute);
    setResolutionStatus(dispute.status === 'Resolved' || dispute.status === 'Rejected' ? dispute.status : 'Resolved');
    setResolutionNote(dispute.adminResolution?.resolutionNote || '');
    setRefundAction(dispute.adminResolution?.refundAction || 'Full Refund');
    setRefundAmount(dispute.adminResolution?.refundAmount || dispute.item?.price || 0);
  };

  const handleAdjudicateSubmit = async (e) => {
    e.preventDefault();
    if (!resolutionNote.trim() || resolutionNote.trim().length < 5) {
      addToast('Please enter a formal resolution note for the platform audit trail.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDisputeStatusAdmin(
        adjudicatingDispute.disputeId,
        resolutionStatus,
        resolutionNote.trim(),
        {
          action: refundAction,
          amount: Number(refundAmount) || 0,
        }
      );
      setAdjudicatingDispute(null);
    } catch (err) {
      addToast(err.message || 'Failed to update dispute status.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vendor-layout">
      <AdminSidebar />

      <main className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <h1 className="vendor-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Scale size={24} color="#9333EA" />
              Platform Dispute Management & Neutral Arbitration
            </h1>
            <p className="vendor-page-subtitle">
              Review customer allegations, vendor fulfillment evidence, update statuses, and log binding resolutions.
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid" style={{ marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">All Active Disputes</div>
            <div className="metric-value">{metrics.total}</div>
            <div className="metric-sub">Platform lifetime total</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="metric-label">Open Claims</div>
            <div className="metric-value" style={{ color: '#D97706' }}>{metrics.open}</div>
            <div className="metric-sub">Awaiting merchant action</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #3B82F6' }}>
            <div className="metric-label">Vendor Responded</div>
            <div className="metric-value" style={{ color: '#2563EB' }}>{metrics.vendorResponded}</div>
            <div className="metric-sub">Ready for Admin Adjudication</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="metric-label">Resolved Cases</div>
            <div className="metric-value" style={{ color: '#16A34A' }}>{metrics.resolved}</div>
            <div className="metric-sub">Customer refunded / closed</div>
          </div>
        </div>

        {/* Multi-facet Filter Controls */}
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            border: '1px solid var(--border)',
            padding: 16,
            marginBottom: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* Status Chips */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 4 }}>
              Status:
            </span>
            {STATUS_FILTERS.map((st) => {
              const isActive = selectedStatus === st;
              return (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    borderRadius: 20,
                    fontSize: '0.78rem',
                    padding: '5px 12px',
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Secondary Dropdown Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search by ID, customer, item..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 34, fontSize: '0.85rem', height: 38 }}
              />
            </div>

            {/* Vendor Filter */}
            <div>
              <select
                className="form-control"
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                style={{ fontSize: '0.82rem', height: 36, padding: '6px 10px' }}
              >
                <option value="All">All Vendors (Stores)</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.businessName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="form-control"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ fontSize: '0.82rem', height: 36, padding: '6px 10px' }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Dispute Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker Filter */}
            <div>
              <input
                type="date"
                className="form-control"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                title="Filter by creation date"
                style={{ fontSize: '0.82rem', height: 36, padding: '6px 10px' }}
              />
            </div>
          </div>
        </div>

        {/* Disputes Table / Dossier List */}
        {filteredDisputes.length === 0 ? (
          <div className="empty-state" style={{ background: 'white', borderRadius: 12, border: '1px solid var(--border)', padding: 48 }}>
            <div className="empty-state-icon"><CheckCircle size={48} color="#10B981" /></div>
            <h3>No disputes matching criteria</h3>
            <p>Try resetting filters or searching with a different term.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredDisputes.map((dispute) => {
              const hasVendorResponse = !!dispute.vendorResponse;
              const isClosed = dispute.status === 'Resolved' || dispute.status === 'Rejected';

              return (
                <div
                  key={dispute.disputeId}
                  style={{
                    background: 'white',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    padding: 20,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#1E293B' }}>
                        Dispute #{dispute.disputeId}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                        {dispute.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: 20,
                          background:
                            dispute.status === 'Resolved'
                              ? '#DCFCE7'
                              : dispute.status === 'Rejected'
                              ? '#FEE2E2'
                              : dispute.status === 'Vendor Responded'
                              ? '#DBEAFE'
                              : '#FEF3C7',
                          color:
                            dispute.status === 'Resolved'
                              ? '#15803D'
                              : dispute.status === 'Rejected'
                              ? '#B91C1C'
                              : dispute.status === 'Vendor Responded'
                              ? '#1E40AF'
                              : '#B45309',
                        }}
                      >
                        ● {dispute.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Order: <strong>#{dispute.orderId}</strong> · Date: {new Date(dispute.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Side-by-Side Review Dossier */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                    {/* Customer Claim Column */}
                    <div style={{ background: '#F8FAFC', padding: 14, borderRadius: 8, border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', color: '#1E293B', marginBottom: 8 }}>
                        <User size={15} color="#4F46E5" />
                        <span>Customer Claim ({dispute.customerName}):</span>
                      </div>

                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8, background: 'white', padding: 8, borderRadius: 6, border: '1px solid #E2E8F0' }}>
                        <img
                          src={dispute.item?.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'}
                          alt={dispute.item?.name}
                          style={{ width: 42, height: 42, borderRadius: 4, objectFit: 'cover' }}
                        />
                        <div style={{ fontSize: '0.82rem', flex: 1 }}>
                          <strong style={{ display: 'block' }}>{dispute.item?.name}</strong>
                          <span style={{ color: 'var(--text-muted)' }}>₹{dispute.item?.price?.toLocaleString('en-IN')} (Qty: {dispute.item?.quantity || 1})</span>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.45 }}>
                        "{dispute.description}"
                      </div>

                      {dispute.evidence?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Attached Proof:</span>
                          {dispute.evidence.map((ev, i) => (
                            <a key={i} href={ev.fileUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={ev.fileUrl}
                                alt="evidence"
                                style={{ width: 34, height: 34, borderRadius: 4, objectFit: 'cover', border: '1px solid #CBD5E1' }}
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Vendor Defense Column */}
                    <div style={{ background: hasVendorResponse ? '#EFF6FF' : '#FDF4FF', padding: 14, borderRadius: 8, border: `1px solid ${hasVendorResponse ? '#BFDBFE' : '#F5D0FE'}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem', color: hasVendorResponse ? '#1E40AF' : '#86198F', marginBottom: 8 }}>
                        <Store size={15} color={hasVendorResponse ? '#2563EB' : '#A21CAF'} />
                        <span>Vendor Statement ({dispute.vendorName}):</span>
                      </div>

                      {hasVendorResponse ? (
                        <>
                          <div style={{ fontSize: '0.84rem', color: '#1E3A8A', lineHeight: 1.45 }}>
                            "{dispute.vendorResponse.explanation}"
                          </div>
                          {dispute.vendorResponse.evidence?.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                              <span style={{ fontSize: '0.72rem', color: '#60A5FA' }}>Merchant Evidence:</span>
                              {dispute.vendorResponse.evidence.map((ev, i) => (
                                <a key={i} href={ev.fileUrl} target="_blank" rel="noopener noreferrer">
                                  <img
                                    src={ev.fileUrl}
                                    alt="vendor proof"
                                    style={{ width: 34, height: 34, borderRadius: 4, objectFit: 'cover', border: '1px solid #93C5FD' }}
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                          <div style={{ fontSize: '0.72rem', color: '#93C5FD', marginTop: 8 }}>
                            Responded: {new Date(dispute.vendorResponse.respondedAt).toLocaleString('en-IN')}
                          </div>
                        </>
                      ) : (
                        <div style={{ fontSize: '0.82rem', color: '#701A75', fontStyle: 'italic', paddingTop: 8 }}>
                          ⏳ Merchant has not submitted an explanation yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Existing Admin Ruling Display */}
                  {dispute.adminResolution && (
                    <div style={{ marginTop: 14, background: dispute.status === 'Resolved' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${dispute.status === 'Resolved' ? '#BBF7D0' : '#FECACA'}`, borderRadius: 8, padding: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '0.85rem', color: dispute.status === 'Resolved' ? '#15803D' : '#991B1B' }}>
                        <ShieldCheck size={16} />
                        <span>Admin Decision: {dispute.adminResolution.decision} ({dispute.adminResolution.refundAction})</span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: dispute.status === 'Resolved' ? '#166534' : '#7F1D1D', marginTop: 3 }}>
                        {dispute.adminResolution.resolutionNote}
                      </div>
                    </div>
                  )}

                  {/* Audit Trail Count & Action Trigger */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Audit Trail: {dispute.auditTrail?.length || 1} logged events
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenAdjudicate(dispute)}
                      style={{
                        background: isClosed ? 'var(--surface-2)' : '#9333EA',
                        color: isClosed ? 'var(--text-primary)' : 'white',
                        borderColor: isClosed ? 'var(--border)' : '#9333EA',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Scale size={14} />
                      {isClosed ? 'Modify Admin Ruling & Audit' : 'Adjudicate & Resolve Dispute'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Admin Adjudication Modal ── */}
        {adjudicatingDispute && (
          <div className="modal-overlay" onClick={() => setAdjudicatingDispute(null)} style={{ zIndex: 1100 }}>
            <div
              className="modal"
              style={{
                maxWidth: '680px',
                width: '95vw',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '24px',
                borderRadius: '16px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    Admin Adjudication · #{adjudicatingDispute.disputeId}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Item: {adjudicatingDispute.item?.name} (₹{adjudicatingDispute.item?.price?.toLocaleString('en-IN')})
                  </div>
                </div>
                <button
                  onClick={() => setAdjudicatingDispute(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAdjudicateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Status Decision Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    1. Admin Ruling Decision:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { status: 'Resolved', label: 'Resolve in Customer Favor', color: '#16A34A', bg: '#DCFCE7' },
                      { status: 'Rejected', label: 'Reject / Uphold Merchant', color: '#DC2626', bg: '#FEE2E2' },
                      { status: 'Under Review', label: 'Keep Under Review', color: '#9333EA', bg: '#F3E8FF' },
                    ].map((opt) => {
                      const isSelected = resolutionStatus === opt.status;
                      return (
                        <button
                          key={opt.status}
                          type="button"
                          onClick={() => setResolutionStatus(opt.status)}
                          style={{
                            padding: '12px 10px',
                            borderRadius: 8,
                            border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--border)',
                            background: isSelected ? opt.bg : 'white',
                            color: isSelected ? opt.color : 'var(--text-primary)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Refund & Compensation Action (if resolving) */}
                {resolutionStatus === 'Resolved' && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: 12 }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6 }}>
                      2. Remediation / Compensation Action:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <select
                        className="form-control"
                        value={refundAction}
                        onChange={(e) => setRefundAction(e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      >
                        <option value="Full Refund">Full Refund to Customer</option>
                        <option value="Partial Refund">Partial Refund</option>
                        <option value="Replacement">Direct Merchant Physical Replacement</option>
                      </select>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Refund Amount (₹)"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        style={{ fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                )}

                {/* Resolution Note */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    3. Official Resolution Note (Visible to Customer & Vendor):
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Document the arbitration reasoning, verified packaging evidence findings, and courier confirmation..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    required
                    style={{ width: '100%', borderRadius: 8, padding: 10, fontSize: '0.86rem' }}
                  />
                </div>

                {/* Audit Trail Preview */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Chronological Case History:
                  </label>
                  <div style={{ maxHeight: 120, overflowY: 'auto', background: '#F1F5F9', borderRadius: 6, padding: 8, fontSize: '0.78rem' }}>
                    {adjudicatingDispute.auditTrail?.map((log, i) => (
                      <div key={i} style={{ marginBottom: 4 }}>
                        • <strong>{log.action}</strong> by {log.performedBy?.name} ({new Date(log.timestamp).toLocaleDateString('en-IN')}): {log.notes}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setAdjudicatingDispute(null)}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || resolutionNote.trim().length < 5}
                    style={{ background: '#9333EA', borderColor: '#9333EA' }}
                  >
                    {isSubmitting ? 'Recording Resolution...' : 'Apply Ruling & Append to Audit Trail'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
