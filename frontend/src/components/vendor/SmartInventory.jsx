import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useToast } from '../../contexts/ToastContext';
import { api } from '../../services/api';
import { VendorSidebar, VendorThemeToggle } from './VendorDashboard';
import {
  Box, Package, AlertTriangle, ArrowUpDown, RefreshCw,
  Search, Filter, Plus, Minus, History, Barcode, MapPin,
  Clock, ShieldAlert, CheckCircle2, TrendingDown, DollarSign,
  Layers, ChevronRight, Copy, Check, Sparkles, ExternalLink,
  Edit3, ArrowUpRight, ArrowDownRight, Warehouse, X
} from 'lucide-react';
import '../../styles/vendor.css';

// Realistic SVG Barcode generator component for EAN-13 / Code-128 aesthetic
function BarcodeSvg({ value, height = 32, width = 160 }) {
  const codeStr = String(value || '8901234567890');
  // Deterministic bar widths based on digit ASCII values
  const bars = useMemo(() => {
    const list = [];
    let x = 4;
    for (let i = 0; i < codeStr.length; i++) {
      const charCode = codeStr.charCodeAt(i);
      const w1 = ((charCode % 3) + 1);
      const w2 = (((charCode >> 1) % 2) + 1);
      list.push({ x, w: w1 });
      x += w1 + w2;
      list.push({ x, w: 1 });
      x += 2;
    }
    return { bars: list, totalWidth: Math.max(x + 4, width) };
  }, [codeStr, width]);

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface)', padding: '4px 6px', borderRadius: 4, border: '1px solid var(--border)' }}>
      <svg width={width} height={height} viewBox={`0 0 ${bars.totalWidth} ${height}`} style={{ display: 'block' }}>
        {bars.bars.map((bar, idx) => (
          <rect key={idx} x={bar.x} y="0" width={bar.w} height={height} fill="var(--text-primary)" />
        ))}
      </svg>
      <span style={{ fontFamily: 'monospace', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '2px', marginTop: 2 }}>
        {codeStr}
      </span>
    </div>
  );
}

