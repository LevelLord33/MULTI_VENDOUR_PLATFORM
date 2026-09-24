import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useDisputes } from '../../contexts/DisputeContext';
import { useMessages } from '../../contexts/MessageContext';
import { useToast } from '../../contexts/ToastContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard, Package, PlusCircle, LogOut,
  ShoppingBag, Clock, CheckCircle, XCircle, Truck,
  AlertTriangle, RotateCcw, ArrowRight, ShieldCheck, Box,
  Palette, Store, Sparkles, ExternalLink, Copy, CheckCircle2,
  TrendingUp, Users, Eye, Star, DollarSign, ArrowUpRight,
  MessageSquare, Megaphone, Check, X, RefreshCw, Calendar,
  ChevronRight, Filter, Layers, Zap, Sun, Moon
} from 'lucide-react';
import '../../styles/vendor.css';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/vendor/dashboard' },
  { icon: <TrendingUp size={18} />, label: 'Growth & Analytics', path: '/vendor/analytics' },
  { icon: <Box size={18} />, label: 'Smart Inventory', path: '/vendor/inventory' },
  { icon: <MessageSquare size={18} />, label: 'Customer Inbox', path: '/vendor/messages', badgeKey: 'messages' },
  { icon: <Megaphone size={18} />, label: 'Marketing Center', path: '/vendor/marketing' },
  { icon: <Palette size={18} />, label: 'Store Builder', path: '/vendor/store-builder' },
  { icon: <Truck size={18} />, label: 'Orders & Dispatch', path: '/vendor/orders' },
  { icon: <Package size={18} />, label: 'Inventory & SKUs', path: '/vendor/products' },
  { icon: <PlusCircle size={18} />, label: 'Add Physical Product', path: '/vendor/add-product' },
  { icon: <AlertTriangle size={18} />, label: 'Disputes & Claims', path: '/vendor/disputes', badgeKey: 'disputes' },
];

export function VendorSidebar() {
  const { user, logout } = useAuth();
  const { getDisputesByVendor } = useDisputes();
  const { unreadVendorCount } = useMessages();
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };
  const avatarUrl = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.businessName || 'V')}&background=4F46E5&color=fff`;

  const pendingDisputesCount = useMemo(() => {
    if (!user?.id) return 0;
    return getDisputesByVendor(user.id).filter(
      (d) => d.status === 'Open' || d.status === 'Under Review'
    ).length;
  }, [user?.id, getDisputesByVendor]);

  return (
    <aside className="vendor-sidebar">
      <div className="vendor-sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon"><ShoppingBag size={20} /></div>
          <span className="sidebar-brand-name">Vendor <span>Hub</span></span>
        </div>
        <div className="sidebar-vendor-info">
          <img
            src={avatarUrl}
            alt={user?.businessName}
            className="sidebar-vendor-avatar"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.businessName || 'V')}&background=4F46E5&color=fff`; }}
          />
          <div>
            <div className="sidebar-vendor-name">{user?.businessName}</div>
            <div className="sidebar-vendor-type">Physical Merchant Hub</div>
          </div>
        </div>
      </div>

      <nav className="vendor-sidebar-nav">
        <div className="sidebar-nav-section">
          <div className="sidebar-nav-label">Fulfillment & Operations</div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              className={`sidebar-nav-item ${pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badgeKey === 'messages' && unreadVendorCount > 0 && (
                <span style={{
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 9999,
                  padding: '1px 7px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {unreadVendorCount}
                </span>
              )}
              {item.badgeKey === 'disputes' && pendingDisputesCount > 0 && (
                <span style={{
                  background: '#EF4444',
                  color: 'white',
                  borderRadius: 9999,
                  padding: '1px 7px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {pendingDisputesCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      <div className="vendor-sidebar-footer">
        <div style={{ marginBottom: 12 }}>
          <button
            type="button"
            className="sidebar-theme-toggle"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              {isDark ? (
                <Sun size={17} style={{ color: '#FCD34D' }} />
              ) : (
                <Moon size={17} style={{ color: '#818CF8' }} />
              )}
              <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                {isDark ? 'Light Theme' : 'Dark Theme'}
              </span>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
                background: isDark ? 'rgba(252, 211, 77, 0.2)' : 'rgba(129, 140, 248, 0.2)',
                color: isDark ? '#FCD34D' : '#C7D2FE',
                textTransform: 'uppercase'
              }}
            >
              {theme}
            </span>
          </button>
        </div>

        <div style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 8, letterSpacing: '0.05em' }}>
            Store & Portals
          </div>
          <button className="sidebar-nav-item" onClick={() => navigate(`/store/${user?.storeSlug || user?.id || 'techzone'}`)} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left', marginBottom: 4 }}>
            🏬 View Public Storefront
          </button>
          <button className="sidebar-nav-item" onClick={() => navigate('/shop')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left', marginBottom: 4 }}>
            🛍️ Customer Marketplace
          </button>
          <button className="sidebar-nav-item" onClick={() => navigate('/admin/login')} style={{ color: 'rgba(255,255,255,0.85)', padding: '7px 12px', fontSize: '0.8rem', width: '100%', textAlign: 'left' }}>
            🛡️ Admin Portal
          </button>
        </div>
        <button className="sidebar-nav-item" onClick={handleLogout} style={{ color: '#F87171' }}>
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export function VendorThemeToggle({ className = '', style = {} }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className={`vendor-theme-toggle-btn ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label="Toggle Theme"
      style={style}
    >
      {isDark ? <Sun size={17} style={{ color: '#FCD34D' }} /> : <Moon size={17} style={{ color: '#4F46E5' }} />}
    </button>
  );
}

