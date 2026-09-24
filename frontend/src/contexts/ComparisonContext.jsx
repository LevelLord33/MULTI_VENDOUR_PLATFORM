import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from './ToastContext';

const ComparisonContext = createContext(null);

export function ComparisonProvider({ children }) {
  const toast = useToast();
  const addToast = toast?.addToast || ((msg) => console.log(msg));

  const [compareList, setCompareList] = useState(() => {
    try {
      const stored = localStorage.getItem('vm_compare_products');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vm_compare_products', JSON.stringify(compareList));
  }, [compareList]);

  // Check if product is already in compare list
  const isInCompare = useCallback(
    (productId) => compareList.some((p) => p.id === productId),
    [compareList]
  );

  // Add product to compare with category compatibility check & max 4 limit
  const addToCompare = useCallback(
    (product) => {
      setCompareList((prev) => {
        // 1. Check if already added
        if (prev.some((p) => p.id === product.id)) {
          addToast(`"${product.name}" is already in comparison.`, 'info');
          return prev;
        }

        // 2. Maximum limit check (2-4 products)
        if (prev.length >= 4) {
          addToast('You can compare a maximum of 4 products at a time.', 'warning');
          return prev;
        }

        // 3. Category Compatibility Check
        // Prevent comparison of completely incompatible product categories
        if (prev.length > 0) {
          const firstItemCategory = prev[0].category;
          if (product.category && firstItemCategory && product.category !== firstItemCategory) {
            addToast(
              `Category mismatch: Cannot compare "${product.category}" with "${firstItemCategory}". Please compare items from the same category or clear your list.`,
              'error'
            );
            return prev;
          }
        }

        const nextList = [...prev, product];
        addToast(`Added "${product.name}" to comparison (${nextList.length}/4)`, 'success');
        setIsCompareDrawerOpen(true);
        return nextList;
      });
    },
    [addToast]
  );

  // Remove single product
  const removeFromCompare = useCallback(
    (productId) => {
      setCompareList((prev) => {
        const item = prev.find((p) => p.id === productId);
        const filtered = prev.filter((p) => p.id !== productId);
        if (item) {
          addToast(`Removed "${item.name}" from comparison`, 'info');
        }
        return filtered;
      });
    },
    [addToast]
  );

  // Toggle comparison state
  const toggleCompare = useCallback(
    (product) => {
      if (isInCompare(product.id)) {
        removeFromCompare(product.id);
      } else {
        addToCompare(product);
      }
    },
    [isInCompare, removeFromCompare, addToCompare]
  );

  // Clear all items
  const clearCompare = useCallback(() => {
    setCompareList([]);
    setIsCompareDrawerOpen(false);
    addToast('Comparison list cleared', 'info');
  }, [addToast]);

  const value = useMemo(
    () => ({
      compareList,
      compareCount: compareList.length,
      isCompareDrawerOpen,
      setIsCompareDrawerOpen,
      isInCompare,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
    }),
    [
      compareList,
      isCompareDrawerOpen,
      isInCompare,
      addToCompare,
      removeFromCompare,
      toggleCompare,
      clearCompare,
    ]
  );

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};
