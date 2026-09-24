import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { seedProducts } from '../data/seedData';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ProductContext = createContext(null);

// ── Product Reducer ───────────────────────────
const PRODUCT_ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  UPDATE_STOCK: 'UPDATE_STOCK',
  DEDUCT_STOCK: 'DEDUCT_STOCK',
  RESTORE_STOCK: 'RESTORE_STOCK',
  ADD_REVIEW: 'ADD_REVIEW',
  ADD_INQUIRY: 'ADD_INQUIRY',
  ANSWER_INQUIRY: 'ANSWER_INQUIRY',
  SET_PRODUCTS: 'SET_PRODUCTS',
};

function productReducer(state, action) {
  switch (action.type) {
    case PRODUCT_ACTIONS.SET_PRODUCTS:
      return Array.isArray(action.payload) ? action.payload : state;

    case PRODUCT_ACTIONS.ADD:
      return [action.payload, ...state];

    case PRODUCT_ACTIONS.EDIT:
      return state.map((p) =>
        p.id === action.payload.id ? { ...p, ...action.payload.updatedData } : p
      );

    case PRODUCT_ACTIONS.DELETE:
      return state.filter((p) => p.id !== action.payload.id);

    case PRODUCT_ACTIONS.APPROVE:
      return state.map((p) =>
        p.id === action.payload.id ? { ...p, status: 'approved' } : p
      );

    case PRODUCT_ACTIONS.REJECT:
      return state.map((p) =>
        p.id === action.payload.id ? { ...p, status: 'rejected' } : p
      );

    case PRODUCT_ACTIONS.UPDATE_STOCK:
      return state.map((p) =>
        p.id === action.payload.id
          ? {
              ...p,
              stock: Math.max(0, parseInt(action.payload.quantity, 10) || 0),
              quantity: Math.max(0, parseInt(action.payload.quantity, 10) || 0),
            }
          : p
      );

    case PRODUCT_ACTIONS.DEDUCT_STOCK:
      return state.map((p) =>
        p.id === action.payload.id
          ? {
              ...p,
              stock: Math.max(0, (p.stock || p.quantity || 0) - action.payload.quantity),
              quantity: Math.max(0, (p.quantity || 0) - action.payload.quantity),
            }
          : p
      );

    case PRODUCT_ACTIONS.RESTORE_STOCK:
      return state.map((p) =>
        p.id === action.payload.id
          ? {
              ...p,
              stock: (p.stock || p.quantity || 0) + action.payload.quantity,
              quantity: (p.quantity || 0) + action.payload.quantity,
            }
          : p
      );

    case PRODUCT_ACTIONS.ADD_REVIEW:
      return state.map((p) => {
        if (p.id !== action.payload.productId) return p;
        const currentReviews = p.reviews || [];
        const newReview = {
          id: `rev-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          verified: true,
          ...action.payload.reviewData,
        };
        const updatedReviews = [newReview, ...currentReviews];
        const newCount = updatedReviews.length;
        const sum = updatedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
        return {
          ...p,
          reviews: updatedReviews,
          reviewsCount: newCount,
          rating: Number((sum / newCount).toFixed(1)),
        };
      });

    case PRODUCT_ACTIONS.ADD_INQUIRY:
      return state.map((p) => {
        if (p.id !== action.payload.productId) return p;
        const currentInquiries = p.inquiries || [];
        const newInquiry = {
          id: `qa-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          question: action.payload.question,
          customerName: action.payload.customerName || 'Customer',
          answer: null,
          answeredAt: null,
        };
        return {
          ...p,
          inquiries: [newInquiry, ...currentInquiries],
        };
      });

    case PRODUCT_ACTIONS.ANSWER_INQUIRY:
      return state.map((p) => {
        if (p.id !== action.payload.productId) return p;
        const updatedInquiries = (p.inquiries || []).map((q) =>
          q.id === action.payload.inquiryId
            ? {
                ...q,
                answer: action.payload.answer,
                answeredAt: new Date().toISOString().split('T')[0],
              }
            : q
        );
        return {
          ...p,
          inquiries: updatedInquiries,
        };
      });

    default:
      return state;
  }
}

