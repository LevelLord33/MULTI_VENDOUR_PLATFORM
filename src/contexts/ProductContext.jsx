import { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { seedProducts } from '../data/seedData';

const ProductContext = createContext(null);

// ── Product Reducer ───────────────────────────
const PRODUCT_ACTIONS = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  UPDATE_STOCK: 'UPDATE_STOCK',
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
          ? { ...p, quantity: parseInt(action.payload.quantity, 10) || 0 }
          : p
      );

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
      return existing ? { ...sp, ...existing } : sp;
    });
    const seedIds = new Set(seedProducts.map((p) => p.id));
    const customProducts = parsed.filter((p) => !seedIds.has(p.id));
    return [...merged, ...customProducts];
  } catch {
    return seedProducts;
  }
}

export function ProductProvider({ children }) {
  // 1. useReducer for state updates
  const [products, dispatch] = useReducer(productReducer, [], initProductState);

  // 2. useEffect for persisting products in localStorage
  useEffect(() => {
    localStorage.setItem('vm_products', JSON.stringify(products));
  }, [products]);

  // 3. useCallback to memoize operations
  const addProduct = useCallback((productData, vendorId) => {
    const newProduct = {
      ...productData,
      id: 'p' + Date.now(),
      vendorId,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    dispatch({ type: PRODUCT_ACTIONS.ADD, payload: newProduct });
    return newProduct;
  }, []);

  const editProduct = useCallback((id, updatedData) => {
    dispatch({
      type: PRODUCT_ACTIONS.EDIT,
      payload: { id, updatedData },
    });
  }, []);

  const deleteProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.DELETE,
      payload: { id },
    });
  }, []);

  const approveProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.APPROVE,
      payload: { id },
    });
  }, []);

  const rejectProduct = useCallback((id) => {
    dispatch({
      type: PRODUCT_ACTIONS.REJECT,
      payload: { id },
    });
  }, []);

  const updateStock = useCallback((id, quantity) => {
    dispatch({
      type: PRODUCT_ACTIONS.UPDATE_STOCK,
      payload: { id, quantity },
    });
  }, []);

  // 4. useMemo for filtered product lists
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

  // 5. useMemo for the context value object
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

// 6. useContext hook
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
