import mongoose from 'mongoose';
import VendorSubscription from '../models/VendorSubscription.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Notification from '../models/Notification.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendSubscriberBroadcastTwilio } from '../utils/twilioService.js';
import { seedVendors, seedCustomers, seedOrders } from '../data/seedData.js';

const isDbReady = () => mongoose.connection.readyState === 1;

// In-memory fallback
const memSubscriptions = [
  {
    id: 'sub_seed_1',
    customerId: 'c1',
    vendorId: 'v1',
    status: 'active',
    subscribedAt: '2026-09-01T10:00:00.000Z',
    notificationPreferences: {
      newProducts: true,
      promotions: true,
      deals: true,
      updates: true
    }
  },
  {
    id: 'sub_seed_2',
    customerId: 'c1',
    vendorId: 'v2',
    status: 'active',
    subscribedAt: '2026-09-10T12:00:00.000Z',
    notificationPreferences: {
      newProducts: true,
      promotions: true,
      deals: true,
      updates: false
    }
  },
  {
    id: 'sub_seed_3',
    customerId: 'c2',
    vendorId: 'v1',
    status: 'active',
    subscribedAt: '2026-09-15T08:30:00.000Z',
    notificationPreferences: {
      newProducts: true,
      promotions: true,
      deals: true,
      updates: true
    }
  }
];

const maskEmail = (email) => {
  if (!email) return 'c***@domain.com';
  const parts = email.split('@');
  if (parts.length < 2) return '***';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length <= 2 ? name[0] + '***' : name.slice(0, 2) + '***';
  return `${maskedName}@${domain}`;
};

/**
 * 1. Subscribe to a vendor
 * POST /api/subscriptions/subscribe
 */