export default function SmartInventory() {
  const { user } = useAuth();
  const { products: contextProducts, updateProductStock } = useProducts();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, healthy, low, out
  const [copiedBarcode, setCopiedBarcode] = useState(null);

  // Modals & Drawers
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState(10);
  const [adjustmentReason, setAdjustmentReason] = useState('restock');
  const [adjustmentNotes, setAdjustmentNotes] = useState('');
  const [adjusting, setAdjusting] = useState(false);

  // SKU / Barcode / Location Editor Modal
  const [skuModalOpen, setSkuModalOpen] = useState(false);
  const [skuForm, setSkuForm] = useState({
    productId: '',
    sku: '',
    barcode: '',
    warehouseLocation: '',
    lowStockThreshold: 5,
    restockLeadDays: 3
  });
  const [savingSku, setSavingSku] = useState(false);

  // Stock Movement History Drawer / Modal
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [movementLogs, setMovementLogs] = useState([]);
  const [historyFilterReason, setHistoryFilterReason] = useState('all');
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    document.title = 'Smart Inventory & Stock Operations | Vendor Hub';
  }, []);

  // Fetch Inventory Summary & Alerts
  const fetchInventory = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [summaryRes, alertsRes] = await Promise.all([
        api.getVendorInventorySummary(user.id),
        api.getLowStockAlerts(user.id)
      ]);

      if (summaryRes && summaryRes.success) {
        setSummaryData(summaryRes.data);
      } else {
        // Resilient fallback using context products
        const vendorProds = contextProducts.filter(p => p.vendorId === user.id);
        const totalItems = vendorProds.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
        const totalVal = vendorProds.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.price) || 0)), 0);
        const lowList = vendorProds.filter(p => (Number(p.stock) || 0) <= (p.lowStockThreshold || 5));

        setSummaryData({
          kpi: {
            totalSkus: vendorProds.length,
            totalInventoryUnits: totalItems,
            totalAssetValuation: totalVal,
            totalReservedUnits: 0,
            lowStockCount: lowList.length,
            outOfStockCount: vendorProds.filter(p => (Number(p.stock) || 0) === 0).length
          },
          inventory: vendorProds.map(p => ({
            _id: p.id || p._id,
            title: p.title,
            category: p.category,
            image: p.image || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
            price: p.price,
            stock: p.stock || 0,
            reservedStock: p.reservedStock || 0,
            availableStock: p.stock || 0,
            lowStockThreshold: p.lowStockThreshold || 5,
            sku: p.sku || `SKU-${(p.id || p._id || '').slice(-4).toUpperCase()}`,
            barcode: p.barcode || '8901234567890',
            warehouseLocation: p.warehouseLocation || 'Aisle 1, Bin A-1',
            restockLeadDays: p.restockLeadDays || 3,
            stockStatus: (p.stock || 0) === 0 ? 'out_of_stock' : (p.stock || 0) <= (p.lowStockThreshold || 5) ? 'low_stock' : 'healthy'
          }))
        });
      }

      if (alertsRes && alertsRes.success) {
        setAlerts(alertsRes.alerts || []);
      }
    } catch (err) {
      console.error('Failed to load smart inventory data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, contextProducts]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // Copy Barcode Helper
  const handleCopyBarcode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedBarcode(code);
    addToast(`Barcode ${code} copied to clipboard!`, 'info');
    setTimeout(() => setCopiedBarcode(null), 2000);
  };

  // Open Quick Restock / Stock Adjust Modal
  const openAdjustModal = (product, defaultDelta = 10, defaultReason = 'restock') => {
    setSelectedProduct(product);
    setAdjustmentDelta(defaultDelta);
    setAdjustmentReason(defaultReason);
    setAdjustmentNotes('');
    setAdjustModalOpen(true);
  };

  // Submit Stock Adjustment
  const handleStockAdjustmentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setAdjusting(true);

    try {
      const payload = {
        productId: selectedProduct._id || selectedProduct.id,
        quantityDelta: Number(adjustmentDelta),
        reason: adjustmentReason,
        notes: adjustmentNotes || `Vendor portal adjustment (${adjustmentReason})`,
        referenceId: `ADJ-${Date.now().toString().slice(-6)}`
      };

      const res = await api.adjustInventoryStock(payload, user);
      if (res && res.success) {
        addToast(res.message || `Stock successfully updated for ${selectedProduct.title}!`, 'success');
        setAdjustModalOpen(false);
        // Also sync local Context
        if (updateProductStock) {
          updateProductStock(selectedProduct._id || selectedProduct.id, res.product?.stock ?? (selectedProduct.stock + Number(adjustmentDelta)));
        }
        await fetchInventory();
      } else {
        addToast(res?.message || 'Failed to adjust stock', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error processing adjustment', 'error');
    } finally {
      setAdjusting(false);
    }
  };

  // Open SKU / Barcode Editor Modal
  const openSkuEditor = (product) => {
    setSkuForm({
      productId: product._id || product.id,
      title: product.title,
      sku: product.sku || '',
      barcode: product.barcode || '',
      warehouseLocation: product.warehouseLocation || '',
      lowStockThreshold: product.lowStockThreshold || 5,
      restockLeadDays: product.restockLeadDays || 3
    });
    setSkuModalOpen(true);
  };

  // Generate Unique GS1 EAN-13 Barcode helper
  const handleGenerateEan13 = () => {
    const prefix = '890'; // GS1 India prefix
    const randomBody = Math.floor(100000000 + Math.random() * 900000000).toString();
    const raw12 = prefix + randomBody;
    // Calculate EAN-13 check digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(raw12[i], 10) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    const generated = raw12 + checkDigit;
    setSkuForm(prev => ({ ...prev, barcode: generated }));
    addToast(`Generated unique GS1 EAN-13: ${generated}`, 'success');
  };

  // Save SKU / Barcode / Location
  const handleSaveSkuBarcode = async (e) => {
    e.preventDefault();
    setSavingSku(true);
    try {
      const res = await api.updateSkuBarcode(skuForm.productId, {
        sku: skuForm.sku,
        barcode: skuForm.barcode,
        warehouseLocation: skuForm.warehouseLocation,
        lowStockThreshold: Number(skuForm.lowStockThreshold),
        restockLeadDays: Number(skuForm.restockLeadDays)
      }, user);

      if (res && res.success) {
        addToast(`SKU & Barcode metadata updated for ${skuForm.title}!`, 'success');
        setSkuModalOpen(false);
        await fetchInventory();
      } else {
        addToast(res?.message || 'Failed to update SKU / Barcode', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Error updating product metadata', 'error');
    } finally {
      setSavingSku(false);
    }
  };

  // Load Stock Movement History Drawer
  const openHistoryDrawer = async (prodId = null) => {
    setHistoryDrawerOpen(true);
    setLoadingHistory(true);
    try {
      const res = await api.getStockMovements(user.id, {
        productId: prodId,
        reason: historyFilterReason === 'all' ? undefined : historyFilterReason,
        limit: 50
      });
      if (res && res.success) {
        setMovementLogs(res.movements || []);
      } else {
        setMovementLogs([]);
      }
    } catch (err) {
      console.error('Failed to load stock movements:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Filtered Products List
  const filteredProducts = useMemo(() => {
    const list = summaryData?.inventory || [];
    return list.filter(item => {
      // Status Filter
      if (statusFilter === 'healthy' && item.stockStatus !== 'healthy') return false;
      if (statusFilter === 'low' && item.stockStatus !== 'low_stock') return false;
      if (statusFilter === 'out' && item.stockStatus !== 'out_of_stock') return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesSku = item.sku?.toLowerCase().includes(q);
        const matchesBarcode = item.barcode?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesLocation = item.warehouseLocation?.toLowerCase().includes(q);
        return matchesTitle || matchesSku || matchesBarcode || matchesCategory || matchesLocation;
      }
      return true;
    });
  }, [summaryData, statusFilter, searchQuery]);

  const kpis = summaryData?.kpi || {
    totalSkus: 0,
    totalInventoryUnits: 0,
    totalAssetValuation: 0,
    totalReservedUnits: 0,
    lowStockCount: 0,
    outOfStockCount: 0
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <main className="vendor-main">
        {/* Topbar */}
        <header className="vendor-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)'
            }}>
              <Box size={22} />
            </div>
            <div>
              <h1 className="vendor-topbar-title" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                Smart Inventory & Stock Operations
              </h1>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                SKU & Barcode tracking, stock reservation, low-stock reorder warnings, and immutable audit logs
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => openHistoryDrawer()}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
            >
              <History size={16} />
              <span>Audit History</span>
            </button>
            <button
              onClick={fetchInventory}
              disabled={loading}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
              title="Refresh inventory data"
            >
              <RefreshCw size={16} className={loading ? 'spin' : ''} />
              <span>Sync</span>
            </button>
            <Link
              to="/vendor/products"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
            >
              <Package size={16} />
              <span>Product Catalog</span>
            </Link>
            <VendorThemeToggle />
          </div>
        </header>

        {/* Content Container */}
        <div className="vendor-content">
          {/* ── Executive Inventory KPI Cards ─────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            marginBottom: 24
          }}>
            {/* KPI 1: Total SKUs */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: 20,
              border: '1px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Tracked Catalog SKUs
                </span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  {kpis.totalSkus}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Package size={13} />
                  <span>{kpis.totalInventoryUnits.toLocaleString()} total units on hand</span>
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(79, 70, 229, 0.1)',
                color: '#4F46E5',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Layers size={24} />
              </div>
            </div>

            {/* KPI 2: Asset Valuation */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: 20,
              border: '1px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Total Asset Valuation
                </span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>
                  ₹{(kpis.totalAssetValuation || 0).toLocaleString()}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Warehouse size={13} />
                  <span>Warehouse inventory worth</span>
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <DollarSign size={24} />
              </div>
            </div>

            {/* KPI 3: Reserved Units */}
            <div style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: 20,
              border: '1px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Reserved In-Transit
                </span>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3B82F6', marginTop: 4 }}>
                  {kpis.totalReservedUnits}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Clock size={13} />
                  <span>Held for pending orders</span>
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#3B82F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Clock size={24} />
              </div>
            </div>

            {/* KPI 4: Low / Out of Stock Alert */}
            <div style={{
              background: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '#FEF2F2' : 'white',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: 20,
              border: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '1px solid #FCA5A5' : '1px solid var(--border)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '#DC2626' : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Replenishment Alerts
                </span>
                <div style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '#EF4444' : '#10B981',
                  marginTop: 4
                }}>
                  {kpis.lowStockCount + kpis.outOfStockCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <AlertTriangle size={13} />
                  <span>{kpis.outOfStockCount} Out of Stock • {kpis.lowStockCount} Low</span>
                </div>
              </div>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '#FEE2E2' : 'rgba(16, 185, 129, 0.1)',
                color: (kpis.lowStockCount > 0 || kpis.outOfStockCount > 0) ? '#DC2626' : '#10B981',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <ShieldAlert size={24} />
              </div>
            </div>
          </div>

          {/* ── Urgent Low-Stock Action Alert Banner ──────────────── */}
          {alerts && alerts.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
              border: '1px solid #FCD34D',
              borderRadius: 'var(--radius-lg, 14px)',
              padding: '20px 24px',
              marginBottom: 28,
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#92400E' }}>
                      Urgent Stock Depletion Warning ({alerts.length} Items Below Threshold)
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#B45309' }}>
                      Replenish inventory to prevent sales downtime and automated out-of-stock delisting.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of Alert Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 12
              }}>
                {alerts.map(alert => (
                  <div
                    key={alert.productId}
                    style={{
                      background: 'var(--surface)',
                      borderRadius: 10,
                      padding: '12px 16px',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{
                          background: alert.currentStock === 0 ? '#FEE2E2' : '#FEF3C7',
                          color: alert.currentStock === 0 ? '#B91C1C' : '#92400E',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4
                        }}>
                          {alert.currentStock === 0 ? 'DEPLETED (0)' : `${alert.currentStock} REMAINING`}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#6B7280', fontFamily: 'monospace' }}>
                          {alert.sku}
                        </span>
                      </div>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#1F2937',
                        marginTop: 4,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {alert.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#92400E', marginTop: 2 }}>
                        Est. {alert.estimatedDaysRemaining} days remaining • Threshold: {alert.threshold} units
                      </div>
                    </div>

                    <button
                      onClick={() => openAdjustModal({
                        _id: alert.productId,
                        title: alert.title,
                        stock: alert.currentStock,
                        sku: alert.sku
                      }, 25, 'restock')}
                      className="btn"
                      style={{
                        background: '#F59E0B',
                        color: 'white',
                        padding: '6px 12px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        flexShrink: 0
                      }}
                    >
                      <Plus size={14} />
                      <span>Restock +25</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Main Inventory Table Card ─────────────────────────── */}
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg, 14px)',
            border: '1px solid var(--border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}>
            {/* Table Control Bar: Search & Filter Tabs */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16
            }}>
              {/* Left: Search Box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by Title, SKU, Barcode, Location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: 'var(--bg)'
                  }}
                />
              </div>

              {/* Right: Filter Status Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status:</span>
                {[
                  { key: 'all', label: 'All SKUs' },
                  { key: 'healthy', label: 'Healthy Stock' },
                  { key: 'low', label: 'Low Stock' },
                  { key: 'out', label: 'Out of Stock' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 20,
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: statusFilter === tab.key ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: statusFilter === tab.key ? 'var(--primary)' : 'white',
                      color: statusFilter === tab.key ? 'white' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid var(--border)', color: '#64748B', fontWeight: 600, fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 20px' }}>Product & Category</th>
                    <th style={{ padding: '14px 16px' }}>SKU & Barcode</th>
                    <th style={{ padding: '14px 16px' }}>Warehouse Location</th>
                    <th style={{ padding: '14px 16px' }}>Stock & Reservation</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                        <RefreshCw size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                        <div>Loading Smart Inventory catalog...</div>
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                        <Package size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)' }}>No inventory items matched</div>
                        <div style={{ fontSize: '0.82rem', marginTop: 4 }}>Try adjusting your search terms or status filters.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((prod) => {
                      const stockVal = Number(prod.stock) || 0;
                      const threshVal = Number(prod.lowStockThreshold) || 5;
                      const isLow = stockVal > 0 && stockVal <= threshVal;
                      const isOut = stockVal === 0;

                      return (
                        <tr
                          key={prod._id || prod.id}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            transition: 'background 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {/* Product Info */}
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <img
                                src={prod.image}
                                alt={prod.title}
                                style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }}
                              />
                              <div>
                                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                  {prod.title}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', background: '#F1F5F9', padding: '1px 6px', borderRadius: 4 }}>
                                    {prod.category || 'General'}
                                  </span>
                                  <span style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--primary)' }}>
                                    ₹{Number(prod.price).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* SKU & Barcode */}
                          <td style={{ padding: '14px 16px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  background: '#EFF6FF',
                                  color: '#1D4ED8',
                                  padding: '2px 8px',
                                  borderRadius: 4,
                                  border: '1px solid #DBEAFE'
                                }}>
                                  {prod.sku || 'NO-SKU'}
                                </span>
                              </div>
                              <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                                <BarcodeSvg value={prod.barcode || '8901234567890'} height={20} width={100} />
                                <button
                                  onClick={() => handleCopyBarcode(prod.barcode || '8901234567890')}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: copiedBarcode === prod.barcode ? '#10B981' : '#94A3B8' }}
                                  title="Copy Barcode"
                                >
                                  {copiedBarcode === prod.barcode ? <Check size={14} /> : <Copy size={14} />}
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Warehouse Location */}
                          <td style={{ padding: '14px 16px' }}>
                            <div
                              onClick={() => openSkuEditor(prod)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '4px 8px',
                                borderRadius: 6,
                                background: '#F8FAFC',
                                border: '1px solid #E2E8F0',
                                cursor: 'pointer',
                                fontSize: '0.78rem',
                                color: '#334155'
                              }}
                              title="Click to edit warehouse location"
                            >
                              <MapPin size={13} style={{ color: '#64748B' }} />
                              <span style={{ fontWeight: 500 }}>{prod.warehouseLocation || 'Aisle 1, Bin A-1'}</span>
                              <Edit3 size={11} style={{ opacity: 0.5 }} />
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: 3 }}>
                              Lead: {prod.restockLeadDays || 3} days
                            </div>
                          </td>

                          {/* Stock & Reservation */}
                          <td style={{ padding: '14px 16px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: '1rem', fontWeight: 800, color: isOut ? '#EF4444' : isLow ? '#D97706' : '#0F172A' }}>
                                  {prod.stock} units
                                </span>
                                {prod.reservedStock > 0 && (
                                  <span style={{ fontSize: '0.72rem', background: '#DBEAFE', color: '#1E40AF', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>
                                    {prod.reservedStock} reserved
                                  </span>
                                )}
                              </div>
                              {/* Stock Level Visual Progress Bar */}
                              <div style={{ width: 110, height: 5, background: '#E2E8F0', borderRadius: 3, marginTop: 5, overflow: 'hidden' }}>
                                <div style={{
                                  width: `${Math.min(100, Math.max(5, (prod.stock / (threshVal * 3)) * 100))}%`,
                                  height: '100%',
                                  background: isOut ? '#EF4444' : isLow ? '#F59E0B' : '#10B981',
                                  borderRadius: 3
                                }} />
                              </div>
                              <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: 3 }}>
                                Min Safety: {threshVal} units
                              </div>
                            </div>
                          </td>

                          {/* Status Badge */}
                          <td style={{ padding: '14px 16px' }}>
                            {isOut ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, background: '#FEE2E2', color: '#B91C1C', fontSize: '0.75rem', fontWeight: 700 }}>
                                <ShieldAlert size={12} /> Out of Stock
                              </span>
                            ) : isLow ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, background: '#FEF3C7', color: '#B45309', fontSize: '0.75rem', fontWeight: 700 }}>
                                <AlertTriangle size={12} /> Low Stock
                              </span>
                            ) : (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, background: '#DCFCE7', color: '#15803D', fontSize: '0.75rem', fontWeight: 700 }}>
                                <CheckCircle2 size={12} /> Healthy
                              </span>
                            )}
                          </td>

                          {/* Row Actions */}
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                              <button
                                onClick={() => openAdjustModal(prod)}
                                className="btn"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '0.76rem',
                                  fontWeight: 600,
                                  borderRadius: 6,
                                  background: '#EEF2FF',
                                  color: '#4F46E5',
                                  border: '1px solid #C7D2FE',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4
                                }}
                                title="Adjust Stock Quantity"
                              >
                                <ArrowUpDown size={13} />
                                <span>Adjust</span>
                              </button>

                              <button
                                onClick={() => openSkuEditor(prod)}
                                className="btn"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '0.76rem',
                                  borderRadius: 6,
                                  background: '#F1F5F9',
                                  color: '#475569',
                                  border: '1px solid #E2E8F0',
                                  cursor: 'pointer'
                                }}
                                title="Edit SKU, Barcode & Warehouse Shelf Location"
                              >
                                <Edit3 size={13} />
                              </button>

                              <button
                                onClick={() => openHistoryDrawer(prod._id || prod.id)}
                                className="btn"
                                style={{
                                  padding: '5px 8px',
                                  fontSize: '0.76rem',
                                  borderRadius: 6,
                                  background: '#F1F5F9',
                                  color: '#475569',
                                  border: '1px solid #E2E8F0',
                                  cursor: 'pointer'
                                }}
                                title="View Movement History"
                              >
                                <History size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer Summary */}
            <div style={{
              padding: '12px 20px',
              borderTop: '1px solid var(--border)',
              background: '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <div>Showing <strong>{filteredProducts.length}</strong> of <strong>{summaryData?.inventory?.length || 0}</strong> SKU catalog entries</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>Total Units Filtered: <strong>{filteredProducts.reduce((sum, p) => sum + (Number(p.stock) || 0), 0)}</strong></span>
                <span>Valuation Filtered: <strong>₹{filteredProducts.reduce((sum, p) => sum + ((Number(p.stock) || 0) * (Number(p.price) || 0)), 0).toLocaleString()}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── MODAL: Stock Adjustment ───────────────────────────────── */}
      {adjustModalOpen && selectedProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg, 14px)',
            width: '100%',
            maxWidth: 480,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowUpDown size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Adjust Inventory Stock</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{selectedProduct.title}</p>
                </div>
              </div>
              <button
                onClick={() => setAdjustModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleStockAdjustmentSubmit} style={{ padding: 24 }}>
              {/* Current Stock Preview Banner */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 8,
                padding: '12px 16px',
                marginBottom: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Current Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>{selectedProduct.stock} units</div>
                </div>
                <div style={{ color: '#94A3B8' }}>➔</div>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#64748B' }}>Projected Balance</div>
                  <div style={{
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: (selectedProduct.stock + Number(adjustmentDelta)) < 0 ? '#EF4444' : '#10B981'
                  }}>
                    {Math.max(0, selectedProduct.stock + Number(adjustmentDelta))} units
                  </div>
                </div>
              </div>

              {/* Adjustment Reason */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Adjustment Type & Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    background: 'var(--surface)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="restock">Inbound Restock (Supplier Delivery / PO +)</option>
                  <option value="damage_write_off">Damaged / Broken Goods Write-off (-)</option>
                  <option value="audit_correction">Cycle Count / Audit Correction (+/-)</option>
                  <option value="customer_return">Customer Return Restocked (+)</option>
                  <option value="manual_adjustment">General Manual Stock Adjustment (+/-)</option>
                </select>
              </div>

              {/* Quantity Delta */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Quantity Adjustment (positive to add, negative to subtract)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta(prev => prev - 5)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                  >
                    -5
                  </button>
                  <input
                    type="number"
                    value={adjustmentDelta}
                    onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                    required
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta(prev => prev + 10)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustmentDelta(prev => prev + 25)}
                    style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', background: '#F8FAFC', cursor: 'pointer', fontWeight: 700 }}
                  >
                    +25
                  </button>
                </div>
              </div>

              {/* Notes / Reference */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Audit Notes / Reference Number (PO#, Batch#, Shelf#)
                </label>
                <input
                  type="text"
                  placeholder="e.g. PO-88432 from Delhi Logistics / damaged packaging"
                  value={adjustmentNotes}
                  onChange={(e) => setAdjustmentNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjusting || adjustmentDelta === 0}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                >
                  {adjusting ? <RefreshCw size={14} className="spin" /> : <Check size={14} />}
                  <span>Confirm & Save Audit Record</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: SKU, Barcode & Location Editor ──────────────────── */}
      {skuModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 20
        }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius-lg, 14px)',
            width: '100%',
            maxWidth: 500,
            overflow: 'hidden',
            border: '1px solid var(--border)',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Barcode size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>SKU, Barcode & Warehouse Location</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>{skuForm.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSkuModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSkuBarcode} style={{ padding: 24 }}>
              {/* SKU */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Merchant SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ELEC-PRO-001"
                  value={skuForm.sku}
                  onChange={(e) => setSkuForm(prev => ({ ...prev, sku: e.target.value }))}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Barcode & EAN Generator */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                    Barcode (GS1 / EAN-13 / Code-128)
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateEan13}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4F46E5',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    <Sparkles size={12} />
                    <span>Auto-Generate GS1 EAN-13</span>
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 8901234567890"
                  value={skuForm.barcode}
                  onChange={(e) => setSkuForm(prev => ({ ...prev, barcode: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    fontFamily: 'monospace',
                    outline: 'none'
                  }}
                />
                {skuForm.barcode && (
                  <div style={{ marginTop: 8, textAlign: 'center' }}>
                    <BarcodeSvg value={skuForm.barcode} height={28} width={140} />
                  </div>
                )}
              </div>

              {/* Warehouse Location */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                  Warehouse Bin / Shelf Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Zone B, Aisle 4, Shelf 2"
                  value={skuForm.warehouseLocation}
                  onChange={(e) => setSkuForm(prev => ({ ...prev, warehouseLocation: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 8,
                    border: '1px solid var(--border)',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Safety Threshold & Lead Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                    Low-Stock Threshold
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={skuForm.lowStockThreshold}
                    onChange={(e) => setSkuForm(prev => ({ ...prev, lowStockThreshold: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 6, color: '#334155' }}>
                    Restock Lead (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={skuForm.restockLeadDays}
                    onChange={(e) => setSkuForm(prev => ({ ...prev, restockLeadDays: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: '1px solid var(--border)',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setSkuModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingSku}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem' }}
                >
                  {savingSku ? <RefreshCw size={14} className="spin" /> : <Check size={14} />}
                  <span>Save Product Identifiers</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DRAWER: Stock Movement Audit History ──────────────────── */}
      {historyDrawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          justifyContent: 'flex-end',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--surface)',
            width: '100%',
            maxWidth: 580,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderLeft: '1px solid var(--border)',
            boxShadow: '-10px 0 25px rgba(0,0,0,0.2)'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--surface-2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(79, 70, 229, 0.1)', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <History size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Stock Movement Audit Logs</h3>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Immutable historical ledger of restocks, orders & corrections
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Filter Bar */}
            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-2)' }}>
              <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)' }}>Filter Reason:</span>
              <select
                value={historyFilterReason}
                onChange={(e) => {
                  setHistoryFilterReason(e.target.value);
                  openHistoryDrawer();
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  fontSize: '0.78rem',
                  outline: 'none',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)'
                }}
              >
                <option value="all">All Movements</option>
                <option value="restock">Inbound Restock</option>
                <option value="order_deduction">Order Dispatched / Deduction</option>
                <option value="damage_write_off">Damaged / Expired Write-off</option>
                <option value="audit_correction">Cycle Count Audit</option>
                <option value="customer_return">Customer Return</option>
              </select>
            </div>

            {/* Movements Timeline List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <RefreshCw size={24} className="spin" style={{ margin: '0 auto 8px' }} />
                  <div>Loading audit logs...</div>
                </div>
              ) : movementLogs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  <History size={36} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No stock movements recorded yet</div>
                  <div style={{ fontSize: '0.8rem', marginTop: 4 }}>Adjust stock or fulfill customer orders to generate immutable audit records.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {movementLogs.map((log) => {
                    const isPositive = log.quantityDelta > 0;
                    const dateFormatted = new Date(log.createdAt).toLocaleString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    });

                    return (
                      <div
                        key={log._id}
                        style={{
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          padding: 14,
                          background: 'var(--surface)',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              color: isPositive ? '#15803D' : '#DC2626',
                              background: isPositive ? '#DCFCE7' : '#FEE2E2',
                              padding: '2px 8px',
                              borderRadius: 4
                            }}>
                              {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                              {isPositive ? `+${log.quantityDelta}` : log.quantityDelta} units
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '2px 6px',
                              borderRadius: 4,
                              background: '#F1F5F9',
                              color: '#475569'
                            }}>
                              {log.reason?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{dateFormatted}</span>
                        </div>

                        <div style={{ marginTop: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B' }}>
                            {log.productTitle || log.productId?.title || 'Product SKU'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: 2 }}>
                            Balance: <strong>{log.previousStock}</strong> ➔ <strong>{log.newStock}</strong> units
                          </div>
                        </div>

                        {log.notes && (
                          <div style={{ fontSize: '0.74rem', color: '#475569', marginTop: 6, background: '#F8FAFC', padding: '6px 10px', borderRadius: 6 }}>
                            {log.notes}
                            {log.referenceId && <span style={{ marginLeft: 6, color: '#6366F1', fontWeight: 600 }}>({log.referenceId})</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
