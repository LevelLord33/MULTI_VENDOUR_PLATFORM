import { useState, useRef } from 'react';
import { useDisputes } from '../../contexts/DisputeContext';
import { useToast } from '../../contexts/ToastContext';
import {
  AlertTriangle, UploadCloud, X, Check, Image as ImageIcon,
  HelpCircle, ShieldAlert, FileText, ShoppingBag
} from 'lucide-react';
import '../../styles/marketplace.css';

const DISPUTE_CATEGORIES = [
  'Product not received',
  'Damaged product',
  'Wrong product',
  'Refund issue',
  'Other'
];

export default function DisputeModal({ order, preselectedItem = null, onClose, onSuccess }) {
  const { raiseDispute } = useDisputes();
  const { addToast } = useToast();

  const [selectedItemId, setSelectedItemId] = useState(
    preselectedItem?.productId || (order?.items?.length > 0 ? order.items[0].productId : '')
  );
  const [category, setCategory] = useState('Damaged product');
  const [description, setDescription] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const currentSelectedItem = order?.items?.find((it) => it.productId === selectedItemId) || order?.items?.[0];

  // Handle file / image upload
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

  const removeEvidence = (index) => {
    setEvidenceFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim() || description.trim().length < 10) {
      addToast('Please provide a descriptive explanation (minimum 10 characters).', 'error');
      return;
    }

    if (!currentSelectedItem) {
      addToast('Please select the order item under dispute.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const disputeData = {
        orderId: order.id,
        vendorId: currentSelectedItem.vendorId || order.vendorId || 'v1',
        vendorName: currentSelectedItem.vendorName || 'Merchant Partner',
        item: {
          productId: currentSelectedItem.productId,
          name: currentSelectedItem.name,
          price: currentSelectedItem.price,
          quantity: currentSelectedItem.quantity || 1,
          image: currentSelectedItem.image,
          sku: currentSelectedItem.sku,
        },
        category,
        description: description.trim(),
        evidence: evidenceFiles,
      };

      const result = await raiseDispute(disputeData);
      if (onSuccess) onSuccess(result);
      onClose();
    } catch (err) {
      addToast(err.message || 'Failed to submit dispute. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal"
        style={{
          maxWidth: '620px',
          width: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '24px',
          borderRadius: '16px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={20} color="#DC2626" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Raise an Order Dispute</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Order #{order?.id} · {order?.items?.length || 1} physical items
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Item Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
              1. Select Order Item to Dispute:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {order?.items?.map((it) => {
                const isSelected = selectedItemId === it.productId;
                return (
                  <label
                    key={it.productId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: isSelected ? '1.5px solid #4F46E5' : '1px solid var(--border)',
                      background: isSelected ? '#EEF2FF' : 'var(--surface-2)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <input
                      type="radio"
                      name="disputeItem"
                      checked={isSelected}
                      onChange={() => setSelectedItemId(it.productId)}
                      style={{ accentColor: '#4F46E5' }}
                    />
                    <img
                      src={it.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'}
                      alt={it.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 6, background: 'white' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {it.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        ₹{it.price?.toLocaleString('en-IN')} · Qty: {it.quantity} · {it.vendorName || 'Vendor'}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Dispute Category */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
              2. Dispute Category:
            </label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem' }}
            >
              {DISPUTE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                3. Detailed Description of the Issue:
              </label>
              <span style={{ fontSize: '0.75rem', color: description.length < 10 ? '#DC2626' : 'var(--text-muted)' }}>
                {description.length} / 1000 chars (min 10)
              </span>
            </div>
            <textarea
              className="form-control"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what went wrong with this item or delivery in detail. Include condition upon arrival, discrepancies with order, or missing parts..."
              maxLength={1000}
              style={{ width: '100%', borderRadius: 8, fontSize: '0.86rem', padding: '10px 12px' }}
              required
            />
          </div>

          {/* Evidence Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>
              4. Upload Photographic Evidence (Recommended):
            </label>

            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #CBD5E1',
                borderRadius: 10,
                padding: '18px',
                textAlign: 'center',
                cursor: 'pointer',
                background: '#F8FAFC',
                transition: 'all 0.2s',
              }}
            >
              <UploadCloud size={28} color="#64748B" style={{ margin: '0 auto 6px' }} />
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                Click to upload pictures of damaged packaging, shipping label, or incorrect product
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: 2 }}>
                Supported: JPG, PNG, WEBP (Max 5MB each)
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

            {/* Evidence Previews */}
            {evidenceFiles.length > 0 && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                {evidenceFiles.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: 72,
                      height: 72,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <img
                      src={file.fileUrl}
                      alt={file.fileName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeEvidence(idx)}
                      style={{
                        position: 'absolute',
                        top: 3,
                        right: 3,
                        background: 'rgba(239, 68, 68, 0.85)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.65rem',
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Dispute Protocol Alert */}
          <div style={{ background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: 8, padding: '10px 14px', fontSize: '0.8rem', color: '#3730A3', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <div>
              Once raised, the vendor is alerted immediately to submit their fulfillment proof. A neutral platform admin audits both submissions before arriving at a final resolution.
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || description.trim().length < 10}
              style={{ background: '#DC2626', borderColor: '#DC2626', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <AlertTriangle size={15} />
              {isSubmitting ? 'Submitting Dispute...' : 'Submit Dispute Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