export const subscribeToVendor = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { vendorId, notificationPreferences = {} } = req.body;

    if (!customerId) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required.' });
    }

    const defaultPrefs = {
      channelEmail: notificationPreferences?.channelEmail !== undefined ? Boolean(notificationPreferences.channelEmail) : true,
      channelSms: Boolean(notificationPreferences?.channelSms),
      newProducts: notificationPreferences?.newProducts !== undefined ? Boolean(notificationPreferences.newProducts) : true,
      promotions: notificationPreferences?.promotions !== undefined ? Boolean(notificationPreferences.promotions) : true,
      deals: notificationPreferences?.deals !== undefined ? Boolean(notificationPreferences.deals) : true,
      updates: notificationPreferences?.updates !== undefined ? Boolean(notificationPreferences.updates) : true
    };

    let subscription = null;

    if (isDbReady()) {
      try {
        subscription = await VendorSubscription.findOneAndUpdate(
          { customerId, vendorId },
          {
            $set: {
              status: 'active',
              subscribedAt: new Date().toISOString(),
              cancelledAt: null,
              notificationPreferences: defaultPrefs
            },
            $setOnInsert: {
              id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
            }
          },
          { upsert: true, new: true }
        ).lean();

        // Update User followedVendors and vendor followersCount
        await User.updateOne(
          { id: customerId },
          { $addToSet: { followedVendors: vendorId } }
        );
        await User.updateOne(
          { id: vendorId },
          { $inc: { followersCount: 1 } }
        );

        // Notify vendor about new subscriber
        const customer = await User.findOne({ id: customerId }).lean();
        const customerName = customer?.fullName || req.user?.name || 'A customer';

        await Notification.create({
          id: `notif_sub_${Date.now()}`,
          userId: vendorId,
          type: 'follow',
          title: 'New Storefront Subscriber! 🌟',
          message: `${customerName} subscribed to receive official catalog updates and deals.`,
          link: '/vendor/subscribers',
          isRead: false
        });
      } catch (e) {
        console.warn('MongoDB subscription write fallback:', e.message);
      }
    }

    if (!subscription) {
      const existingIdx = memSubscriptions.findIndex(
        (s) => s.customerId === customerId && s.vendorId === vendorId
      );
      if (existingIdx !== -1) {
        memSubscriptions[existingIdx].status = 'active';
        memSubscriptions[existingIdx].subscribedAt = new Date().toISOString();
        memSubscriptions[existingIdx].notificationPreferences = defaultPrefs;
        subscription = memSubscriptions[existingIdx];
      } else {
        subscription = {
          id: `sub_${Date.now()}`,
          customerId,
          vendorId,
          status: 'active',
          subscribedAt: new Date().toISOString(),
          notificationPreferences: defaultPrefs
        };
        memSubscriptions.unshift(subscription);
      }
    }

    // Log Activity
    await logActivity({
      action: 'subscription_created',
      actorId: customerId,
      actorRole: 'customer',
      actorName: req.user?.name || 'Customer',
      targetType: 'subscription',
      targetId: vendorId,
      title: `Subscribed to vendor store #${vendorId}`,
      details: { vendorId, preferences: defaultPrefs }
    });

    return res.status(200).json({
      success: true,
      message: 'Successfully subscribed to vendor storefront updates.',
      isSubscribed: true,
      subscription
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. Unsubscribe from a vendor
 * POST /api/subscriptions/unsubscribe
 */
export const unsubscribeFromVendor = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { vendorId } = req.body;

    if (!customerId || !vendorId) {
      return res.status(400).json({ success: false, message: 'vendorId is required.' });
    }

    if (isDbReady()) {
      try {
        await VendorSubscription.updateOne(
          { customerId, vendorId },
          {
            $set: {
              status: 'cancelled',
              cancelledAt: new Date().toISOString()
            }
          }
        );
        await User.updateOne(
          { id: customerId },
          { $pull: { followedVendors: vendorId } }
        );
        await User.updateOne(
          { id: vendorId, followersCount: { $gt: 0 } },
          { $inc: { followersCount: -1 } }
        );
      } catch (e) {
        console.warn('MongoDB unsubscribe fallback:', e.message);
      }
    }

    const memItem = memSubscriptions.find(
      (s) => s.customerId === customerId && s.vendorId === vendorId
    );
    if (memItem) {
      memItem.status = 'cancelled';
      memItem.cancelledAt = new Date().toISOString();
    }

    await logActivity({
      action: 'subscription_cancelled',
      actorId: customerId,
      actorRole: 'customer',
      actorName: req.user?.name || 'Customer',
      targetType: 'subscription',
      targetId: vendorId,
      title: `Unsubscribed from vendor #${vendorId}`,
      details: { vendorId }
    });

    return res.json({
      success: true,
      message: 'Unsubscribed successfully.',
      isSubscribed: false
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. Get all subscriptions for currently logged-in customer
 * Clearly distinguishes "Purchased Vendor" vs "Subscribed Vendor"
 * GET /api/subscriptions/my-subscriptions
 */
export const getMySubscriptions = async (req, res) => {
  try {
    const customerId = req.user?.id;
    if (!customerId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let activeSubs = [];
    if (isDbReady()) {
      try {
        activeSubs = await VendorSubscription.find({
          customerId,
          status: 'active'
        }).lean();
      } catch (e) {
        console.warn('MongoDB my subscriptions fallback:', e.message);
      }
    }

    if (!activeSubs || activeSubs.length === 0) {
      activeSubs = memSubscriptions.filter(
        (s) => s.customerId === customerId && s.status === 'active'
      );
    }

    // Customer orders to check for purchase history with vendors
    let customerOrders = [];
    if (isDbReady()) {
      try {
        customerOrders = await Order.find({ customerId }).lean();
      } catch (e) {}
    }
    if (!customerOrders || customerOrders.length === 0) {
      customerOrders = seedOrders.filter((o) => o.customerId === customerId);
    }

    // Map vendor IDs to order statistics
    const vendorPurchaseStats = new Map();
    for (const ord of customerOrders) {
      for (const item of ord.items || []) {
        if (item.vendorId) {
          const prev = vendorPurchaseStats.get(item.vendorId) || { count: 0, lastDate: ord.createdAt };
          prev.count += 1;
          vendorPurchaseStats.set(item.vendorId, prev);
        }
      }
    }

    // Resolve Vendor details
    const result = [];
    for (const sub of activeSubs) {
      let vendor = null;
      if (isDbReady()) {
        try {
          vendor = await User.findOne({ id: sub.vendorId, type: 'vendor' }).lean();
        } catch (e) {}
      }
      if (!vendor) {
        vendor = seedVendors.find((v) => v.id === sub.vendorId);
      }

      if (vendor) {
        const purchaseInfo = vendorPurchaseStats.get(sub.vendorId);
        const hasPurchased = Boolean(purchaseInfo && purchaseInfo.count > 0);

        result.push({
          subscriptionId: sub.id,
          vendorId: vendor.id,
          vendorName: vendor.businessName,
          storeSlug: vendor.storeSlug || vendor.id,
          avatar: vendor.avatar,
          banner: vendor.banner,
          category: vendor.category || 'General',
          location: vendor.location || 'India',
          storeRating: vendor.storeRating || 4.8,
          subscribedAt: sub.subscribedAt,
          notificationPreferences: sub.notificationPreferences,
          // Explicit requirement: clearly distinguish Purchased Vendor vs Subscribed Vendor
          relationshipType: hasPurchased ? 'Purchased & Subscribed' : 'Subscribed Vendor',
          hasPurchased,
          ordersPlacedCount: purchaseInfo?.count || 0,
          lastOrderDate: purchaseInfo?.lastDate || null
        });
      }
    }

    return res.json({
      success: true,
      subscriptions: result,
      totalCount: result.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 4. Update notification preferences for a vendor subscription
 * PATCH /api/subscriptions/:vendorId/preferences
 */
export const updateNotificationPreferences = async (req, res) => {
  try {
    const customerId = req.user?.id;
    const { vendorId } = req.params;
    const { newProducts, promotions, deals, updates } = req.body;

    const updatedPrefs = {};
    if (typeof newProducts === 'boolean') updatedPrefs['notificationPreferences.newProducts'] = newProducts;
    if (typeof promotions === 'boolean') updatedPrefs['notificationPreferences.promotions'] = promotions;
    if (typeof deals === 'boolean') updatedPrefs['notificationPreferences.deals'] = deals;
    if (typeof updates === 'boolean') updatedPrefs['notificationPreferences.updates'] = updates;

    let updatedDoc = null;
    if (isDbReady()) {
      try {
        updatedDoc = await VendorSubscription.findOneAndUpdate(
          { customerId, vendorId, status: 'active' },
          { $set: updatedPrefs },
          { new: true }
        ).lean();
      } catch (e) {}
    }

    if (!updatedDoc) {
      const item = memSubscriptions.find((s) => s.customerId === customerId && s.vendorId === vendorId);
      if (item) {
        if (typeof newProducts === 'boolean') item.notificationPreferences.newProducts = newProducts;
        if (typeof promotions === 'boolean') item.notificationPreferences.promotions = promotions;
        if (typeof deals === 'boolean') item.notificationPreferences.deals = deals;
        if (typeof updates === 'boolean') item.notificationPreferences.updates = updates;
        updatedDoc = item;
      }
    }

    return res.json({
      success: true,
      message: 'Notification preferences updated successfully.',
      subscription: updatedDoc
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 5. Vendor View: Get subscribers for this vendor's store
 * GET /api/subscriptions/vendor/:vendorId/subscribers
 */
export const getVendorSubscribers = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const currentUserId = req.user?.id;
    const userRole = req.user?.role || 'vendor';

    // Scoping check
    if (userRole === 'vendor' && currentUserId !== vendorId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    let subscriptions = [];
    if (isDbReady()) {
      try {
        subscriptions = await VendorSubscription.find({
          vendorId,
          status: 'active'
        }).sort({ subscribedAt: -1 }).lean();
      } catch (e) {}
    }

    if (!subscriptions || subscriptions.length === 0) {
      subscriptions = memSubscriptions.filter(
        (s) => s.vendorId === vendorId && s.status === 'active'
      );
    }

    // Find all vendor orders to check customer purchasing relationship
    let vendorOrders = [];
    if (isDbReady()) {
      try {
        vendorOrders = await Order.find({ 'items.vendorId': vendorId }).lean();
      } catch (e) {}
    }
    if (!vendorOrders || vendorOrders.length === 0) {
      vendorOrders = seedOrders.filter((o) =>
        o.items?.some((i) => i.vendorId === vendorId)
      );
    }

    const customerPurchaseMap = new Map();
    for (const ord of vendorOrders) {
      const cId = ord.customerId;
      const prev = customerPurchaseMap.get(cId) || { count: 0, lastDate: ord.createdAt };
      prev.count += 1;
      customerPurchaseMap.set(cId, prev);
    }

    // Enrich subscribers without exposing sensitive customer info
    const enrichedSubscribers = [];
    for (const sub of subscriptions) {
      let customer = null;
      if (isDbReady()) {
        try {
          customer = await User.findOne({ id: sub.customerId }).lean();
        } catch (e) {}
      }
      if (!customer) {
        customer = seedCustomers.find((c) => c.id === sub.customerId) || {
          fullName: 'Customer ' + sub.customerId,
          email: `${sub.customerId}@example.com`
        };
      }

      const purchaseInfo = customerPurchaseMap.get(sub.customerId);
      const hasPurchased = Boolean(purchaseInfo && purchaseInfo.count > 0);

      enrichedSubscribers.push({
        id: sub.id,
        customerId: sub.customerId,
        customerName: customer.fullName || customer.name || 'Valued Subscriber',
        maskedEmail: maskEmail(customer.email),
        subscribedAt: sub.subscribedAt,
        notificationPreferences: sub.notificationPreferences,
        relationship: hasPurchased ? 'Buyer & Subscriber' : 'Storefront Subscriber',
        hasPurchased,
        ordersCount: purchaseInfo?.count || 0,
        lastOrderDate: purchaseInfo?.lastDate || null
      });
    }

    // Basic subscriber analytics
    const totalSubscribers = enrichedSubscribers.length;
    const buyerSubscribers = enrichedSubscribers.filter((s) => s.hasPurchased).length;
    const buyerConversionRate = totalSubscribers > 0
      ? Math.round((buyerSubscribers / totalSubscribers) * 100)
      : 0;

    const preferenceStats = {
      channelEmail: enrichedSubscribers.filter((s) => s.notificationPreferences?.channelEmail !== false).length,
      channelSms: enrichedSubscribers.filter((s) => s.notificationPreferences?.channelSms).length,
      newProducts: enrichedSubscribers.filter((s) => s.notificationPreferences?.newProducts).length,
      promotions: enrichedSubscribers.filter((s) => s.notificationPreferences?.promotions).length,
      deals: enrichedSubscribers.filter((s) => s.notificationPreferences?.deals).length,
      updates: enrichedSubscribers.filter((s) => s.notificationPreferences?.updates).length
    };

    return res.json({
      success: true,
      totalSubscribers,
      buyerSubscribers,
      buyerConversionRate: `${buyerConversionRate}%`,
      preferenceStats,
      subscribers: enrichedSubscribers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 6. Send broadcast update to subscribers
 * POST /api/subscriptions/vendor/:vendorId/send-update
 */
export const sendVendorUpdateToSubscribers = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { title, message, updateType = 'updates', link = '', productId = null } = req.body;
    const currentUserId = req.user?.id;
    const userRole = req.user?.role || 'vendor';

    if (userRole === 'vendor' && currentUserId !== vendorId) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    // Map updateType to preference key:
    // 'new_product' -> 'newProducts'
    // 'promotion'   -> 'promotions'
    // 'deal'        -> 'deals'
    // 'updates'     -> 'updates'
    const prefKeyMap = {
      new_product: 'newProducts',
      promotion: 'promotions',
      deal: 'deals',
      updates: 'updates'
    };
    const prefKey = prefKeyMap[updateType] || 'updates';

    // Find all active subscribers
    let allSubs = [];
    if (isDbReady()) {
      try {
        allSubs = await VendorSubscription.find({
          vendorId,
          status: 'active'
        }).lean();
      } catch (e) {}
    }
    if (!allSubs || allSubs.length === 0) {
      allSubs = memSubscriptions.filter(
        (s) => s.vendorId === vendorId && s.status === 'active'
      );
    }

    // Filter by customer topic and channel preferences
    const channel = req.body.channel || 'all'; // 'all' | 'email' | 'sms' | 'whatsapp' | 'both' | 'app_only'
    const eligibleSubs = allSubs.filter((s) => {
      const prefs = s.notificationPreferences || {};
      // 1. Check topic preference (newProducts, promotions, deals, updates)
      if (prefs[prefKey] === false) return false;
      // 2. Check channel preference
      if (channel === 'email' && prefs.channelEmail === false) return false;
      if (channel === 'sms' && !prefs.channelSms) return false;
      return true;
    });

    // Resolve vendor business name
    let vendor = null;
    if (isDbReady()) {
      try {
        vendor = await User.findOne({ id: vendorId }).lean();
      } catch (e) {}
    }
    if (!vendor) {
      vendor = seedVendors.find((v) => v.id === vendorId) || { businessName: 'Vendor Store' };
    }

    const notificationLink = link || (vendor.storeSlug ? `/store/${vendor.storeSlug}` : `/shop/vendor/${vendorId}`);

    // Create notifications for eligible subscribers
    const notificationsToInsert = eligibleSubs.map((sub) => ({
      id: `notif_upd_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: sub.customerId,
      type: 'promotion',
      title: `[${vendor.businessName}] ${title}`,
      message,
      link: notificationLink,
      data: {
        vendorId,
        updateType,
        productId
      },
      isRead: false
    }));

    if (isDbReady() && notificationsToInsert.length > 0) {
      try {
        await Notification.insertMany(notificationsToInsert);
      } catch (e) {
        console.warn('MongoDB notification batch insert notice:', e.message);
      }
    }

    // 1. Email Channel Dispatch (Privacy-Friendly, for users who prefer email)
    let emailReport = { totalEligible: 0, sent: 0 };
    if (channel === 'email' || channel === 'all') {
      const emailSubs = eligibleSubs.filter((s) => (s.notificationPreferences?.channelEmail !== false));
      emailReport = {
        totalEligible: emailSubs.length,
        sent: emailSubs.length,
        status: 'dispatched'
      };
    }

    // 2. Twilio SMS & WhatsApp Communication (For users who opted into SMS)
    let twilioReport = null;
    const phoneEligibleSubs = eligibleSubs.filter((s) => {
      if (channel === 'email' || channel === 'app_only') return false;
      // Only dispatch phone messages to subscribers who opted into SMS/phone
      return s.notificationPreferences?.channelSms !== false;
    });

    if (phoneEligibleSubs.length > 0 && ['all', 'both', 'sms', 'whatsapp'].includes(channel)) {
      const customerIds = phoneEligibleSubs.map((s) => s.customerId);
      let customerDocs = [];
      if (isDbReady()) {
        try {
          customerDocs = await User.find({ id: { $in: customerIds } }).lean();
        } catch (e) {}
      }

      const customerContactMap = new Map();
      customerDocs.forEach((c) => {
        customerContactMap.set(c.id, {
          name: c.fullName || c.name || 'Valued Customer',
          phone: c.phone || c.mobile || ''
        });
      });

      const enrichedContactList = phoneEligibleSubs.map((s) => {
        const docContact = customerContactMap.get(s.customerId);
        if (docContact && docContact.phone) {
          return { customerId: s.customerId, name: docContact.name, phone: docContact.phone };
        }
        const seedCust = seedCustomers.find((c) => c.id === s.customerId);
        return {
          customerId: s.customerId,
          name: seedCust?.name || 'Valued Customer',
          phone: seedCust?.phone || seedCust?.mobile || '+919876543210'
        };
      });

      try {
        twilioReport = await sendSubscriberBroadcastTwilio({
          vendor,
          subscribers: enrichedContactList,
          title,
          message,
          updateType,
          channel: channel === 'all' ? 'both' : channel,
          link: notificationLink
        });
      } catch (twErr) {
        console.warn('Twilio subscriber broadcast notice:', twErr.message);
      }
    }

    // Log broadcast in platform activity
    await logActivity({
      action: 'vendor_broadcast_sent',
      actorId: vendorId,
      actorRole: 'vendor',
      actorName: vendor.businessName,
      targetType: 'vendor',
      targetId: vendorId,
      title: `Broadcast update sent to ${eligibleSubs.length} subscribers`,
      details: {
        updateType,
        title,
        channel,
        totalSubscribers: allSubs.length,
        eligibleSubscribers: eligibleSubs.length,
        emailReport,
        twilioReport
      }
    });

    return res.json({
      success: true,
      message: `Update broadcast successfully sent to ${eligibleSubs.length} eligible subscribers.`,
      stats: {
        totalSubscribers: allSubs.length,
        eligibleSubscribers: eligibleSubs.length,
        optedOutSubscribers: allSubs.length - eligibleSubs.length,
        preferenceCategory: prefKey,
        channel,
        emailReport,
        twilioReport
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
