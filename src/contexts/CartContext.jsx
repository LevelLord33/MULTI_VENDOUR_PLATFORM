import { createContext, useContext, useReducer, useState, useEffect, useCallback, useMemo } from 'react';
import { seedOrders } from '../data/seedData';

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
      const { product, quantity = 1 } = action.payload;
      const existingIndex = state.findIndex((item) => item.productId === product.id);

      if (existingIndex > -1) {
        return state.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...state,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          quantity,
          vendorId: product.vendorId,
          maxQuantity: product.quantity,
        },
      ];
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return state.filter((item) => item.productId !== action.payload.productId);

    case CART_ACTIONS.UPDATE_QTY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((item) => item.productId !== productId);
      }
      return state.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
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
  // 1. useReducer for robust Cart state mutations
  const [cart, dispatch] = useReducer(cartReducer, [], initCartState);

  // 2. useState for user order history
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem('vm_orders');
      return stored ? JSON.parse(stored) : seedOrders;
    } catch {
      return seedOrders;
    }
  });

  // 3. useEffect for persisting cart and order state to localStorage
  useEffect(() => {
    localStorage.setItem('vm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vm_orders', JSON.stringify(orders));
  }, [orders]);

  // 4. useCallback to memoize action dispatchers and maintain stable function references
  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity },
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { productId },
    });
  }, []);

  const updateCartQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QTY,
      payload: { productId, quantity },
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  }, []);

  const placeOrder = useCallback((customerId, address) => {
    if (cart.length === 0) return null;
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newOrder = {
      id: 'ord' + Date.now(),
      customerId,
      items: cart.map((item) => ({ ...item })),
      total,
      status: 'Processing',
      address,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setOrders((prev) => [newOrder, ...prev]);
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
    return newOrder;
  }, [cart]);

  const getCustomerOrders = useCallback((customerId) => {
    return orders.filter((o) => o.customerId === customerId);
  }, [orders]);

  // 5. useMemo for derived totals to prevent unnecessary recalculations on re-renders
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  // Memoize the context value object itself to prevent consumer re-renders
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
    getCustomerOrders,
  }), [
    cart,
    orders,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    getCustomerOrders,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// 6. useContext hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
