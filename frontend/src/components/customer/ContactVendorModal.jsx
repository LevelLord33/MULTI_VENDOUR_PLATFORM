import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../../contexts/MessageContext';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import {
  X, Send, Store, Package, Truck, MessageSquare,
  ShieldCheck, HelpCircle, AlertCircle, Sparkles
} from 'lucide-react';
import '../../styles/marketplace.css';

export default function ContactVendorModal({
  isOpen,
  onClose,
  vendor,
  product = null,
  order = null,
  initialSubject = ''
}) {
  const { startConversation } = useMessages();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [subject, setSubject] = useState(initialSubject || '');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState(
    product ? 'product_inquiry' : order ? 'order_inquiry' : 'general'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (!subject) {
        if (product) {
          setSubject(`Product Question: ${product.name}`);
        } else if (order) {
          setSubject(`Order Assistance: #${order.id}`);
        } else {
          setSubject(`Store Inquiry for ${vendor?.businessName || 'Merchant'}`);
        }
      }
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [isOpen, product, order, vendor]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      addToast('Please type your inquiry or message.', 'error');
      return;
    }

    if (!user) {
      addToast('Please sign in to contact the merchant.', 'error');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const conv = await startConversation({
        vendorId: vendor?.id || product?.vendorId || order?.items?.[0]?.vendorId || 'v1',
        vendorName: vendor?.businessName || 'Verified Merchant',
        vendorAvatar: vendor?.avatar || '',
        customerId: user?.id,
        customerName: user?.fullName || user?.name || 'Customer',
        customerEmail: user?.email || '',
        customerAvatar: user?.avatar || '',
        subject: subject.trim(),
        category,
        relatedProduct: product
          ? {
              productId: product.id,
              name: product.name,
              price: product.price,
              image: product.images?.[0] || product.image || '',
              sku: product.sku || 'VM-PHYSICAL',
              category: product.category || 'General'
            }
          : null,
        relatedOrder: order
          ? {
              orderId: order.id,
              trackingNumber: order.trackingNumber || '',
              courierPartner: order.courierPartner || order.shippingMethod || '',
              status: order.status || 'Placed',
              total: order.total || 0,
              orderDate: order.createdAt || new Date().toISOString().split('T')[0]
            }
          : null,
        initialMessage: message.trim()
      });

      addToast('Your message has been sent to the merchant!', 'success');
      onClose();
      // Optionally navigate to messages
      navigate('/shop/messages');
    } catch (err) {
      addToast('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickPrompts = product
    ? [
        'Is this item available for immediate courier dispatch?',
        'Does this include brand warranty and official GST tax invoice?',
        'Can you provide more details regarding packaging and dimensions?'
      ]
    : order
    ? [
        'What is the estimated delivery date for this order?',
        'Can you verify the courier dispatch tracking number?',
        'I have a question about the doorstep package inspection and delivery OTP.'
      ]
    : [
        'Do you provide bulk order discounts for physical retail purchase?',
        'What is your standard return and warranty replacement timeline?'
      ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 560,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--surface-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MessageSquare size={18} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Contact Merchant
              </h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Direct inquiry with {vendor?.businessName || 'Storefront Vendor'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: 4,
              borderRadius: 6
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Context Item Banner (Product or Order) */}
          {product && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: 'var(--surface-2)',
                borderRadius: 10,
                border: '1px solid var(--border)'
              }}
            >
              <img
                src={product.images?.[0] || product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop'}
                alt={product.name}
                style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--border)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>
                  {product.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                  <span>₹{(product.price || 0).toLocaleString('en-IN')}</span>
                  <span>•</span>
                  <span>SKU: {product.sku || 'VM-PHYSICAL'}</span>
                </div>
              </div>
            </div>
          )}

          {order && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: 'var(--surface-2)',
                borderRadius: 10,
                border: '1px solid var(--border)'
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 8,
                  background: '#EEF2FF',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Truck size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Order #{order.id}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                  <span>Status: <strong>{order.status || 'Active'}</strong></span>
                  {order.trackingNumber && (
                    <>
                      <span>•</span>
                      <span>Tracking: {order.trackingNumber}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Subject Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 5, color: 'var(--text-secondary)' }}>
              Subject:
            </label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Sizing query, dispatch ETA, warranty question"
              required
              style={{ fontSize: '0.88rem', padding: '9px 12px' }}
            />
          </div>

          {/* Quick Prompt Suggestions */}
          <div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>
              Quick Inquiry Templates:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  style={{
                    textAlign: 'left',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    padding: '6px 10px',
                    borderRadius: 8,
                    fontSize: '0.78rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 5, color: 'var(--text-secondary)' }}>
              Your Message:
            </label>
            <textarea
              ref={inputRef}
              className="form-control"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the merchant..."
              required
              style={{ fontSize: '0.88rem', padding: '10px 12px', resize: 'vertical' }}
            />
          </div>

          {/* Security & Verification Notice */}
          <div
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              fontSize: '0.76rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <ShieldCheck size={16} />
            <span>Messages are securely logged for warranty records and doorstep order safety.</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting || !message.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Send size={14} />
              <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
