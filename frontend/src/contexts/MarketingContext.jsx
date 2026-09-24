import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { seedPromotions } from '../data/seedData';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const MarketingContext = createContext(null);

const STORAGE_KEY = 'vendorhub_promotions';

export function MarketingProvider({ children }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [promotions, setPromotions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return seedPromotions;
  });

  const [featuredMap, setFeaturedMap] = useState(() => {
    try {
      const saved = localStorage.getItem('vendorhub_featured_products');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      v1: ['p1', 'p2', 'p3', 'p4'],
      v2: ['p11', 'p12', 'p13'],
      v3: ['p21', 'p22']
    };
  });

  const [loading, setLoading] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions));
    } catch {
      // ignore
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem('vendorhub_featured_products', JSON.stringify(featuredMap));
    } catch {
      // ignore
    }
  }, [featuredMap]);

  // Fetch from backend on vendor change
  useEffect(() => {
    if (!user || user.type !== 'vendor') return;

    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await apiService.getVendorPromotions(user.id);
      if (mounted && res && res.success && Array.isArray(res.promotions)) {
        if (res.promotions.length > 0) {
          setPromotions((prev) => {
            const others = prev.filter((p) => p.vendorId !== user.id);
            return [...res.promotions, ...others];
          });
        }
        if (res.featuredProductIds && res.featuredProductIds.length > 0) {
          setFeaturedMap((prev) => ({ ...prev, [user.id]: res.featuredProductIds }));
        }
      }
      if (mounted) setLoading(false);
    })();

    return () => { mounted = false; };
  }, [user]);

  const getPromotionsByVendor = useCallback((vendorId) => {
    if (!vendorId) return [];
    return promotions.filter((p) => p.vendorId === vendorId);
  }, [promotions]);

  const createPromotion = useCallback(async (promoData) => {
    const effectiveVendorId = promoData.vendorId || user?.id || 'v1';
    const newPromo = {
      ...promoData,
      id: `promo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      vendorId: effectiveVendorId,
      code: promoData.code ? promoData.code.trim().toUpperCase() : undefined,
      discountValue: Number(promoData.discountValue) || 0,
      minOrderValue: Number(promoData.minOrderValue) || 0,
      maxDiscount: Number(promoData.maxDiscount) || 0,
      usageLimit: Number(promoData.usageLimit) || 100,
      usageCount: 0,
      status: 'active',
      startDate: promoData.startDate || new Date().toISOString().split('T')[0],
      endDate: promoData.endDate || '2026-12-31'
    };

    // Optimistic local update
    setPromotions((prev) => [newPromo, ...prev]);

    // Backend sync
    const res = await apiService.createPromotion(newPromo, user);
    if (res && res.success && res.promotion) {
      setPromotions((prev) => prev.map((p) => (p.id === newPromo.id ? res.promotion : p)));
    }
    addToast('Promotion campaign created successfully!', 'success');
    return newPromo;
  }, [user, addToast]);

  const updatePromotion = useCallback(async (promoId, updates) => {
    setPromotions((prev) =>
      prev.map((p) => (p.id === promoId ? { ...p, ...updates } : p))
    );

    await apiService.updatePromotion(promoId, updates, user);
    addToast('Promotion updated successfully.', 'success');
  }, [user, addToast]);

  const togglePromotionStatus = useCallback(async (promoId) => {
    let nextStatus = 'active';
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === promoId) {
          nextStatus = p.status === 'active' ? 'paused' : 'active';
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );

    await apiService.togglePromotionStatus(promoId, user);
    addToast(`Promotion is now ${nextStatus}.`, 'info');
  }, [user, addToast]);

  const deletePromotion = useCallback(async (promoId) => {
    setPromotions((prev) => prev.filter((p) => p.id !== promoId));
    await apiService.deletePromotion(promoId, user);
    addToast('Promotion removed.', 'info');
  }, [user, addToast]);

  const validateCoupon = useCallback(async (code, subtotal = 0, vendorId = null, cartItems = []) => {
    if (!code) {
      return { valid: false, message: 'Please enter a coupon code.' };
    }

    // Try backend validation first
    const backendRes = await apiService.validateCoupon(code, subtotal, vendorId, cartItems);
    if (backendRes && typeof backendRes.valid === 'boolean') {
      return backendRes;
    }

    // Client fallback validation
    const searchCode = code.trim().toUpperCase();
    const today = new Date().toISOString().split('T')[0];
    const promo = promotions.find(
      (p) => p.type === 'coupon' && p.code === searchCode && p.status === 'active'
    );

    if (!promo) {
      return {
        valid: false,
        message: `Coupon "${searchCode}" is invalid or expired.`
      };
    }

    if (promo.startDate && promo.startDate > today) {
      return { valid: false, message: `Coupon starts on ${promo.startDate}.` };
    }
    if (promo.endDate && promo.endDate < today) {
      return { valid: false, message: `Coupon expired on ${promo.endDate}.` };
    }
    if (promo.usageLimit > 0 && promo.usageCount >= promo.usageLimit) {
      return { valid: false, message: 'Coupon redemption limit reached.' };
    }

    let eligibleSubtotal = subtotal;
    if (cartItems.length > 0 && promo.vendorId) {
      const vendorItems = cartItems.filter((item) => item.vendorId === promo.vendorId);
      if (vendorItems.length === 0 && vendorId && vendorId !== promo.vendorId) {
        return { valid: false, message: 'Coupon not applicable to items from this seller.' };
      }
      if (vendorItems.length > 0) {
        eligibleSubtotal = vendorItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      }
    }

    if (promo.minOrderValue > 0 && eligibleSubtotal < promo.minOrderValue) {
      return {
        valid: false,
        message: `Min order value of ₹${promo.minOrderValue.toLocaleString()} required (current: ₹${eligibleSubtotal.toLocaleString()}).`
      };
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((eligibleSubtotal * promo.discountValue) / 100);
      if (promo.maxDiscount > 0) {
        discountAmount = Math.min(discountAmount, promo.maxDiscount);
      }
    } else {
      discountAmount = Math.min(promo.discountValue, eligibleSubtotal);
    }

    return {
      valid: true,
      message: `Coupon "${promo.code}" applied! You saved ₹${discountAmount.toLocaleString()}`,
      coupon: {
        id: promo.id,
        code: promo.code,
        title: promo.title,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        vendorId: promo.vendorId
      }
    };
  }, [promotions]);

  const updateFeaturedProducts = useCallback(async (vendorId, productIds) => {
    setFeaturedMap((prev) => ({ ...prev, [vendorId]: productIds }));
    await apiService.updateFeaturedProducts(vendorId, productIds, user);
    addToast(`Updated ${productIds.length} featured products!`, 'success');
  }, [user, addToast]);

  const getFeaturedProducts = useCallback((vendorId) => {
    return featuredMap[vendorId] || [];
  }, [featuredMap]);

  const value = {
    promotions,
    loading,
    getPromotionsByVendor,
    createPromotion,
    updatePromotion,
    togglePromotionStatus,
    deletePromotion,
    validateCoupon,
    updateFeaturedProducts,
    getFeaturedProducts
  };

  return (
    <MarketingContext.Provider value={value}>
      {children}
    </MarketingContext.Provider>
  );
}

export function useMarketing() {
  const context = useContext(MarketingContext);
  if (!context) {
    throw new Error('useMarketing must be used within a MarketingProvider');
  }
  return context;
}
