import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { DisputeProvider } from './contexts/DisputeContext';
import { MarketingProvider } from './contexts/MarketingContext';
import { MessageProvider } from './contexts/MessageContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import { ToastProvider } from './contexts/ToastContext';
import { SocketProvider } from './contexts/SocketContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { RecentlyAccessedProvider } from './contexts/RecentlyAccessedContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';
import CustomerChatbot from './components/chatbot/CustomerChatbot';
import VendorChatbot from './components/chatbot/VendorChatbot';
import ChatbotErrorBoundary from './components/common/ChatbotErrorBoundary';

// Pages
import LandingPage from './pages/LandingPage';
import HubAssistantPage from './pages/HubAssistantPage';
import GoogleCallback from './pages/GoogleCallback';

// Customer
import CustomerAuth from './components/customer/CustomerAuth';
import ProductListing from './components/customer/ProductListing';
import ProductDetail from './components/customer/ProductDetail';
import ProductComparison from './components/customer/ProductComparison';
import VendorProfile from './components/customer/VendorProfile';
import StoreDirectory from './components/customer/StoreDirectory';
import Cart from './components/customer/Cart';
import Orders from './components/customer/Orders';
import CustomerProfile from './components/customer/CustomerProfile';
import CustomerMessages from './components/customer/CustomerMessages';
import Wishlist from './components/customer/Wishlist';
import CustomerSubscriptions from './components/customer/CustomerSubscriptions';

// Vendor
import VendorAuth from './components/vendor/VendorAuth';
import VendorDashboard from './components/vendor/VendorDashboard';
import VendorSubscribers from './components/vendor/VendorSubscribers';
import VendorAnalytics from './components/vendor/VendorAnalytics';
import SmartInventory from './components/vendor/SmartInventory';
import VendorInbox from './components/vendor/VendorInbox';
import VendorMarketing from './components/vendor/VendorMarketing';
import VendorProducts from './components/vendor/VendorProducts';
import AddProduct from './components/vendor/AddProduct';
import VendorOrders from './components/vendor/VendorOrders';
import VendorDisputes from './components/vendor/VendorDisputes';
import StoreBuilder from './components/vendor/StoreBuilder';

import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminVendors from './components/admin/AdminVendors';
import AdminDisputes from './components/admin/AdminDisputes';
import { PendingProducts, ApprovedProducts, RejectedProducts } from './components/admin/AdminProducts';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <SocketProvider>
                <NotificationProvider>
                  <ProductProvider>
                  <CartProvider>
                    <ComparisonProvider>
                      <DisputeProvider>
                        <MarketingProvider>
                          <MessageProvider>
                            <ChatbotProvider>
                              <RecentlyAccessedProvider>
                                <Routes>
                      {/* ── Public ── */}
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/auth/google/callback" element={<GoogleCallback />} />
                      <Route path="/login" element={<CustomerAuth initialMode="login" />} />
                      <Route path="/register" element={<CustomerAuth initialMode="register" />} />
                      <Route path="/signup" element={<CustomerAuth initialMode="register" />} />
                      <Route path="/auth/customer" element={<CustomerAuth initialMode="login" />} />
                      <Route path="/auth/login" element={<CustomerAuth initialMode="login" />} />
                      <Route path="/vendor/login" element={<VendorAuth initialMode="login" />} />
                      <Route path="/vendor/register" element={<VendorAuth initialMode="register" />} />
                      <Route path="/vendor/signup" element={<VendorAuth initialMode="register" />} />
                      <Route path="/vendor/auth" element={<VendorAuth initialMode="login" />} />
                      <Route path="/auth/vendor" element={<VendorAuth initialMode="login" />} />
                      <Route path="/admin/login" element={<AdminLogin />} />
                      <Route path="/store/:slug" element={<VendorProfile />} />
                      <Route path="/stores" element={<StoreDirectory />} />
                      <Route path="/shop/stores" element={<StoreDirectory />} />
                      <Route path="/assistant" element={
                        <ProtectedRoute allowedType={['customer', 'vendor']} redirectTo="/login">
                          <HubAssistantPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/hub-assistant" element={
                        <ProtectedRoute allowedType={['customer', 'vendor']} redirectTo="/login">
                          <HubAssistantPage />
                        </ProtectedRoute>
                      } />

                      {/* ── Customer / Marketplace (Publicly Browseable) ── */}
                      <Route path="/shop" element={<ProductListing />} />
                      <Route path="/shop/product/:id" element={<ProductDetail />} />
                      <Route path="/shop/compare" element={<ProductComparison />} />
                      <Route path="/shop/vendor/:id" element={<VendorProfile />} />
                      <Route path="/shop/wishlist" element={<Wishlist />} />
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
                    <Route path="/shop/messages" element={
                      <ProtectedRoute allowedType="customer" redirectTo="/login">
                        <CustomerMessages />
                      </ProtectedRoute>
                    } />
                    <Route path="/shop/profile" element={
                      <ProtectedRoute allowedType="customer" redirectTo="/login">
                        <CustomerProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="/shop/subscriptions" element={
                      <ProtectedRoute allowedType="customer" redirectTo="/login">
                        <CustomerSubscriptions />
                      </ProtectedRoute>
                    } />

                    {/* ── Vendor ── */}
                    <Route path="/vendor" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <Navigate to="/vendor/dashboard" replace />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/dashboard" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/analytics" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorAnalytics />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/inventory" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <SmartInventory />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/messages" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorInbox />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/inbox" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorInbox />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/marketing" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorMarketing />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/subscribers" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorSubscribers />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/store-builder" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <StoreBuilder />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/products" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorProducts />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/orders" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorOrders />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/disputes" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <VendorDisputes />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/add-product" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <AddProduct />
                      </ProtectedRoute>
                    } />
                    <Route path="/vendor/assistant" element={
                      <ProtectedRoute allowedType="vendor" redirectTo="/vendor/login">
                        <HubAssistantPage defaultRole="vendor" />
                      </ProtectedRoute>
                    } />

                    {/* ── Admin ── */}
                    <Route path="/admin" element={
                      <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                        <Navigate to="/admin/dashboard" replace />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/dashboard" element={
                      <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                        <AdminDashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/vendors" element={
                      <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                        <AdminVendors />
                      </ProtectedRoute>
                    } />
                    <Route path="/admin/disputes" element={
                      <ProtectedRoute allowedType="admin" redirectTo="/admin/login">
                        <AdminDisputes />
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
                  {/* Distinct, Non-Overlapping Dedicated Chatbots for Customers and Vendors */}
                  <ChatbotErrorBoundary>
                    <CustomerChatbot />
                    <VendorChatbot />
                  </ChatbotErrorBoundary>
                </RecentlyAccessedProvider>
              </ChatbotProvider>
              </MessageProvider>
                      </MarketingProvider>
                    </DisputeProvider>
                  </ComparisonProvider>
                </CartProvider>
                </ProductProvider>
                </NotificationProvider>
              </SocketProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
