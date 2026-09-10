import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import { MapPin, Phone, Mail, Calendar, Store, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import '../../styles/marketplace.css';

export default function VendorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVendorById } = useAuth();
  const { getApprovedProducts } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  const vendor = getVendorById(id);
  const products = getApprovedProducts().filter((p) => p.vendorId === id);

  if (!vendor) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="empty-state">
          <Store size={64} className="empty-state-icon" />
          <h3>Vendor not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1E1B4B, #4F46E5)', padding: '40px 0' }}>
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '8px 14px', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', marginBottom: 24 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
            <img
              src={vendor.avatar}
              alt={vendor.businessName}
              style={{ width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(255,255,255,0.3)' }}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName)}&background=4F46E5&color=fff`; }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <Store size={18} color="#FCD34D" />
                <span style={{ color: '#FCD34D', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase' }}>Verified Vendor</span>
              </div>
              <h1 style={{ color: 'white', fontSize: '1.8rem', marginBottom: 4 }}>{vendor.businessName}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Owner: {vendor.ownerName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '28px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 28, alignItems: 'start' }}>
          {/* Vendor Info Card */}
          <div className="card">
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <h4>Store Information</h4>
              <div className="divider" />
              {[
                { icon: <MapPin size={16} />, label: 'Location', value: vendor.location },
                { icon: <Store size={16} />, label: 'Address', value: vendor.businessAddress },
                { icon: <Phone size={16} />, label: 'Mobile', value: vendor.mobile },
                { icon: <Mail size={16} />, label: 'Email', value: vendor.email },
                { icon: <Calendar size={16} />, label: 'Joined', value: new Date(vendor.joinedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' }) },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ color: 'var(--primary)', marginTop: 2, flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}

              <div className="divider" />
              <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{products.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Products Listed</div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 style={{ marginBottom: 20 }}>Products by {vendor.businessName}</h3>
            {products.length === 0 ? (
              <div className="empty-state">
                <Package size={48} className="empty-state-icon" />
                <h3>No approved products yet</h3>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="product-card"
                    onClick={() => navigate(`/shop/product/${product.id}`)}
                  >
                    <div className="product-card-img-wrap">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="product-card-img"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400&h=400&fit=crop'; }}
                      />
                    </div>
                    <div className="product-card-body">
                      <div className="product-card-name">{product.name}</div>
                      <div className="product-card-price">
                        <span className="currency">₹</span>{product.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        className="product-card-add-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                          addToast(`${product.name} added!`, 'success');
                        }}
                      >
                        <ShoppingCart size={14} /> Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart
      </footer>
    </div>
  );
}
