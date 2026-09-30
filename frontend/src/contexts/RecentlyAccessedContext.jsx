import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RecentlyAccessedContext = createContext(null);
const STORAGE_KEY = 'vendorhub_recently_accessed';

export function RecentlyAccessedProvider({ children }) {
  const [recentItems, setRecentItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { products: [], stores: [] };
    } catch {
      return { products: [], stores: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentItems));
    } catch (e) {
      console.warn('Could not save recently accessed items:', e);
    }
  }, [recentItems]);

  const recordProductView = useCallback((product, vendor = null) => {
    if (!product || !product.id) return;
    setRecentItems((prev) => {
      const filtered = prev.products.filter((p) => p.id !== product.id);
      const newEntry = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        category: product.category,
        vendorName: vendor?.businessName || product.vendorName || 'Verified Merchant',
        vendorId: vendor?.id || product.vendorId,
        viewedAt: Date.now()
      };
      return {
        ...prev,
        products: [newEntry, ...filtered].slice(0, 8)
      };
    });
  }, []);

  const recordStoreView = useCallback((store) => {
    if (!store || (!store.id && !store.storeSlug)) return;
    setRecentItems((prev) => {
      const storeKey = store.storeSlug || store.id;
      const filtered = prev.stores.filter((s) => (s.storeSlug || s.id) !== storeKey);
      const newEntry = {
        id: store.id,
        storeSlug: store.storeSlug || store.id,
        businessName: store.businessName,
        avatar: store.avatar,
        category: store.category,
        location: store.location,
        viewedAt: Date.now()
      };
      return {
        ...prev,
        stores: [newEntry, ...filtered].slice(0, 6)
      };
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentItems({ products: [], stores: [] });
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <RecentlyAccessedContext.Provider
      value={{
        recentProducts: recentItems.products || [],
        recentStores: recentItems.stores || [],
        recordProductView,
        recordStoreView,
        clearRecent
      }}
    >
      {children}
    </RecentlyAccessedContext.Provider>
  );
}

export const useRecentlyAccessed = () => {
  const ctx = useContext(RecentlyAccessedContext);
  if (!ctx) {
    throw new Error('useRecentlyAccessed must be used within RecentlyAccessedProvider');
  }
  return ctx;
};
