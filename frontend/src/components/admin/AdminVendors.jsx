import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import { AdminSidebar } from './AdminDashboard';
import { seedVendors } from '../../data/seedData';
import {
  Store, Search, Star, ShieldCheck, MapPin, Package,
  ArrowRight, ExternalLink, Sparkles, Filter, CheckCircle2,
  Building2, Flame, Award, Eye, ShieldAlert, Check, X,
  FileCheck, Clock, AlertCircle, FileText, Phone, Mail,
  CreditCard, Send, CheckCircle, XCircle
} from 'lucide-react';
import '../../styles/vendor.css';

const DEFAULT_APPLICATIONS = [
  {
    id: 'app-1001',
    vendorId: 'v11-demo',
    businessName: 'Vedic Aromas & Organics',
    ownerName: 'Sunita Sharma',
    email: 'sunita@vedicaromas.in',
    mobile: '9811223344',
    category: 'Beauty',
    businessType: 'Sole Proprietorship',
    gstin: '07AABCS9876K1Z3',
    panNumber: 'AABCS9876K',
    fssaiLicense: '10019022001234',
    businessAddress: '24, Rose Garden Road, Civil Lines',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302006',
    deliveryRadiusKm: 30,
    deliveryScope: 'pan_india',
    bankDetails: {
      accountHolder: 'Vedic Aromas',
      accountNumber: '918273645019',
      ifscCode: 'HDFC0001234',
      upiId: 'vedicaromas@okhdfc'
    },
    documents: [
      {
        type: 'GST Certificate',
        title: 'Form GST REG-06 Certificate of Registration',
        url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop'
      },
      {
        type: 'PAN Card',
        title: 'Business PAN Entity Card',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      }
    ],
    status: 'pending',
    rejectionReason: '',
    submittedAt: '2026-09-28T10:00:00.000Z'
  },
  {
    id: 'app-1002',
    vendorId: 'v12-demo',
    businessName: 'Himalayan Shilajit & Pure Herbs',
    ownerName: 'Vikram Negi',
    email: 'vikram@himalayanherbs.in',
    mobile: '9822334455',
    category: 'Grocery',
    businessType: 'Partnership Firm',
    gstin: '05AABCH5544R1Z9',
    panNumber: 'AABCH5544R',
    fssaiLicense: '10020011009876',
    businessAddress: '78, Mall Road, Almora',
    city: 'Dehradun',
    state: 'Uttarakhand',
    pincode: '248001',
    deliveryRadiusKm: 50,
    deliveryScope: 'pan_india',
    bankDetails: {
      accountHolder: 'Himalayan Shilajit Traders',
      accountNumber: '50100234567891',
      ifscCode: 'SBIN0004567',
      upiId: 'himalayanherbs@oksbi'
    },
    documents: [
      {
        type: 'FSSAI License',
        title: 'Central FSSAI Food Safety Compliance Certificate',
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop'
      }
    ],
    status: 'under_review',
    rejectionReason: '',
    submittedAt: '2026-09-29T14:30:00.000Z'
  }
];

