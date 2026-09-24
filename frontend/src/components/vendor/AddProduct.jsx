import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import { PlusCircle, Image, X, Plus, Package, Truck, ShieldCheck } from 'lucide-react';
import { CATEGORIES } from '../../data/seedData';
import '../../styles/vendor.css';

const INITIAL_FORM = {
  name: '',
  sku: '',
  category: 'Electronics',
  price: '',
  mrp: '',
  description: '',
  stock: '25',
  lowStockThreshold: '5',
  brand: '',
  condition: 'New',
  weight: '500 g',
  dispatchTime: 'Ships within 24 hours',
  returnWindowDays: '7',
  images: ['https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&h=600&fit=crop'],
  specifications: [{ key: 'Material', value: 'Standard Physical Build' }],
};

export default function AddProduct() {
  // 1. useContext hooks
  const { user } = useAuth();
  const { addProduct } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // 2. useState hooks
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // 3. useRef hook
  const nameInputRef = useRef(null);

  // 4. useEffect hooks
  useEffect(() => {
    document.title = 'Add Physical Product SKU | Vendor Hub';
  }, []);

  // 5. useMemo hooks
  const categoriesList = useMemo(() => {
    return CATEGORIES.filter((c) => c !== 'All');
  }, []);

  const calculatedDiscount = useMemo(() => {
    const price = parseFloat(form.price);
    const mrp = parseFloat(form.mrp);
    if (!price || !mrp || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  }, [form.price, form.mrp]);

  // 6. useCallback hooks
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '' }));
  }, []);

  const handleImageChange = useCallback((idx, val) => {
    setForm((p) => {
      const imgs = [...p.images];
      imgs[idx] = val;
      return { ...p, images: imgs };
    });
  }, []);

  const addImageField = useCallback(() => {
    setForm((p) => ({ ...p, images: [...p.images, ''] }));
  }, []);

  const removeImage = useCallback((idx) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  }, []);

  const handleSpecChange = useCallback((idx, field, val) => {
    setForm((p) => {
      const specs = [...p.specifications];
      specs[idx][field] = val;
      return { ...p, specifications: specs };
    });
  }, []);

  const addSpec = useCallback(() => {
    setForm((p) => ({ ...p, specifications: [...p.specifications, { key: '', value: '' }] }));
  }, []);

  const removeSpec = useCallback((idx) => {
    setForm((p) => ({ ...p, specifications: p.specifications.filter((_, i) => i !== idx) }));
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Physical product title required';
    if (!form.price || isNaN(form.price) || +form.price <= 0) errs.price = 'Valid selling price required';
    if (!form.stock || isNaN(form.stock) || +form.stock < 0) errs.stock = 'Valid stock count required';
    if (!form.description.trim()) errs.description = 'Product description required';
    if (!form.images[0]) errs.images = 'At least one image URL required';
    return errs;
  }, [form]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      if (errs.name && nameInputRef.current) nameInputRef.current.focus();
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));

    // Build specs object
    const specifications = {};
    form.specifications.forEach(({ key, value }) => {
      if (key && value) specifications[key] = value;
    });

    const parsedPrice = parseFloat(form.price);
    const parsedStock = parseInt(form.stock, 10) || 0;
    const generatedSku = form.sku.trim() || `VM-${form.category.slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newProductData = {
      name: form.name.trim(),
      sku: generatedSku,
      category: form.category,
      price: parsedPrice,
      mrp: form.mrp ? parseFloat(form.mrp) : Math.round(parsedPrice * 1.25),
      discountPercent: calculatedDiscount || 20,
      description: form.description.trim(),
      quantity: parsedStock,
      stock: parsedStock,
      lowStockThreshold: parseInt(form.lowStockThreshold, 10) || 5,
      brand: form.brand.trim() || 'Verified Store Brand',
      condition: form.condition,
      images: form.images.filter(Boolean),
      specifications,
      shipping: {
        weight: form.weight || '500 g',
        dispatchTime: form.dispatchTime || 'Ships within 24 hours',
        estimatedDays: '2 - 4 business days',
        courierPartners: ['BlueDart Express', 'Delhivery Surface'],
        codAvailable: true,
        returnWindowDays: parseInt(form.returnWindowDays, 10) || 7,
      },
      variants: {
        colors: [
          { name: 'Standard Edition', hex: '#3B82F6', inStock: true },
          { name: 'Dark Metallic', hex: '#1F2937', inStock: true }
        ],
        options: [
          { label: 'Standard', priceDelta: 0, stock: parsedStock }
        ],
        customization: {
          allowEngraving: false,
          allowGiftWrap: true,
          giftWrapPrice: 99,
          warrantyPlans: [
            { label: 'Standard 1-Year Warranty', price: 0 }
          ]
        }
      },
      reviews: [],
      inquiries: []
    };

    addProduct(newProductData, user?.id || 'v1');
    setSaving(false);
    addToast(`Physical SKU ${generatedSku} created and submitted for catalog review!`, 'success');
    navigate('/vendor/products');
  }, [validate, form, calculatedDiscount, addProduct, user, navigate, addToast]);

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Add Physical SKU Listing</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Configure physical attributes, warehouse stock, shipping weight, and variants
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <VendorThemeToggle />
          </div>
        </div>

        <div className="vendor-content">
          <div className="card" style={{ maxWidth: 960 }}>
            <div className="card-body">
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* 1. Core Physical Identity */}
                <div>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                    <Package size={18} /> Physical Item Identity & SKU
                  </h4>

                  <div className="product-form-grid">
                    <div className="form-group product-form-full">
                      <label className="form-label">Physical Product Name / Title *</label>
                      <input
                        ref={nameInputRef}
                        className={`form-input ${errors.name ? 'error' : ''}`}
                        name="name"
                        placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                        value={form.name}
                        onChange={handleChange}
                      />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Custom SKU Code (Optional)</label>
                      <input
                        className="form-input"
                        name="sku"
                        placeholder="e.g. VM-AUDIO-SONY-01 (or auto-generates)"
                        value={form.sku}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-input form-select" name="category" value={form.category} onChange={handleChange}>
                        {categoriesList.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Brand / Manufacturer</label>
                      <input
                        className="form-input"
                        name="brand"
                        placeholder="e.g. Sony, Samsung, Nike..."
                        value={form.brand}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Physical Condition</label>
                      <select className="form-input form-select" name="condition" value={form.condition} onChange={handleChange}>
                        {['New', 'Brand New Sealed Box', 'Refurbished - Grade A', 'Open Box Verified'].map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* 2. Pricing & Warehouse Inventory */}
                <div>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                    ₹ Pricing & Warehouse Stock
                  </h4>

                  <div className="product-form-grid">
                    <div className="form-group">
                      <label className="form-label">Selling Price (₹) *</label>
                      <input
                        className={`form-input ${errors.price ? 'error' : ''}`}
                        name="price"
                        type="number"
                        min="0"
                        placeholder="e.g. 29990"
                        value={form.price}
                        onChange={handleChange}
                      />
                      {errors.price && <span className="form-error">{errors.price}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Maximum Retail Price / MRP (₹)</label>
                      <input
                        className="form-input"
                        name="mrp"
                        type="number"
                        min="0"
                        placeholder="e.g. 34990"
                        value={form.mrp}
                        onChange={handleChange}
                      />
                      {calculatedDiscount > 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600, marginTop: 4 }}>
                          ✓ Shows {calculatedDiscount}% OFF on marketplace card
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Physical Warehouse Units in Stock *</label>
                      <input
                        className={`form-input ${errors.stock ? 'error' : ''}`}
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="25"
                        value={form.stock}
                        onChange={handleChange}
                      />
                      {errors.stock && <span className="form-error">{errors.stock}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Low-Stock Safety Alert At (Units)</label>
                      <input
                        className="form-input"
                        name="lowStockThreshold"
                        type="number"
                        min="1"
                        placeholder="5"
                        value={form.lowStockThreshold}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* 3. Logistics & Physical Shipping */}
                <div>
                  <h4 style={{ margin: '0 0 14px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)' }}>
                    <Truck size={18} /> Logistics & Courier Fulfillment Details
                  </h4>

                  <div className="product-form-grid">
                    <div className="form-group">
                      <label className="form-label">Package Dead Weight (e.g. 650 g)</label>
                      <input
                        className="form-input"
                        name="weight"
                        placeholder="e.g. 450 g or 1.2 kg"
                        value={form.weight}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Dispatch Timeframe</label>
                      <select className="form-input form-select" name="dispatchTime" value={form.dispatchTime} onChange={handleChange}>
                        <option>Ships within 24 hours</option>
                        <option>Same day dispatch (Before 2 PM)</option>
                        <option>Ships in 1 - 2 business days</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Physical Return Window (Days)</label>
                      <select className="form-input form-select" name="returnWindowDays" value={form.returnWindowDays} onChange={handleChange}>
                        <option value="7">7 Days Replacement / Return</option>
                        <option value="10">10 Days Replacement / Return</option>
                        <option value="14">14 Days Replacement / Return</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="divider" />

                {/* 4. Description */}
                <div className="form-group">
                  <label className="form-label">Detailed Physical Description *</label>
                  <textarea
                    className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
                    name="description"
                    placeholder="Describe product build, physical materials, inbox contents, authenticity, and warranty coverage..."
                    value={form.description}
                    onChange={handleChange}
                    style={{ minHeight: 110 }}
                  />
                  {errors.description && <span className="form-error">{errors.description}</span>}
                </div>

                {/* 5. Images */}
                <div className="form-group">
                  <label className="form-label">Product Photographs (URLs) *</label>
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
                    <Plus size={14} /> Add Another Photograph
                  </button>
                </div>

                {/* 6. Specifications */}
                <div className="form-group">
                  <label className="form-label">Physical & Technical Specifications</label>
                  {form.specifications.map((spec, idx) => (
                    <div key={idx} className="spec-row">
                      <input
                        className="form-input"
                        placeholder="Spec attribute (e.g. Dimensions / Connectivity)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                      />
                      <input
                        className="form-input"
                        placeholder="Value (e.g. 15 x 8 x 2 cm / Bluetooth 5.3)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                      />
                      <button type="button" className="spec-remove-btn" onClick={() => removeSpec(idx)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={addSpec}>
                    <Plus size={14} /> Add Specification Row
                  </button>
                </div>

                {/* Submit Buttons */}
                <div style={{ display: 'flex', gap: 12, paddingTop: 12 }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                    {saving ? 'Creating SKU Listing...' : <><PlusCircle size={18} /> Submit Physical Product Listing</>}
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
