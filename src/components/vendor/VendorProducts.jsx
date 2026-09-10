import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar } from './VendorDashboard';
import { Edit2, Trash2, Package, PlusCircle, CheckCircle, Clock, XCircle, Save } from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import '../../styles/vendor.css';

export default function VendorProducts() {
  const { user } = useAuth();
  const { getVendorProducts, deleteProduct, editProduct, updateStock } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const products = getVendorProducts(user.id);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [stockEditing, setStockEditing] = useState({});

  const STATUS_ICON = {
    approved: <CheckCircle size={14} color="#10B981" />,
    pending:  <Clock size={14} color="#F59E0B" />,
    rejected: <XCircle size={14} color="#EF4444" />,
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
      condition: product.condition,
      brand: product.brand || '',
    });
  };

  const saveEdit = (id) => {
    editProduct(id, {
      ...editForm,
      price: parseFloat(editForm.price),
      status: 'pending', // reset to pending after edit
    });
    setEditingId(null);
    addToast('Product updated — resubmitted for review', 'success');
  };

  const confirmDelete = (id) => {
    deleteProduct(id);
    setDeleteId(null);
    addToast('Product deleted', 'info');
  };

  const saveStock = (id) => {
    const qty = stockEditing[id];
    if (qty !== undefined) {
      updateStock(id, qty);
      setStockEditing((p) => { const n = { ...p }; delete n[id]; return n; });
      addToast('Stock updated!', 'success');
    }
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />
      <div className="vendor-main">
        <div className="vendor-topbar">
          <div className="vendor-topbar-title">My Products</div>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/vendor/add-product')}>
            <PlusCircle size={15} /> Add Product
          </button>
        </div>

        <div className="vendor-content">
          {products.length === 0 ? (
            <div className="empty-state card">
              <Package size={56} className="empty-state-icon" />
              <h3>No products yet</h3>
              <p>Add your first product to start selling</p>
              <button className="btn btn-primary" onClick={() => navigate('/vendor/add-product')}>
                <PlusCircle size={16} /> Add Product
              </button>
            </div>
          ) : (
            <div className="card" style={{ overflow: 'visible' }}>
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <>
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="product-table-img"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                            />
                            <div>
                              <div className="product-table-name">{product.name}</div>
                              {product.brand && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{product.brand}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-primary">{product.category}</span>
                        </td>
                        <td style={{ fontWeight: 700 }}>₹{product.price.toLocaleString('en-IN')}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              className="stock-input"
                              type="number"
                              min="0"
                              value={stockEditing[product.id] !== undefined ? stockEditing[product.id] : product.quantity}
                              onChange={(e) => setStockEditing((p) => ({ ...p, [product.id]: e.target.value }))}
                            />
                            {stockEditing[product.id] !== undefined && (
                              <button className="btn btn-success btn-sm" onClick={() => saveStock(product.id)}>
                                <Save size={12} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className={`badge badge-${product.status}`} style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                            {STATUS_ICON[product.status]} {product.status}
                          </div>
                        </td>
                        <td>
                          <div className="product-table-actions">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => startEdit(product)}
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => setDeleteId(product.id)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Inline edit row */}
                      {editingId === product.id && (
                        <tr key={`edit-${product.id}`}>
                          <td colSpan={6} style={{ padding: '16px 20px', background: '#F8F7FF', borderTop: '2px solid var(--primary-light)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                              <div className="form-group">
                                <label className="form-label">Name</label>
                                <input className="form-input" value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Price (₹)</label>
                                <input className="form-input" type="number" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Category</label>
                                <select className="form-input form-select" value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}>
                                  {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c}>{c}</option>)}
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">Brand</label>
                                <input className="form-input" value={editForm.brand} onChange={(e) => setEditForm((p) => ({ ...p, brand: e.target.value }))} />
                              </div>
                              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label className="form-label">Description</label>
                                <textarea className="form-input form-textarea" value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} style={{ minHeight: 80 }} />
                              </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn btn-primary btn-sm" onClick={() => saveEdit(product.id)}>
                                <Save size={14} /> Save Changes
                              </button>
                              <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
                              ⚠️ Editing will resubmit this product for admin review
                            </p>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: 400 }}>
            <div style={{ textAlign: 'center', padding: '8px 0 20px' }}>
              <div style={{ width: 60, height: 60, background: '#FEE2E2', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Trash2 size={28} color="var(--danger)" />
              </div>
              <h3>Delete Product?</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>
                This action cannot be undone. The product will be permanently removed.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-danger btn-full" onClick={() => confirmDelete(deleteId)}>
                Delete Product
              </button>
              <button className="btn btn-ghost btn-full" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
