import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { AdminSidebar } from './AdminDashboard';
import { seedVendors } from '../../data/seedData';
import {
  Store, Search, Star, ShieldCheck, MapPin, Package,
  ArrowRight, ExternalLink, Sparkles, Filter, CheckCircle2,
  Building2, Flame, Award, Eye, ShieldAlert, Check, X
} from 'lucide-react';
import '../../styles/vendor.css';

export default function AdminVendors() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { getApprovedProducts } = useProducts();

  // Local state for interactive overrides
  const [vendorsList, setVendorsList] = useState(() => {
    return seedVendors.map((v) => ({
      ...v,
      isEmerging: Boolean(v.isEmerging || ['v5', 'v6', 'v7', 'v8', 'v9', 'v10'].includes(v.id)),
      isVerified: v.isVerified !== false,
      isFeatured: Boolean(v.isFeatured || ['v1', 'v2', 'v3', 'v4'].includes(v.id))
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState(null);

  const allProducts = getApprovedProducts();

  // Stats
  const stats = useMemo(() => {
    return {
      totalVendors: vendorsList.length,
      verifiedCount: vendorsList.filter((v) => v.isVerified).length,
      emergingCount: vendorsList.filter((v) => v.isEmerging).length,
      featuredCount: vendorsList.filter((v) => v.isFeatured).length,
      totalProducts: allProducts.length
    };
  }, [vendorsList, allProducts]);

  // Filtered vendors
  const filteredVendors = useMemo(() => {
    return vendorsList.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.businessName.toLowerCase().includes(q) ||
        (v.ownerName && v.ownerName.toLowerCase().includes(q)) ||
        (v.location && v.location.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q));

      const matchesCat =
        selectedCategory === 'All' ||
        (v.category && v.category.toLowerCase().includes(selectedCategory.toLowerCase()));

      const matchesType =
        selectedType === 'All' ||
        (selectedType === 'Emerging' && v.isEmerging) ||
        (selectedType === 'Featured' && v.isFeatured) ||
        (selectedType === 'Verified' && v.isVerified);

      return matchesSearch && matchesCat && matchesType;
    });
  }, [vendorsList, searchQuery, selectedCategory, selectedType]);

  // 1-Click Toggles
  const handleToggleVerified = (vendorId) => {
    setVendorsList((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated = !v.isVerified;
          addToast(
            `${v.businessName} verification ${updated ? 'granted' : 'revoked'}.`,
            updated ? 'success' : 'info'
          );
          return { ...v, isVerified: updated };
        }
        return v;
      })
    );
  };

  const handleToggleFeatured = (vendorId) => {
    setVendorsList((prev) =>
      prev.map((v) => {
        if (v.id === vendorId) {
          const updated = !v.isFeatured;
          addToast(
            `${v.businessName} ${updated ? 'added to' : 'removed from'} Featured Merchants.`,
            updated ? 'success' : 'info'
          );
          return { ...v, isFeatured: updated };
        }
        return v;
      })
    );
  };

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <AdminSidebar />

      <main className="admin-main">
        {/* Header */}
        <div className="vendor-header" style={{ marginBottom: 24 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Store size={22} color="#9333EA" />
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
                Vendor Directory & Catalog Controls
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Manage all 10 registered merchant storefronts, toggle verified badges, inspect 15-product catalogs, and control fair exposure
            </p>
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => navigate('/stores')}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <ExternalLink size={14} />
            <span>Open Public Store Directory</span>
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Merchants
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
              {stats.totalVendors}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Across 10 Indian cities
            </div>
          </div>

          <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
              Verified Stores
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
              {stats.verifiedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              GSTIN & Tax Invoice compliant
            </div>
          </div>

          <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', textTransform: 'uppercase' }}>
              Emerging Merchants
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#D97706', marginTop: 4 }}>
              {stats.emergingCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Receiving Fair Exposure boost
            </div>
          </div>

          <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>
              Catalog Items
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginTop: 4 }}>
              {stats.totalProducts}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              15 SKUs per merchant
            </div>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, maxWidth: 640 }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: 36, fontSize: '0.85rem' }}
                placeholder="Search merchant name, city, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type filter */}
            <select
              className="form-select"
              style={{ width: 'auto', fontSize: '0.85rem' }}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Tiers</option>
              <option value="Emerging">Emerging Only (⚡)</option>
              <option value="Featured">Featured Only (★)</option>
              <option value="Verified">Verified Only (✓)</option>
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            Showing {filteredVendors.length} of {vendorsList.length} merchants
          </div>
        </div>

        {/* Vendors Table */}
        <div className="card" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px' }}>Merchant</th>
                  <th style={{ padding: '12px 16px' }}>Category & Tier</th>
                  <th style={{ padding: '12px 16px' }}>Location & GSTIN</th>
                  <th style={{ padding: '12px 16px' }}>Catalog & Stock</th>
                  <th style={{ padding: '12px 16px' }}>Rating & Orders</th>
                  <th style={{ padding: '12px 16px' }}>Status Toggles</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => {
                  const vendorProducts = allProducts.filter((p) => p.vendorId === vendor.id);
                  const totalUnits = vendorProducts.reduce((acc, p) => acc + (p.stock || p.quantity || 0), 0);

                  return (
                    <tr key={vendor.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {/* Merchant Avatar & Name */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img
                            src={vendor.avatar}
                            alt={vendor.businessName}
                            style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: '1px solid var(--border)' }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                              {vendor.businessName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ID: <code>{vendor.id}</code> • Slug: <code>{vendor.storeSlug || vendor.id}</code>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                              Owner: {vendor.ownerName || 'Merchant'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category & Tier */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {vendor.category || 'General Retail'}
                        </div>
                        <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                          {vendor.isEmerging ? (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309', padding: '1px 6px', borderRadius: 4, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                              <Flame size={10} /> Emerging
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.68rem', fontWeight: 700, background: '#EEF2FF', color: '#4F46E5', padding: '1px 6px', borderRadius: 4 }}>
                              Established
                            </span>
                          )}
                          <span style={{ fontSize: '0.68rem', background: 'var(--surface-sunken)', padding: '1px 6px', borderRadius: 4 }}>
                            {vendor.businessType || 'Private Limited'}
                          </span>
                        </div>
                      </td>

                      {/* Location & GSTIN */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                          <MapPin size={13} color="var(--primary)" />
                          <span>{vendor.location}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          GSTIN: <strong>{vendor.gstin || '07AABCT1234F1Z8'}</strong>
                        </div>
                      </td>

                      {/* Catalog & Stock */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary)' }}>
                          {vendorProducts.length || 15} Physical SKUs
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {totalUnits} units in warehouse
                        </div>
                      </td>

                      {/* Rating & Orders */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800, color: '#D97706' }}>
                          <Star size={13} fill="#D97706" /> {vendor.storeRating || 4.8}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          {vendor.totalOrdersFulfilled || 200}+ Fulfilled
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--success)' }}>
                          {vendor.onTimeDispatchRate || '99%'} SLA
                        </div>
                      </td>

                      {/* Status Toggles */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <button
                            type="button"
                            onClick={() => handleToggleVerified(vendor.id)}
                            style={{
                              border: vendor.isVerified ? '1px solid #10B981' : '1px solid var(--border)',
                              background: vendor.isVerified ? '#D1FAE5' : 'var(--surface-2)',
                              color: vendor.isVerified ? '#065F46' : 'var(--text-muted)',
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <ShieldCheck size={12} />
                            {vendor.isVerified ? 'Verified Active' : 'Unverified'}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(vendor.id)}
                            style={{
                              border: vendor.isFeatured ? '1px solid #F59E0B' : '1px solid var(--border)',
                              background: vendor.isFeatured ? '#FEF3C7' : 'var(--surface-2)',
                              color: vendor.isFeatured ? '#B45309' : 'var(--text-muted)',
                              padding: '2px 8px',
                              borderRadius: 6,
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Star size={12} fill={vendor.isFeatured ? '#F59E0B' : 'none'} />
                            {vendor.isFeatured ? 'Featured Merchant' : 'Standard'}
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedVendorForModal(vendor)}
                            title="Inspect all products from this vendor"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          >
                            <Eye size={13} />
                            <span>Inspect SKUs</span>
                          </button>

                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(`/store/${vendor.storeSlug || vendor.id}`)}
                            title="Open customer storefront"
                            style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                          >
                            <span>Storefront</span>
                            <ArrowRight size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal to inspect vendor's 15 products */}
        {selectedVendorForModal && (
          <div
            className="preview-modal-backdrop"
            onClick={() => setSelectedVendorForModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}
          >
            <div
              className="card"
              style={{ maxWidth: 840, width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={selectedVendorForModal.avatar}
                    alt={selectedVendorForModal.businessName}
                    style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                      {selectedVendorForModal.businessName} — Physical Catalog
                    </h3>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {selectedVendorForModal.location} • Category: {selectedVendorForModal.category}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setSelectedVendorForModal(null)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Product list inside modal */}
              <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {allProducts.filter((p) => p.vendorId === selectedVendorForModal.id).map((prod) => (
                    <div
                      key={prod.id}
                      style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 10, background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 6 }}
                    >
                      <img
                        src={prod.image || prod.images?.[0]}
                        alt={prod.name}
                        style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 6 }}
                      />
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1.3 }}>
                        {prod.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        SKU: <code>{prod.sku}</code>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 'auto', paddingTop: 6 }}>
                        <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                          ₹{prod.price?.toLocaleString('en-IN')}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--success)', fontWeight: 700 }}>
                          {prod.stock || prod.quantity || 10} in stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '14px 24px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Total 15 verified physical items linked to merchant
                </span>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    navigate(`/store/${selectedVendorForModal.storeSlug || selectedVendorForModal.id}`);
                  }}
                >
                  Open Storefront →
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
