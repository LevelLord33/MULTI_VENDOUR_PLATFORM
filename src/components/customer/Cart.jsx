import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Navbar from '../common/Navbar';
import { ShoppingCart, Trash2, Plus, Minus, MapPin, CheckCircle, Package } from 'lucide-react';
import '../../styles/marketplace.css';

export default function Cart() {
  const { cart, cartTotal, cartCount, removeFromCart, updateCartQuantity, placeOrder } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || '');
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const handleOrder = async () => {
    if (!address.trim()) {
      addToast('Please enter a delivery address', 'error');
      return;
    }
    setOrdering(true);
    await new Promise((r) => setTimeout(r, 1000));
    placeOrder(user.id, address);
    setOrdered(true);
    setOrdering(false);
    addToast('Order placed successfully! 🎉', 'success');
  };

  if (ordered) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="container" style={{ padding: '80px 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 100, height: 100, background: '#D1FAE5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <CheckCircle size={52} color="var(--success)" />
            </div>
            <h2 style={{ marginBottom: 12 }}>Order Placed Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28 }}>
              Your order has been placed and is being processed. You can track it in My Orders.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={() => navigate('/shop/orders')}>
                <Package size={16} /> View My Orders
              </button>
              <button className="btn btn-outline" onClick={() => { setOrdered(false); navigate('/shop'); }}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-header">
        <div className="container">
          <h1>My Cart</h1>
          <p>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container">
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart size={64} /></div>
            <h3>Your cart is empty</h3>
            <p>Add products from the shop to get started</p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cart.map((item) => (
                <div key={item.productId} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=200&h=200&fit=crop'; }}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      Subtotal: ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)' }}
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className="qty-num">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => updateCartQuantity(item.productId, Math.min(item.maxQuantity, item.quantity + 1))}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="order-summary-card">
              <h3 style={{ marginBottom: 16 }}>Order Summary</h3>

              <div className="order-summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="order-summary-row">
                <span>Delivery Fee</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
              </div>
              <div className="order-summary-row total">
                <span>Total</span>
                <span style={{ color: 'var(--primary-dark)', fontSize: '1.2rem' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {/* Address */}
              <div style={{ marginTop: 20 }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <MapPin size={14} /> Delivery Address
                </label>
                <textarea
                  className="form-input form-textarea"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your delivery address..."
                  style={{ minHeight: 80 }}
                />
              </div>

              <button
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: 16 }}
                onClick={handleOrder}
                disabled={ordering}
              >
                {ordering ? 'Placing Order...' : '🎉 Place Order'}
              </button>

              <button
                className="btn btn-ghost btn-full"
                style={{ marginTop: 8 }}
                onClick={() => navigate('/shop')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart
      </footer>
    </div>
  );
}