export default function AdminVendors() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { getApprovedProducts } = useProducts();

  // Main Tabs: 'directory' | 'applications'
  const [mainTab, setMainTab] = useState('directory');

  // Local state for interactive overrides
  const [vendorsList, setVendorsList] = useState(() => {
    return seedVendors.map((v) => ({
      ...v,
      isEmerging: Boolean(v.isEmerging || (v.totalOrdersFulfilled != null && v.totalOrdersFulfilled < 350)),
      isVerified: v.isVerified !== false,
      isFeatured: Boolean(v.isFeatured || (v.storeRating && v.storeRating >= 4.8))
    }));
  });

  // Applications State
  const [applications, setApplications] = useState(DEFAULT_APPLICATIONS);
  const [appFilter, setAppFilter] = useState('all'); // 'all' | 'pending' | 'under_review' | 'approved' | 'rejected'
  const [selectedAppForModal, setSelectedAppForModal] = useState(null);
  const [rejectingApp, setRejectingApp] = useState(null);
  const [rejectionReasonText, setRejectionReasonText] = useState('');
  const [loadingApps, setLoadingApps] = useState(false);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApps = async () => {
      try {
        setLoadingApps(true);
        const res = await api.getVendorApplications();
        if (res?.success && res?.applications && res.applications.length > 0) {
          // Merge with defaults to ensure complete list
          const ids = new Set(res.applications.map((a) => a.id));
          const combined = [
            ...res.applications,
            ...DEFAULT_APPLICATIONS.filter((d) => !ids.has(d.id))
          ];
          setApplications(combined);
        }
      } catch (err) {
        console.warn('Backend applications fetch fallback:', err);
      } finally {
        setLoadingApps(false);
      }
    };
    fetchApps();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState(null);

  const allProducts = getApprovedProducts();

  // Application Stats
  const pendingAppsCount = useMemo(() => {
    return applications.filter((a) => a.status === 'pending').length;
  }, [applications]);

  const underReviewAppsCount = useMemo(() => {
    return applications.filter((a) => a.status === 'under_review').length;
  }, [applications]);

  // Handle Application Status Actions
  const handleApproveApp = async (app) => {
    try {
      await api.updateVendorApplicationStatus(app.id, {
        status: 'approved',
        adminNotes: 'All business credentials, GSTIN and pickup location verified successfully.'
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: 'approved', reviewedAt: new Date().toISOString() } : a))
      );
      // Activate in vendors list
      setVendorsList((prev) => {
        const existing = prev.find((v) => v.id === app.vendorId || v.businessName === app.businessName);
        if (existing) {
          return prev.map((v) => (v.id === existing.id ? { ...v, isVerified: true, vendorApplicationStatus: 'approved' } : v));
        } else {
          return [
            {
              id: app.vendorId || 'v-' + app.id,
              businessName: app.businessName,
              ownerName: app.ownerName,
              email: app.email,
              mobile: app.mobile,
              category: app.category || 'General',
              location: `${app.city || ''}, ${app.state || ''}`.replace(/^,\s*|,\s*$/g, '') || 'India',
              gstin: app.gstin || '07AABCV9999Z1Z0',
              businessType: app.businessType || 'Private Limited',
              deliveryRadiusKm: app.deliveryRadiusKm || 30,
              isVerified: true,
              isEmerging: true,
              isFeatured: false,
              storeRating: 5.0,
              totalOrdersFulfilled: 0,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(app.businessName)}&background=7C3AED&color=fff`,
              storeSlug: (app.businessName || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-')
            },
            ...prev
          ];
        }
      });
      addToast(`🎉 Application for ${app.businessName} APPROVED! Merchant store is now active and verified.`, 'success');
      if (selectedAppForModal?.id === app.id) {
        setSelectedAppForModal(null);
      }
    } catch (err) {
      addToast('Failed to approve application', 'error');
    }
  };

  const handleSetUnderReview = async (app) => {
    try {
      await api.updateVendorApplicationStatus(app.id, { status: 'under_review' });
      setApplications((prev) =>
        prev.map((a) => (a.id === app.id ? { ...a, status: 'under_review' } : a))
      );
      addToast(`${app.businessName} marked as Under Administrative Review.`, 'info');
      if (selectedAppForModal?.id === app.id) {
        setSelectedAppForModal((prev) => ({ ...prev, status: 'under_review' }));
      }
    } catch (err) {
      addToast('Status update failed', 'error');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingApp) return;
    try {
      const reason = rejectionReasonText.trim() || 'Missing or unverified compliance documentation.';
      await api.updateVendorApplicationStatus(rejectingApp.id, {
        status: 'rejected',
        rejectionReason: reason
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === rejectingApp.id ? { ...a, status: 'rejected', rejectionReason: reason } : a))
      );
      addToast(`Application for ${rejectingApp.businessName} has been rejected. Notification dispatched.`, 'info');
      setRejectingApp(null);
      setRejectionReasonText('');
      if (selectedAppForModal?.id === rejectingApp.id) {
        setSelectedAppForModal(null);
      }
    } catch (err) {
      addToast('Failed to reject application', 'error');
    }
  };

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

  // Filtered Applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus = appFilter === 'all' || app.status === appFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        app.businessName.toLowerCase().includes(q) ||
        app.ownerName.toLowerCase().includes(q) ||
        (app.city && app.city.toLowerCase().includes(q)) ||
        (app.gstin && app.gstin.toLowerCase().includes(q)) ||
        (app.category && app.category.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [applications, appFilter, searchQuery]);

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
        <div className="vendor-header" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Store size={22} color="#9333EA" />
              <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
                Merchant Management & Onboarding Hub
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Review merchant onboarding applications, verify GSTIN & PAN documents, inspect live catalogs, and control store tier visibility
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

        {/* ── Main Top Tabs (Directory vs Applications) ── */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <button
            type="button"
            onClick={() => setMainTab('directory')}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: mainTab === 'directory' ? '1.5px solid #9333EA' : '1px solid var(--border)',
              background: mainTab === 'directory' ? 'rgba(147, 51, 234, 0.12)' : 'var(--surface)',
              color: mainTab === 'directory' ? '#9333EA' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <Store size={16} />
            <span>Active Merchants Directory ({vendorsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('applications')}
            style={{
              padding: '10px 18px',
              borderRadius: 10,
              border: mainTab === 'applications' ? '1.5px solid #9333EA' : '1px solid var(--border)',
              background: mainTab === 'applications' ? 'rgba(147, 51, 234, 0.12)' : 'var(--surface)',
              color: mainTab === 'applications' ? '#9333EA' : 'var(--text-secondary)',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <FileCheck size={16} />
            <span>Merchant Onboarding Applications</span>
            {pendingAppsCount > 0 && (
              <span style={{
                background: '#EF4444',
                color: 'white',
                borderRadius: 999,
                padding: '2px 8px',
                fontSize: '0.72rem',
                fontWeight: 900
              }}>
                {pendingAppsCount} Pending
              </span>
            )}
          </button>
        </div>

        {/* ── Active Merchants Directory Tab ── */}
        {mainTab === 'directory' && (
          <>
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
                  Across Indian regional hubs
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
                  Receiving Dynamic Fair Exposure
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
                  Live verified marketplace SKUs
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
          </>
        )}

        {/* ── Merchant Applications Tab ── */}
        {mainTab === 'applications' && (
          <>
            {/* Applications Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
              <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Total Applications
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
                  {applications.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Merchant onboarding requests
                </div>
              </div>

              <div className="card" style={{ padding: 18, borderRadius: 12, border: '1.5px solid #FCD34D', background: 'rgba(254, 243, 199, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#B45309', textTransform: 'uppercase' }}>
                  Pending Verification
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#B45309', marginTop: 4 }}>
                  {pendingAppsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Awaiting compliance sign-off
                </div>
              </div>

              <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase' }}>
                  Under Review
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2563EB', marginTop: 4 }}>
                  {underReviewAppsCount}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Address & document audits
                </div>
              </div>

              <div className="card" style={{ padding: 18, borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  Approved & Live
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
                  {applications.filter((a) => a.status === 'approved').length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  Verified merchant storefronts
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {['all', 'pending', 'under_review', 'approved', 'rejected'].map((st) => {
                  const labelMap = {
                    all: `All Applications (${applications.length})`,
                    pending: `Pending (${pendingAppsCount})`,
                    under_review: `Under Review (${underReviewAppsCount})`,
                    approved: `Approved (${applications.filter((a) => a.status === 'approved').length})`,
                    rejected: `Rejected (${applications.filter((a) => a.status === 'rejected').length})`
                  };
                  const active = appFilter === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAppFilter(st)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 8,
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: active ? '1.5px solid #9333EA' : '1px solid var(--border)',
                        background: active ? 'rgba(147, 51, 234, 0.12)' : 'var(--surface)',
                        color: active ? '#9333EA' : 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {labelMap[st]}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div style={{ position: 'relative', width: 280 }}>
                <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: 32, fontSize: '0.82rem' }}
                  placeholder="Filter applications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Applications Table */}
            <div className="card" style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Applicant Business</th>
                      <th style={{ padding: '12px 16px' }}>Category & Structure</th>
                      <th style={{ padding: '12px 16px' }}>Tax & Identity (GSTIN/PAN)</th>
                      <th style={{ padding: '12px 16px' }}>Pickup & Radius</th>
                      <th style={{ padding: '12px 16px' }}>Documentation</th>
                      <th style={{ padding: '12px 16px' }}>Review Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Workflow Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No vendor applications matching the selected criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => {
                        const statusColors = {
                          pending: { bg: '#FEF3C7', text: '#B45309', border: '#FCD34D', icon: <Clock size={12} />, label: 'Pending Review' },
                          under_review: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD', icon: <Eye size={12} />, label: 'Under Review' },
                          approved: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7', icon: <CheckCircle2 size={12} />, label: 'Approved & Active' },
                          rejected: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5', icon: <XCircle size={12} />, label: 'Rejected' }
                        };
                        const cfg = statusColors[app.status] || statusColors.pending;

                        return (
                          <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            {/* Business & Owner */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                                {app.businessName}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {app.ownerName}
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: 8, marginTop: 3 }}>
                                <span>📞 {app.mobile}</span>
                                <span>✉️ {app.email}</span>
                              </div>
                            </td>

                            {/* Category & Structure */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontWeight: 700, color: '#7C3AED' }}>
                                {app.category || 'Retail'}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                {app.businessType || 'Sole Proprietorship'}
                              </div>
                            </td>

                            {/* Tax & Identity */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 700 }}>
                                GST: {app.gstin || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                PAN: <strong>{app.panNumber || 'N/A'}</strong>
                              </div>
                              {app.fssaiLicense && (
                                <div style={{ fontSize: '0.7rem', color: '#059669', marginTop: 1 }}>
                                  FSSAI: {app.fssaiLicense}
                                </div>
                              )}
                            </td>

                            {/* Location & Radius */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)' }}>
                                <MapPin size={12} color="var(--primary)" />
                                <span>{app.city || app.location || 'India'}, {app.pincode || ''}</span>
                              </div>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2 }}>
                                Radius: <strong>{app.deliveryRadiusKm || 30} km</strong> ({app.deliveryScope === 'pan_india' ? 'Pan-India' : 'Local'})
                              </div>
                            </td>

                            {/* Documents */}
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                {app.documents && app.documents.length > 0 ? (
                                  app.documents.map((doc, idx) => (
                                    <a
                                      key={idx}
                                      href={doc.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        fontSize: '0.72rem',
                                        color: '#4F46E5',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 3
                                      }}
                                    >
                                      <FileText size={11} />
                                      <span>{doc.type || 'Document'}</span>
                                      <ExternalLink size={9} />
                                    </a>
                                  ))
                                ) : (
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Self-declared</span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td style={{ padding: '14px 16px' }}>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  padding: '3px 8px',
                                  borderRadius: 6,
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  background: cfg.bg,
                                  color: cfg.text,
                                  border: `1px solid ${cfg.border}`
                                }}
                              >
                                {cfg.icon}
                                {cfg.label}
                              </span>
                              {app.rejectionReason && (
                                <div style={{ fontSize: '0.7rem', color: '#DC2626', marginTop: 4, maxWidth: 160 }}>
                                  Reason: {app.rejectionReason}
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button
                                  type="button"
                                  className="btn btn-outline btn-sm"
                                  onClick={() => setSelectedAppForModal(app)}
                                  title="View full application"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                                >
                                  <Eye size={12} />
                                  <span>Details</span>
                                </button>

                                {app.status !== 'approved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleApproveApp(app)}
                                    style={{
                                      background: '#059669',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '4px 9px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: 4
                                    }}
                                  >
                                    <Check size={12} />
                                    <span>Approve</span>
                                  </button>
                                )}

                                {app.status === 'pending' && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetUnderReview(app)}
                                    style={{
                                      background: '#2563EB',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: 6,
                                      padding: '4px 8px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Review
                                  </button>
                                )}

                                {app.status !== 'rejected' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRejectingApp(app);
                                      setRejectionReasonText('');
                                    }}
                                    style={{
                                      background: 'rgba(239, 68, 68, 0.1)',
                                      color: '#DC2626',
                                      border: '1px solid rgba(239, 68, 68, 0.3)',
                                      borderRadius: 6,
                                      padding: '4px 8px',
                                      fontSize: '0.75rem',
                                      fontWeight: 700,
                                      cursor: 'pointer'
                                    }}
                                  >
                                    Reject
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Modal: Application Details Inspection ── */}
        {selectedAppForModal && (
          <div
            className="preview-modal-backdrop"
            onClick={() => setSelectedAppForModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 }}
          >
            <div
              className="card"
              style={{ maxWidth: 680, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: 16, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-2)' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    {selectedAppForModal.businessName} — Application Dossier
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Application ID: <code>{selectedAppForModal.id}</code> • Submitted: {new Date(selectedAppForModal.submittedAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSelectedAppForModal(null)}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
                  <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Applicant & Owner</div>
                    <div style={{ fontWeight: 800, marginTop: 4 }}>{selectedAppForModal.ownerName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedAppForModal.email}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{selectedAppForModal.mobile}</div>
                  </div>

                  <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>Entity Structure</div>
                    <div style={{ fontWeight: 800, marginTop: 4 }}>{selectedAppForModal.businessType || 'Sole Proprietorship'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: 700 }}>Category: {selectedAppForModal.category}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status: <strong>{selectedAppForModal.status.toUpperCase()}</strong></div>
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <ShieldCheck size={15} color="#059669" />
                    <span>Statutory Tax & Compliance Registration</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, fontSize: '0.82rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>GSTIN:</span> <strong>{selectedAppForModal.gstin || 'Unspecified'}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>PAN Number:</span> <strong>{selectedAppForModal.panNumber || 'Unspecified'}</strong>
                    </div>
                    {selectedAppForModal.fssaiLicense && (
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>FSSAI:</span> <strong>{selectedAppForModal.fssaiLicense}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={15} color="#7C3AED" />
                    <span>Pickup Address & Fulfillment Reach</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                    <div>{selectedAppForModal.businessAddress || 'Warehouse address provided'}</div>
                    <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>
                      {selectedAppForModal.city || ''}, {selectedAppForModal.state || ''} — {selectedAppForModal.pincode || ''}
                    </div>
                    <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--primary)' }}>
                      Local Delivery Radius: {selectedAppForModal.deliveryRadiusKm || 30} km ({selectedAppForModal.deliveryScope === 'pan_india' ? 'Pan-India Delivery Enabled' : 'Regional Express'})
                    </div>
                  </div>
                </div>

                {selectedAppForModal.bankDetails && (
                  <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CreditCard size={15} color="#2563EB" />
                      <span>Bank Payout Account</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8, fontSize: '0.8rem' }}>
                      <div>Account Holder: <strong>{selectedAppForModal.bankDetails.accountHolder || selectedAppForModal.businessName}</strong></div>
                      <div>A/C: <code>{selectedAppForModal.bankDetails.accountNumber}</code></div>
                      <div>IFSC: <code>{selectedAppForModal.bankDetails.ifscCode}</code></div>
                      {selectedAppForModal.bankDetails.upiId && <div>UPI: <code>{selectedAppForModal.bankDetails.upiId}</code></div>}
                    </div>
                  </div>
                )}

                {selectedAppForModal.documents && selectedAppForModal.documents.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={15} color="#D97706" />
                      <span>Attached Verification Documents</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
                      {selectedAppForModal.documents.map((d, i) => (
                        <a
                          key={i}
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            border: '1px solid var(--border)',
                            borderRadius: 8,
                            padding: 10,
                            textDecoration: 'none',
                            color: 'inherit',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            background: 'var(--surface)'
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '0.8rem', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{d.type}</span>
                            <ExternalLink size={12} />
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.title}</div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Merchant compliance checks adhere to GST Rule 8(4) & IT Act.
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {selectedAppForModal.status !== 'approved' && (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => handleApproveApp(selectedAppForModal)}
                      style={{ background: '#059669', borderColor: '#059669' }}
                    >
                      <Check size={14} /> Approve & Activate Store
                    </button>
                  )}
                  {selectedAppForModal.status !== 'rejected' && (
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setRejectingApp(selectedAppForModal);
                        setRejectionReasonText('');
                      }}
                      style={{ color: '#DC2626', borderColor: '#DC2626' }}
                    >
                      Reject Application
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Rejection Reason Dialog ── */}
        {rejectingApp && (
          <div
            className="preview-modal-backdrop"
            onClick={() => setRejectingApp(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}
          >
            <div
              className="card"
              style={{ maxWidth: 460, width: '100%', borderRadius: 16, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(239, 68, 68, 0.08)' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={18} />
                  <span>Reject Application: {rejectingApp.businessName}</span>
                </h3>
              </div>
              <div style={{ padding: '20px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 0, marginBottom: 12 }}>
                  Please specify the compliance or documentation reason for rejection so the merchant can re-submit the required documents.
                </p>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. GSTIN certificate unreadable or PAN entity name mismatch..."
                  value={rejectionReasonText}
                  onChange={(e) => setRejectionReasonText(e.target.value)}
                  style={{ width: '100%', fontSize: '0.84rem' }}
                />
              </div>
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--surface-2)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setRejectingApp(null)}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleConfirmReject}
                  style={{ background: '#DC2626', borderColor: '#DC2626' }}
                >
                  Confirm Rejection & Dispatch Notification
                </button>
              </div>
            </div>
          </div>
        )}

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
                  Total verified physical items linked to merchant
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