function initProductState() {
  const stored = localStorage.getItem('vm_products');
  if (!stored) return seedProducts;
  try {
    const parsed = JSON.parse(stored);
    const existingMap = new Map(parsed.map((p) => [p.id, p]));
    const merged = seedProducts.map((sp) => {
      const existing = existingMap.get(sp.id);
      if (!existing) return sp;
      return {
        ...sp,
        ...existing,
        sku: sp.sku,
        mrp: sp.mrp,
        discountPercent: sp.discountPercent,
        variants: sp.variants,
        shipping: sp.shipping,
        reviews: existing.reviews || sp.reviews,
        inquiries: existing.inquiries || sp.inquiries,
      };
    });
    const seedIds = new Set(seedProducts.map((p) => p.id));
    const customProducts = parsed.filter((p) => !seedIds.has(p.id));
    return [...merged, ...customProducts];
  } catch {
    return seedProducts;
  }
}

export function ProductProvider({ children }) {
  const { user } = useAuth();
  const { socket } = useSocket();

  // 1. useReducer for state updates
  const [products, dispatch] = useReducer(productReducer, [], initProductState);

  // Real-time Socket.IO stock synchronization
  useEffect(() => {
    if (!socket) return;

    const handleStockChanged = ({ productId, stock }) => {
      console.log('📦 [Socket] Real-time product stock updated:', productId, stock);
      dispatch({
        type: PRODUCT_ACTIONS.UPDATE_STOCK,
        payload: { id: productId, quantity: stock }
      });
    };

    socket.on('product_stock_changed', handleStockChanged);
    return () => {
      socket.off('product_stock_changed', handleStockChanged);
    };
  }, [socket]);

  // 2. Fetch latest catalog from Express/MongoDB Atlas on mount
  useEffect(() => {
    apiService.getProducts().then((data) => {
      if (data && data.success && Array.isArray(data.products) && data.products.length > 0) {
        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCTS, payload: data.products });
      }
    }).catch(() => {});
  }, []);

  // 3. Persist products in localStorage as resilient backup
  useEffect(() => {
    localStorage.setItem('vm_products', JSON.stringify(products));
  }, [products]);

  // 4. Operations with API synchronization
  const addProduct = useCallback((productData, vendorId) => {
    const vId = vendorId || user?.id || 'v1';
    const newProduct = {
      ...productData,
      id: 'p' + Date.now(),
      sku: productData.sku || `VM-SKU-${Date.now().toString().slice(-4)}`,
      stock: parseInt(productData.stock || productData.quantity, 10) || 10,
      quantity: parseInt(productData.stock || productData.quantity, 10) || 10,
      mrp: productData.mrp || Math.round(productData.price * 1.2),
      discountPercent: productData.mrp
        ? Math.round(((productData.mrp - productData.price) / productData.mrp) * 100)
        : 15,
      vendorId: vId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      variants: productData.variants || { colors: [], options: [], customization: null },
      shipping: productData.shipping || {
        weight: '500 g',
        dispatchTime: 'Ships within 24 hours',
        estimatedDays: '2 - 4 days',
        courierPartners: ['BlueDart', 'Delhivery'],
        codAvailable: true,
        returnWindowDays: 7,
      },
      reviews: [],
      inquiries: [],
    };

    // Optimistic local dispatch
    dispatch({ type: PRODUCT_ACTIONS.ADD, payload: newProduct });

    // Sync to Express/MongoDB Atlas
    apiService.createProduct(newProduct, user);

    return newProduct;
  }, [user]);

  const editProduct = useCallback((id, updatedData) => {
    dispatch({
      type: PRODUCT_ACTIONS.EDIT,
      payload: { id, updatedData },
    });
    apiService.updateProduct(id, updatedData, user);
  }, [user]);

  const deleteProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.DELETE,
      payload: { id },
    });
    apiService.deleteProduct(id, user);
  }, [user]);

  const approveProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.APPROVE,
      payload: { id },
    });
    apiService.updateProductStatus(id, 'approved', user);
  }, [user]);

  const rejectProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.REJECT,
      payload: { id },
    });
    apiService.updateProductStatus(id, 'rejected', user);
  }, [user]);

  const updateStock = useCallback((id, quantity) => {
    dispatch({
      type: PRODUCT_ACTIONS.UPDATE_STOCK,
      payload: { id, quantity },
    });
    apiService.updateStock(id, quantity, user);
  }, [user]);

  const deductStock = useCallback((id, quantity) => {
    dispatch({
      type: PRODUCT_ACTIONS.DEDUCT_STOCK,
      payload: { id, quantity },
    });
  }, []);

  const restoreStock = useCallback((id, quantity) => {
    dispatch({
      type: PRODUCT_ACTIONS.RESTORE_STOCK,
      payload: { id, quantity },
    });
  }, []);

  const addProductReview = useCallback((productId, reviewData) => {
    dispatch({
      type: PRODUCT_ACTIONS.ADD_REVIEW,
      payload: { productId, reviewData },
    });
    apiService.addProductReview(productId, reviewData, user);
  }, [user]);

  const addProductInquiry = useCallback((productId, question, customerName) => {
    dispatch({
      type: PRODUCT_ACTIONS.ADD_INQUIRY,
      payload: { productId, question, customerName },
    });
    apiService.addProductInquiry(productId, question, customerName, user);
  }, [user]);

  const answerProductInquiry = useCallback((productId, inquiryId, answer) => {
    dispatch({
      type: PRODUCT_ACTIONS.ANSWER_INQUIRY,
      payload: { productId, inquiryId, answer },
    });
    apiService.answerProductInquiry(productId, inquiryId, answer, user);
  }, [user]);

  // 5. Memoized filtered product lists
  const approvedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'approved');
  }, [products]);

  const pendingProducts = useMemo(() => {
    return products.filter((p) => p.status === 'pending');
  }, [products]);

  const rejectedProducts = useMemo(() => {
    return products.filter((p) => p.status === 'rejected');
  }, [products]);

  // Stable getters using useCallback
  const getApprovedProducts = useCallback(() => approvedProducts, [approvedProducts]);
  const getPendingProducts = useCallback(() => pendingProducts, [pendingProducts]);
  const getRejectedProducts = useCallback(() => rejectedProducts, [rejectedProducts]);

  const getVendorProducts = useCallback(
    (vendorId) => products.filter((p) => p.vendorId === vendorId),
    [products]
  );

  const getProductById = useCallback(
    (id) => products.find((p) => p.id === id),
    [products]
  );

  // 6. Memoized context value
  const contextValue = useMemo(() => ({
    products,
    approvedProducts,
    pendingProducts,
    rejectedProducts,
    addProduct,
    editProduct,
    deleteProduct,
    approveProduct,
    rejectProduct,
    updateStock,
    deductStock,
    restoreStock,
    addProductReview,
    addProductInquiry,
    answerProductInquiry,
    getApprovedProducts,
    getPendingProducts,
    getRejectedProducts,
    getVendorProducts,
    getProductById,
  }), [
    products,
    approvedProducts,
    pendingProducts,
    rejectedProducts,
    addProduct,
    editProduct,
    deleteProduct,
    approveProduct,
    rejectProduct,
    updateStock,
    deductStock,
    restoreStock,
    addProductReview,
    addProductInquiry,
    answerProductInquiry,
    getApprovedProducts,
    getPendingProducts,
    getRejectedProducts,
    getVendorProducts,
    getProductById,
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
