import { createContext, useContext, useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import { seedOrders } from '../data/seedData';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const CartContext = createContext(null);

// ── Cart Reducer ──────────────────────────────
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QTY: 'UPDATE_QTY',
  CLEAR_CART: 'CLEAR_CART',
  INIT_CART: 'INIT_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.INIT_CART:
      return Array.isArray(action.payload) ? action.payload : [];

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1, selectedVariant = {}, customization = {} } = action.payload;

      // Unique cart key by product and selected variant/customization
      const variantKey = `${product.id}-${selectedVariant.color || 'none'}-${selectedVariant.option || 'none'}-${customization.engravingText || 'none'}-${customization.giftWrap ? 'gw' : 'nogw'}`;

      const existingIndex = state.findIndex((item) => item.cartItemId === variantKey);

      const priceDelta = selectedVariant.priceDelta || 0;
      const giftWrapCost = customization.giftWrap ? 99 : 0;
      const unitPrice = (product.price || 0) + priceDelta + giftWrapCost;
      const maxStock = selectedVariant.stock !== undefined ? selectedVariant.stock : (product.stock || product.quantity || 10);

      if (existingIndex > -1) {
        return state.map((item, index) => {
          if (index !== existingIndex) return item;
          const newQty = Math.min(maxStock, item.quantity + quantity);
          return {
            ...item,
            quantity: newQty,
            maxStock,
          };
        });
      }

      return [
        ...state,
        {
          cartItemId: variantKey,
          productId: product.id,
          sku: product.sku || `VM-${product.id}`,
          name: product.name,
          basePrice: product.price,
          price: unitPrice,
          image: product.images?.[0] || '',
          quantity: Math.min(maxStock, Math.max(1, quantity)),
          selectedVariant,
          customization,
          vendorId: product.vendorId,
          maxStock,
        },
      ];
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return state.filter((item) => item.cartItemId !== action.payload.cartItemId);

    case CART_ACTIONS.UPDATE_QTY: {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((item) => item.cartItemId !== cartItemId);
      }
      return state.map((item) => {
        if (item.cartItemId !== cartItemId) return item;
        const boundedQty = Math.min(item.maxStock, quantity);
        return { ...item, quantity: boundedQty };
      });
    }

    case CART_ACTIONS.CLEAR_CART:
      return [];

    default:
      return state;
  }
}

