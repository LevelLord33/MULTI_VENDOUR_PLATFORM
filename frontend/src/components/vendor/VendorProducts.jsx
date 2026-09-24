import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  Edit2, Trash2, Package, PlusCircle, CheckCircle, Clock,
  XCircle, Save, AlertTriangle, HelpCircle, MessageSquare, Send, X, Plus, Box
} from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import '../../styles/vendor.css';

export default function VendorProducts() {
  // 1. useContext hooks
  const { user } = useAuth();
  const { getVendorProducts, deleteProduct, editProduct, updateStock, answerProductInquiry } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // 2. useState hooks
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [stockEditing, setStockEditing] = useState({});

  // Inquiries Modal state
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [answersState, setAnswersState] = useState({});

  // 3. useRef hook
  const editInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    document.title = 'Inventory & SKU Management | Vendor Hub';
  }, []);

  // 5. useMemo hooks
  const products = useMemo(() => {
    return user?.id ? getVendorProducts(user.id) : [];
  }, [user, getVendorProducts]);

  const STATUS_ICON = useMemo(() => ({
    approved: <CheckCircle size={14} color="#10B981" />,
    pending:  <Clock size={14} color="#F59E0B" />,
    rejected: <XCircle size={14} color="#EF4444" />,
  }), []);

  // 6. useCallback hooks
  const startEdit = useCallback((product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      sku: product.sku || '',
      description: product.description,
      category: product.category,
      condition: product.condition || 'New',
      brand: product.brand || '',
      lowStockThreshold: product.lowStockThreshold || 5,
    });
  }, []);

  const saveEdit = useCallback((id) => {
    editProduct(id, {
      ...editForm,
      price: parseFloat(editForm.price),
      lowStockThreshold: parseInt(editForm.lowStockThreshold, 10) || 5,
      status: 'pending', // re-submits for admin review
    });
    setEditingId(null);
    addToast('Product details updated — submitted for review', 'success');
  }, [editForm, editProduct, addToast]);

  const confirmDelete = useCallback((id) => {
    deleteProduct(id);
    setDeleteId(null);
    addToast('Product SKU removed from inventory', 'info');
  }, [deleteProduct, addToast]);

  const saveStock = useCallback((id) => {
    const qty = stockEditing[id];
    if (qty !== undefined) {
      const parsed = Math.max(0, parseInt(qty, 10) || 0);
      updateStock(id, parsed);
      setStockEditing((p) => { const n = { ...p }; delete n[id]; return n; });
      addToast(`Warehouse stock updated to ${parsed} units!`, 'success');
    }
  }, [stockEditing, updateStock, addToast]);

  const quickReplenish = useCallback((id, currentVal, addAmount) => {
    const nextVal = Math.max(0, currentVal + addAmount);
    updateStock(id, nextVal);
    addToast(`Restocked +${addAmount} units! New stock: ${nextVal}`, 'success');
  }, [updateStock, addToast]);

  const openInquiries = useCallback((product) => {
    setInquiryProduct(product);
    setAnswersState({});
  }, []);

  const handleAnswerSubmit = useCallback((inquiryId) => {
    const text = answersState[inquiryId];
    if (!text || !text.trim() || !inquiryProduct) return;

    answerProductInquiry(inquiryProduct.id, inquiryId, text.trim());
    addToast('Answer published to the public product listing!', 'success');
    setAnswersState((prev) => ({ ...prev, [inquiryId]: '' }));

    // Update the local modal's view of this product's inquiries
    setInquiryProduct((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        inquiries: (prev.inquiries || []).map((q) =>
          q.id === inquiryId
            ? { ...q, answer: text.trim(), answeredAt: new Date().toISOString().split('T')[0] }
            : q
        ),
      };
    });
  }, [answersState, inquiryProduct, answerProductInquiry, addToast]);

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        {/* Topbar */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Physical Inventory & SKUs</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Manage warehouse stock, quick replenish quantities, and answer customer product questions
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/vendor/inventory')}>
              <Box size={15} /> Smart Inventory Hub
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/vendor/add-product')}>
              <PlusCircle size={15} /> Add New SKU
            </button>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content">
          {products.length === 0 ? (
            <div className="empty-state card" style={{ padding: 48 }}>
              <Package size={56} className="empty-state-icon" />
              <h3>No Inventory SKUs Listed Yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
                List your physical store products with variant colors, sizes, and warehouse stock levels.
              </p>
              <button className="btn btn-primary" onClick={() => navigate('/vendor/add-product')}>
                <PlusCircle size={16} /> Add Product Listing
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflowX: 'auto' }}>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product & SKU</th>
                    <th>Category</th>
                    <th>Price & MRP</th>
                    <th>Stock Units</th>
                    <th>Customer Q&A</th>
                    <th>Review Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const currentStock = product.stock != null ? product.stock : (product.quantity || 0);
                    const threshold = product.lowStockThreshold || 5;
                    const isLow = currentStock <= threshold;
                    const inquiriesCount = product.inquiries?.length || 0;
                    const unansweredCount = product.inquiries?.filter((q) => !q.answer).length || 0;

                    return (
                      <tr key={product.id}>
                        {/* Product & SKU */}
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="product-table-img"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                            />
                            <div>
                              <div className="product-table-name" style={{ fontWeight: 600 }}>
                                {product.name}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, fontSize: '0.72rem' }}>
                                <code style={{ background: 'var(--surface-2)', padding: '1px 5px', borderRadius: 4, fontFamily: 'monospace' }}>
                                  {product.sku || 'VM-SKU'}
                                </code>
                                {product.brand && <span style={{ color: 'var(--text-muted)' }}>{product.brand}</span>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td>
                          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td>
                          <div style={{ fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</div>
                          {product.mrp && product.mrp > product.price && (
                            <div style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                              ₹{product.mrp.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        {/* Live Stock & Quick Replenish */}
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <input
                                className="stock-input"
                                type="number"
                                min="0"
                                value={stockEditing[product.id] !== undefined ? stockEditing[product.id] : currentStock}
                                onChange={(e) => setStockEditing((p) => ({ ...p, [product.id]: e.target.value }))}
                                style={{ width: 68 }}
                              />
                              {stockEditing[product.id] !== undefined && (
                                <button
                                  className="btn btn-success btn-sm"
                                  title="Save Stock"
                                  onClick={() => saveStock(product.id)}
                                >
                                  <Save size={13} />
                                </button>
                              )}
                              <button
                                type="button"
                                className="btn btn-outline btn-sm"
                                style={{ padding: '3px 6px', fontSize: '0.72rem' }}
                                title="Quick Restock +10"
                                onClick={() => quickReplenish(product.id, currentStock, 10)}
                              >
                                +10
                              </button>
                            </div>

                            {/* Low Stock Warning Pill */}
                            {isLow && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#DC2626', fontSize: '0.72rem', fontWeight: 700 }}>
                                <AlertTriangle size={12} /> Low Stock (≤{threshold})
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Q&A Inquiries */}
                        <td>
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => openInquiries(product)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}
                          >
                            <HelpCircle size={14} />
                            <span>{inquiriesCount} Q&A</span>
                            {unansweredCount > 0 && (
                              <span style={{ background: '#EF4444', color: 'white', borderRadius: '50%', width: 18, height: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800 }}>
                                {unansweredCount}
                              </span>
                            )}
                          </button>
                        </td>

                        {/* Status */}
                        <td>
                          <div className={`badge badge-${product.status}`} style={{ display: 'inline-flex', gap: 4, alignItems: 'center', fontSize: '0.75rem' }}>
                            {STATUS_ICON[product.status]} {product.status}
                          </div>
                        </td>

                        {/* Actions */}
                        <td>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Edit Details"
                              onClick={() => startEdit(product)}
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm"
                              title="Delete SKU"
                              style={{ color: 'var(--danger)' }}
                              onClick={() => setDeleteId(product.id)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT PRODUCT MODAL ── */}
      {editingId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 520, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Edit Product SKU</h3>
              <button onClick={() => setEditingId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>Product Title:</label>
                <input
                  ref={editInputRef}
                  type="text"
                  className="form-control"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>SKU Code:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.sku}
                    onChange={(e) => setEditForm((p) => ({ ...p, sku: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>Brand:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editForm.brand}
                    onChange={(e) => setEditForm((p) => ({ ...p, brand: e.target.value }))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>Price (₹):</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.price}
                    onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>Low Stock Alert At:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editForm.lowStockThreshold}
                    onChange={(e) => setEditForm((p) => ({ ...p, lowStockThreshold: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: 2 }}>Description:</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={() => saveEdit(editingId)}>
                  Save & Resubmit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CUSTOMER Q&A INQUIRIES MODAL ── */}
      {inquiryProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 560, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Product Questions & Answers</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  SKU: {inquiryProduct.sku} · {inquiryProduct.name}
                </div>
              </div>
              <button onClick={() => setInquiryProduct(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {!inquiryProduct.inquiries || inquiryProduct.inquiries.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)', background: 'var(--surface-2)', borderRadius: 8 }}>
                  No questions asked yet for this SKU.
                </div>
              ) : (
                inquiryProduct.inquiries.map((q) => (
                  <div key={q.id} style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>
                      Q: {q.question}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                      Asked by {q.customerName} on {q.date}
                    </div>

                    {q.answer ? (
                      <div style={{ padding: 10, background: '#DCFCE7', borderRadius: 6, fontSize: '0.85rem', color: '#14532D', borderLeft: '3px solid #10B981' }}>
                        <strong>Your Published Answer:</strong> {q.answer}
                        <div style={{ fontSize: '0.7rem', color: '#166534', marginTop: 2 }}>
                          Answered on {q.answeredAt || 'today'}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                        <input
                          type="text"
                          className="form-control"
                          style={{ fontSize: '0.85rem' }}
                          placeholder="Type seller response..."
                          value={answersState[q.id] || ''}
                          onChange={(e) => setAnswersState((prev) => ({ ...prev, [q.id]: e.target.value }))}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAnswerSubmit(q.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <Send size={13} /> Publish
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}>
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', maxWidth: 400, width: '100%', padding: 24, boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.15rem' }}>Confirm SKU Deletion</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 18px 0' }}>
              Are you sure you want to permanently delete this product from your physical store inventory?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => confirmDelete(deleteId)}>Delete SKU</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