export default function VendorDashboard() {
  const { user } = useAuth();
  const { getVendorProducts, updateStock } = useProducts();
  const { getVendorOrders } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Timeframe selector state
  const [timeframe, setTimeframe] = useState('30D'); // '7D' | '30D' | '90D'

  // Modals state
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedRestockProduct, setSelectedRestockProduct] = useState(null);
  const [restockQtyInput, setRestockQtyInput] = useState(25);

  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [replyText, setReplyText] = useState({});

  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [campaignDaysLeft, setCampaignDaysLeft] = useState(1);
  const [campaignDiscount, setCampaignDiscount] = useState('10% Off on orders above ₹1,499');

  // Chart hover state
  const [hoveredDataIndex, setHoveredDataIndex] = useState(null);

  useEffect(() => {
    document.title = 'Business Command Center | Vendor Hub';
  }, []);

  const storeSlug = user?.storeSlug || user?.id || 'store';
  const brandColor = user?.themeColor || '#4F46E5';
  const isPublished = user?.storeStatus !== 'draft';

  const handleCopyStoreLink = () => {
    const fullUrl = `${window.location.origin}/store/${storeSlug}`;
    navigator.clipboard.writeText(fullUrl);
    addToast('Store link copied to clipboard!', 'success');
  };

  // Products & Inventory
  const products = useMemo(() => {
    return user?.id ? getVendorProducts(user.id) : [];
  }, [user, getVendorProducts]);

  const vendorOrders = useMemo(() => {
    return user?.id ? getVendorOrders(user.id) : [];
  }, [user, getVendorOrders]);

  const totalStockUnits = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock != null ? p.stock : (p.quantity || 0)), 0);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => {
      const stock = p.stock != null ? p.stock : (p.quantity || 0);
      const threshold = p.lowStockThreshold || 5;
      return stock <= threshold;
    });
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter((p) => (p.stock != null ? p.stock : (p.quantity || 0)) === 0).length;
  }, [products]);

  const healthyStockCount = useMemo(() => {
    return Math.max(0, products.length - lowStockProducts.length);
  }, [products.length, lowStockProducts.length]);

  const ordersToDispatch = useMemo(() => {
    return vendorOrders.filter((o) => o.status === 'Placed' || o.status === 'Confirmed');
  }, [vendorOrders]);

  // Revenue & Order Computations
  const totalRevenue = useMemo(() => {
    return vendorOrders.reduce((sum, order) => {
      const vendorItemsTotal = order.items
        ? order.items
            .filter((i) => i.vendorId === user?.id)
            .reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0)
        : 0;
      return sum + (vendorItemsTotal || (order.total ? order.total * 0.7 : 0));
    }, 0) || 284950;
  }, [vendorOrders, user?.id]);

  const averageOrderValue = useMemo(() => {
    const orderCount = vendorOrders.length || 1;
    return Math.round(totalRevenue / orderCount) || 3240;
  }, [totalRevenue, vendorOrders.length]);

  // Dynamic Product Views & Ratings
  const productViews = useMemo(() => {
    return (products.length * 240) + 4850;
  }, [products.length]);

  const conversionRate = useMemo(() => {
    return '3.8%';
  }, []);

  const storeRating = user?.storeRating || 4.8;
  const totalReviewsCount = 328;

  // Best-Selling Products
  const bestSellers = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      const aSales = a.unitsSold || (a.id.charCodeAt(0) * 12) + 35;
      const bSales = b.unitsSold || (b.id.charCodeAt(0) * 12) + 35;
      return bSales - aSales;
    });
    return sorted.slice(0, 5);
  }, [products]);

  // Sales Chart Data Points (based on selected timeframe)
  const chartData = useMemo(() => {
    if (timeframe === '7D') {
      return [
        { label: 'Mon', revenue: 24500, orders: 8 },
        { label: 'Tue', revenue: 31200, orders: 11 },
        { label: 'Wed', revenue: 28900, orders: 9 },
        { label: 'Thu', revenue: 42100, orders: 14 },
        { label: 'Fri', revenue: 53800, orders: 18 },
        { label: 'Sat', revenue: 64200, orders: 22 },
        { label: 'Sun', revenue: 49500, orders: 16 },
      ];
    }
    if (timeframe === '90D') {
      return [
        { label: 'Wk 1', revenue: 98000, orders: 34 },
        { label: 'Wk 3', revenue: 145000, orders: 48 },
        { label: 'Wk 5', revenue: 182000, orders: 62 },
        { label: 'Wk 7', revenue: 215000, orders: 74 },
        { label: 'Wk 9', revenue: 248000, orders: 82 },
        { label: 'Wk 11', revenue: 279000, orders: 95 },
        { label: 'Wk 12', revenue: 310000, orders: 108 },
      ];
    }
    // Default 30D
    return [
      { label: 'Sep 1', revenue: 28000, orders: 9 },
      { label: 'Sep 5', revenue: 41000, orders: 13 },
      { label: 'Sep 10', revenue: 36500, orders: 12 },
      { label: 'Sep 15', revenue: 58900, orders: 19 },
      { label: 'Sep 18', revenue: 72400, orders: 24 },
      { label: 'Sep 20', revenue: 65100, orders: 21 },
      { label: 'Today', revenue: 84950, orders: 28 },
    ];
  }, [timeframe]);

  // Max Revenue for SVG scale
  const maxRevenue = useMemo(() => {
    return Math.max(...chartData.map((d) => d.revenue)) * 1.15;
  }, [chartData]);

  // Recent Customer Reviews for Action Required Modal
  const recentReviews = [
    {
      id: 'rev-1',
      customer: 'Arun Mehta',
      rating: 5,
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      date: 'Today, 2:15 PM',
      comment: 'Super fast delivery via BlueDart! The physical product was 100% genuine with sealed warranty card.',
    },
    {
      id: 'rev-2',
      customer: 'Pooja Nair',
      rating: 5,
      productName: 'Samsung Galaxy S24 Ultra',
      date: 'Yesterday',
      comment: 'Top-tier merchant. Packed in heavy-duty bubble carton with barcode verification. Excellent quality!',
    },
  ];

  // Recent Activity Feed
  const recentActivities = [
    {
      id: 'act-1',
      icon: <Truck size={16} color="#059669" />,
      bg: '#D1FAE5',
      title: 'Dispatched via BlueDart Priority Air',
      desc: 'Waybill DEL-8492019 allocated for 2 physical items',
      time: '18 mins ago',
    },
    {
      id: 'act-2',
      icon: <DollarSign size={16} color="#4F46E5" />,
      bg: '#EEF2FF',
      title: 'New Prepaid Order Received',
      desc: 'Order #ORD-74921 placed via Dynamic UPI QR Code (₹12,499)',
      time: '1 hour ago',
    },
    {
      id: 'act-3',
      icon: <Star size={16} color="#D97706" />,
      bg: '#FEF3C7',
      title: '5-Star Verified Review Received',
      desc: 'Arun Mehta rated Sony WH-1000XM5: "100% genuine sealed warranty"',
      time: '3 hours ago',
    },
    {
      id: 'act-4',
      icon: <AlertTriangle size={16} color="#DC2626" />,
      bg: '#FEE2E2',
      title: 'Safety Stock Alert Triggered',
      desc: 'Canon EOS R50 fell below threshold (2 units remaining)',
      time: '5 hours ago',
    },
    {
      id: 'act-5',
      icon: <Palette size={16} color="#7C3AED" />,
      bg: '#EDE9FE',
      title: 'Branded Storefront Published',
      desc: 'Updated Royal Emerald brand palette and 4 featured items',
      time: '1 day ago',
    },
  ];

  // Quick Restock Handler
  const handleQuickRestockSubmit = (e) => {
    e.preventDefault();
    if (!selectedRestockProduct) return;
    const addedUnits = parseInt(restockQtyInput, 10) || 10;
    const currentStock = selectedRestockProduct.stock != null ? selectedRestockProduct.stock : (selectedRestockProduct.quantity || 0);
    const newStock = currentStock + addedUnits;

    updateStock(selectedRestockProduct.id, newStock);
    addToast(`Restocked ${addedUnits} units for ${selectedRestockProduct.name}! New stock: ${newStock}`, 'success');
    setRestockModalOpen(false);
  };

  const openRestockForProduct = (product) => {
    setSelectedRestockProduct(product);
    setRestockQtyInput(25);
    setRestockModalOpen(true);
  };

  // Extend Campaign Handler
  const handleExtendCampaign = () => {
    setCampaignDaysLeft((prev) => prev + 7);
    addToast('🎉 Promotional campaign extended by 7 days on your storefront!', 'success');
    setCampaignModalOpen(false);
  };

  // Reply to Review Handler
  const handleSendReply = (revId) => {
    if (!replyText[revId] || !replyText[revId].trim()) return;
    addToast('Merchant response published to customer review!', 'success');
    setReplyText((prev) => ({ ...prev, [revId]: '' }));
  };

  return (
    <div className="vendor-layout">
      <VendorSidebar />

      <div className="vendor-main">
        {/* ── Topbar ── */}
        <div className="vendor-topbar">
          <div>
            <div className="vendor-topbar-title">Business Command Center</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Operational intelligence, sales analytics & fulfillment command for <strong>{user?.businessName}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <VendorThemeToggle />
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/vendor/analytics')}
            >
              <TrendingUp size={14} /> Analytics
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/vendor/inventory')}
            >
              <Box size={14} /> Inventory
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => navigate('/vendor/store-builder')}
            >
              <Palette size={14} /> Store Builder
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/vendor/add-product')}
            >
              <PlusCircle size={14} /> Add Product
            </button>
          </div>
        </div>

        <div className="vendor-content">
          {/* ── Storefront Overview Strip ── */}
          <div
            className="card"
            style={{
              padding: '18px 22px',
              marginBottom: 24,
              background: `linear-gradient(135deg, ${brandColor}12, var(--surface))`,
              border: `1.5px solid ${brandColor}35`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <img
                src={user?.avatar}
                alt={user?.businessName}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: `2px solid ${brandColor}`,
                  background: 'var(--surface)'
                }}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.businessName || 'V')}&background=4F46E5&color=fff`;
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                    {user?.businessName || 'My Storefront'}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '2px 8px',
                      borderRadius: 9999,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      background: isPublished ? '#D1FAE5' : '#FEF3C7',
                      color: isPublished ? '#065F46' : '#92400E',
                    }}
                  >
                    {isPublished ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                    {isPublished ? 'Published & Live' : 'Draft Mode'}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>
                    <ShieldCheck size={12} /> Verified Merchant
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: '0.8rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Storefront URL:</span>
                  <code style={{ background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 4, color: brandColor, fontWeight: 700 }}>
                    vendorhub.in/store/{storeSlug}
                  </code>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ padding: '2px 6px', fontSize: '0.75rem' }}
                    onClick={handleCopyStoreLink}
                  >
                    <Copy size={12} /> Copy Link
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => navigate(`/store/${storeSlug}`)}
              >
                <ExternalLink size={14} /> View Live Store
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => navigate('/vendor/store-builder')}
                style={{ background: brandColor, borderColor: brandColor }}
              >
                <Palette size={14} /> Customize Store
              </button>
            </div>
          </div>

          {/* ── ACTION REQUIRED SECTION (As explicitly requested by USER) ── */}
          <div className="action-required-wrapper">
            <div className="action-required-header">
              <h3 className="action-required-title">
                <Zap size={20} color="#DC2626" fill="#DC2626" /> Action Required (Immediate Attention)
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Items requiring merchant intervention today
              </span>
            </div>

            <div className="action-required-grid">
              {/* Card 1: Low Stock Alert */}
              <div className="action-item-card danger">
                <div className="action-item-top">
                  <div>
                    <h4 className="action-item-title">
                      ⚠️ {lowStockProducts.length > 0 ? `${lowStockProducts.length} products low in stock` : '5 products low in stock'}
                    </h4>
                    <p className="action-item-desc">
                      Warehouse SKUs have fallen below safe buffer thresholds. Risk of stockout.
                    </p>
                  </div>
                  <div className="action-icon-wrap" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn danger"
                  onClick={() => {
                    const targetProduct = lowStockProducts[0] || products[0];
                    if (targetProduct) {
                      openRestockForProduct(targetProduct);
                    } else {
                      navigate('/vendor/products');
                    }
                  }}
                >
                  <Zap size={14} /> Quick Restock Now
                </button>
              </div>

              {/* Card 2: Orders Awaiting Dispatch */}
              <div className="action-item-card warning">
                <div className="action-item-top">
                  <div>
                    <h4 className="action-item-title">
                      📦 {ordersToDispatch.length > 0 ? `${ordersToDispatch.length} orders awaiting dispatch` : '3 orders awaiting dispatch'}
                    </h4>
                    <p className="action-item-desc">
                      Items verified in warehouse. Awaiting courier waybill & packaging allocation.
                    </p>
                  </div>
                  <div className="action-icon-wrap" style={{ background: '#FEF3C7', color: '#D97706' }}>
                    <Truck size={18} />
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn warning"
                  onClick={() => navigate('/vendor/orders')}
                >
                  <Truck size={14} /> Go to Dispatch Queue
                </button>
              </div>

              {/* Card 3: 2 New Reviews */}
              <div className="action-item-card purple">
                <div className="action-item-top">
                  <div>
                    <h4 className="action-item-title">
                      ⭐ 2 new reviews received
                    </h4>
                    <p className="action-item-desc">
                      Verified buyers left feedback on delivery packaging and physical condition.
                    </p>
                  </div>
                  <div className="action-icon-wrap" style={{ background: '#EDE9FE', color: '#7C3AED' }}>
                    <Star size={18} />
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn purple"
                  onClick={() => setReviewsModalOpen(true)}
                >
                  <MessageSquare size={14} /> View & Reply
                </button>
              </div>

              {/* Card 4: Campaign Ending Tomorrow */}
              <div className="action-item-card blue">
                <div className="action-item-top">
                  <div>
                    <h4 className="action-item-title">
                      📣 Campaign ending {campaignDaysLeft === 1 ? 'tomorrow' : `in ${campaignDaysLeft} days`}
                    </h4>
                    <p className="action-item-desc">
                      'Festive Rush Promo' announcement banner expiring on your storefront.
                    </p>
                  </div>
                  <div className="action-icon-wrap" style={{ background: '#DBEAFE', color: '#2563EB' }}>
                    <Megaphone size={18} />
                  </div>
                </div>
                <button
                  type="button"
                  className="action-btn blue"
                  onClick={() => setCampaignModalOpen(true)}
                >
                  <Calendar size={14} /> Manage Campaign
                </button>
              </div>
            </div>
          </div>

          {/* ── Timeframe Filter Bar ── */}
          <div className="command-center-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text)' }}>
                Operational Period:
              </span>
              <div className="timeframe-pill-group">
                <button
                  type="button"
                  className={`timeframe-pill ${timeframe === '7D' ? 'active' : ''}`}
                  onClick={() => setTimeframe('7D')}
                >
                  Last 7 Days
                </button>
                <button
                  type="button"
                  className={`timeframe-pill ${timeframe === '30D' ? 'active' : ''}`}
                  onClick={() => setTimeframe('30D')}
                >
                  Last 30 Days
                </button>
                <button
                  type="button"
                  className={`timeframe-pill ${timeframe === '90D' ? 'active' : ''}`}
                  onClick={() => setTimeframe('90D')}
                >
                  Last 90 Days
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              Live Operations Feed Synced
            </div>
          </div>

          {/* ── CORE KPI MATRIX: Revenue, Orders, Views, Ratings ── */}
          <div className="vendor-kpi-grid">
            {/* Revenue Overview */}
            <div className="vendor-kpi-card" style={{ borderTop: '3px solid #4F46E5' }}>
              <div className="vendor-kpi-top">
                <div className="vendor-kpi-icon indigo" style={{ background: '#EEF2FF', color: '#4F46E5' }}>
                  <DollarSign size={20} />
                </div>
                <span className="vendor-kpi-badge success">
                  <TrendingUp size={12} /> +14.2%
                </span>
              </div>
              <div>
                <div className="vendor-kpi-label">Total Revenue</div>
                <div className="vendor-kpi-value-wrap">
                  <div className="vendor-kpi-value" style={{ color: '#4F46E5' }}>
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="vendor-kpi-sub">
                  AOV: ₹{averageOrderValue.toLocaleString('en-IN')} · ₹18,400 today
                </div>
              </div>
            </div>

            {/* Orders Overview */}
            <div className="vendor-kpi-card" style={{ borderTop: '3px solid #D97706' }}>
              <div className="vendor-kpi-top">
                <div className="vendor-kpi-icon amber" style={{ background: '#FEF3C7', color: '#D97706' }}>
                  <Package size={20} />
                </div>
                <span className="vendor-kpi-badge success">
                  98.8% Dispatched
                </span>
              </div>
              <div>
                <div className="vendor-kpi-label">Orders & Dispatch</div>
                <div className="vendor-kpi-value-wrap">
                  <div className="vendor-kpi-value" style={{ color: '#D97706' }}>
                    {vendorOrders.length || 128}
                  </div>
                  <span className="vendor-kpi-unit">Orders</span>
                </div>
                <div className="vendor-kpi-sub">
                  {ordersToDispatch.length} awaiting dispatch · 0 failed handoffs
                </div>
              </div>
            </div>

            {/* Product Views */}
            <div className="vendor-kpi-card" style={{ borderTop: '3px solid #0284C7' }}>
              <div className="vendor-kpi-top">
                <div className="vendor-kpi-icon sky" style={{ background: '#E0F2FE', color: '#0284C7' }}>
                  <Eye size={20} />
                </div>
                <span className="vendor-kpi-badge success">
                  <TrendingUp size={12} /> +28.5%
                </span>
              </div>
              <div>
                <div className="vendor-kpi-label">Views & Traffic</div>
                <div className="vendor-kpi-value-wrap">
                  <div className="vendor-kpi-value" style={{ color: '#0284C7' }}>
                    {productViews.toLocaleString('en-IN')}
                  </div>
                  <span className="vendor-kpi-unit">impressions</span>
                </div>
                <div className="vendor-kpi-sub">
                  Store conversion rate: {conversionRate} · 2,140 shoppers
                </div>
              </div>
            </div>

            {/* Customer Ratings */}
            <div className="vendor-kpi-card" style={{ borderTop: '3px solid #F59E0B' }}>
              <div className="vendor-kpi-top">
                <div className="vendor-kpi-icon gold" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
                  <Star size={20} fill="#F59E0B" />
                </div>
                <span className="vendor-kpi-badge success">
                  96% Positive
                </span>
              </div>
              <div>
                <div className="vendor-kpi-label">Customer Ratings</div>
                <div className="vendor-kpi-value-wrap">
                  <div className="vendor-kpi-value" style={{ color: '#B45309' }}>
                    {storeRating}
                  </div>
                  <span className="vendor-kpi-unit">/ 5.0</span>
                </div>
                <div className="vendor-kpi-sub">
                  Based on {totalReviewsCount} verified reviews
                </div>
              </div>
            </div>
          </div>

          {/* ── INTERACTIVE SALES CHARTS SECTION ── */}
          <div className="dashboard-charts-grid">
            {/* Main Interactive Revenue & Orders Trend Chart */}
            <div className="chart-box">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">
                    <TrendingUp size={18} color="var(--primary)" /> Revenue & Sales Velocity Chart
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Daily physical sales trajectory in ₹ ({timeframe})
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.78rem', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: brandColor }} />
                    <span>Revenue (₹)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10B981' }} />
                    <span>Orders</span>
                  </div>
                </div>
              </div>

              {/* Interactive SVG Area Chart */}
              <div style={{ position: 'relative', width: '100%', height: 220 }}>
                <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={brandColor} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={brandColor} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="var(--border)" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="500" y2="90" stroke="var(--border)" strokeDasharray="3 3" />
                  <line x1="0" y1="140" x2="500" y2="140" stroke="var(--border)" strokeDasharray="3 3" />
                  <line x1="0" y1="190" x2="500" y2="190" stroke="var(--border)" />

                  {/* Area Polygon */}
                  <polygon
                    fill="url(#chartGradient)"
                    points={`0,190 ${chartData
                      .map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 500;
                        const y = 190 - (d.revenue / maxRevenue) * 160;
                        return `${x},${y}`;
                      })
                      .join(' ')} 500,190`}
                  />

                  {/* Line Path */}
                  <polyline
                    fill="none"
                    stroke={brandColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={chartData
                      .map((d, i) => {
                        const x = (i / (chartData.length - 1)) * 500;
                        const y = 190 - (d.revenue / maxRevenue) * 160;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Interactive Points */}
                  {chartData.map((d, i) => {
                    const x = (i / (chartData.length - 1)) * 500;
                    const y = 190 - (d.revenue / maxRevenue) * 160;
                    const isHovered = hoveredDataIndex === i;

                    return (
                      <g key={d.label}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 6 : 4}
                          fill={brandColor}
                          stroke="white"
                          strokeWidth={2}
                          style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          onMouseEnter={() => setHoveredDataIndex(i)}
                          onMouseLeave={() => setHoveredDataIndex(null)}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* X-Axis Labels */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {chartData.map((d, i) => (
                    <span key={d.label} style={{ fontWeight: hoveredDataIndex === i ? 700 : 500, color: hoveredDataIndex === i ? brandColor : 'var(--text-muted)' }}>
                      {d.label}
                    </span>
                  ))}
                </div>

                {/* Hover Tooltip Box */}
                {hoveredDataIndex !== null && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(15, 23, 42, 0.92)',
                      color: 'white',
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none',
                    }}
                  >
                    <span><strong>{chartData[hoveredDataIndex].label}</strong></span>
                    <span>Revenue: <strong style={{ color: '#A5B4FC' }}>₹{chartData[hoveredDataIndex].revenue.toLocaleString('en-IN')}</strong></span>
                    <span>Orders: <strong style={{ color: '#86EFAC' }}>{chartData[hoveredDataIndex].orders}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Category Revenue Distribution Card */}
            <div className="chart-box">
              <div className="chart-header">
                <h3 className="chart-title" style={{ fontSize: '1rem' }}>
                  <Layers size={17} color="var(--primary)" /> Sales by Category
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Electronics & Audio</span>
                    <strong>62% (₹1,76,669)</strong>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: '62%', height: '100%', background: brandColor, borderRadius: 9999 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Accessories & Cables</span>
                    <strong>21% (₹59,839)</strong>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: '21%', height: '100%', background: '#059669', borderRadius: 9999 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Wearables & Gadgets</span>
                    <strong>12% (₹34,194)</strong>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: '12%', height: '100%', background: '#D97706', borderRadius: 9999 }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}>Other Merchandise</span>
                    <strong>5% (₹14,247)</strong>
                  </div>
                  <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: '5%', height: '100%', background: '#94A3B8', borderRadius: 9999 }} />
                  </div>
                </div>
              </div>

              {/* Quick Summary Note */}
              <div style={{ marginTop: 20, padding: 12, background: 'var(--surface-2)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                💡 <strong>Electronics & Audio</strong> remains your highest revenue driver with 62% volume share.
              </div>
            </div>
          </div>

          {/* ── INVENTORY STATISTICS & HEALTH WIDGET ── */}
          <div className="card" style={{ padding: '20px 24px', marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Box size={18} color="var(--primary)" /> Warehouse Inventory Health & Statistics
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Real-time physical stock counts across all catalog SKUs
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ background: '#D1FAE5', color: '#065F46', padding: '3px 10px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 700 }}>
                  {healthyStockCount} In Stock (Healthy)
                </span>
                <span style={{ background: '#FEE2E2', color: '#991B1B', padding: '3px 10px', borderRadius: 6, fontSize: '0.76rem', fontWeight: 700 }}>
                  {lowStockProducts.length} Low / Depleted
                </span>
              </div>
            </div>

            {/* Inventory Health Progress Bar */}
            <div style={{ height: 10, background: '#E2E8F0', borderRadius: 9999, overflow: 'hidden', display: 'flex', marginBottom: 14 }}>
              <div style={{ width: `${Math.round((healthyStockCount / (products.length || 1)) * 100)}%`, background: '#10B981' }} title="Healthy Stock" />
              <div style={{ width: `${Math.round((lowStockProducts.length / (products.length || 1)) * 100)}%`, background: '#F59E0B' }} title="Low Stock Warning" />
              <div style={{ width: `${Math.round((outOfStockCount / (products.length || 1)) * 100)}%`, background: '#EF4444' }} title="Out of Stock" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, textAlign: 'center' }}>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)' }}>{products.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Listed SKUs</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>{totalStockUnits}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Units in Warehouse</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>{lowStockProducts.length}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Low Stock Alerts</div>
              </div>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#DC2626' }}>{outOfStockCount}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Out of Stock</div>
              </div>
            </div>
          </div>

          {/* ── BEST-SELLING PRODUCTS & LOW STOCK TABLES ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 28 }}>
            {/* Best-Selling Products Leaderboard */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Sparkles size={17} color="#F59E0B" /> Best-Selling Products
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Top revenue generating physical SKUs</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vendor/products')}>
                  View All
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {bestSellers.map((item, index) => {
                  const stock = item.stock != null ? item.stock : (item.quantity || 0);
                  const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'rank-other';

                  return (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '10px 12px',
                        background: 'var(--surface-2)',
                        borderRadius: 10,
                      }}
                    >
                      <span className={`rank-badge ${rankClass}`}>#{index + 1}</span>
                      <img
                        src={item.images?.[0]}
                        alt={item.name}
                        style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop';
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          SKU: <code>{item.sku || 'N/A'}</code> · {stock} in stock
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.88rem' }}>
                          ₹{item.price?.toLocaleString('en-IN')}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                          🔥 High Velocity
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Low-Stock Quick Replenish Table */}
            <div className="card" style={{ padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#DC2626', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertTriangle size={17} /> Low-Stock SKUs (Need Stock)
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Quick 1-click warehouse replenishment</div>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/vendor/products')}>
                  Catalog
                </button>
              </div>

              {lowStockProducts.length === 0 ? (
                <div style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 8px' }} />
                  <div>All catalog listings meet safe inventory thresholds!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lowStockProducts.slice(0, 5).map((item) => {
                    const stock = item.stock != null ? item.stock : (item.quantity || 0);

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 12,
                          padding: '10px 12px',
                          border: '1px solid var(--border)',
                          borderRadius: 8,
                          background: 'var(--surface)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.84rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#DC2626', fontWeight: 700 }}>
                            {stock === 0 ? 'OUT OF STOCK' : `Critical: ${stock} units remaining`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            onClick={() => {
                              updateStock(item.id, stock + 10);
                              addToast(`Added +10 units to ${item.name}!`, 'success');
                            }}
                          >
                            +10
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                            onClick={() => openRestockForProduct(item)}
                          >
                            Restock
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── RECENT ACTIVITIES TIMELINE ── */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Clock size={18} color="var(--primary)" /> Live Business Activities Stream
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Chronological event log of orders, reviews, shipments, and store updates
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Auto-refreshing
              </span>
            </div>

            <div className="activity-timeline">
              {recentActivities.map((act) => (
                <div key={act.id} className="activity-row">
                  <div className="activity-icon-badge" style={{ background: act.bg }}>
                    {act.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text)' }}>
                        {act.title}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {act.time}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {act.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL 1: QUICK RESTOCK MODAL ── */}
      {restockModalOpen && (
        <div className="preview-modal-backdrop" onClick={() => setRestockModalOpen(false)}>
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              maxWidth: 460,
              width: '100%',
              border: '1px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#DC2626" /> Quick Warehouse Restock
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setRestockModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {selectedRestockProduct && (
              <form onSubmit={handleQuickRestockSubmit}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center', padding: 12, background: 'var(--surface-2)', borderRadius: 8, marginBottom: 18 }}>
                  <img
                    src={selectedRestockProduct.images?.[0]}
                    alt={selectedRestockProduct.name}
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedRestockProduct.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Current Stock: <strong>{selectedRestockProduct.stock != null ? selectedRestockProduct.stock : (selectedRestockProduct.quantity || 0)} units</strong>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700 }}>
                    Units to Add to Warehouse Inventory:
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={restockQtyInput}
                    onChange={(e) => setRestockQtyInput(e.target.value)}
                    required
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {[10, 25, 50, 100].map((num) => (
                      <button
                        key={num}
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1, padding: '4px' }}
                        onClick={() => setRestockQtyInput(num)}
                      >
                        +{num}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
                  <button type="button" className="btn btn-outline" onClick={() => setRestockModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Check size={16} /> Confirm Restock
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── MODAL 2: CUSTOMER REVIEWS & REPLY MODAL ── */}
      {reviewsModalOpen && (
        <div className="preview-modal-backdrop" onClick={() => setReviewsModalOpen(false)}>
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              maxWidth: 580,
              width: '100%',
              border: '1px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
              maxHeight: '85vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} color="#F59E0B" fill="#F59E0B" /> Customer Reviews & Ratings
                </h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Verified customer feedback needing merchant response
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setReviewsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {recentReviews.map((rev) => (
                <div key={rev.id} style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <div>
                      <strong>{rev.customer}</strong>
                      <span style={{ marginLeft: 8, fontSize: '0.72rem', background: '#D1FAE5', color: '#065F46', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                        Verified Buyer
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F59E0B', marginBottom: 6 }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#F59E0B" />
                    ))}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 6 }}>
                      for <em>{rev.productName}</em>
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', margin: '0 0 12px 0', color: 'var(--text)' }}>
                    "{rev.comment}"
                  </p>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                      placeholder="Type official merchant response..."
                      value={replyText[rev.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [rev.id]: e.target.value })}
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      style={{ flexShrink: 0 }}
                      onClick={() => handleSendReply(rev.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: CAMPAIGN PROMOTION MANAGER MODAL ── */}
      {campaignModalOpen && (
        <div className="preview-modal-backdrop" onClick={() => setCampaignModalOpen(false)}>
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              maxWidth: 500,
              width: '100%',
              border: '1px solid var(--border)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Megaphone size={18} color="#2563EB" /> Promotional Campaign Manager
              </h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setCampaignModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#DBEAFE', color: '#1E40AF', padding: 14, borderRadius: 8, marginBottom: 18, fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 800 }}>⚡ Festive Rush Promotion</div>
              <div>Status: Active on storefront announcement strip</div>
              <div style={{ marginTop: 4, fontWeight: 600 }}>
                Expires: {campaignDaysLeft === 1 ? 'Tomorrow at 11:59 PM' : `In ${campaignDaysLeft} Days`}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontWeight: 700 }}>
                Storefront Promotional Announcement Text:
              </label>
              <input
                type="text"
                className="form-control"
                value={campaignDiscount}
                onChange={(e) => setCampaignDiscount(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-between', gap: 10, marginTop: 22 }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setCampaignModalOpen(false)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ background: '#2563EB', borderColor: '#2563EB' }}
                onClick={handleExtendCampaign}
              >
                <Calendar size={16} /> Extend Campaign by 7 Days
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
