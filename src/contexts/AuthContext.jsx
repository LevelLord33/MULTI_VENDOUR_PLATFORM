import { createContext, useContext, useState, useEffect } from 'react';
import { seedVendors, seedCustomers, ADMIN_CREDENTIALS } from '../data/seedData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { type: 'customer'|'vendor'|'admin', ...userData }
  const [vendors, setVendors] = useState(() => {
    const stored = localStorage.getItem('vm_vendors');
    return stored ? JSON.parse(stored) : seedVendors;
  });
  const [customers, setCustomers] = useState(() => {
    const stored = localStorage.getItem('vm_customers');
    return stored ? JSON.parse(stored) : seedCustomers;
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('vm_current_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    localStorage.setItem('vm_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('vm_customers', JSON.stringify(customers));
  }, [customers]);

  const login = (type, email, password) => {
    if (type === 'admin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const adminUser = { type: 'admin', ...ADMIN_CREDENTIALS };
        setUser(adminUser);
        localStorage.setItem('vm_current_user', JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, message: 'Invalid admin credentials.' };
    }

    if (type === 'vendor') {
      const vendor = vendors.find((v) => v.email === email && v.password === password);
      if (vendor) {
        const vendorUser = { type: 'vendor', ...vendor };
        setUser(vendorUser);
        localStorage.setItem('vm_current_user', JSON.stringify(vendorUser));
        return { success: true };
      }
      return { success: false, message: 'Invalid vendor credentials.' };
    }

    if (type === 'customer') {
      const customer = customers.find((c) => c.email === email && c.password === password);
      if (customer) {
        const customerUser = { type: 'customer', ...customer };
        setUser(customerUser);
        localStorage.setItem('vm_current_user', JSON.stringify(customerUser));
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password.' };
    }
  };

  const registerVendor = (data) => {
    const exists = vendors.find((v) => v.email === data.email);
    if (exists) return { success: false, message: 'Email already registered.' };
    const newVendor = {
      ...data,
      id: 'v' + Date.now(),
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName)}&background=4F46E5&color=fff`,
    };
    const updated = [...vendors, newVendor];
    setVendors(updated);
    const vendorUser = { type: 'vendor', ...newVendor };
    setUser(vendorUser);
    localStorage.setItem('vm_current_user', JSON.stringify(vendorUser));
    return { success: true };
  };

  const registerCustomer = (data) => {
    const exists = customers.find((c) => c.email === data.email);
    if (exists) return { success: false, message: 'Email already registered.' };
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
  };

  const updateCustomer = (data) => {
    const updated = customers.map((c) => (c.id === user.id ? { ...c, ...data } : c));
    setCustomers(updated);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('vm_current_user', JSON.stringify(updatedUser));
  };

  const updateVendor = (data) => {
    const updated = vendors.map((v) => (v.id === user.id ? { ...v, ...data } : v));
    setVendors(updated);
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('vm_current_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vm_current_user');
  };

  const getVendorById = (id) => vendors.find((v) => v.id === id);

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
        getVendorById,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