function initCartState() {
  try {
    const stored = localStorage.getItem('vm_cart');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();

  // 1. useReducer for Cart state mutations
  const [cart, dispatch] = useReducer(cartReducer, [], initCartState);

  // 2. Orders with initial physical shipments
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('vm_orders');
      return stored ? JSON.parse(stored) : seedOrders;
    } catch {
      return seedOrders;
    }
  });

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const { socket } = useSocket();

  // Socket: real-time order status updates and new order placements
  useEffect(() => {
    if (!socket) return;

    const handleOrderStatusChanged = (payload) => {
      console.log('📦 [Socket] Order status updated:', payload);
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === payload.orderId || order._id === payload.orderId) {
            return {
              ...order,
              status: payload.status || order.status,
              courierPartner: payload.courierPartner || order.courierPartner,
              trackingNumber: payload.trackingNumber || order.trackingNumber,
              shipmentTimeline: payload.shipmentTimeline || order.shipmentTimeline || []
            };
          }
          return order;
        })
      );
    };

    const handleNewOrder = (payload) => {
      console.log('🛍️ [Socket] New order placed:', payload);
      if (payload.order) {
        setOrders((prev) => {
          const exists = prev.some((o) => o.id === payload.order.id);
          if (exists) return prev;
          return [payload.order, ...prev];
        });
      }
    };

    socket.on('order_status_changed', handleOrderStatusChanged);
    socket.on('new_order_placed', handleNewOrder);

    return () => {
      socket.off('order_status_changed', handleOrderStatusChanged);
      socket.off('new_order_placed', handleNewOrder);
    };
  }, [socket]);

  const applyCoupon = useCallback((coupon) => {
    setAppliedCoupon(coupon);
  }, []);

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  // 3. Fetch latest orders from Express/MongoDB Atlas on user session change
  useEffect(() => {
    if (!user) return;

    if (user.type === 'customer' && user.id) {
      apiService.getCustomerOrders(user.id, user).then((data) => {
        if (data && data.success && Array.isArray(data.orders)) {
          setOrders((prev) => {
            const apiMap = new Map(data.orders.map((o) => [o.id, o]));
            const merged = prev.map((o) => apiMap.get(o.id) || o);
            data.orders.forEach((o) => {
              if (!merged.some((m) => m.id === o.id)) merged.unshift(o);
            });
            return merged;
          });
        }
      }).catch(() => {});
    } else if (user.type === 'vendor' && user.id) {
      apiService.getVendorOrders(user.id, user).then((data) => {
        if (data && data.success && Array.isArray(data.orders)) {
          setOrders((prev) => {
            const apiMap = new Map(data.orders.map((o) => [o.id, o]));
            const merged = prev.map((o) => apiMap.get(o.id) || o);
            data.orders.forEach((o) => {
              if (!merged.some((m) => m.id === o.id)) merged.unshift(o);
            });
            return merged;
          });
        }
      }).catch(() => {});
    }
  }, [user]);

  // 4. Persist cart and orders in localStorage
  useEffect(() => {
    localStorage.setItem('vm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vm_orders', JSON.stringify(orders));
  }, [orders]);

  // 5. Cart operations
  const addToCart = useCallback((product, quantity = 1, selectedVariant = {}, customization = {}) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity, selectedVariant, customization },
    });
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { cartItemId },
    });
  }, []);

  const updateCartQuantity = useCallback((cartItemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QTY,
      payload: { cartItemId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    setAppliedCoupon(null);
  }, []);

  // 6. Order Placement & Physical Shipment Lifecycle
  const placeOrder = useCallback((customerId, orderDetails = {}) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingMethod = orderDetails.shippingMethod || 'Standard';
    const shippingCost = shippingMethod === 'Express' ? 199 : (subtotal > 999 ? 0 : 79);
    const discountAmount = orderDetails.couponDiscount !== undefined ? orderDetails.couponDiscount : (appliedCoupon?.discountAmount || 0);
    const total = Math.max(0, subtotal - discountAmount + shippingCost);

    const courier = shippingMethod === 'Express' ? 'BlueDart Express Air' : 'Delhivery Surface Express';
    const trackingNo = `BD-${Math.floor(100000000 + Math.random() * 900000000)}-IN`;

    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    const timestampStr = now.toLocaleDateString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    const paymentMethod = orderDetails.paymentMethod || 'UPI_QR';
    const isCOD = paymentMethod === 'COD';
    const paymentStatus = isCOD ? 'Pending (Pay on Delivery)' : 'Paid';
    const codOtp = isCOD ? (orderDetails.paymentDetails?.codOtp || String(Math.floor(1000 + Math.random() * 9000))) : null;

    const paymentDetails = {
      method: paymentMethod,
      status: paymentStatus,
      codOtp: codOtp,
      amountToCollect: isCOD ? total : 0,
      upiId: orderDetails.paymentDetails?.upiId || (paymentMethod === 'UPI_QR' ? 'vendorhub.pay@okhdfcbank' : null),
      upiRef: orderDetails.paymentDetails?.upiRef || (paymentMethod === 'UPI_QR' ? `UPI-${Math.floor(10000000 + Math.random() * 90000000)}-IN` : null),
      cardLast4: orderDetails.paymentDetails?.cardLast4 || null,
      cardNetwork: orderDetails.paymentDetails?.cardNetwork || null,
      paidAt: isCOD ? null : (orderDetails.paymentDetails?.paidAt || new Date().toISOString()),
    };

    const newOrder = {
      id: 'ord' + Date.now(),
      customerId: customerId || user?.id || 'c1',
      items: cart.map((item) => ({ ...item })),
      subtotal,
      discountAmount,
      couponCode: appliedCoupon?.code || orderDetails.couponCode || null,
      shippingCost,
      total,
      shippingMethod,
      courierPartner: courier,
      trackingNumber: trackingNo,
      status: 'Placed',
      paymentMethod,
      paymentStatus,
      paymentDetails,
      shippingAddress: orderDetails.addressDetails || {
        fullName: orderDetails.fullName || 'Customer',
        phone: orderDetails.phone || '9876543210',
        street: orderDetails.address || 'Street Address',
        city: orderDetails.city || 'New Delhi',
        state: orderDetails.state || 'Delhi',
        pincode: orderDetails.pincode || '110001',
      },
      address: orderDetails.address || 'Local Delivery Address',
      createdAt: formattedDate,
      shipmentTimeline: [
        {
          status: 'Order Placed',
          timestamp: timestampStr,
          location: 'Customer Checkout',
          note: isCOD
            ? `Physical order placed with Cash on Delivery. ₹${total.toLocaleString('en-IN')} due upon delivery. Tamper-evident OTP: ${codOtp}.`
            : `Physical order placed & authorized via ${paymentMethod === 'UPI_QR' ? 'UPI Dynamic QR' : 'Card'} (Ref: ${paymentDetails.upiRef || 'AUTH-OK'}). Stock reserved.`,
        },
        {
          status: 'Order Confirmed',
          timestamp: timestampStr,
          location: 'Vendor Store Dispatch Hub',
          note: isCOD
            ? 'Vendor confirmed physical items for packaging. COD collection note attached to courier waybill.'
            : 'Vendor confirmed physical items for packaging & barcode generation.',
        },
      ],
      returnRequest: null,
      supportTickets: [],
    };

    // Optimistic local update
    setOrders((prev) => [newOrder, ...prev]);
    dispatch({ type: CART_ACTIONS.CLEAR_CART });

    // Sync to Express/MongoDB Atlas
    apiService.createOrder(newOrder, user);

    return newOrder;
  }, [cart, user]);

  // Update physical shipment status (Vendor or Admin action)
  const updateShipmentStatus = useCallback((orderId, nextStatus, details = {}) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const timestampStr = new Date().toLocaleDateString('en-IN', {
          month: 'short', day: 'numeric', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });

        const timelineEvent = {
          status: nextStatus,
          timestamp: timestampStr,
          location: details.location || 'Hub / Delivery Facility',
          note: details.note || `Shipment advanced to ${nextStatus}. Courier: ${details.courierPartner || order.courierPartner}`,
        };

        return {
          ...order,
          status: nextStatus,
          courierPartner: details.courierPartner || order.courierPartner,
          trackingNumber: details.trackingNumber || order.trackingNumber,
          shipmentTimeline: [...(order.shipmentTimeline || []), timelineEvent],
        };
      })
    );

    // Sync to Express/MongoDB Atlas
    apiService.updateShipmentStatus(orderId, nextStatus, details, user);
  }, [user]);

  // Request Return or Replacement (Customer action against delivered order)
  const requestReturn = useCallback((orderId, returnData) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          returnRequest: {
            status: 'pending',
            reason: returnData.reason,
            requestedAction: returnData.requestedAction || 'replacement',
            note: returnData.note || '',
            requestedAt: new Date().toISOString().split('T')[0],
            vendorNote: null,
          },
        };
      })
    );

    // Sync to Express/MongoDB Atlas
    apiService.requestReturn(orderId, returnData, user);
  }, [user]);

  // Resolve Return / Replacement (Vendor action)
  const resolveReturn = useCallback((orderId, resolution, vendorNote = '') => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        if (!order.returnRequest) return order;
        return {
          ...order,
          returnRequest: {
            ...order.returnRequest,
            status: resolution, // 'approved' or 'rejected'
            vendorNote,
            resolvedAt: new Date().toISOString().split('T')[0],
          },
        };
      })
    );

    // Sync to Express/MongoDB Atlas
    apiService.resolveReturn(orderId, resolution, vendorNote, user);
  }, [user]);

  // Create Product Support Ticket (Customer action tied to order & product)
  const createProductSupportTicket = useCallback((orderId, productId, ticketData) => {
    const newTicket = {
      id: `tkt-${Date.now()}`,
      productId,
      productName: ticketData.productName || 'Product',
      issueType: ticketData.issueType || 'General Product Inquiry',
      message: ticketData.message || '',
      status: 'Open',
      date: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        return {
          ...order,
          supportTickets: [...(order.supportTickets || []), newTicket],
        };
      })
    );

    // Sync to Express/MongoDB Atlas
    apiService.createProductSupportTicket(orderId, productId, ticketData, user);
  }, [user]);

  const getCustomerOrders = useCallback((customerId) => {
    return orders.filter((o) => o.customerId === customerId);
  }, [orders]);

  const getVendorOrders = useCallback((vendorId) => {
    return orders.filter((o) =>
      o.items && o.items.some((item) => item.vendorId === vendorId)
    );
  }, [orders]);

  // Derived totals
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const contextValue = useMemo(() => ({
    cart,
    orders,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    updateShipmentStatus,
    requestReturn,
    resolveReturn,
    appliedCoupon,
    couponDiscount: appliedCoupon?.discountAmount || 0,
    applyCoupon,
    removeCoupon,
    getCustomerOrders,
    getVendorOrders,
  }), [
    cart,
    orders,
    cartCount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    updateShipmentStatus,
    requestReturn,
    resolveReturn,
    createProductSupportTicket,
    getCustomerOrders,
    getVendorOrders,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
