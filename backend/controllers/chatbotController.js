import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Promotion from '../models/Promotion.js';
import { seedOrders, seedProducts, seedVendors, seedPromotions } from '../data/seedData.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Curated FAQ dictionary for platform self-service
export const FAQ_KNOWLEDGE_BASE = [
  {
    category: 'Doorstep Delivery OTP & Anti-Fraud',
    question: 'How does the 4-digit Cash on Delivery (COD) OTP work?',
    answer:
      'For anti-fraud protection on all Cash on Delivery (COD) orders, a secure 4-digit Delivery OTP is generated upon checkout. The OTP is listed under your Order details in "My Orders". Share this OTP with the delivery executive ONLY after physically inspecting the outer package carton at your doorstep to ensure tamper-free delivery.'
  },
  {
    category: 'Order Fulfillment & Tracking',
    question: 'How do I track my physical shipment?',
    answer:
      'All physical shipments transition through 5 verifiable fulfillment stages: Stock Reserved ➔ Packaging Verified ➔ In Transit with Courier ➔ Out for Delivery ➔ Physically Delivered. You can copy your courier waybill tracking number (e.g., DEL-8492019, BD-9382109) from "My Orders" for live courier tracking via BlueDart or Delhivery.'
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
    category: 'Order Cancellation & Changes',
    question: 'Can I cancel or change an order after placing it?',
    answer:
      'You can cancel your order for a 100% instant refund at any time before the merchant dispatches the package to the courier partner directly from "My Orders". If the package has already dispatched, you may refuse delivery at your doorstep or use the 7-Day Return window.'
  },
  {
    category: 'Shipping Charges & Express Delivery',
    question: 'What are the delivery charges and delivery times?',
    answer:
      'We offer FREE standard delivery on orders above ₹499 (nominal ₹40 for smaller orders). Verified merchants dispatch within 24 hours from physical warehouses, and express courier transit typically takes 2-4 business days nationwide.'
  },
  {
    category: 'Coupons, Discounts & Promotions',
    question: 'How do I get discounts and coupon codes?',
    answer:
      'We feature active merchant coupon codes such as TECH20 (20% off electronics above ₹999), STYLE15 (15% off fashion), and AUDIO200 (flat ₹200 off audio gear). You can enter these promo codes in the Cart or Checkout page to save instantly.'
  },
  {
    category: 'Vendor Storefronts & Direct Chat',
    question: 'Can I contact a merchant directly before buying?',
    answer:
      'Yes! On any product page or store profile, click "Message Merchant" to open a direct conversation thread with the store owner regarding stock availability, sizing, custom engraving, or dispatch timing.'
  },
  {
    category: 'Customer Care & Grievance',
    question: 'How do I contact customer support or human agents?',
    answer:
      'Our dedicated customer care team is available daily from 9:00 AM to 9:00 PM IST via toll-free helpline at 1800-836-3687 or by email at support@vendour.com. All ticket escalations are addressed within 24 hours.'
  }
];

/**
 * Intelligent Multi-Intent Natural Language Chatbot Processor
 * POST /api/chatbot/message
 */
