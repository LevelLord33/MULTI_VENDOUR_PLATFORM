import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';

// Pages
import LandingPage from './pages/LandingPage';

// Customer
import CustomerAuth from './components/customer/CustomerAuth';
import ProductListing from './components/customer/ProductListing';
import ProductDetail from './components/customer/ProductDetail';
import VendorProfile from './components/customer/VendorProfile';
import Cart from './components/customer/Cart';
import Orders from './components/customer/Orders';
import CustomerProfile from './components/customer/CustomerProfile';

// Vendor
import VendorAuth from './components/vendor/VendorAuth';
import VendorDashboard from './components/vendor/VendorDashboard';
import VendorProducts from './components/vendor/VendorProducts';
import AddProduct from './components/vendor/AddProduct';

// Admin
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { PendingProducts, ApprovedProducts, RejectedProducts } from './components/admin/AdminProducts';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <ToastProvider>
              <Routes>
                {/* ── Public ── */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<CustomerAuth />} />
                <Route path="/vendor/login" element={<VendorAuth />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* ── Customer ── */}
                <Route path="/shop" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <ProductListing />
                  </ProtectedRoute>
                } />
                <Route path="/shop/product/:id" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <ProductDetail />
                  </ProtectedRoute>
                } />
                <Route path="/shop/vendor/:id" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <VendorProfile />
                  </ProtectedRoute>
                } />
                <Route path="/shop/cart" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/shop/orders" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/shop/profile" element={
                  <ProtectedRoute allowedType="customer" redirectTo="/login">
                    <CustomerProfile />
                  </ProtectedRoute>
                } />

                {/* ── Vendor ── */}
                <Route path="/vendor/dashboard" element={
                  <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                    <VendorDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/products" element={
                  <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                    <VendorProducts />
                  </ProtectedRoute>
                } />
                <Route path="/vendor/add-product" element={
                  <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                    <AddProduct />
                  </ProtectedRoute>
                } />

                {/* ── Admin ── */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/pending" element={
                  <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                    <PendingProducts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/approved" element={
                  <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                    <ApprovedProducts />
                  </ProtectedRoute>
                } />
                <Route path="/admin/rejected" element={
                  <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                    <RejectedProducts />
                  </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ToastProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
