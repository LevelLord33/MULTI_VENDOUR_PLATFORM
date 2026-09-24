/**
 * API Service for Backend Communication
 * Connects to Express & MongoDB backend, with automatic resilient fallback
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (user) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (user) {
    headers['x-user-id'] = user.id;
    headers['x-user-role'] = user.type || user.role || 'customer';
    headers['x-user-name'] = user.fullName || user.businessName || user.name || 'User';
  }
  return headers;
};

export const apiService = {
  // ── Authentication & Storefronts ──────────────────
  async login(type, email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, email, password })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data.message || `Login failed (${res.status})` };
      }
      return await res.json();
    } catch {
      return null; // Signals context to use local fallback
    }
  },

  async registerCustomer(customerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerData)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data.message || 'Registration failed' };
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async registerVendor(vendorData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register-vendor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vendorData)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return { success: false, message: data.message || 'Vendor onboarding failed' };
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVendors() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/vendors`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVendorByIdOrSlug(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/vendors/${encodeURIComponent(idOrSlug)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async checkSlugAvailability(slug, currentVendorId) {
    try {
      const url = new URL(`${API_BASE_URL}/auth/check-slug/${encodeURIComponent(slug)}`);
      if (currentVendorId) url.searchParams.set('vendorId', currentVendorId);
      const res = await fetch(url.toString());
      if (!res.ok) return true;
      const data = await res.json();
      return data.available;
    } catch {
      return true;
    }
  },

  async updateCustomer(id, data, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/customer/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateVendorStore(id, storeData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/vendor/${encodeURIComponent(id)}/store`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(storeData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Products & Inventory ─────────────────────────
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/products${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createProduct(productData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateProduct(id, updatedData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(updatedData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async deleteProduct(id, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateProductStatus(id, status, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/status`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateStock(id, quantity, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/stock`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ stock: quantity })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async addProductReview(productId, reviewData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}/reviews`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async addProductInquiry(productId, question, customerName, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(productId)}/inquiries`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify({ question, customerName })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async answerProductInquiry(productId, inquiryId, answer, user) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/products/${encodeURIComponent(productId)}/inquiries/${encodeURIComponent(inquiryId)}`,
        {
          method: 'PATCH',
          headers: getHeaders(user),
          body: JSON.stringify({ answer })
        }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async compareProducts(productIds) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Orders & Logistics ───────────────────────────
  async createOrder(orderData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getCustomerOrders(customerId, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/customer/${encodeURIComponent(customerId)}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVendorOrders(vendorId, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/vendor/${encodeURIComponent(vendorId)}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getOrderById(id, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(id)}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateShipmentStatus(orderId, nextStatus, details, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ nextStatus, ...details })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async requestReturn(orderId, returnData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/return`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(returnData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async resolveReturn(orderId, resolution, vendorNote, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/return`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ resolution, vendorNote })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createProductSupportTicket(orderId, productId, ticketData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}/support-tickets`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify({ productId, ...ticketData })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Disputes ─────────────────────────────────────
  async raiseDispute(disputeData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(disputeData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getCustomerDisputes(user) {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes/my-disputes`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVendorDisputes(user) {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes/vendor`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async submitVendorResponse(disputeId, responseData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes/${encodeURIComponent(disputeId)}/vendor-response`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(responseData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getAllDisputesAdmin(user, params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/disputes/admin${query ? `?${query}` : ''}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateDisputeStatusAdmin(disputeId, updateData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/disputes/${encodeURIComponent(disputeId)}/status`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify(updateData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Phase 4: Vendor Marketing Center & Promotions ──
  async getVendorPromotions(vendorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/vendor/${encodeURIComponent(vendorId)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createPromotion(promoData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/promotions`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(promoData)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.message || 'Failed to create promotion' };
      }
      return await res.json();
    } catch {
      return null;
    }
  },

  async updatePromotion(id, updates, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/promotions/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async deletePromotion(id, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/promotions/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async togglePromotionStatus(id, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/promotions/${encodeURIComponent(id)}/toggle`, {
        method: 'PATCH',
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async validateCoupon(code, subtotal = 0, vendorId = null, cartItems = []) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/validate-coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal, vendorId, cartItems })
      });
      const data = await res.json();
      return data;
    } catch {
      return null;
    }
  },

  async getPublicPromotions(vendorId = null) {
    try {
      const url = vendorId
        ? `${API_BASE_URL}/marketing/public?vendorId=${encodeURIComponent(vendorId)}`
        : `${API_BASE_URL}/marketing/public`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateFeaturedProducts(vendorId, productIds, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/marketing/featured-products`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify({ vendorId, productIds })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Customer ↔ Vendor Communication ────────────
  async getVendorConversations(vendorId, params = {}, user = null) {
    try {
      const query = new URLSearchParams();
      if (params.status) query.append('status', params.status);
      if (params.category) query.append('category', params.category);
      if (params.search) query.append('search', params.search);

      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await fetch(`${API_BASE_URL}/messages/vendor/${encodeURIComponent(vendorId)}${qs}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getCustomerConversations(customerId, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/customer/${encodeURIComponent(customerId)}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getConversationById(id, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/conversation/${encodeURIComponent(id)}`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async createConversation(data, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/conversations`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async sendChatMessage(conversationId, messageData, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/conversations/${encodeURIComponent(conversationId)}/messages`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(messageData)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async markConversationAsRead(conversationId, userRole = 'vendor', user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/conversations/${encodeURIComponent(conversationId)}/read`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ userRole })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateConversationStatus(conversationId, status, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/conversations/${encodeURIComponent(conversationId)}/status`, {
        method: 'PATCH',
        headers: getHeaders(user),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getVendorMessageStats(vendorId, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/messages/vendor/${encodeURIComponent(vendorId)}/stats`, {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Customer Assistance Chatbot (HubBot) ───────
  async sendChatbotMessage(payload, user = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/message`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async getChatbotFaqs() {
    try {
      const res = await fetch(`${API_BASE_URL}/chatbot/faqs`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  // ── Growth & Analytics (Phase 7) ─────────────────
  async getVendorAnalytics(vendorId, timeframe = '30D', user = null) {
    try {
      const url = new URL(`${API_BASE_URL}/analytics/vendor/${encodeURIComponent(vendorId)}`);
      if (timeframe) url.searchParams.set('timeframe', timeframe);
      const res = await fetch(url.toString(), {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getVendorAnalytics fallback:', err.message);
      return null;
    }
  },

  async recordStoreVisit(vendorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/store-visit/${encodeURIComponent(vendorId)}`, {
        method: 'POST'
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async exportVendorAnalyticsReport(vendorId, timeframe = '30D', user = null) {
    try {
      const url = new URL(`${API_BASE_URL}/analytics/vendor/${encodeURIComponent(vendorId)}/export`);
      if (timeframe) url.searchParams.set('timeframe', timeframe);
      const res = await fetch(url.toString(), {
        headers: getHeaders(user)
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `vendor-analytics-${vendorId}-${timeframe}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      return true;
    } catch (err) {
      console.error('exportVendorAnalyticsReport Error:', err);
      return false;
    }
  },

  // ── Store Promotion & Discoverability (Phase 8) ───
  async getStores(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/stores${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStores fallback:', err.message);
      return null;
    }
  },

  async getFeaturedStores() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/featured`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getFeaturedStores fallback:', err.message);
      return null;
    }
  },

  async getStoreCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/categories`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStoreCategories fallback:', err.message);
      return null;
    }
  },

  async getStoreSeoMetadata(slug) {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${encodeURIComponent(slug)}/seo`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStoreSeoMetadata fallback:', err.message);
      return null;
    }
  },

  // ── Smart Inventory Management ───────────────────
  async getVendorInventorySummary(vendorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/summary/${encodeURIComponent(vendorId)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getVendorInventorySummary fallback:', err.message);
      return null;
    }
  },

  async adjustInventoryStock(adjustmentData, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/adjust`, {
        method: 'POST',
        headers: getHeaders(user),
        body: JSON.stringify(adjustmentData)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Inventory adjustment failed' };
      }
      return await res.json();
    } catch (err) {
      console.warn('adjustInventoryStock fallback:', err.message);
      return null;
    }
  },

  async getStockMovements(vendorId, options = {}) {
    try {
      const queryParams = new URLSearchParams();
      if (options.productId) queryParams.set('productId', options.productId);
      if (options.reason) queryParams.set('reason', options.reason);
      if (options.limit) queryParams.set('limit', options.limit);
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

      const res = await fetch(`${API_BASE_URL}/inventory/movements/${encodeURIComponent(vendorId)}${queryString}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStockMovements fallback:', err.message);
      return null;
    }
  },

  async getLowStockAlerts(vendorId) {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/alerts/${encodeURIComponent(vendorId)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getLowStockAlerts fallback:', err.message);
      return null;
    }
  },

  async updateSkuBarcode(productId, data, user) {
    try {
      const res = await fetch(`${API_BASE_URL}/inventory/sku-barcode/${encodeURIComponent(productId)}`, {
        method: 'PUT',
        headers: getHeaders(user),
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, message: errorData.message || 'Update SKU/Barcode failed' };
      }
      return await res.json();
    } catch (err) {
      console.warn('updateSkuBarcode fallback:', err.message);
      return null;
    }
  },

  // ── Store & Vendor Discovery ───────────────────
  async getStores(params = {}) {
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== '' && v !== null)
      );
      const query = new URLSearchParams(cleanParams).toString();
      const res = await fetch(`${API_BASE_URL}/stores${query ? `?${query}` : ''}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStores fallback:', err.message);
      return null;
    }
  },

  async getFeaturedStores() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/featured`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getFeaturedStores fallback:', err.message);
      return null;
    }
  },

  async getEmergingStores() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/emerging`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getEmergingStores fallback:', err.message);
      return null;
    }
  },

  async getStoreCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/categories`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStoreCategories fallback:', err.message);
      return null;
    }
  },

  async getStoreSeo(slug) {
    try {
      const res = await fetch(`${API_BASE_URL}/stores/${encodeURIComponent(slug)}/seo`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('getStoreSeo fallback:', err.message);
      return null;
    }
  },

  // ── Health & Maintenance ─────────────────────────
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async seedDatabase(force = false) {
    try {
      const res = await fetch(`${API_BASE_URL}/seed${force ? '?force=true' : ''}`, {
        method: 'POST'
      });
      return await res.json();
    } catch {
      return null;
    }
  }
};

export const api = apiService;
export default apiService;

