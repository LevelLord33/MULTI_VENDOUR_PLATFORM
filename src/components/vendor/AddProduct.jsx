import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar } from './VendorDashboard';
import { PlusCircle, Image, X, Plus } from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import '../../styles/vendor.css';

const INITIAL_FORM = {
  name: '', category: 'Electronics', price: '', description: '', quantity: '',
  brand: '', condition: 'New', images: [''],
  specifications: [{ key: '', value: '' }],
};

export default function AddProduct() {
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: '' }));
  };

  const handleImageChange = (idx, val) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm((p) => ({ ...p, images: imgs }));
  };

  const addImageField = () => setForm((p) => ({ ...p, images: [...p.images, ''] }));
  const removeImage = (idx) => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  const handleSpecChange = (idx, field, val) => {
    const specs = [...form.specifications];
    specs[idx][field] = val;
    setForm((p) => ({ ...p, specifications: specs }));
  };
  const addSpec = () => setForm((p) => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  const removeSpec = (idx) => setForm((p) => ({ ...p, specifications: p.specifications.filter((_, i) => i !== idx) }));

  const validate = () => {
    const errs = {};
    if (!form.name) errs.name = 'Product name required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) errs.price = 'Valid price required';
    if (!form.description) errs.description = 'Description required';
    if (!form.quantity || isNaN(form.quantity) || +form.quantity < 0) errs.quantity = 'Valid quantity required';
    if (!form.images[0]) errs.images = 'At least one image URL required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));

    // Build specs object
    const specifications = {};
    form.specifications.forEach(({ key, value }) => { if (key) specifications[key] = value; });

    addProduct({
      name: form.name,
      category: form.category,
      price: parseFloat(form.price),
      description: form.description,
      quantity: parseInt(form.quantity),
      brand: form.brand,
      condition: form.condition,
      images: form.images.filter(Boolean),
      specifications,
    }, user.id);

    setSaving(false);
    addToast('Product submitted for review!', 'success');
    navigate('/vendor/products');
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />
      <div className="vendor-main">
        <div className="vendor-topbar">
          <div className="vendor-topbar-title">Add New Product</div>
        </div>
        <div className="vendor-content">
          <div className="card" style={{ maxWidth: 900 }}>
            <div className="card-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.9rem' }}>
                Fill in the product details below. Your product will be reviewed by our admin team before appearing in the marketplace.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Basic Info */}
                <div className="product-form-grid">
                  <div className="form-group product-form-full">
                    <label className="form-label">Product Name *</label>
                    <input className={`form-input ${errors.name?'error':''}`} name="name" placeholder="e.g. Samsung Galaxy S24 Ultra" value={form.name} onChange={handleChange} />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select className="form-input form-select" name="category" value={form.category} onChange={handleChange}>
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Condition</label>
                    <select className="form-input form-select" name="condition" value={form.condition} onChange={handleChange}>
                      {['New', 'Used - Like New', 'Used - Good', 'Refurbished', 'N/A'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹) *</label>
                    <input className={`form-input ${errors.price?'error':''}`} name="price" type="number" min="0" placeholder="0.00" value={form.price} onChange={handleChange} />
                    {errors.price && <span className="form-error">{errors.price}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Available Quantity *</label>
                    <input className={`form-input ${errors.quantity?'error':''}`} name="quantity" type="number" min="0" placeholder="50" value={form.quantity} onChange={handleChange} />
                    {errors.quantity && <span className="form-error">{errors.quantity}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input className="form-input" name="brand" placeholder="Samsung, Apple, Nike..." value={form.brand} onChange={handleChange} />
                  </div>
                </div>

                {/* Description */}
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea className={`form-input form-textarea ${errors.description?'error':''}`} name="description" placeholder="Describe your product in detail..." value={form.description} onChange={handleChange} style={{ minHeight: 120 }} />
                  {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                {/* Images */}
                <div className="form-group">
                  <label className="form-label">Product Image URLs *</label>
                  {errors.images && <span className="form-error" style={{ marginBottom: 8, display: 'block' }}>{errors.images}</span>}
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                      <Image size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                      <input
                        className="form-input"
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                      />
                      {form.images.length > 1 && (
                        <button type="button" className="spec-remove-btn" onClick={() => removeImage(idx)}>
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addImageField}>
                    <Plus size={14} /> Add Image URL
                  </button>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    Tip: Use Unsplash URLs like https://images.unsplash.com/photo-...?w=600&h=600&fit=crop
                  </p>
                </div>

                {/* Specifications */}
                <div className="form-group">
                  <label className="form-label">Specifications</label>
                  {form.specifications.map((spec, idx) => (
                    <div key={idx} className="spec-row">
                      <input
                        className="form-input"
                        placeholder="Spec name (e.g. RAM)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                      />
                      <input
                        className="form-input"
                        placeholder="Value (e.g. 8 GB)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      />
                      <button type="button" className="spec-remove-btn" onClick={() => removeSpec(idx)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addSpec}>
                    <Plus size={14} /> Add Specification
                  </button>
                </div>

                {/* Submit */}
                <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? 'Submitting...' : <><PlusCircle size={18} /> Submit for Review</>}
                  </button>
                  <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate('/vendor/products')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
