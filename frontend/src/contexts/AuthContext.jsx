import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { seedVendors, seedCustomers, ADMIN_CREDENTIALS } from '../data/seedData';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { type: 'customer'|'vendor'|'admin', ...userData }
  const [vendors, setVendors] = useState(() => {
    const stored = localStorage.getItem('vm_vendors');
    if (!stored) return seedVendors;
    try {
      const parsed = JSON.parse(stored);
      return parsed.map((v) => {
        const seed = seedVendors.find((s) => s.id === v.id);
        return seed ? { ...seed, ...v } : v;
      });
    } catch {
      return seedVendors;
    }
  });

  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem('vm_customers');
    return stored ? JSON.parse(stored) : seedCustomers;
  });

  // Sync initial vendors from backend API on mount
  useEffect(() => {
    apiService.getVendors().then((data) => {
      if (data && data.success && Array.isArray(data.vendors) && data.vendors.length > 0) {
        setVendors((prev) => {
          const apiMap = new Map(data.vendors.map((v) => [v.id, v]));
          const merged = prev.map((v) => apiMap.get(v.id) || v);
          data.vendors.forEach((v) => {
            if (!merged.some((m) => m.id === v.id)) merged.push(v);
          });
          return merged;
        });
      }
    }).catch(() => {});
  }, []);

  // Restore active user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('vm_current_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.type === 'vendor') {
          const freshVendor = vendors.find((v) => v.id === parsed.id);
          if (freshVendor) {
            setUser({ type: 'vendor', ...freshVendor });
            return;
          }
        }
        setUser(parsed);
      } catch {
        setUser(null);
      }
    }
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vm_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vm_customers', JSON.stringify(customers));
  }, [customers]);

  const login = useCallback(async (type, email, password) => {
    // 1. Try real Express backend API
    const apiRes = await apiService.login(type, email, password);
    if (apiRes && apiRes.success && apiRes.user) {
      setUser(apiRes.user);
      localStorage.setItem('vm_current_user', JSON.stringify(apiRes.user));
      return { success: true };
    }

    // 2. Resilient local fallback if backend offline or unseeded
    if (type === 'admin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser = { type: 'admin', ...ADMIN_CREDENTIALS };
        setUser(adminUser);
        localStorage.setItem('vm_current_user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: apiRes?.message || 'Invalid admin credentials.' };
    }

    if (type === 'vendor') {
      const vendor = vendors.find((v) => v.email === email && v.password === password);
      if (vendor) {
        const vendorUser = { type: 'vendor', ...vendor };
        setUser(vendorUser);
        localStorage.setItem('vm_current_user', JSON.stringify(vendorUser));
        return { success: true };
      }
      return { success: false, message: apiRes?.message || 'Invalid vendor credentials.' };
    }

    if (type === 'customer') {
      const customer = customers.find((c) => c.email === email && c.password === password);
      if (customer) {
        const customerUser = { type: 'customer', ...customer };
        setUser(customerUser);
        localStorage.setItem('vm_current_user', JSON.stringify(customerUser));
        return { success: true };
      }
      return { success: false, message: apiRes?.message || 'Invalid email or password.' };
    }

    return { success: false, message: 'Invalid user type.' };
  }, [vendors, customers]);

  const registerVendor = useCallback(async (data) => {
    // Attempt backend registration
    const apiRes = await apiService.registerVendor(data);
    if (apiRes && apiRes.success && apiRes.user) {
      const newVendor = apiRes.user;
      setVendors((prev) => [...prev, newVendor]);
      setUser(newVendor);
      localStorage.setItem('vm_current_user', JSON.stringify(newVendor));
      return { success: true };
    }

    // Local fallback
    const exists = vendors.find((v) => v.email === data.email);
    if (exists) return { success: false, message: apiRes?.message || 'Email already registered.' };
    const defaultSlug = (data.businessName || 'store')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newVendor = {
      ...data,
      id: 'v' + Date.now(),
      storeSlug: defaultSlug,
      tagline: `Welcome to the official ${data.businessName} storefront`,
      themeColor: '#4F46E5',
      themePreset: 'indigo',
      storeStatus: 'published',
      isVerified: true,
      gstin: '07AABCV9999Z1Z0',
      announcement: '🎉 Fast Courier Dispatch with Verified Brand Warranty!',
      featuredProductIds: [],
      banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&h=300&fit=crop',
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName || data.businessName)}&background=4F46E5&color=fff`,
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    const vendorUser = { type: 'vendor', ...newVendor };
    setUser(vendorUser);
    localStorage.setItem('vm_current_user', JSON.stringify(vendorUser));
    return { success: true };
  }, [vendors]);

  const registerCustomer = useCallback(async (data) => {
    // Attempt backend registration
    const apiRes = await apiService.registerCustomer(data);
    if (apiRes && apiRes.success && apiRes.user) {
      const newCustomer = apiRes.user;
      setCustomers((prev) => [...prev, newCustomer]);
      setUser(newCustomer);
      localStorage.setItem('vm_current_user', JSON.stringify(newCustomer));
      return { success: true };
    }

    // Local fallback
    const exists = customers.find((c) => c.email === data.email);
    if (exists) return { success: false, message: apiRes?.message || 'Email already registered.' };
    const newCustomer = {
      ...data,
      id: 'c' + Date.now(),
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=4F46E5&color=fff`,
    };
    const updated = [...customers, newCustomer];
    setCustomers(updated);
    const customerUser = { type: 'customer', ...newCustomer };
    setUser(customerUser);
    localStorage.setItem('vm_current_user', JSON.stringify(customerUser));
    return { success: true };
  }, [customers]);

  const updateCustomer = useCallback((data) => {
    const updated = customers.map((c) => (c.id === user?.id ? { ...c, ...data } : c));
    setCustomers(updated);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('vm_current_user', JSON.stringify(updatedUser));
    if (user?.id) {
      apiService.updateCustomer(user.id, data, user);
    }
  }, [customers, user]);

  const updateVendor = useCallback((data) => {
    const targetId = data.id || user?.id;
    if (!targetId) return;
    const updated = vendors.map((v) => (v.id === targetId ? { ...v, ...data } : v));
    setVendors(updated);
    if (user?.id === targetId) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('vm_current_user', JSON.stringify(updatedUser));
    }
    apiService.updateVendorStore(targetId, data, user);
  }, [vendors, user]);

  const updateVendorStore = useCallback((vendorId, storeData) => {
    const targetId = vendorId || user?.id;
    if (!targetId) return { success: false };
    const updated = vendors.map((v) => (v.id === targetId ? { ...v, ...storeData } : v));
    setVendors(updated);
    if (user?.id === targetId) {
      const updatedUser = { ...user, ...storeData };
      setUser(updatedUser);
      localStorage.setItem('vm_current_user', JSON.stringify(updatedUser));
    }
    apiService.updateVendorStore(targetId, storeData, user);
    return { success: true };
  }, [vendors, user]);

  const publishVendorStore = useCallback((vendorId, isPublished) => {
    const status = isPublished ? 'published' : 'draft';
    return updateVendorStore(vendorId, { storeStatus: status });
  }, [updateVendorStore]);

  const checkSlugAvailability = useCallback(async (slug, currentVendorId) => {
    if (!slug) return false;
    const clean = slug.toLowerCase().trim();
    const localMatch = vendors.find(
      (v) => (v.storeSlug?.toLowerCase() === clean) && v.id !== currentVendorId
    );
    if (localMatch) return false;
    return await apiService.checkSlugAvailability(slug, currentVendorId);
  }, [vendors]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('vm_current_user');
  }, []);

  const getVendorById = useCallback((id) => vendors.find((v) => v.id === id), [vendors]);

  const getVendorBySlug = useCallback((slug) => {
    if (!slug) return null;
    const clean = slug.toLowerCase().trim();
    return vendors.find((v) => v.storeSlug?.toLowerCase() === clean);
  }, [vendors]);

  const getVendorByIdOrSlug = useCallback((idOrSlug) => {
    if (!idOrSlug) return null;
    const clean = idOrSlug.toLowerCase().trim();
    return vendors.find(
      (v) => v.id?.toLowerCase() === clean || v.storeSlug?.toLowerCase() === clean
    );
  }, [vendors]);

  return (
    <AuthContext.Provider
      value={{
        user,
        vendors,
        customers,
        login,
        logout,
        registerVendor,
        registerCustomer,
        updateCustomer,
        updateVendor,
        updateVendorStore,
        publishVendorStore,
        checkSlugAvailability,
        getVendorById,
        getVendorBySlug,
        getVendorByIdOrSlug,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
