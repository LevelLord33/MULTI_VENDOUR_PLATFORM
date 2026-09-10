import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../common/Navbar';
import { Clock, CheckCircle, Truck, ShoppingBag } from 'lucide-react';
import '../../styles/marketplace.css';

const STATUS_CONFIG = {
  Processing: { icon: <Clock size={14} />, cls: 'status-processing' },
  Shipped:    { icon: <Truck size={14} />, cls: 'status-shipped' },
  Delivered:  { icon: <CheckCircle size={14} />, cls: 'status-delivered' },
};

export default function Orders() {
  const { getCustomerOrders } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const orders = getCustomerOrders(user.id);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-header">
        <div className="container">
          <h1>My Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 8, paddingBottom: 40 }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingBag size={64} /></div>
            <h3>No orders yet</h3>
            <p>Start shopping and your orders will appear here</p>
            <button className="btn btn-primary" onClick={() => navigate('/shop')}>Shop Now</button>
          </div>
        ) : (
          <div>
            {orders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.Processing;
              return (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{order.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                      <div className={`status-badge ${status.cls}`}>
                        {status.icon} {order.status}
                      </div>
                      <div style={{ fontWeight: 800, color: 'var(--primary-dark)' }}>
                        ₹{order.total.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="order-card-body">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="order-item-img"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=100&h=100&fit=crop'; }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}

                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong>Delivery to:</strong> {order.address}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer style={{ background: 'var(--text-primary)', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '24px', marginTop: 'auto', fontSize: '0.85rem' }}>
        © 2024 Vendour-Mart
      </footer>
    </div>
  );
}
