import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProducts } from '../../contexts/ProductContext';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import {
  Heart, ShoppingCart, Trash2, ArrowRight, Store, Star,
  ShieldCheck, MapPin, Truck, Check, PackageOpen, ExternalLink, Sparkles
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function Wishlist() {
  const { wishlist, followedVendors, isWishlisted, toggleWishlist, toggleFollowVendor, vendors } = useAuth();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'vendors'

  // Map wishlist product IDs to actual product objects
  const wishlistedProducts = useMemo(() => {
    if (!Array.isArray(wishlist) || wishlist.length === 0) return [];
    return products.filter((p) => wishlist.includes(p.id));
  }, [wishlist, products]);

  // Map followed vendor IDs to vendor objects
  const followedVendorList = useMemo(() => {
    if (!Array.isArray(followedVendors) || followedVendors.length === 0) return [];
    return vendors.filter((v) => followedVendors.includes(v.id));
  }, [followedVendors, vendors]);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product, 1);
    addToast(`${product.name} added to your cart!`, 'success');
  };

  const handleRemoveWishlist = async (productId, productName, e) => {
    e.stopPropagation();
    await toggleWishlist(productId);
    addToast(`Removed ${productName} from wishlist`, 'info');
  };

  const handleUnfollowVendor = async (vendorId, vendorName, e) => {
    e.stopPropagation();
    await toggleFollowVendor(vendorId);
    addToast(`Unfollowed ${vendorName}`, 'info');
  };

  return (
    <div className="marketplace-layout">
      <Navbar />

      <main className="marketplace-container" style={{ padding: '32px 16px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'
            }}>
              <Heart size={22} fill="#fff" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                Wishlist & Followed Vendors
              </h1>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Quickly access your saved items and stay updated with your favorite merchant stores.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', marginTop: 24 }}>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'products' ? '3px solid #EC4899' : '3px solid transparent',
                color: activeTab === 'products' ? '#EC4899' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <Heart size={16} fill={activeTab === 'products' ? '#EC4899' : 'none'} />
              Saved Products ({wishlistedProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('vendors')}
              style={{
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === 'vendors' ? '3px solid var(--primary)' : '3px solid transparent',
                color: activeTab === 'vendors' ? 'var(--primary)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'all 0.15s ease'
              }}
            >
              <Store size={16} />
              Followed Stores ({followedVendorList.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Saved Products */}
        {activeTab === 'products' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '64px 20px',
                background: 'var(--surface)',
                borderRadius: 16,
                border: '1px dashed var(--border)'
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 50,
                  background: 'rgba(236, 72, 153, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', color: '#EC4899'
                }}>
                  <Heart size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
                  Your wishlist is empty
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 24px' }}>
                  Explore thousands of unique products from verified merchants across India and tap the heart icon to save items here!
                </p>
                <Link to="/shop" className="btn btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Explore Customer Shop <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 20
              }}>
                {wishlistedProducts.map((product) => {
                  const vendor = vendors.find((v) => v.id === product.vendorId);
                  const isStockOut = (product.stock ?? 0) <= 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => navigate(`/shop/product/${product.id}`)}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 14,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 10px 24px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Product Image */}
                      <div style={{ position: 'relative', width: '100%', height: 180, background: '#f3f4f6' }}>
                        <img
                          src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                          alt={product.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <button
                          onClick={(e) => handleRemoveWishlist(product.id, product.name, e)}
                          title="Remove from wishlist"
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.95)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#EC4899',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                          }}
                        >
                          <Heart size={18} fill="#EC4899" />
                        </button>

                        {product.discount > 0 && (
                          <span style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            background: '#10B981',
                            color: '#fff',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6
                          }}>
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {vendor?.businessName || 'Verified Merchant'}
                          </span>
                          {vendor?.isVerified && (
                            <ShieldCheck size={13} color="var(--primary)" title="Verified Seller" />
                          )}
                        </div>

                        <h3 style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          margin: '0 0 8px',
                          color: 'var(--text-main)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.3'
                        }}>
                          {product.name}
                        </h3>

                        {/* Price & Rating */}
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 'auto', marginBottom: 12 }}>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                            ₹{product.price?.toLocaleString('en-IN')}
                          </span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Action CTA */}
                        <button
                          disabled={isStockOut}
                          onClick={(e) => handleAddToCart(product, e)}
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            opacity: isStockOut ? 0.6 : 1,
                            cursor: isStockOut ? 'not-allowed' : 'pointer'
                          }}
                        >
                          <ShoppingCart size={15} />
                          {isStockOut ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Followed Stores */}
        {activeTab === 'vendors' && (
          <div>
            {followedVendorList.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '64px 20px',
                background: 'var(--surface)',
                borderRadius: 16,
                border: '1px dashed var(--border)'
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 50,
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px', color: 'var(--primary)'
                }}>
                  <Store size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-main)' }}>
                  You haven't followed any stores yet
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 440, margin: '0 auto 24px' }}>
                  Follow your favorite regional shops, indie creators, and specialty stores to stay informed about product launches, combo deals, and courier updates!
                </p>
                <Link to="/stores" className="btn btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  Discover Stores & Brands <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20
              }}>
                {followedVendorList.map((vendor) => {
                  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);

                  return (
                    <div
                      key={vendor.id}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 16,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      {/* Banner & Avatar */}
                      <div style={{
                        height: 90,
                        background: vendor.banner
                          ? `url(${vendor.banner}) center/cover no-repeat`
                          : 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                        position: 'relative'
                      }}>
                        <div style={{
                          position: 'absolute',
                          bottom: -24,
                          left: 16,
                          width: 56,
                          height: 56,
                          borderRadius: 12,
                          border: '3px solid var(--surface)',
                          overflow: 'hidden',
                          background: '#fff',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                        }}>
                          <img
                            src={vendor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.businessName || 'Store')}&background=4F46E5&color=fff`}
                            alt={vendor.businessName}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding: '34px 16px 16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
                                {vendor.businessName}
                              </h3>
                              {vendor.isVerified && (
                                <ShieldCheck size={16} color="var(--primary)" title="Verified Merchant" />
                              )}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                              <MapPin size={12} />
                              <span>{vendor.location || vendor.city || 'Pan-India'}</span>
                              {vendor.deliveryRadiusKm && (
                                <span style={{ marginLeft: 4, color: '#10B981', fontWeight: 600 }}>
                                  • {vendor.deliveryRadiusKm} km radius
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '3px 7px',
                            borderRadius: 6,
                            fontSize: '0.78rem',
                            fontWeight: 700
                          }}>
                            <Star size={12} fill="#F59E0B" color="#F59E0B" />
                            {vendor.rating ? Number(vendor.rating).toFixed(1) : '4.8'}
                          </div>
                        </div>

                        <p style={{
                          fontSize: '0.82rem',
                          color: 'var(--text-muted)',
                          margin: '0 0 14px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: '1.4'
                        }}>
                          {vendor.description || vendor.tagline || 'Discover authentic products crafted with care.'}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'var(--surface-2)',
                          borderRadius: 8,
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          marginBottom: 16
                        }}>
                          <span>Catalog: <strong>{vendorProducts.length} items</strong></span>
                          <span>Followers: <strong>{vendor.followersCount || 12}</strong></span>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                          <Link
                            to={`/store/${vendor.storeSlug || vendor.id}`}
                            className="btn btn-outline"
                            style={{ flex: 1, padding: '7px 10px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                          >
                            <ExternalLink size={14} /> Visit Store
                          </Link>
                          <button
                            onClick={(e) => handleUnfollowVendor(vendor.id, vendor.businessName, e)}
                            style={{
                              padding: '7px 12px',
                              fontSize: '0.82rem',
                              border: '1px solid var(--border)',
                              borderRadius: 8,
                              background: 'transparent',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Unfollow
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
