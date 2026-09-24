import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar, ProductReviewCard } from './AdminDashboard';
import { Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import '../../styles/vendor.css';

/* ── Pending Products ─────────────────────── */
export function PendingProducts() {
  const { getPendingProducts, approveProduct, rejectProduct } = useProducts();
  const { addToast } = useToast();
  const pending = getPendingProducts();

  const handleApprove = (id) => { approveProduct(id); addToast('Product approved!', 'success'); };
  const handleReject  = (id) => { rejectProduct(id);  addToast('Product rejected', 'error'); };

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Clock size={20} color="#F59E0B" />
            <div className="vendor-topbar-title">Pending Products</div>
          </div>
          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 12px', borderRadius: 9999, fontWeight: 700, fontSize: '0.8rem' }}>
            {pending.length} awaiting review
          </span>
        </div>
        <div className="admin-content">
          {pending.length === 0 ? (
            <div className="empty-state card">
              <CheckCircle size={56} color="#10B981" />
              <h3>No pending products</h3>
              <p>All products have been reviewed</p>
            </div>
          ) : (
            pending.map((p) => (
              <ProductReviewCard key={p.id} product={p} onApprove={handleApprove} onReject={handleReject} showActions />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Approved Products ────────────────────── */
export function ApprovedProducts() {
  const { getApprovedProducts } = useProducts();
  const approved = getApprovedProducts();

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle size={20} color="#10B981" />
            <div className="vendor-topbar-title">Approved Products</div>
          </div>
          <span style={{ background: '#D1FAE5', color: '#065F46', padding: '4px 12px', borderRadius: 9999, fontWeight: 700, fontSize: '0.8rem' }}>
            {approved.length} live on marketplace
          </span>
        </div>
        <div className="admin-content">
          {approved.length === 0 ? (
            <div className="empty-state card">
              <Package size={56} className="empty-state-icon" />
              <h3>No approved products yet</h3>
            </div>
          ) : (
            approved.map((p) => (
              <ProductReviewCard key={p.id} product={p} onApprove={() => {}} onReject={() => {}} showActions={false} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Rejected Products ────────────────────── */
export function RejectedProducts() {
  const { getRejectedProducts, approveProduct } = useProducts();
  const { addToast } = useToast();
  const rejected = getRejectedProducts();

  const handleReApprove = (id) => { approveProduct(id); addToast('Product re-approved!', 'success'); };

  return (
    <div className="vendor-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <XCircle size={20} color="#EF4444" />
            <div className="vendor-topbar-title">Rejected Products</div>
          </div>
          <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '4px 12px', borderRadius: 9999, fontWeight: 700, fontSize: '0.8rem' }}>
            {rejected.length} rejected
          </span>
        </div>
        <div className="admin-content">
          {rejected.length === 0 ? (
            <div className="empty-state card">
              <Package size={56} className="empty-state-icon" />
              <h3>No rejected products</h3>
            </div>
          ) : (
            rejected.map((p) => (
              <div key={p.id}>
                <ProductReviewCard product={p} onApprove={handleReApprove} onReject={() => {}} showActions={false} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-14px 0 20px', paddingRight: 20 }}>
                  <button className="btn btn-success btn-sm" onClick={() => handleReApprove(p.id)}>
                    <CheckCircle size={14} /> Re-approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
