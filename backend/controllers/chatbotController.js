import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { seedOrders, seedProducts, seedVendors } from '../data/seedData.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Curated FAQ dictionary
const FAQ_KNOWLEDGE_BASE = [
  {
    category: 'Doorstep Delivery OTP & Anti-Fraud',
    question: 'How does the 4-digit Cash on Delivery (COD) OTP work?',
    answer:
      'For anti-fraud protection on all Cash on Delivery (COD) orders, a secure 4-digit Delivery OTP is generated upon checkout. The OTP is listed under your Order details. Share this OTP with the delivery executive ONLY after physically inspecting the outer package carton at your doorstep to ensure tamper-free delivery.'
  },
  {
    category: 'Order Fulfillment & Tracking',
    question: 'How do I track my physical shipment?',
    answer:
      'All physical shipments transition through 5 verifiable fulfillment stages: Stock Reserved ➔ Packaging Verified ➔ In Transit with Courier ➔ Out for Delivery ➔ Physically Delivered. You can copy your courier waybill tracking number (e.g., DEL-8492019) from "My Orders" for live courier tracking via Delhivery or BlueDart.'
  },
  {
    category: 'Returns & Replacement Window',
    question: 'What is the return and replacement policy?',
    answer:
      'Vendor Hub physical retail purchases carry a mandatory 7-Day Hassle-Free Replacement or Refund window. If you receive an item with transit damage, defects, or incorrect specifications, navigate to "My Orders" and click "Return / Replace" or "Raise Dispute" with photo evidence.'
  },
  {
    category: 'Brand Warranty & Authenticity',
    question: 'Are all products covered by manufacturer warranty?',
    answer:
      'Yes! 100% of products listed on Vendor Hub represent physically stocked inventory from verified merchants. Every package includes an official GST tax invoice and manufacturer warranty document valid at authorized service centers nationwide.'
  },
  {
    category: 'Payment Options & UPI QR',
    question: 'What payment methods are supported?',
    answer:
      'We support: 1) Dynamic UPI QR Code (with 10-minute validity timer & instant VPA copy), 2) Cash on Delivery (COD) with 4-Digit Doorstep Delivery OTP, and 3) 256-bit SSL encrypted Credit/Debit Cards and NetBanking.'
  },
  {
    category: 'Vendor Storefronts & Direct Chat',
    question: 'Can I contact a merchant directly before buying?',
    answer:
      'Yes! On any product page or store profile, click "Message Merchant" to open a direct conversation thread with the store owner regarding stock availability, custom engraving, or dispatch timing.'
  }
];

/**
 * Intelligent chatbot message processor
 * POST /api/chatbot/message
 */
