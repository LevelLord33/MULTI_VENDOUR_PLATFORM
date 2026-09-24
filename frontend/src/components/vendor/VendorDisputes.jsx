import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDisputes } from '../../contexts/DisputeContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  AlertTriangle, CheckCircle, Clock, XCircle, Store, Send,
  UploadCloud, X, Search, Filter, ShieldAlert, FileText, Image as ImageIcon
} from 'lucide-react';
import '../../styles/vendor.css';

const STATUS_TABS = ['All', 'Open', 'Under Review', 'Vendor Responded', 'Resolved', 'Rejected'];

export default function VendorDisputes() {
  const { user } = useAuth();
  const { getDisputesByVendor, submitVendorResponse } = useDisputes();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Response Modal state
  const [respondingDispute, setRespondingDispute] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    document.title = 'Merchant Disputes & Resolution | Vendor Hub';
  }, []);

  // Strict vendor isolation: only fetch disputes for logged-in vendor
  const vendorDisputes = useMemo(() => {
    if (!user?.id) return [];
    return getDisputesByVendor(user.id);
  }, [user, getDisputesByVendor]);

  // Filtered by tab and search
  const filteredDisputes = useMemo(() => {
    return vendorDisputes.filter((d) => {
      const matchesTab = activeTab === 'All' ? true : d.status === activeTab;
      const matchesSearch =
        d.disputeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.item?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [vendorDisputes, activeTab, searchQuery]);

  // Status Metrics
  const metrics = useMemo(() => {
    const total = vendorDisputes.length;
    const awaitingResponse = vendorDisputes.filter((d) => d.status === 'Open' || d.status === 'Under Review').length;
    const responded = vendorDisputes.filter((d) => d.status === 'Vendor Responded').length;
    const resolved = vendorDisputes.filter((d) => d.status === 'Resolved').length;
    return { total, awaitingResponse, responded, resolved };
  }, [vendorDisputes]);

  const handleOpenResponseModal = (dispute) => {
    setRespondingDispute(dispute);
    setExplanation(dispute.vendorResponse?.explanation || '');
    setEvidenceFiles(dispute.vendorResponse?.evidence || []);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        addToast(`File "${file.name}" exceeds 5MB limit.`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setEvidenceFiles((prev) => [
          ...prev,
          {
            fileName: file.name,
            fileUrl: uploadEvent.target.result,
            fileType: file.type,
            fileSize: file.size,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResponseSubmit = async (e) => {
    e.preventDefault();
    if (!explanation.trim() || explanation.trim().length < 10) {
      addToast('Please provide a descriptive explanation (at least 10 characters).', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVendorResponse(respondingDispute.disputeId, {
        explanation: explanation.trim(),
        evidence: evidenceFiles,
      });
      setRespondingDispute(null);
    } catch (err) {
      addToast(err.message || 'Failed to submit response.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <main className="vendor-main">
        {/* Header */}
        <div className="vendor-topbar">
          <div>
            <h1 className="vendor-page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AlertTriangle size={24} color="#D97706" />
              Store Disputes & Claims Management
            </h1>
            <p className="vendor-page-subtitle">
              Review and respond to customer-raised product discrepancies and delivery claims.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content">

        {/* Metrics Row */}
        <div className="metrics-grid" style={{ marginBottom: 24 }}>
          <div className="metric-card">
            <div className="metric-label">Total Disputes</div>
            <div className="metric-value">{metrics.total}</div>
            <div className="metric-sub">Across all store orders</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="metric-label">Action Required</div>
            <div className="metric-value" style={{ color: '#D97706' }}>
              {metrics.awaitingResponse}
            </div>
            <div className="metric-sub">Awaiting vendor explanation</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #3B82F6' }}>
            <div className="metric-label">Response Submitted</div>
            <div className="metric-value" style={{ color: '#2563EB' }}>
              {metrics.responded}
            </div>
            <div className="metric-sub">Under admin adjudication</div>
          </div>
          <div className="metric-card" style={{ borderLeft: '4px solid #10B981' }}>
            <div className="metric-label">Resolved Claims</div>
            <div className="metric-value" style={{ color: '#16A34A' }}>
              {metrics.resolved}
            </div>
            <div className="metric-sub">Successfully closed cases</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="card" style={{ padding: 18, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Full-width Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search disputes by dispute ID, order ID, product name, customer claim, or vendor explanation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 42, height: 42, fontSize: '0.875rem' }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: 4 }}>
              Filter by Status:
            </span>
            {STATUS_TABS.map((tab) => {
              const count = tab === 'All' ? vendorDisputes.length : vendorDisputes.filter((d) => d.status === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`btn btn-sm ${isActive ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    borderRadius: 20,
                    fontSize: '0.8rem',
                    padding: '6px 14px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Disputes List */}
        {filteredDisputes.length === 0 ? (
          <div className="empty-state" style={{ background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)', padding: 48 }}>
            <div className="empty-state-icon"><CheckCircle size={48} color="#10B981" /></div>
            <h3>No disputes found in this category</h3>
            <p>Your store has maintained excellent customer fulfillment with no active claims here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredDisputes.map((dispute) => {
              const isResolved = dispute.status === 'Resolved' || dispute.status === 'Rejected';
              const hasResponded = !!dispute.vendorResponse;

              return (
                <div
                  key={dispute.disputeId}
                  style={{
                    background: 'var(--surface)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    padding: 20,
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 14 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
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
                      Order ID: <strong>#{dispute.orderId}</strong> · Raised: {new Date(dispute.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Body Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 2fr', gap: 20 }}>
                    {/* Item Info */}
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <img
                        src={dispute.item?.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=120&h=120&fit=crop'}
                        alt={dispute.item?.name}
                        style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{dispute.item?.name}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          SKU: {dispute.item?.sku || 'VM-SKU'} · Qty: {dispute.item?.quantity || 1}
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--primary)', marginTop: 4 }}>
                          ₹{dispute.item?.price?.toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4 }}>
                          Customer: <strong>{dispute.customerName}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Customer Claim & Vendor Status */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Customer Claim:
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#334155', background: '#F8FAFC', padding: 10, borderRadius: 6, lineHeight: 1.4, border: '1px solid #E2E8F0' }}>
                        "{dispute.description}"
                      </div>

                      {/* Customer evidence preview */}
                      {dispute.evidence?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Customer Proof:</span>
                          {dispute.evidence.map((ev, i) => (
                            <a key={i} href={ev.fileUrl} target="_blank" rel="noopener noreferrer">
                              <img
                                src={ev.fileUrl}
                                alt={ev.fileName}
                                style={{ width: 36, height: 36, borderRadius: 4, objectFit: 'cover', border: '1px solid #CBD5E1' }}
                              />
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Current Vendor Response (if any) */}
                      {hasResponded && (
                        <div style={{ marginTop: 12, background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 6, padding: 10 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1E40AF', marginBottom: 2 }}>
                            Your Submitted Merchant Explanation:
                          </div>
                          <div style={{ fontSize: '0.83rem', color: '#1E3A8A' }}>
                            {dispute.vendorResponse.explanation}
                          </div>
                          {dispute.vendorResponse.evidence?.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                              {dispute.vendorResponse.evidence.map((ev, i) => (
                                <img
                                  key={i}
                                  src={ev.fileUrl}
                                  alt="proof"
                                  style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'cover', border: '1px solid #93C5FD' }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Admin Resolution (if any) */}
                      {dispute.adminResolution && (
                        <div style={{ marginTop: 12, background: dispute.status === 'Resolved' ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${dispute.status === 'Resolved' ? '#BBF7D0' : '#FECACA'}`, borderRadius: 6, padding: 10 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: dispute.status === 'Resolved' ? '#15803D' : '#991B1B' }}>
                            Admin Ruling: {dispute.adminResolution.decision}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: dispute.status === 'Resolved' ? '#166534' : '#7F1D1D', marginTop: 2 }}>
                            {dispute.adminResolution.resolutionNote}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    {!isResolved && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenResponseModal(dispute)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Send size={14} />
                        {hasResponded ? 'Update Merchant Response' : 'Submit Vendor Explanation & Evidence'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Vendor Response Modal ── */}
        {respondingDispute && (
          <div className="modal-overlay" onClick={() => setRespondingDispute(null)} style={{ zIndex: 1100 }}>
            <div
              className="modal"
              style={{
                maxWidth: '600px',
                width: '95vw',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '24px',
                borderRadius: '16px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                    Vendor Response for Dispute #{respondingDispute.disputeId}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Item: {respondingDispute.item?.name}
                  </div>
                </div>
                <button
                  onClick={() => setRespondingDispute(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleResponseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Merchant Explanation & Fulfillment Audit:
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Provide details regarding pre-dispatch testing, barcode packaging records, courier pickup handover timestamps, or return/replacement willingness..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    required
                    style={{ width: '100%', borderRadius: 8, padding: 10, fontSize: '0.86rem' }}
                  />
                </div>

                {/* Evidence Upload */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6 }}>
                    Upload Merchant Proof (Manifest, CCTV Packaging Clip, Weighing Slip):
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed #CBD5E1',
                      borderRadius: 8,
                      padding: 16,
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: '#F8FAFC',
                    }}
                  >
                    <UploadCloud size={24} color="#64748B" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155' }}>
                      Click to attach merchant fulfillment photos or courier proof
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </div>

                  {evidenceFiles.length > 0 && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10 }}>
                      {evidenceFiles.map((f, idx) => (
                        <div key={idx} style={{ position: 'relative', width: 64, height: 64, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          <img src={f.fileUrl} alt="evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => setEvidenceFiles((prev) => prev.filter((_, i) => i !== idx))}
                            style={{
                              position: 'absolute', top: 2, right: 2, background: 'rgba(239, 68, 68, 0.85)',
                              border: 'none', color: 'white', borderRadius: '50%', width: 16, height: 16,
                              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.65rem'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setRespondingDispute(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || explanation.trim().length < 10}>
                    {isSubmitting ? 'Submitting...' : 'Submit Official Response'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