export const processChatbotMessage = async (req, res) => {
  try {
    const { message, userId, userRole, context = {} } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty' });
    }

    const cleanMsg = message.trim().toLowerCase();
    const rawMsg = message.trim();
    const now = new Date().toISOString();

    // ─────────────────────────────────────────────────────────
    // 1. GREETINGS, COURTESIES & ABOUT BOT
    // ─────────────────────────────────────────────────────────
    const isGreeting =
      /^(hi|hello|hey|heya|namaste|hola|greetings|good\s*(morning|afternoon|evening|day)|sup|what'?s\s*up)\b/i.test(cleanMsg) ||
      cleanMsg === 'hi' ||
      cleanMsg === 'hello' ||
      cleanMsg === 'hey';

    const isCourtesy =
      /^(thanks|thank\s*you|thx|awesome|great|cool|perfect|good\s*job|nice|superb|ok|okay)\b/i.test(cleanMsg) ||
      cleanMsg.includes('thank you') ||
      cleanMsg.includes('thanks a lot');

    const isGoodbye =
      /^(bye|goodbye|see\s*you|take\s*care|cya|exit|quit|close)\b/i.test(cleanMsg);

    const isBotIdentity =
      cleanMsg.includes('who are you') ||
      cleanMsg.includes('what is your name') ||
      cleanMsg.includes('what are you') ||
      cleanMsg.includes('who made you') ||
      cleanMsg.includes('hubbot');

    const isHelpOverview =
      cleanMsg === 'help' ||
      cleanMsg === 'menu' ||
      cleanMsg === 'options' ||
      cleanMsg.includes('what can you do') ||
      cleanMsg.includes('how can you help') ||
      cleanMsg.includes('features');

    if (isGreeting || isBotIdentity || isHelpOverview) {
      return res.json({
        success: true,
        reply:
          `👋 **Hello! I am HubBot**, your 24/7 AI shopping and order assistant on Vendor Hub.\n\n` +
          `I am equipped to handle all your customer queries in real-time, including:\n\n` +
          `• 📦 **Live Order Tracking**: Find out exactly where your package is and courier waybills.\n` +
          `• 🔑 **Doorstep Delivery OTP**: Understand the anti-fraud 4-digit code for COD parcels.\n` +
          `• 🏷️ **Coupons & Promo Codes**: Get active discount codes (e.g. \`TECH20\`, \`STYLE15\`, \`AUDIO200\`).\n` +
          `• 🔄 **7-Day Returns & Replacements**: Hassle-free physical return or dispute resolution.\n` +
          `• 🚚 **Shipping & Delivery Timelines**: Free shipping thresholds, dispatch SLAs & pincodes.\n` +
          `• 💳 **Payment & Dynamic UPI QR**: COD, UPI countdown timer, and secure checkout.\n` +
          `• 🛡️ **Brand Warranty & GST Invoices**: 100% verified physical stock & tax invoices.\n` +
          `• 💬 **Message Sellers**: How to chat 1-on-1 with verified merchant storefronts.\n` +
          `• 🛍️ **Product Recommendations**: Find best products, deals, and filter by budget.\n\n` +
          `How can I assist you right now? Select a quick option below or type your question:`,
        intent: 'greeting',
        quickReplies: [
          'Track My Order',
          'Active Coupons & Offers',
          'Recommend Top Electronics',
          'How does Delivery OTP work?',
          'Return & Replacement Policy',
          'Contact Customer Care'
        ],
        timestamp: now
      });
    }

    if (isCourtesy) {
      return res.json({
        success: true,
        reply:
          `You're very welcome! 😊 I am always here to make your Vendor Hub shopping smooth, secure, and delightful.\n\n` +
          `Is there anything else I can assist you with regarding orders, delivery OTP, active coupons, or products?`,
        intent: 'courtesy',
        quickReplies: [
          'Track My Order',
          'Active Coupons & Offers',
          'Recommend Top Products',
          'Return / Replacement Policy'
        ],
        timestamp: now
      });
    }

    if (isGoodbye) {
      return res.json({
        success: true,
        reply:
          `Goodbye! 👋 Have a wonderful day shopping on Vendor Hub. If you ever need order updates, delivery OTP assistance, or product recommendations, just click my icon anytime!`,
        intent: 'farewell',
        quickReplies: ['Browse Marketplace Catalog', 'Track My Order', 'View Active Coupons'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 2. ACTIVE COUPONS, DISCOUNTS, OFFERS & PROMO CODES
    // ─────────────────────────────────────────────────────────
    const isCouponQuery =
      cleanMsg.includes('coupon') ||
      cleanMsg.includes('promo') ||
      cleanMsg.includes('discount') ||
      cleanMsg.includes('offer') ||
      cleanMsg.includes('voucher') ||
      cleanMsg.includes('deal of the day') ||
      cleanMsg.includes('promotional code') ||
      cleanMsg.includes('save money') ||
      cleanMsg.includes('cashback') ||
      cleanMsg.includes('sale') ||
      cleanMsg.includes('cheaper');

    if (isCouponQuery && !cleanMsg.includes('track') && !cleanMsg.includes('return')) {
      let activePromos = [];
      if (isDbConnected()) {
        try {
          activePromos = await Promotion.find({ status: 'active', type: 'coupon' }).limit(4).lean();
        } catch {
          activePromos = [];
        }
      }
      if (!activePromos || activePromos.length === 0) {
        activePromos = seedPromotions.filter((p) => p.status === 'active' && p.type === 'coupon').slice(0, 4);
      }

      const couponCards = activePromos.map((p) => ({
        type: 'coupon_card',
        id: p.id,
        code: p.code,
        title: p.title,
        discountType: p.discountType,
        discountValue: p.discountValue,
        minOrderValue: p.minOrderValue,
        maxDiscount: p.maxDiscount,
        description: p.description || `Save ${p.discountType === 'percentage' ? `${p.discountValue}%` : `₹${p.discountValue}`} on your order!`
      }));

      return res.json({
        success: true,
        reply:
          `🎉 **Verified Active Coupons & Promo Codes**:\n\n` +
          `You can apply any of these verified promotional codes during checkout to save instantly:\n\n` +
          activePromos
            .map(
              (p) =>
                `• **Code \`${p.code}\`**: ${p.title} (${p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `Flat ₹${p.discountValue} OFF`} on orders above ₹${p.minOrderValue.toLocaleString('en-IN')})`
            )
            .join('\n') +
          `\n\n💡 **How to Apply**: Add products to your Cart, proceed to Checkout, and paste your coupon code into the "Apply Coupon" box!`,
        intent: 'coupons',
        actionCards: couponCards,
        quickReplies: [
          'Recommend Top Electronics',
          'Recommend Fashion Deals',
          'How does Delivery OTP work?',
          'Track My Order'
        ],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 3. ORDER CANCELLATION & ADDRESS MODIFICATION
    // ─────────────────────────────────────────────────────────
    const isCancellationQuery =
      cleanMsg.includes('cancel') ||
      cleanMsg.includes('cancellation') ||
      cleanMsg.includes('stop order') ||
      cleanMsg.includes('abort order');

    const isAddressChangeQuery =
      cleanMsg.includes('change address') ||
      cleanMsg.includes('update address') ||
      cleanMsg.includes('modify address') ||
      cleanMsg.includes('wrong address') ||
      cleanMsg.includes('change delivery address') ||
      cleanMsg.includes('change phone number');

    if (isCancellationQuery) {
      return res.json({
        success: true,
        reply:
          `🛑 **Order Cancellation Policy & Instructions**:\n\n` +
          `• **Pre-Dispatch Instant Cancellation**: You can cancel any order for a **100% instant refund** as long as it has not yet been handed over to the courier partner.\n` +
          `• **How to Cancel**:\n` +
          `  1. Go to **My Orders** in the top navigation bar.\n` +
          `  2. Locate your active order.\n` +
          `  3. If status is **"Placed"** or **"Confirmed"**, click the **Cancel Order** button.\n` +
          `  4. Your refund will be initiated instantly to your original payment method.\n\n` +
          `• **If Already Dispatched / In Transit**: Once the package is with the courier (status "Dispatched" or "Out for Delivery"), it cannot be cancelled online. You can simply **refuse acceptance at your doorstep**, or accept it and initiate a **7-Day Hassle-Free Return** once delivered!`,
        intent: 'order_cancellation',
        quickReplies: ['Check My Orders', 'Track Active Shipment', 'Return & Replacement Policy', 'Contact Customer Support'],
        timestamp: now
      });
    }

    if (isAddressChangeQuery) {
      return res.json({
        success: true,
        reply:
          `📍 **Updating Shipping Address or Phone Number**:\n\n` +
          `• **Before Courier Dispatch**: If your order is still in **Placed** or **Confirmed** state, you can reach out directly to the merchant via **"Message Merchant"** under your order details to request an address or phone update before shipping label generation.\n` +
          `• **After Handover to Courier**: For security reasons, courier waybills cannot be rerouted mid-transit. If the address is unreachable, the courier will attempt delivery and you can instruct the delivery agent or decline delivery for auto-return and full refund.`,
        intent: 'address_change',
        quickReplies: ['View My Orders', 'Message Merchant', 'Contact Customer Care'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 4. ORDER TRACKING & STATUS
    // ─────────────────────────────────────────────────────────
    const orderIdMatch = cleanMsg.match(/\b(ord\d+|order\s*#?\s*\d+|#\s*\d{1,6})\b/i);
    const hasOrderKeywords =
      cleanMsg.includes('track') ||
      cleanMsg.includes('where is my order') ||
      cleanMsg.includes('where is my package') ||
      cleanMsg.includes('order status') ||
      cleanMsg.includes('my orders') ||
      cleanMsg.includes('shipment status') ||
      cleanMsg.includes('courier status') ||
      cleanMsg.includes('dispatch status') ||
      cleanMsg.includes('delivery status');

    if (orderIdMatch || (hasOrderKeywords && !cleanMsg.includes('otp') && !cleanMsg.includes('return') && !cleanMsg.includes('how to buy'))) {
      let queriedOrderId = null;
      if (orderIdMatch) {
        queriedOrderId = orderIdMatch[0].replace(/order\s*#?\s*/i, 'ord').replace(/#/g, '').trim().toLowerCase();
        if (!queriedOrderId.startsWith('ord') && /^\d+$/.test(queriedOrderId)) {
          queriedOrderId = `ord${queriedOrderId}`;
        }
      }

      // Fetch user's orders or specific order
      let orders = [];
      if (isDbConnected()) {
        try {
          if (queriedOrderId) {
            const single = await Order.findOne({ id: queriedOrderId }).lean();
            if (single) orders = [single];
          } else if (userId) {
            orders = await Order.find({ customerId: userId }).sort({ createdAt: -1 }).limit(3).lean();
          }
        } catch {
          orders = [];
        }
      }

      if (orders.length === 0) {
        if (queriedOrderId) {
          const single = seedOrders.find((o) => o.id.toLowerCase() === queriedOrderId || o.id.toLowerCase() === queriedOrderId.replace('ord', 'ord-'));
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
          statusExplanation = `Your order is In Transit with ${topOrder.courierPartner || 'Delhivery Surface Express'}. Estimated delivery is within 2-3 business days.`;
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
          courierPartner: o.courierPartner || o.shippingMethod || 'Delhivery Surface Express',
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
          reply:
            `📦 Here is the verified tracking update for **Order #${topOrder.id}**:\n\n` +
            `• **Status**: **${topOrder.status}**\n` +
            `• **Courier Partner**: ${topOrder.courierPartner || 'Delhivery Surface Express'}\n` +
            `• **Waybill Tracking #**: \`${topOrder.trackingNumber || 'DEL-8492019'}\`\n` +
            `• **Total Amount**: ₹${(topOrder.total || 0).toLocaleString('en-IN')}\n\n` +
            `📌 *Fulfillment Update*: ${statusExplanation}${topOrder.paymentDetails?.codOtp ? `\n\n🔑 **Doorstep Delivery OTP**: \`${topOrder.paymentDetails.codOtp}\` (Share with courier only after carton inspection).` : ''}`,
          intent: 'order_tracking',
          actionCards,
          quickReplies: [
            `View Order #${topOrder.id} in Dashboard`,
            'How does Delivery OTP work?',
            'What is the Return Policy?',
            'Contact Merchant for this Order'
          ],
          timestamp: now
        });
      } else {
        return res.json({
          success: true,
          reply: queriedOrderId
            ? `I couldn't locate Order **#${queriedOrderId}** in our active database. Please double-check the Order ID or visit your "My Orders" screen.`
            : `You don't have any active orders under your current session, or you are browsing as a guest. You can sign in to view your orders, live courier tracking, and doorstep OTPs.`,
          intent: 'order_tracking',
          quickReplies: ['Go to My Orders', 'Browse Marketplace Catalog', 'How does Delivery OTP work?'],
          timestamp: now
        });
      }
    }

    // ─────────────────────────────────────────────────────────
    // 5. DOORSTEP DELIVERY OTP (COD PROTECTION)
    // ─────────────────────────────────────────────────────────
    const isOtpQuery =
      cleanMsg.includes('otp') ||
      cleanMsg.includes('delivery pin') ||
      cleanMsg.includes('cod otp') ||
      cleanMsg.includes('verification code') ||
      cleanMsg.includes('delivery code') ||
      cleanMsg.includes('doorstep pin') ||
      cleanMsg.includes('4 digit');

    if (isOtpQuery) {
      return res.json({
        success: true,
        reply:
          `🛡️ **Doorstep Delivery OTP Security Explained**:\n\n` +
          `1. **Anti-Fraud Security**: To protect you from fake delivery attempts or tamper on Cash on Delivery (COD) packages, our system generates a unique **4-digit Delivery OTP** upon checkout.\n` +
          `2. **Where to Find It**: Your OTP is displayed in **"My Orders"** on your active order card.\n` +
          `3. **Step-by-Step Doorstep Protocol**:\n` +
          `   • Inspect the outer courier box to verify seals are intact and undamaged.\n` +
          `   • Pay the exact order amount in cash or via delivery executive's UPI QR.\n` +
          `   • Share the 4-digit OTP with the delivery agent to confirm successful handover.\n\n` +
          `> ⚠️ *Golden Rule*: Never share your Delivery OTP over phone calls or before package inspection!`,
        intent: 'delivery_otp',
        quickReplies: ['Check My Active Orders', 'Return / Replacement Window', 'Track Shipment'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 6. RETURNS, REPLACEMENTS & DISPUTE CLAIMS
    // ─────────────────────────────────────────────────────────
    const isReturnsQuery =
      cleanMsg.includes('return') ||
      cleanMsg.includes('replace') ||
      cleanMsg.includes('damaged') ||
      cleanMsg.includes('defective') ||
      cleanMsg.includes('broken') ||
      cleanMsg.includes('wrong item') ||
      cleanMsg.includes('dispute') ||
      cleanMsg.includes('money back') ||
      cleanMsg.includes('not working') ||
      cleanMsg.includes('exchange');

    if (isReturnsQuery) {
      return res.json({
        success: true,
        reply:
          `🔄 **7-Day Hassle-Free Returns & Replacements**:\n\n` +
          `• **Mandatory 7-Day Window**: Every physical order delivered on Vendor Hub is protected by a 7-day replacement/refund guarantee from the delivery timestamp.\n` +
          `• **Eligible Issues**: Transit damage, manufacturing defects, missing components, or mismatch in size/specifications.\n` +
          `• **Step-by-Step Resolution**:\n` +
          `  1. Go to **My Orders** in the top navigation.\n` +
          `  2. Find your delivered item and click **Return / Replace** or **Raise Dispute**.\n` +
          `  3. Select the reason and upload a photo or unboxing video of the defect.\n` +
          `  4. The merchant and platform escrow team review within **24 hours**.\n` +
          `• **Pickup & Payout**: A courier agent will pick up the item from your doorstep. You will receive an immediate brand new replacement unit or a 100% refund!`,
        intent: 'returns',
        quickReplies: ['Go to My Orders', 'Raise a Dispute', 'Message Storefront Merchant', 'Refund Timelines'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 7. REFUND TIMELINE & FAILED PAYMENTS
    // ─────────────────────────────────────────────────────────
    const isRefundTimelineQuery =
      cleanMsg.includes('refund time') ||
      cleanMsg.includes('when will i get refund') ||
      cleanMsg.includes('when refund') ||
      cleanMsg.includes('refund status') ||
      cleanMsg.includes('how long for refund');

    const isPaymentFailureQuery =
      cleanMsg.includes('money deducted') ||
      cleanMsg.includes('payment failed') ||
      cleanMsg.includes('debited but order not placed') ||
      cleanMsg.includes('amount debited') ||
      cleanMsg.includes('failed transaction') ||
      cleanMsg.includes('bank deducted');

    if (isRefundTimelineQuery || isPaymentFailureQuery) {
      return res.json({
        success: true,
        reply:
          `💰 **Refund Processing & Payment Protection**:\n\n` +
          `• **If money was debited but order didn't confirm**: Do not worry! Banking gateways automatically reconcile failed sessions. The amount will be reversed back to your bank account within **24-48 business hours**.\n` +
          `• **Refund Timelines after Return Approval**:\n` +
          `  - **UPI / Wallets**: 2 to 4 hours post pickup verification.\n` +
          `  - **Credit / Debit Cards & NetBanking**: 3 to 5 business days per RBI banking rules.\n` +
          `  - **Cash on Delivery (COD) Orders**: Direct transfer to your preferred UPI VPA or bank account provided during claim filing.\n\n` +
          `If you haven't received your refund after the timeline, contact our support team at **support@vendour.com** with your transaction reference.`,
        intent: 'refunds',
        quickReplies: ['Check My Orders', 'Payment Methods Supported', 'Contact Customer Care'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 8. SHIPPING CHARGES, DELIVERY TIME & LOCATIONS
    // ─────────────────────────────────────────────────────────
    const isShippingCostQuery =
      cleanMsg.includes('shipping charge') ||
      cleanMsg.includes('delivery charge') ||
      cleanMsg.includes('delivery fee') ||
      cleanMsg.includes('free delivery') ||
      cleanMsg.includes('shipping fee') ||
      cleanMsg.includes('cost of delivery') ||
      cleanMsg.includes('is shipping free');

    const isDeliveryTimeQuery =
      cleanMsg.includes('how long does delivery take') ||
      cleanMsg.includes('delivery time') ||
      cleanMsg.includes('delivery days') ||
      cleanMsg.includes('how many days') ||
      cleanMsg.includes('dispatch time') ||
      cleanMsg.includes('speed') ||
      cleanMsg.includes('when will it arrive') ||
      cleanMsg.includes('estimated delivery') ||
      cleanMsg.includes('fast delivery') ||
      cleanMsg.includes('express delivery');

    const isCoverageQuery =
      cleanMsg.includes('pincode') ||
      cleanMsg.includes('deliver to') ||
      cleanMsg.includes('serviceable') ||
      cleanMsg.includes('delivery locations') ||
      cleanMsg.includes('pan india') ||
      cleanMsg.includes('which cities');

    if (isShippingCostQuery || isDeliveryTimeQuery || isCoverageQuery) {
      return res.json({
        success: true,
        reply:
          `🚚 **Shipping, Delivery Timelines & Coverage**:\n\n` +
          `• **Delivery Charges**: **FREE Standard Delivery** on all orders above **₹499**! For smaller orders below ₹499, a nominal flat courier fee of ₹40 applies.\n` +
          `• **Dispatch SLA**: 100% of verified merchants dispatch physically stocked packages within **24 hours** from confirmed checkout.\n` +
          `• **Estimated Delivery Transit**:\n` +
          `  - **Metro Cities (Delhi, Mumbai, Bengaluru, etc.)**: 1 - 2 business days.\n` +
          `  - **Tier 2 / Tier 3 Cities**: 2 - 4 business days.\n` +
          `• **Courier Partners**: BlueDart Express, Delhivery Surface, and DTDC Air with end-to-end waybill tracking.\n` +
          `• **Service Coverage**: We deliver across **19,000+ PIN codes** in all Indian states and Union Territories.`,
        intent: 'shipping_info',
        quickReplies: ['Track My Active Order', 'Active Coupons & Deals', 'How does Delivery OTP work?'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 9. PAYMENT OPTIONS & DYNAMIC UPI QR
    // ─────────────────────────────────────────────────────────
    const isPaymentQuery =
      cleanMsg.includes('payment') ||
      cleanMsg.includes('how to pay') ||
      cleanMsg.includes('upi') ||
      cleanMsg.includes('qr code') ||
      cleanMsg.includes('cod') ||
      cleanMsg.includes('cash on delivery') ||
      cleanMsg.includes('card') ||
      cleanMsg.includes('netbanking') ||
      cleanMsg.includes('credit card') ||
      cleanMsg.includes('debit card') ||
      cleanMsg.includes('pay');

    if (isPaymentQuery && !cleanMsg.includes('track')) {
      return res.json({
        success: true,
        reply:
          `💳 **Vendor Hub Payment Methods & Security**:\n\n` +
          `1. **Dynamic UPI QR Code**:\n` +
          `   - Generates an instant high-resolution QR with merchant VPA and order amount.\n` +
          `   - Features a **10-minute validity timer** and 1-click VPA copy for seamless payment via GPay, PhonePe, Paytm, or CRED.\n` +
          `2. **Cash on Delivery (COD)**:\n` +
          `   - Available nationwide with **Zero advance deposit**.\n` +
          `   - Backed by our automated **4-digit Doorstep Delivery OTP**.\n` +
          `3. **Cards & NetBanking**:\n` +
          `   - 256-bit SSL encrypted PCI-DSS certified gateway for Visa, MasterCard, RuPay, and major Indian banking institutions.`,
        intent: 'payment',
        quickReplies: ['How does Delivery OTP work?', 'Active Coupons & Discounts', 'Check Cart & Checkout'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 10. BRAND WARRANTY, GST TAX INVOICES & AUTHENTICITY
    // ─────────────────────────────────────────────────────────
    const isWarrantyQuery =
      cleanMsg.includes('warranty') ||
      cleanMsg.includes('guarantee') ||
      cleanMsg.includes('genuine') ||
      cleanMsg.includes('original') ||
      cleanMsg.includes('invoice') ||
      cleanMsg.includes('tax invoice') ||
      cleanMsg.includes('gst') ||
      cleanMsg.includes('bill') ||
      cleanMsg.includes('authentic') ||
      cleanMsg.includes('fake');

    if (isWarrantyQuery) {
      return res.json({
        success: true,
        reply:
          `🛡️ **100% Genuine Merchandise & Brand Warranty Guarantee**:\n\n` +
          `• **Zero-Ghost Inventory**: Every single product listed represents physically audited stock inside verified merchant warehouses.\n` +
          `• **Official Manufacturer Warranty**: All electronics, consumer appliances, and branded items carry **1 to 2 Years Direct Brand Warranty** serviceable at authorized brand centers nationwide.\n` +
          `• **GST Tax Invoice Enclosed**: Every parcel carton includes a physical printed GST tax invoice with the merchant's verified GSTIN for warranty registration and tax filing.\n` +
          `• **Download Invoice**: You can also download a PDF copy of your tax invoice anytime from **"My Orders"**!`,
        intent: 'warranty',
        quickReplies: ['Browse Electronics with Warranty', 'Track My Order', '7-Day Return Policy'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 11. VENDOR STOREFRONTS, DIRECT CHAT & SELLER ONBOARDING
    // ─────────────────────────────────────────────────────────
    const isVendorHelpQuery =
      cleanMsg.includes('seller') ||
      cleanMsg.includes('vendor') ||
      cleanMsg.includes('merchant') ||
      cleanMsg.includes('store') ||
      cleanMsg.includes('chat with seller') ||
      cleanMsg.includes('message merchant') ||
      cleanMsg.includes('contact seller') ||
      cleanMsg.includes('become a seller') ||
      cleanMsg.includes('sell on vendorhub');

    if (isVendorHelpQuery) {
      const isSellerRegistration =
        cleanMsg.includes('become a seller') ||
        cleanMsg.includes('register store') ||
        cleanMsg.includes('sell on') ||
        cleanMsg.includes('onboard');

      if (isSellerRegistration) {
        return res.json({
          success: true,
          reply:
            `🏬 **Become a Verified Merchant on Vendor Hub**:\n\n` +
            `• **Physical Retailers Welcome**: We empower genuine Indian merchants with physical retail stores or warehouses.\n` +
            `• **Zero Platform Monopoly**: Fair algorithmic catalog exposure with no pay-to-play ad favoritism.\n` +
            `• **Integrated Fulfillment**: In-built courier waybill generation (BlueDart, Delhivery), automated 4-digit COD OTPs, and escrow disbursements.\n` +
            `• **How to Apply**: Click **"Become a Seller"** in the top navigation or visit \`/vendor/register\` to submit your GSTIN and store details!`,
          intent: 'vendor_onboarding',
          quickReplies: ['Register as Vendor', 'Explore Verified Stores', 'Customer Support'],
          timestamp: now
        });
      }

      return res.json({
        success: true,
        reply:
          `🏪 **Direct Merchant Communication & Storefronts**:\n\n` +
          `• **Ask Before You Buy**: On any product page or store profile, click the **"Message Merchant"** button to start a real-time conversation about stock availability, sizing, custom engraving, or dispatch timing.\n` +
          `• **Order Specific Chat**: In **"My Orders"**, click "Message Merchant" on any order item to directly communicate with the dispatch warehouse.\n` +
          `• **Messages Center**: Access all your active merchant threads at \`/shop/messages\` from the top navigation bar.`,
        intent: 'vendor_help',
        quickReplies: ['Open My Messages', 'Browse Verified Stores', 'Track My Order'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 12. ACCOUNT, CART & HOW TO BUY ASSISTANCE
    // ─────────────────────────────────────────────────────────
    const isBuyingOrAccountQuery =
      cleanMsg.includes('how to buy') ||
      cleanMsg.includes('how to order') ||
      cleanMsg.includes('how to purchase') ||
      cleanMsg.includes('cart') ||
      cleanMsg.includes('checkout') ||
      cleanMsg.includes('profile') ||
      cleanMsg.includes('login') ||
      cleanMsg.includes('sign in') ||
      cleanMsg.includes('sign up') ||
      cleanMsg.includes('register account');

    if (isBuyingOrAccountQuery && !cleanMsg.includes('track')) {
      return res.json({
        success: true,
        reply:
          `🛒 **How to Shop & Checkout on Vendor Hub**:\n\n` +
          `1. **Browse & Select**: Explore our catalog across Electronics, Fashion, Grocery, Sports, Beauty, and Home & Living.\n` +
          `2. **Check Specifications**: Review warranty details, dispatch SLA (within 24h), and courier partners.\n` +
          `3. **Add to Cart**: Click **"Add to Cart"** or **"Buy Now"**.\n` +
          `4. **Apply Coupons**: Enter promo codes like \`TECH20\` or \`STYLE15\` in the cart for extra discounts.\n` +
          `5. **Choose Payment**: Select Dynamic UPI QR Code, Cash on Delivery (COD) with Doorstep OTP, or Card/NetBanking.\n` +
          `6. **Track Shipment**: Receive real-time dispatch updates and live courier tracking in **"My Orders"**!`,
        intent: 'how_to_buy',
        quickReplies: ['Browse Marketplace Catalog', 'Active Coupons & Offers', 'How does Delivery OTP work?'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 13. CUSTOMER CARE, HELPLINE & HUMAN SUPPORT
    // ─────────────────────────────────────────────────────────
    const isSupportQuery =
      cleanMsg.includes('customer care') ||
      cleanMsg.includes('support') ||
      cleanMsg.includes('helpline') ||
      cleanMsg.includes('phone number') ||
      cleanMsg.includes('toll free') ||
      cleanMsg.includes('human') ||
      cleanMsg.includes('agent') ||
      cleanMsg.includes('talk to person') ||
      cleanMsg.includes('call center') ||
      cleanMsg.includes('contact us') ||
      cleanMsg.includes('complaint') ||
      cleanMsg.includes('email');

    if (isSupportQuery) {
      return res.json({
        success: true,
        reply:
          `📞 **Vendor Hub Customer Support & Grievance Redressal**:\n\n` +
          `Our dedicated platform support team is here to assist you with any order, delivery, or dispute issue:\n\n` +
          `• ☎️ **Toll-Free Helpline**: **1800-836-3687** (Available Daily, 9:00 AM – 9:00 PM IST)\n` +
          `• ✉️ **Email Support**: **support@vendour.com** (Guaranteed response within 4 hours)\n` +
          `• 🛡️ **Escrow & Dispute Desk**: Navigate to **"My Orders"** ➔ **"Raise Dispute"** for priority admin mediation within 24 hours.\n` +
          `• 🏪 **Merchant Messaging**: Chat directly with store owners via **"Message Merchant"** for product or dispatch queries.`,
        intent: 'customer_support',
        quickReplies: ['Raise a Dispute', 'Track My Order', 'Return Policy', 'Message Merchant'],
        timestamp: now
      });
    }

    // ─────────────────────────────────────────────────────────
    // 14. PRODUCT SEARCH, PRICE FILTERS & RECOMMENDATIONS
    // ─────────────────────────────────────────────────────────
    // Price filter detection: e.g. "under 1000", "below 2000", "less than 5000", "under 1500"
    let maxPriceFilter = null;
    const priceUnderMatch = cleanMsg.match(/(?:under|below|less\s*than|within|budget(?:\s*of)?)\s*(?:rs\.?|inr|₹)?\s*(\d+)/i);
    if (priceUnderMatch) {
      maxPriceFilter = parseInt(priceUnderMatch[1], 10);
    }

    // Category detection
    let categoryTarget = '';
    if (cleanMsg.includes('phone') || cleanMsg.includes('mobile') || cleanMsg.includes('electronic') || cleanMsg.includes('headphone') || cleanMsg.includes('earbud') || cleanMsg.includes('laptop') || cleanMsg.includes('audio') || cleanMsg.includes('smartwatch')) {
      categoryTarget = 'Electronics';
    } else if (cleanMsg.includes('fashion') || cleanMsg.includes('saree') || cleanMsg.includes('shirt') || cleanMsg.includes('cloth') || cleanMsg.includes('shoe') || cleanMsg.includes('dress') || cleanMsg.includes('jacket') || cleanMsg.includes('kurta')) {
      categoryTarget = 'Fashion';
    } else if (cleanMsg.includes('grocery') || cleanMsg.includes('oil') || cleanMsg.includes('rice') || cleanMsg.includes('food') || cleanMsg.includes('tea') || cleanMsg.includes('coffee') || cleanMsg.includes('snack') || cleanMsg.includes('spice')) {
      categoryTarget = 'Grocery';
    } else if (cleanMsg.includes('home') || cleanMsg.includes('living') || cleanMsg.includes('bedsheet') || cleanMsg.includes('lamp') || cleanMsg.includes('pillow') || cleanMsg.includes('chair') || cleanMsg.includes('curtain')) {
      categoryTarget = 'Home & Living';
    } else if (cleanMsg.includes('sport') || cleanMsg.includes('fitness') || cleanMsg.includes('cricket') || cleanMsg.includes('gym') || cleanMsg.includes('dumbbell') || cleanMsg.includes('yoga') || cleanMsg.includes('badminton')) {
      categoryTarget = 'Sports';
    } else if (cleanMsg.includes('beauty') || cleanMsg.includes('cosmetic') || cleanMsg.includes('skincare') || cleanMsg.includes('cream') || cleanMsg.includes('serum') || cleanMsg.includes('perfume')) {
      categoryTarget = 'Beauty';
    } else if (cleanMsg.includes('auto') || cleanMsg.includes('car') || cleanMsg.includes('bike') || cleanMsg.includes('helmet') || cleanMsg.includes('vehicle')) {
      categoryTarget = 'Automotive';
    }

    const isProductIntent =
      Boolean(categoryTarget) ||
      Boolean(maxPriceFilter) ||
      cleanMsg.includes('recommend') ||
      cleanMsg.includes('suggest') ||
      cleanMsg.includes('best product') ||
      cleanMsg.includes('top rated') ||
      cleanMsg.includes('best seller') ||
      cleanMsg.includes('looking for') ||
      cleanMsg.includes('buy') ||
      cleanMsg.includes('find') ||
      cleanMsg.includes('search');

    if (isProductIntent) {
      let matchedProducts = [];

      // Extract search tokens
      const stopWords = new Set(['recommend', 'suggest', 'product', 'products', 'best', 'top', 'buy', 'looking', 'for', 'find', 'show', 'me', 'under', 'below', 'less', 'than', 'rs', 'inr', 'rupees', 'with', 'the', 'and', 'deals', 'good', 'cheap', 'budget']);
      const queryTokens = cleanMsg.split(/[\s,]+/).filter((w) => w.length > 2 && !stopWords.has(w));

      if (isDbConnected()) {
        try {
          const query = { status: 'approved' };
          if (categoryTarget) query.category = categoryTarget;
          if (maxPriceFilter) query.price = { $lte: maxPriceFilter };

          if (queryTokens.length > 0 && !categoryTarget) {
            query.$or = queryTokens.map((t) => ({
              $or: [
                { name: { $regex: t, $options: 'i' } },
                { description: { $regex: t, $options: 'i' } },
                { category: { $regex: t, $options: 'i' } },
                { brand: { $regex: t, $options: 'i' } }
              ]
            }));
          }

          matchedProducts = await Product.find(query).limit(4).lean();
        } catch {
          matchedProducts = [];
        }
      }

      if (matchedProducts.length === 0) {
        matchedProducts = seedProducts.filter((p) => {
          const isApproved = p.status === 'approved' || !p.status;
          const matchCat = !categoryTarget || p.category === categoryTarget;
          const matchPrice = !maxPriceFilter || p.price <= maxPriceFilter;

          let matchKeywords = true;
          if (queryTokens.length > 0) {
            const pText = `${p.name} ${p.category} ${p.brand || ''} ${p.description || ''}`.toLowerCase();
            matchKeywords = queryTokens.some((t) => pText.includes(t));
          }

          return isApproved && matchCat && matchPrice && matchKeywords;
        }).slice(0, 4);

        // Fallback if strict token match yielded no products
        if (matchedProducts.length === 0 && (categoryTarget || maxPriceFilter)) {
          matchedProducts = seedProducts.filter((p) => {
            const matchCat = !categoryTarget || p.category === categoryTarget;
            const matchPrice = !maxPriceFilter || p.price <= maxPriceFilter;
            return matchCat && matchPrice;
          }).slice(0, 4);
        }
      }

      if (matchedProducts.length > 0) {
        const productCards = matchedProducts.map((p) => ({
          type: 'product_card',
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
          mrp: p.mrp || Math.round(p.price * 1.25),
          image: p.images?.[0] || p.image || '',
          sku: p.sku || 'VM-PHYSICAL',
          stock: p.stock != null ? p.stock : (p.quantity || 15),
          fastShipping: p.shipping?.shipsIn24h || true
        }));

        let headerText = `Here are verified, top-rated products physically stocked in merchant warehouses`;
        if (categoryTarget && maxPriceFilter) {
          headerText += ` in **${categoryTarget}** under **₹${maxPriceFilter.toLocaleString('en-IN')}**:`;
        } else if (categoryTarget) {
          headerText += ` in **${categoryTarget}**:`;
        } else if (maxPriceFilter) {
          headerText += ` under **₹${maxPriceFilter.toLocaleString('en-IN')}**:`;
        } else {
          headerText += ` ready for express courier dispatch:`;
        }

        return res.json({
          success: true,
          reply: `${headerText}\n\nAll items include a physical GST tax invoice, standard manufacturer warranty, and 7-day return guarantee. Click any item to view full specifications!`,
          intent: 'product_recommendation',
          actionCards: productCards,
          quickReplies: [
            'Active Coupons & Offers',
            'How does Delivery OTP work?',
            'Track My Order',
            'Return / Replacement Policy'
          ],
          timestamp: now
        });
      }
    }

    // ─────────────────────────────────────────────────────────
    // 15. SMART FUZZY SEARCH & FALLBACK
    // ─────────────────────────────────────────────────────────
    // Check if the query matches any FAQ question or category
    const matchedFaq = FAQ_KNOWLEDGE_BASE.find(
      (f) =>
        f.question.toLowerCase().includes(cleanMsg) ||
        cleanMsg.includes(f.question.toLowerCase().slice(0, 20)) ||
        f.category.toLowerCase().includes(cleanMsg)
    );

    if (matchedFaq) {
      return res.json({
        success: true,
        reply: `💡 **${matchedFaq.category}**:\n\n${matchedFaq.answer}`,
        intent: 'faq_match',
        quickReplies: [
          'Track My Order',
          'Active Coupons & Offers',
          'How does Delivery OTP work?',
          'Contact Customer Care'
        ],
        timestamp: now
      });
    }

    // Comprehensive Fallback with clear guidance
    return res.json({
      success: true,
      reply:
        `I understand you're inquiring about "${rawMsg}". Here is how I can best assist you:\n\n` +
        `• 📦 **Looking for an Order?** Type your Order ID (e.g. \`#ord1\`) or ask "Track my order" for live courier tracking.\n` +
        `• 🏷️ **Looking for Discounts?** Ask for "Coupons" to get verified codes like \`TECH20\` or \`STYLE15\`.\n` +
        `• 🔑 **COD Delivery OTP?** Ask "How does delivery OTP work?" for our anti-fraud verification guide.\n` +
        `• 🔄 **Returns or Damaged Item?** Ask "Return policy" or visit "My Orders" to open a 7-day dispute claim.\n` +
        `• 🚚 **Shipping & Pincodes?** Ask "Shipping charges" or "Delivery time" for dispatch times & coverage.\n` +
        `• 🛍️ **Finding Products?** Tell me what you're looking for (e.g. "Laptops under 50000", "Wireless Earbuds", "Silk Sarees").\n` +
        `• 📞 **Speak with Support?** Our toll-free helpline is **1800-836-3687** (Daily 9 AM - 9 PM IST).\n\n` +
        `Select an option below or type your question in more detail:`,
      intent: 'fallback_guided',
      quickReplies: [
        'Track My Order',
        'Active Coupons & Offers',
        'Recommend Electronics',
        'Recommend Fashion Deals',
        'How does Delivery OTP work?',
        'Return & Replacement Policy',
        'Contact Customer Care'
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