export const processChatbotMessage = async (req, res) => {
  try {
    const { message, userId, userRole, context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const cleanMsg = message.trim().toLowerCase();
    const now = new Date().toISOString();

    // ── INTENT 1: ORDER STATUS & TRACKING ───────────────────
    const orderIdMatch = cleanMsg.match(/\b(ord\d+|order\s*#?\s*\d+)\b/i);
    const hasOrderKeywords =
      cleanMsg.includes('track') ||
      cleanMsg.includes('order') ||
      cleanMsg.includes('shipment') ||
      cleanMsg.includes('courier') ||
      cleanMsg.includes('where is my') ||
      cleanMsg.includes('delivery status');

    if (orderIdMatch || (hasOrderKeywords && !cleanMsg.includes('otp') && !cleanMsg.includes('return'))) {
      let queriedOrderId = null;
      if (orderIdMatch) {
        queriedOrderId = orderIdMatch[0].replace(/order\s*#?\s*/i, 'ord').toLowerCase();
      }

      // Fetch user's orders or specific order
      let orders = [];
      if (isDbConnected()) {
        if (queriedOrderId) {
          const single = await Order.findOne({ id: queriedOrderId }).lean();
          if (single) orders = [single];
        } else if (userId) {
          orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 }).limit(3).lean();
        }
      } else {
        if (queriedOrderId) {
          const single = seedOrders.find((o) => o.id.toLowerCase() === queriedOrderId);
          if (single) orders = [single];
        } else if (userId) {
          orders = seedOrders.filter((o) => o.customerId === userId).slice(0, 3);
        } else {
          orders = seedOrders.slice(0, 2);
        }
      }

      if (orders.length > 0) {
        const topOrder = orders[0];
        const isDelivered = topOrder.status === 'Delivered';
        const isDispatched = topOrder.status === 'Dispatched' || topOrder.status === 'Out for Delivery';

        let statusExplanation = '';
        if (topOrder.status === 'Placed') {
          statusExplanation = 'Your warehouse stock has been reserved and is awaiting merchant packaging verification.';
        } else if (topOrder.status === 'Confirmed') {
          statusExplanation = 'The merchant has verified packaging and scheduled handover to the courier partner.';
        } else if (topOrder.status === 'Dispatched') {
          statusExplanation = `Your order is currently In Transit with ${topOrder.courierPartner || 'Delhivery Surface Express'}. Estimated delivery is within 2-3 business days.`;
        } else if (topOrder.status === 'Out for Delivery') {
          statusExplanation = 'Your package has reached the local delivery hub and is Out for Delivery with the courier executive today!';
        } else if (isDelivered) {
          statusExplanation = 'Your package was safely handed over and physically delivered.';
        } else {
          statusExplanation = `Current order status is "${topOrder.status}".`;
        }

        const actionCards = orders.map((o) => ({
          type: 'order_card',
          orderId: o.id,
          status: o.status,
          courierPartner: o.courierPartner || o.shippingMethod || 'Surface Express',
          trackingNumber: o.trackingNumber || 'DEL-8492019',
          total: o.total,
          itemsCount: o.items?.length || 1,
          firstItemName: o.items?.[0]?.name || 'Physical merchandise',
          firstItemImage: o.items?.[0]?.image || '',
          deliveryOtp: o.paymentDetails?.codOtp || null,
          isCod: o.paymentMethod === 'COD'
        }));

        return res.json({
          success: true,
          reply: `Here is the current tracking update for **Order #${topOrder.id}**:\n\n• **Status**: ${topOrder.status}\n• **Courier**: ${topOrder.courierPartner || 'Delhivery Surface Express'}\n• **Waybill Tracking**: \`${topOrder.trackingNumber || 'DEL-8492019'}\`\n\n📌 *Fulfillment Note*: ${statusExplanation}${topOrder.paymentDetails?.codOtp ? `\n\n🔑 **Doorstep Delivery OTP**: \`${topOrder.paymentDetails.codOtp}\` (Share only after carton inspection).` : ''}`,
          intent: 'order_tracking',
          actionCards,
          quickReplies: [
            `View Order #${topOrder.id} Details`,
            'How does Delivery OTP work?',
            'Contact Merchant for this Order',
            'Return / Dispute Policy'
          ],
          timestamp: now
        });
      } else {
        return res.json({
          success: true,
          reply: queriedOrderId
            ? `I couldn't locate Order **#${queriedOrderId}** in our verified database. Please double-check your Order ID or check your "My Orders" dashboard.`
            : `You don't have any recent orders on record, or you are browsing as a guest. You can sign in to view your live orders and courier waybill tracking.`,
          intent: 'order_tracking',
          quickReplies: ['View My Orders', 'Browse Marketplace Catalog', 'How does Delivery OTP work?'],
          timestamp: now
        });
      }
    }

    // ── INTENT 2: DOORSTEP DELIVERY OTP ─────────────────────
    if (
      cleanMsg.includes('otp') ||
      cleanMsg.includes('code') ||
      cleanMsg.includes('verification code') ||
      cleanMsg.includes('delivery pin') ||
      cleanMsg.includes('cod otp')
    ) {
      return res.json({
        success: true,
        reply:
          `🛡️ **Doorstep Delivery OTP Security Explained**:\n\n` +
          `1. **Tamper-Proof Guarantee**: When you place a Cash on Delivery (COD) order, a unique **4-digit Delivery OTP** is generated.\n` +
          `2. **Where to find it**: Your OTP is visible in **My Orders** under the order tracking bar.\n` +
          `3. **Doorstep Protocol**: Inspect the outer package carton before paying. Once you verify that the tamper seal is intact, share the 4-digit OTP with the delivery executive to complete fulfillment.\n\n` +
          `> ⚠️ *Important*: Never share your OTP over phone calls or prior to package delivery inspection.`,
        intent: 'delivery_otp',
        quickReplies: ['Check My Active Orders', 'Return / Replacement Window', 'Track Shipment'],
        timestamp: now
      });
    }

    // ── INTENT 3: RETURNS, REFUNDS & DISPUTES ───────────────
    if (
      cleanMsg.includes('return') ||
      cleanMsg.includes('refund') ||
      cleanMsg.includes('replace') ||
      cleanMsg.includes('damaged') ||
      cleanMsg.includes('defective') ||
      cleanMsg.includes('dispute') ||
      cleanMsg.includes('broken')
    ) {
      return res.json({
        success: true,
        reply:
          `🔄 **Returns, Replacements & Dispute Resolution**:\n\n` +
          `• **7-Day Window**: Every physical order is backed by a 7-day replacement guarantee from the date of doorstep delivery.\n` +
          `• **Eligible Issues**: Transit damage, wrong item dispatched, or functional defects.\n` +
          `• **How to File**:\n` +
          `  1. Go to **My Orders**.\n` +
          `  2. Find your delivered item and click **Return / Replace** or **Raise Dispute**.\n` +
          `  3. Attach a clear photo of the damaged parcel/item and submit.\n` +
          `• **Resolution**: The vendor and platform admin will review within 24 hours to schedule courier pickup and dispatch a brand new sealed replacement unit or process a 100% refund.`,
        intent: 'returns',
        quickReplies: ['Go to My Orders', 'Raise a Dispute', 'Contact Storefront Merchant'],
        timestamp: now
      });
    }

    // ── INTENT 4: PAYMENT OPTIONS & DYNAMIC UPI QR ──────────
    if (
      cleanMsg.includes('payment') ||
      cleanMsg.includes('pay') ||
      cleanMsg.includes('upi') ||
      cleanMsg.includes('qr') ||
      cleanMsg.includes('cod') ||
      cleanMsg.includes('card')
    ) {
      return res.json({
        success: true,
        reply:
          `💳 **Vendor Hub Payment Systems**:\n\n` +
          `• **Dynamic UPI QR Code**: Instant QR code generated with merchant VPA and order amount. Features a 10-minute validity countdown timer and 1-click VPA copy for seamless mobile payments.\n` +
          `• **Cash on Delivery (COD)**: Available nationwide for all physical inventory with zero advance charge. Protected by our automated 4-digit Delivery OTP.\n` +
          `• **Cards & NetBanking**: 256-bit SSL encrypted checkout compliant with PCI-DSS guidelines for Visa, MasterCard, RuPay, and leading Indian banks.`,
        intent: 'payment',
        quickReplies: ['How does Delivery OTP work?', 'Check Cart & Checkout', 'Return Policy'],
        timestamp: now
      });
    }

    // ── INTENT 5: BRAND WARRANTY & AUTHENTICITY ─────────────
    if (
      cleanMsg.includes('warranty') ||
      cleanMsg.includes('guarantee') ||
      cleanMsg.includes('genuine') ||
      cleanMsg.includes('invoice') ||
      cleanMsg.includes('original') ||
      cleanMsg.includes('tax invoice')
    ) {
      return res.json({
        success: true,
        reply:
          `🛡️ **100% Physical Inventory & Brand Warranty Guarantee**:\n\n` +
          `• **Zero-Ghost Inventory**: Every SKU listed on Vendor Hub represents physically stocked merchandise in verified merchant warehouses.\n` +
          `• **Direct Brand Warranty**: All electronic gear, appliances, and branded apparel include standard manufacturer warranties (1 to 2 years) serviceable at authorized service centers across India.\n` +
          `• **Tax Invoice Included**: A printed physical GST tax invoice is placed inside every courier carton for warranty registration and tax filing.`,
        intent: 'warranty',
        quickReplies: ['Browse Electronics with Warranty', 'Track My Order', 'Contact Storefront'],
        timestamp: now
      });
    }

    // ── INTENT 6: VENDOR STOREFRONT & MESSAGING ─────────────
    if (
      cleanMsg.includes('seller') ||
      cleanMsg.includes('vendor') ||
      cleanMsg.includes('merchant') ||
      cleanMsg.includes('contact') ||
      cleanMsg.includes('store') ||
      cleanMsg.includes('chat') ||
      cleanMsg.includes('message')
    ) {
      return res.json({
        success: true,
        reply:
          `🏪 **Direct Merchant Communication & Storefronts**:\n\n` +
          `• You can chat directly with verified store owners on Vendor Hub!\n` +
          `• **From Product Pages**: Click the **Message Merchant** button beside the product specs to ask sizing, stock availability, or courier dispatch questions.\n` +
          `• **From My Orders**: Click **Message Merchant** on any order item to discuss dispatch ETA or delivery inquiries.\n` +
          `• **Messages Portal**: Access all your active merchant threads at \`/shop/messages\` from the top navigation bar.`,
        intent: 'vendor_help',
        quickReplies: ['Open My Messages', 'Browse Verified Stores', 'Track My Order'],
        timestamp: now
      });
    }

    // ── INTENT 7: PRODUCT RECOMMENDATIONS & SEARCH ──────────
    if (
      cleanMsg.includes('recommend') ||
      cleanMsg.includes('suggest') ||
      cleanMsg.includes('phone') ||
      cleanMsg.includes('mobile') ||
      cleanMsg.includes('electronics') ||
      cleanMsg.includes('headphone') ||
      cleanMsg.includes('fashion') ||
      cleanMsg.includes('saree') ||
      cleanMsg.includes('grocery') ||
      cleanMsg.includes('deal') ||
      cleanMsg.includes('buy')
    ) {
      let matchedProducts = [];

      let categoryTarget = '';
      if (cleanMsg.includes('phone') || cleanMsg.includes('mobile') || cleanMsg.includes('electronic') || cleanMsg.includes('headphone')) {
        categoryTarget = 'Electronics';
      } else if (cleanMsg.includes('fashion') || cleanMsg.includes('saree') || cleanMsg.includes('shirt') || cleanMsg.includes('cloth')) {
        categoryTarget = 'Fashion';
      } else if (cleanMsg.includes('grocery') || cleanMsg.includes('oil') || cleanMsg.includes('rice') || cleanMsg.includes('food')) {
        categoryTarget = 'Grocery';
      }

      if (isDbConnected()) {
        const query = { status: 'approved' };
        if (categoryTarget) query.category = categoryTarget;
        matchedProducts = await Product.find(query).limit(3).lean();
      } else {
        matchedProducts = seedProducts
          .filter((p) => (p.status === 'approved' || !p.status) && (!categoryTarget || p.category === categoryTarget))
          .slice(0, 3);
      }

      const productCards = matchedProducts.map((p) => ({
        type: 'product_card',
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        mrp: p.mrp || Math.round(p.price * 1.25),
        image: p.images?.[0] || p.image || '',
        sku: p.sku || 'VM-PHYSICAL',
        stock: p.stock != null ? p.stock : (p.quantity || 10),
        fastShipping: p.shipping?.shipsIn24h || true
      }));

      return res.json({
        success: true,
        reply:
          `Here are verified, top-rated products physically stocked in merchant warehouses${categoryTarget ? ` in **${categoryTarget}**` : ''} ready for priority courier dispatch:`,
        intent: 'product_recommendation',
        actionCards: productCards,
        quickReplies: ['View Marketplace Catalog', 'Electronics Deals', 'Track My Order', 'Delivery OTP Guide'],
        timestamp: now
      });
    }

    // ── INTENT 8: GENERAL ASSISTANCE & FALLBACK ─────────────
    return res.json({
      success: true,
      reply:
        `Hello! I am **HubBot**, your Vendor Hub assistant. I can assist you with:\n\n` +
        `• 📦 **Real-Time Order Tracking**: Ask "Track my order" or mention your Order ID (e.g. \`#ord1\`).\n` +
        `• 🔑 **Doorstep Delivery OTP**: Learn how anti-fraud 4-digit verification protects your COD orders.\n` +
        `• 🔄 **Returns & Replacements**: 7-day replacement policy and dispute claims.\n` +
        `• 🛡️ **Brand Warranty**: 100% physical inventory integrity and GST tax invoices.\n` +
        `• 💬 **Storefront Chat**: How to contact verified merchants directly.\n\n` +
        `How can I help you right now? Pick an option below or type your question:`,
      intent: 'faq',
      quickReplies: [
        'Track My Order',
        'How does Delivery OTP work?',
        'Return & Replacement Policy',
        'Physical Brand Warranty',
        'Recommend Electronics'
      ],
      timestamp: now
    });
  } catch (error) {
    console.error('Chatbot Processing Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process chatbot query',
      error: error.message
    });
  }
};

/**
 * Get curated FAQ categories
 * GET /api/chatbot/faqs
 */
export const getChatbotFaqs = async (req, res) => {
  try {
    return res.json({
      success: true,
      faqs: FAQ_KNOWLEDGE_BASE,
      count: FAQ_KNOWLEDGE_BASE.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve FAQs',
      error: error.message
    });
  }
};
