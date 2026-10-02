import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Promotion from '../models/Promotion.js';
import { seedOrders, seedProducts, seedVendors, seedPromotions } from '../data/seedData.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

// Curated FAQ dictionary for platform self-service (Customer & Vendor)
export const FAQ_KNOWLEDGE_BASE = [
  // ── Customer FAQs ──
  {
    category: 'Doorstep Delivery OTP & Anti-Fraud',
    targetRole: 'customer',
    question: 'How does the 4-digit Cash on Delivery (COD) OTP work?',
    answer:
      'For anti-fraud protection on all Cash on Delivery (COD) orders, a secure 4-digit Delivery OTP is generated upon checkout. The OTP is listed under your Order details in "My Orders". Share this OTP with the delivery executive ONLY after physically inspecting the outer package carton at your doorstep to ensure tamper-free delivery.'
  },
  {
    category: 'Order Fulfillment & Tracking',
    targetRole: 'customer',
    question: 'How do I track my physical shipment?',
    answer:
      'All physical shipments transition through 5 verifiable fulfillment stages: Stock Reserved ➔ Packaging Verified ➔ In Transit with Courier ➔ Out for Delivery ➔ Physically Delivered. You can copy your courier waybill tracking number (e.g., DEL-8492019, BD-9382109) from "My Orders" for live courier tracking via BlueDart or Delhivery.'
  },
  {
    category: 'Returns & Replacement Window',
    targetRole: 'customer',
    question: 'What is the return and replacement policy?',
    answer:
      'Vendor Hub physical retail purchases carry a mandatory 7-Day Hassle-Free Replacement or Refund window. If you receive an item with transit damage, defects, or incorrect specifications, navigate to "My Orders" and click "Return / Replace" or "Raise Dispute" with photo evidence.'
  },
  {
    category: 'Brand Warranty & Authenticity',
    targetRole: 'customer',
    question: 'Are all products covered by manufacturer warranty?',
    answer:
      'Yes! 100% of products listed on Vendor Hub represent physically stocked inventory from verified merchants. Every package includes an official GST tax invoice and manufacturer warranty document valid at authorized service centers nationwide.'
  },
  {
    category: 'Payment Options & UPI QR',
    targetRole: 'customer',
    question: 'What payment methods are supported?',
    answer:
      'We support: 1) Dynamic UPI QR Code (with 10-minute validity timer & instant VPA copy), 2) Cash on Delivery (COD) with 4-Digit Doorstep Delivery OTP, and 3) 256-bit SSL encrypted Credit/Debit Cards and NetBanking.'
  },
  {
    category: 'Order Cancellation & Changes',
    targetRole: 'customer',
    question: 'Can I cancel or change an order after placing it?',
    answer:
      'You can cancel your order for a 100% instant refund at any time before the merchant dispatches the package to the courier partner directly from "My Orders". If the package has already dispatched, you may refuse delivery at your doorstep or use the 7-Day Return window.'
  },
  {
    category: 'Shipping Charges & Express Delivery',
    targetRole: 'customer',
    question: 'What are the delivery charges and delivery times?',
    answer:
      'We offer FREE standard delivery on orders above ₹499 (nominal ₹40 for smaller orders). Verified merchants dispatch within 24 hours from physical warehouses, and express courier transit typically takes 2-4 business days nationwide.'
  },
  {
    category: 'Coupons, Discounts & Promotions',
    targetRole: 'customer',
    question: 'How do I get discounts and coupon codes?',
    answer:
      'We feature active merchant coupon codes such as TECH20 (20% off electronics above ₹999), STYLE15 (15% off fashion), and AUDIO200 (flat ₹200 off audio gear). You can enter these promo codes in the Cart or Checkout page to save instantly.'
  },
  {
    category: 'Vendor Storefronts & Direct Chat',
    targetRole: 'customer',
    question: 'Can I contact a merchant directly before buying?',
    answer:
      'Yes! On any product page or store profile, click "Message Merchant" to open a direct conversation thread with the store owner regarding stock availability, sizing, custom engraving, or dispatch timing.'
  },
  {
    category: 'Customer Care & Grievance',
    targetRole: 'customer',
    question: 'How do I contact customer support or human agents?',
    answer:
      'Our dedicated customer care team is available daily from 9:00 AM to 9:00 PM IST via toll-free helpline at 1800-836-3687 or by email at support@vendour.com. All ticket escalations are addressed within 24 hours.'
  },

  // ── Vendor Merchant Operations FAQs ──
  {
    category: 'Product Catalog & Listing Guidelines',
    targetRole: 'vendor',
    question: 'How do I list and publish new physical products as a vendor?',
    answer:
      'Navigate to "Add Physical Product" in your Vendor Dashboard. Provide the product title, unique SKU, category, brand name, Selling Price, MRP, and stock inventory. Set your GST tax slab (0%, 5%, 12%, 18%, 28%) and mandatory HSN code. Upload clean 1:1 square photos (min 800x800) with a neutral background. Submitted items undergo compliance verification within 24 hours.'
  },
  {
    category: 'Product Approval SLA & Quality',
    targetRole: 'vendor',
    question: 'How long does product review take and why is my product pending?',
    answer:
      'Platform moderators review submissions within 24 hours to ensure accurate technical specs, legitimate brand rights, and authentic pricing. Once approved, your listing goes live instantly in search. If rejected, specific correction notes will appear in your catalog.'
  },
  {
    category: 'Order Dispatch & Courier Waybills',
    targetRole: 'vendor',
    question: 'How do I process orders and dispatch shipments to couriers?',
    answer:
      'When an order is placed, it appears under "Orders & Dispatch". 1) Inspect and pack the item in secure tamper-evident packaging. 2) Click "Confirm Packaging" and generate the auto-calculated GST tax invoice & shipping label. 3) Assign courier partner (Delhivery or BlueDart) and copy your AWB tracking waybill. 4) Hand package over during scheduled courier warehouse pickup.'
  },
  {
    category: 'Delivery OTP Seller Protection',
    targetRole: 'vendor',
    question: 'How does the 4-digit Delivery OTP protect vendors against fraud?',
    answer:
      'On Cash on Delivery (COD) shipments, the courier executive cannot mark an order delivered without verifying the customer\'s secret 4-digit Delivery OTP. This guarantees proof of physical handover and protects merchants from courier theft, fake delivery claims, and buyer chargebacks.'
  },
  {
    category: 'Vendor Subscriptions & Commission Tiers',
    targetRole: 'vendor',
    question: 'What are the vendor subscription plans and platform commission rates?',
    answer:
      'We offer 4 flexible tiers: 1) Starter (Free): ₹0/mo, 10 products, 12% commission. 2) Growth Plan: ₹999/mo, 50 products, 8% commission, priority badges. 3) Pro Merchant: ₹2,499/mo, unlimited products, 5% commission, featured merchant badge, automated inventory alerts. 4) Enterprise: 3% commission, dedicated account manager and volume API gateway.'
  },
  {
    category: 'Payout Settlement & Bank Transfers',
    targetRole: 'vendor',
    question: 'When and how do vendors receive payouts for completed sales?',
    answer:
      'Payouts operate on a T+3 business day settlement cycle following delivery confirmation (to account for the initial customer inspection period). Net earnings (Order Total minus platform commission and GST) are transferred directly via automated NEFT / IMPS batch transfer to your verified merchant bank account.'
  },
  {
    category: 'GST Invoices & Automated Twilio Gateway',
    targetRole: 'vendor',
    question: 'How are customer GST invoices and dispatch notifications handled?',
    answer:
      'Our backend automatically generates GST-compliant invoices calculating CGST/SGST for intra-state or IGST for inter-state deliveries. Upon courier dispatch, our Twilio gateway sends an automated SMS and WhatsApp confirmation with the download link directly to the customer.'
  },
  {
    category: 'Storefront Promotions & Marketing Center',
    targetRole: 'vendor',
    question: 'How can vendors create coupons and boost store visibility?',
    answer:
      'Under "Marketing Center", vendors can create store-wide or category promo codes (percentage or flat discounts) with custom minimum spend limits. You can also boost listings to appear on the marketplace homepage and category tops.'
  },
  {
    category: 'Customer Returns & Dispute Arbitration',
    targetRole: 'vendor',
    question: 'How do vendors handle customer returns and damage disputes?',
    answer:
      'If a buyer opens a 7-day return claim, you will receive an alert in "Disputes & Claims". You have 48 hours to review buyer photos, authorize a replacement, or submit your dispatch CCTV/packing photos to platform moderators for fair arbitration.'
  },
  {
    category: 'Smart Inventory & Low Stock Alerts',
    targetRole: 'vendor',
    question: 'How do inventory alerts work to prevent out-of-stock penalties?',
    answer:
      'The "Smart Inventory" system monitors SKU velocity and triggers alerts when stock falls below 5 units. If an item hits 0 units, the system auto-pauses the listing so you never receive unfulfillable orders.'
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

    // Determine effective user role
    const effectiveRole = (userRole || context.userRole || '').toLowerCase();

    // Detect if the message is explicitly vendor-focused
    const isVendorOperationalIntent =
      cleanMsg.includes('commission') ||
      cleanMsg.includes('vendor fee') ||
      cleanMsg.includes('add product') ||
      cleanMsg.includes('list product') ||
      cleanMsg.includes('upload product') ||
      cleanMsg.includes('pending approval') ||
      cleanMsg.includes('subscription plan') ||
      cleanMsg.includes('growth plan') ||
      cleanMsg.includes('pro tier') ||
      cleanMsg.includes('vendor plan') ||
      cleanMsg.includes('payout') ||
      cleanMsg.includes('settlement') ||
      cleanMsg.includes('when get paid') ||
      cleanMsg.includes('store builder') ||
      cleanMsg.includes('marketing center') ||
      cleanMsg.includes('packing slip') ||
      cleanMsg.includes('dispatch order') ||
      cleanMsg.includes('fulfill order') ||
      cleanMsg.includes('seller support') ||
      cleanMsg.includes('merchant support') ||
      cleanMsg.includes('dispute claim') ||
      cleanMsg.includes('low stock alert');

    // Route to Vendor Co-Pilot if user is a vendor or query is strictly vendor operational
    if (effectiveRole === 'vendor' || (isVendorOperationalIntent && effectiveRole !== 'customer')) {
      return handleVendorIntent(req, res, { cleanMsg, rawMsg, userId, context, now });
    }

    // Otherwise, handle as Customer Concierge
    return handleCustomerIntent(req, res, { cleanMsg, rawMsg, userId, context, now });
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
 * ─────────────────────────────────────────────────────────────
 * VENDOR OPERATIONS CO-PILOT INTENT HANDLER
 * ─────────────────────────────────────────────────────────────
 */
async function handleVendorIntent(req, res, { cleanMsg, rawMsg, userId, context, now }) {
  // 1. GREETING & VENDOR BOT IDENTITY
  const isGreeting =
    /^(hi|hello|hey|heya|namaste|hola|greetings|good\s*(morning|afternoon|evening|day)|sup|what'?s\s*up)\b/i.test(cleanMsg) ||
    cleanMsg === 'hi' ||
    cleanMsg === 'hello' ||
    cleanMsg === 'hey';

  const isBotIdentity =
    cleanMsg.includes('who are you') ||
    cleanMsg.includes('what are you') ||
    cleanMsg.includes('hubbot') ||
    cleanMsg.includes('what can you do') ||
    cleanMsg.includes('how can you help') ||
    cleanMsg === 'help' ||
    cleanMsg === 'menu';

  if (isGreeting || isBotIdentity) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🏪 **Welcome to HubBot Vendor Operations Co-Pilot!**\n\n` +
        `I am your dedicated 24/7 AI business partner on Vendor Hub, engineered to help you maximize merchant revenue, streamline logistics, and manage your store:\n\n` +
        `• ➕ **Product Catalog & SKUs**: Add physical products, HSN codes, GST tax slabs, and track approval status.\n` +
        `• 🚚 **Orders & Courier Dispatch**: Print GST tax invoices, generate packing slips, and assign Delhivery/BlueDart waybills.\n` +
        `• 🔑 **Doorstep COD OTP**: Fraud-proof delivery verification protecting merchants against non-delivery claims.\n` +
        `• 💎 **Subscription Plans & Fees**: Compare Starter (12%), Growth (8%), and Pro (5%) tiers.\n` +
        `• 💰 **Payouts & Bank Settlement**: T+3 automated settlement cycle, commission deduction, and NEFT remittance.\n` +
        `• 📄 **GST Invoices & Twilio Gateway**: Automated customer tax billing with automated WhatsApp/SMS dispatch alerts.\n` +
        `• 📣 **Marketing & Store Promotions**: Create custom merchant discount coupons and featured placements.\n` +
        `• 📦 **Smart Inventory & Stock Alerts**: Monitor reorder levels (<=5 units) and prevent out-of-stock penalties.\n` +
        `• ⚠️ **Dispute & Claim Defense**: Resolve buyer return disputes with photo/video packaging proof.\n` +
        `• 🎨 **Storefront Builder**: Customize your store banner, logo, brand story, and business hours.\n\n` +
        `How can I assist your store operations right now? Click an action below or ask your question:`,
      intent: 'vendor_greeting',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Add Physical Product',
          description: 'List new inventory with SKU, MRP, GST slab & HSN code.',
          buttonText: '➕ Add Product',
          link: '/vendor/add-product',
          badge: 'Catalog'
        },
        {
          type: 'navigation_card',
          title: 'Orders & Dispatch',
          description: 'Process pending orders, print labels & assign courier waybills.',
          buttonText: '🚚 Fulfill Orders',
          link: '/vendor/orders',
          badge: 'Fulfillment'
        },
        {
          type: 'navigation_card',
          title: 'Marketing Center',
          description: 'Launch store promo codes & boost featured items.',
          buttonText: '📣 Launch Promo',
          link: '/vendor/marketing',
          badge: 'Sales'
        }
      ],
      quickReplies: [
        '➕ Add New Product',
        '🚚 Fulfill Orders & AWB',
        '💎 Vendor Plans & Fees',
        '💰 Payout Settlement',
        '📄 GST Invoices & Twilio',
        '📣 Store Marketing & Coupons',
        '⚠️ Dispute Resolution'
      ],
      timestamp: now
    });
  }

  // 2. ADD PRODUCT & CATALOG LISTING
  const isAddProduct =
    cleanMsg.includes('add product') ||
    cleanMsg.includes('list product') ||
    cleanMsg.includes('upload product') ||
    cleanMsg.includes('new product') ||
    cleanMsg.includes('how to sell') ||
    cleanMsg.includes('create product') ||
    cleanMsg.includes('sku') ||
    cleanMsg.includes('hsn') ||
    cleanMsg.includes('gst slab') ||
    cleanMsg.includes('image requirement');

  if (isAddProduct) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `📋 **Physical Product Listing Guidelines for Merchants**:\n\n` +
        `To publish a high-converting, compliant product on Vendor Hub, ensure the following fields are complete:\n\n` +
        `1. **Basic Details**: Clear product title, unique SKU (e.g. \`ELEC-HP-101\`), category, and brand name.\n` +
        `2. **Pricing & Margins**: Enter Maximum Retail Price (MRP) and your actual Selling Price. Displayed discounts are auto-calculated.\n` +
        `3. **Tax & Compliance**: Select the exact GST slab (\`0%\`, \`5%\`, \`12%\`, \`18%\`, or \`28%\`) and enter the mandatory 6-8 digit HSN/SAC code.\n` +
        `4. **Physical Dimensions & Weight**: Accurate gross weight and dimensions (L x W x H in cm) for courier rate and packing slip calculation.\n` +
        `5. **Product Imagery**: Upload high-resolution 1:1 square photos (min 800x800 px) with clean white or neutral background.\n` +
        `6. **Approval SLA**: Submissions are vetted by compliance moderators within **24 hours** and go live upon approval!`,
      intent: 'vendor_add_product',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Add Physical Product',
          description: 'Open the product creator with auto-pricing and tax calculations.',
          buttonText: '➕ Open Add Product',
          link: '/vendor/add-product',
          badge: 'Product Creator'
        },
        {
          type: 'navigation_card',
          title: 'Inventory & SKUs',
          description: 'View all active, pending, and out-of-stock listings.',
          buttonText: '📦 View Inventory',
          link: '/vendor/products',
          badge: 'Catalog'
        }
      ],
      quickReplies: ['Product Approval Process', 'Vendor Subscription Limits', 'Fulfill Orders & AWB'],
      timestamp: now
    });
  }

  // 3. PRODUCT APPROVAL & STATUS
  const isApprovalQuery =
    cleanMsg.includes('approval') ||
    cleanMsg.includes('pending') ||
    cleanMsg.includes('rejected') ||
    cleanMsg.includes('why pending') ||
    cleanMsg.includes('review product') ||
    cleanMsg.includes('admin approval') ||
    cleanMsg.includes('verification');

  if (isApprovalQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🔍 **Product Approval Workflow & Turnaround**:\n\n` +
        `• **Review SLA**: All newly submitted or edited physical products undergo compliance review within **24 hours**.\n` +
        `• **Review Lifecycle**:\n` +
        `  1. **Pending Review**: Your listing is queued in the admin compliance dashboard.\n` +
        `  2. **Approved**: The listing is live and discoverable in the Customer Shop and store catalog.\n` +
        `  3. **Rejected**: If specs, HSN codes, or pricing contain discrepancies, admin remarks will appear on the product card in your catalog with an "Edit & Resubmit" option.\n\n` +
        `💡 *Pro-Tip*: Clear photos with no watermarks and valid brand documentation guarantee 100% same-day approval!`,
      intent: 'vendor_approval',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Check Product Status',
          description: 'Filter your items by Approved, Pending, or Rejected.',
          buttonText: '📦 View My Products',
          link: '/vendor/products',
          badge: 'Catalog'
        }
      ],
      quickReplies: ['➕ Add New Product', 'Vendor Subscription Plans', 'Contact Seller Support'],
      timestamp: now
    });
  }

  // 4. ORDER FULFILLMENT & COURIER DISPATCH
  const isOrderFulfillment =
    cleanMsg.includes('fulfill') ||
    cleanMsg.includes('dispatch') ||
    cleanMsg.includes('shipping label') ||
    cleanMsg.includes('waybill') ||
    cleanMsg.includes('awb') ||
    cleanMsg.includes('pack order') ||
    cleanMsg.includes('courier') ||
    cleanMsg.includes('bluedart') ||
    cleanMsg.includes('delhivery') ||
    cleanMsg.includes('ship order');

  if (isOrderFulfillment) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🚚 **5-Step Order Fulfillment & Dispatch Protocol**:\n\n` +
        `1. **New Order Alert**: When a buyer purchases, the order is logged under **"Orders & Dispatch"** in \`Placed\` status.\n` +
        `2. **Inspect & Pack**: Verify product physical condition, pack in bubble-lined carton, and click **Confirm Packaging**.\n` +
        `3. **Print GST Invoice & Shipping Label**: Download the auto-generated tax invoice and stick the courier label with barcode on the carton.\n` +
        `4. **Assign Courier & AWB**: Select your courier partner (**Delhivery Surface Express** or **BlueDart**) to generate the live waybill AWB.\n` +
        `5. **Pickup Handover**: Hand the package to the courier driver. As soon as the barcode is scanned, the customer receives an automated Twilio WhatsApp & SMS tracking update!`,
      intent: 'vendor_orders_dispatch',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Orders & Dispatch Center',
          description: 'Manage pending customer orders, packing slips, and shipping waybills.',
          buttonText: '🚚 Open Orders & Dispatch',
          link: '/vendor/orders',
          badge: 'Operations'
        }
      ],
      quickReplies: ['Delivery OTP Seller Protection', 'GST Invoice Generation', 'Payout & Settlement Cycle'],
      timestamp: now
    });
  }

  // 5. DELIVERY OTP SELLER PROTECTION
  const isVendorOtp =
    cleanMsg.includes('otp') ||
    cleanMsg.includes('cod otp') ||
    cleanMsg.includes('delivery pin') ||
    cleanMsg.includes('fake delivery') ||
    cleanMsg.includes('anti-fraud') ||
    cleanMsg.includes('chargeback');

  if (isVendorOtp) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🛡️ **Doorstep Delivery OTP: Anti-Fraud Seller Protection**:\n\n` +
        `• **How It Protects Merchants**: On all Cash on Delivery (COD) shipments, a cryptographically generated 4-digit Delivery OTP is tied to the order.\n` +
        `• **Zero False Non-Delivery Claims**: Courier executives cannot mark a package delivered without validating the customer's 4-digit code. This protects you against dishonest delivery attempts and false buyer claims.\n` +
        `• **Chargeback & Escrow Immunity**: Because the OTP proves physical doorstep handover, platform escrow automatically releases your payout without risk of chargebacks!`,
      intent: 'vendor_otp_protection',
      quickReplies: ['Order Fulfillment Protocol', 'Dispute & Claim Defense', 'Payout Settlement'],
      timestamp: now
    });
  }

  // 6. SUBSCRIPTION PLANS & COMMISSION TIERS
  const isSubscriptionQuery =
    cleanMsg.includes('subscription') ||
    cleanMsg.includes('plan') ||
    cleanMsg.includes('tier') ||
    cleanMsg.includes('fee') ||
    cleanMsg.includes('commission') ||
    cleanMsg.includes('growth') ||
    cleanMsg.includes('pro') ||
    cleanMsg.includes('enterprise') ||
    cleanMsg.includes('upgrade');

  if (isSubscriptionQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `💎 **Vendor Hub Subscription Tiers & Commission Rates**:\n\n` +
        `Choose the ideal merchant tier to optimize your profit margins:\n\n` +
        `1. **Starter (Free)** — \`₹0 / month\`:\n` +
        `   • Up to 10 active product listings\n` +
        `   • **12%** marketplace commission per sale\n` +
        `   • Standard email support\n\n` +
        `2. **Growth Plan** — \`₹999 / month\`:\n` +
        `   • Up to 50 active product listings\n` +
        `   • Reduced **8%** marketplace commission\n` +
        `   • Basic marketing banner placement & priority order badges\n\n` +
        `3. **Pro Merchant** — \`₹2,499 / month\` *(Most Popular)*:\n` +
        `   • **Unlimited** product listings\n` +
        `   • Low **5%** marketplace commission\n` +
        `   • Verified Top Seller badge, automated inventory alerts, and 24/7 dedicated account manager\n\n` +
        `4. **Enterprise** — Custom volume pricing (\`3% commission\`) with dedicated API gateway.\n\n` +
        `💡 *Upgrading from Starter to Pro instantly saves 7% margin on every transaction!*`,
      intent: 'vendor_subscriptions',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Upgrade Subscription',
          description: 'Lower your commission rate and unlock unlimited product listings.',
          buttonText: '💎 View Plans & Upgrade',
          link: '/vendor/dashboard',
          badge: 'Tiers'
        }
      ],
      quickReplies: ['Payout & Commission Calculation', '➕ Add New Product', 'Marketing Center'],
      timestamp: now
    });
  }

  // 7. PAYOUTS & BANK SETTLEMENTS
  const isPayoutQuery =
    cleanMsg.includes('payout') ||
    cleanMsg.includes('settlement') ||
    cleanMsg.includes('bank') ||
    cleanMsg.includes('earnings') ||
    cleanMsg.includes('transfer') ||
    cleanMsg.includes('neft') ||
    cleanMsg.includes('when get paid');

  if (isPayoutQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `💰 **Vendor Payouts & Automated Bank Settlement**:\n\n` +
        `• **Settlement Cycle (T+3)**: Funds are cleared **3 business days** following confirmed physical delivery (to honor the initial return window).\n` +
        `• **Net Payout Calculation**:\n` +
        `  \`Net Remittance = (Gross Item Value) - (Platform Commission %) - (18% GST on Commission) + (Shipping Allowance)\`\n` +
        `• **Payment Method**: Direct automated batch NEFT / IMPS transfer into your verified merchant bank account (IFSC & Account Number on file).\n` +
        `• **Statements & Tax Invoices**: Download detailed remittance advice and monthly commission deduction receipts under **Growth & Analytics**.`,
      intent: 'vendor_payouts',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Growth & Analytics',
          description: 'View sales velocity, net earnings, and settlement reports.',
          buttonText: '📈 View Financial Reports',
          link: '/vendor/analytics',
          badge: 'Revenue'
        }
      ],
      quickReplies: ['Vendor Subscriptions & Fees', 'GST Invoices & Reports', 'Fulfill Orders'],
      timestamp: now
    });
  }

  // 8. GST TAX INVOICES & TWILIO GATEWAY
  const isInvoiceQuery =
    cleanMsg.includes('invoice') ||
    cleanMsg.includes('gst') ||
    cleanMsg.includes('tax') ||
    cleanMsg.includes('cgst') ||
    cleanMsg.includes('sgst') ||
    cleanMsg.includes('igst') ||
    cleanMsg.includes('billing') ||
    cleanMsg.includes('slip') ||
    cleanMsg.includes('twilio') ||
    cleanMsg.includes('whatsapp');

  if (isInvoiceQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `📄 **GST Invoicing & Automated Twilio Gateway**:\n\n` +
        `• **Automated Tax Calculation**: For every order, the system calculates GST according to your product's HSN slab:\n` +
        `  - **Intra-State Delivery**: Auto-split into **CGST + SGST**.\n` +
        `  - **Inter-State Delivery**: Auto-calculated as **IGST**.\n` +
        `• **Automated Twilio Communication**: As soon as you mark an order dispatched, our Twilio gateway sends an automated SMS and WhatsApp message to the customer with their order tracking and tax invoice PDF link.\n` +
        `• **Packing Slips**: Print physical packing slips and courier labels in 1 click from "Orders & Dispatch".`,
      intent: 'vendor_invoices',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'View Invoices & Orders',
          description: 'Download PDF tax invoices and print courier shipping slips.',
          buttonText: '📄 Open Invoices & Orders',
          link: '/vendor/orders',
          badge: 'Tax Compliance'
        }
      ],
      quickReplies: ['Fulfill Orders & AWB', 'Payout Settlement', 'Store Builder'],
      timestamp: now
    });
  }

  // 9. MARKETING CENTER & PROMOTIONS
  const isMarketingQuery =
    cleanMsg.includes('marketing') ||
    cleanMsg.includes('promotion') ||
    cleanMsg.includes('promo') ||
    cleanMsg.includes('coupon') ||
    cleanMsg.includes('campaign') ||
    cleanMsg.includes('banner') ||
    cleanMsg.includes('sales boost');

  if (isMarketingQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `📣 **Marketing Center: Grow Your Merchant Store**:\n\n` +
        `• **Create Custom Store Coupons**: Generate discount codes (e.g. \`SAVE15\` for 15% off, or flat ₹200 off above ₹1,499) with custom expiry dates.\n` +
        `• **Featured Product Boost**: Promote select high-margin SKUs to appear highlighted at the top of category browsing.\n` +
        `• **Hero Banner Campaigns**: Place your brand on the main marketplace slider to attract high-intent shoppers.\n` +
        `• **Real-Time ROI**: Track coupon redemptions, CTR, and incremental sales in your **Marketing Center** dashboard!`,
      intent: 'vendor_marketing',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Marketing Center',
          description: 'Launch store coupons and featured banner campaigns.',
          buttonText: '📣 Open Marketing Center',
          link: '/vendor/marketing',
          badge: 'Campaigns'
        }
      ],
      quickReplies: ['➕ Add New Product', 'Smart Inventory Alerts', 'Vendor Subscriptions'],
      timestamp: now
    });
  }

  // 10. SMART INVENTORY & LOW STOCK ALERTS
  const isInventoryQuery =
    cleanMsg.includes('inventory') ||
    cleanMsg.includes('stock') ||
    cleanMsg.includes('out of stock') ||
    cleanMsg.includes('reorder') ||
    cleanMsg.includes('quantity') ||
    cleanMsg.includes('low stock') ||
    cleanMsg.includes('threshold');

  if (isInventoryQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `📦 **Smart Inventory & Stock Management**:\n\n` +
        `• **Automated Low-Stock Alerts**: When any SKU falls to **5 units or fewer**, you will receive an alert in the dashboard and notification center.\n` +
        `• **Out-of-Stock Protection**: Listings that hit 0 units are automatically paused from buyer search to protect your seller rating against cancellation penalties.\n` +
        `• **Batch Restocking**: Update stock counts across your entire catalog in seconds from the **Smart Inventory** tab.`,
      intent: 'vendor_inventory',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Smart Inventory',
          description: 'Review stock velocity, restock thresholds, and SKU status.',
          buttonText: '📦 Open Smart Inventory',
          link: '/vendor/inventory',
          badge: 'Stock Levels'
        }
      ],
      quickReplies: ['➕ Add New Product', 'Fulfill Orders', 'Marketing Center'],
      timestamp: now
    });
  }

  // 11. DISPUTES & RETURN DEFENSE
  const isDisputeQuery =
    cleanMsg.includes('dispute') ||
    cleanMsg.includes('claim') ||
    cleanMsg.includes('customer return') ||
    cleanMsg.includes('damaged return') ||
    cleanMsg.includes('buyer return') ||
    cleanMsg.includes('refund dispute');

  if (isDisputeQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `⚠️ **Dispute Defense & Return Arbitration**:\n\n` +
        `• **48-Hour Response Window**: If a customer requests a return or replacement, you will receive an alert under **Disputes & Claims**.\n` +
        `• **Fair Seller Defense**: If the customer claims transit damage or wrong item, you can review their uploaded photos and submit your packaging photos or dispatch CCTV.\n` +
        `• **Escrow Protection**: Funds remain safely held by platform escrow until mutual resolution. If courier transit damage is proven, carrier transit insurance protects your reimbursement!`,
      intent: 'vendor_disputes',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Disputes & Claims',
          description: 'Review active return claims, upload dispatch proof, and resolve disputes.',
          buttonText: '⚠️ View Disputes & Claims',
          link: '/vendor/disputes',
          badge: 'Claims'
        }
      ],
      quickReplies: ['Delivery OTP Seller Protection', 'Fulfill Orders', 'Contact Seller Support'],
      timestamp: now
    });
  }

  // 12. STORE BUILDER & BRANDING
  const isStoreBuilder =
    cleanMsg.includes('store builder') ||
    cleanMsg.includes('store profile') ||
    cleanMsg.includes('banner') ||
    cleanMsg.includes('logo') ||
    cleanMsg.includes('business hours') ||
    cleanMsg.includes('storefront') ||
    cleanMsg.includes('branding');

  if (isStoreBuilder) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🎨 **Store Builder: Showcase Your Brand**:\n\n` +
        `• **Storefront Customization**: Upload your custom brand banner (1200x300 px), official store logo, and compelling business story.\n` +
        `• **Warehouse Address & Operating Hours**: Configure your pickup location and operating hours so couriers schedule pickups accurately.\n` +
        `• **Buyer Messaging SLA**: Responding to customer queries in "Customer Inbox" within 15 minutes boosts your store rating and search ranking!`,
      intent: 'vendor_storefront',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Store Builder',
          description: 'Customize your merchant storefront, banners, and business profile.',
          buttonText: '🎨 Open Store Builder',
          link: '/vendor/store-builder',
          badge: 'Storefront'
        }
      ],
      quickReplies: ['Marketing Center', '➕ Add New Product', 'Vendor Subscriptions'],
      timestamp: now
    });
  }

  // 13. SELLER SUPPORT & HELPLINE
  const isVendorSupport =
    cleanMsg.includes('seller support') ||
    cleanMsg.includes('vendor helpline') ||
    cleanMsg.includes('contact support') ||
    cleanMsg.includes('merchant care') ||
    cleanMsg.includes('help desk') ||
    cleanMsg.includes('helpline');

  if (isVendorSupport) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `📞 **Vendor Priority Partner Support**:\n\n` +
        `• **Dedicated Merchant Email**: \`merchant-help@vendorhub.com\`\n` +
        `• **Priority Merchant Hotline**: **1800-836-3687** *(Press 2 for Verified Merchants)*\n` +
        `• **Support Hours**: Monday - Saturday, 8:00 AM to 10:00 PM IST\n` +
        `• **Escalation SLA**: Dedicated partner tickets are addressed within **12 business hours**.`,
      intent: 'vendor_support',
      quickReplies: ['Vendor Subscriptions', 'Fulfill Orders', 'Payout Settlement'],
      timestamp: now
    });
  }

  // 14. CROSS-ROLE SWITCH: VENDOR ASKING ABOUT BUYER SHOPPING
  const isShoppingQuery =
    cleanMsg.includes('buy product') ||
    cleanMsg.includes('recommend product') ||
    cleanMsg.includes('shop') ||
    cleanMsg.includes('where is my order') ||
    cleanMsg.includes('customer discount');

  if (isShoppingQuery) {
    return res.json({
      success: true,
      role: 'vendor',
      reply:
        `🛍️ **Looking to Shop or Track Personal Purchases?**\n\n` +
        `You are currently in **Vendor Operations Co-Pilot Mode**. If you wish to browse the marketplace catalog, search deals, or track personal consumer orders, you can switch to **Customer Concierge Mode** anytime using the toggle at the top of this assistant!`,
      intent: 'vendor_switch_customer',
      quickReplies: ['Switch to Customer Mode', '➕ Add New Product', 'Fulfill Orders & AWB'],
      timestamp: now
    });
  }

  // 15. VENDOR FALLBACK GUIDANCE
  return res.json({
    success: true,
    role: 'vendor',
    reply:
      `I understand you're inquiring about "${rawMsg}". Here are key merchant operations I can help you with:\n\n` +
      `• ➕ **List a Product?** Ask "How to add product" for step-by-step SKU, HSN, and GST slab instructions.\n` +
      `• 🚚 **Fulfill Orders?** Ask "Order dispatch" for packing, courier waybills (Delhivery/BlueDart), and labels.\n` +
      `• 💎 **Pricing & Fees?** Ask "Vendor plans" to compare Starter (12%), Growth (8%), and Pro (5%) tiers.\n` +
      `• 💰 **Bank Payouts?** Ask "When will I get paid" for our T+3 settlement cycle and remittance advice.\n` +
      `• 📄 **GST Tax Invoices?** Ask "How do invoices work" for automated tax billing & Twilio WhatsApp/SMS alerts.\n` +
      `• 📣 **Boost Store Sales?** Ask "Marketing coupons" to launch custom discount codes and banner campaigns.\n` +
      `• 📦 **Stock Management?** Ask "Low stock alerts" to prevent out-of-stock penalties.\n\n` +
      `Select a quick option below or type your question:`,
    intent: 'vendor_fallback_guided',
    quickReplies: [
      '➕ Add New Product',
      '🚚 Fulfill Orders & AWB',
      '💎 Vendor Plans & Fees',
      '💰 Payout Settlement',
      '📄 GST Invoices & Twilio',
      '📣 Store Marketing & Coupons',
      '⚠️ Dispute Resolution'
    ],
    timestamp: now
  });
}

/**
 * ─────────────────────────────────────────────────────────────
 * CUSTOMER SHOPPING CONCIERGE INTENT HANDLER
 * ─────────────────────────────────────────────────────────────
 */
async function handleCustomerIntent(req, res, { cleanMsg, rawMsg, userId, context, now }) {
  // 1. GREETINGS, COURTESIES & ABOUT BOT
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
      role: 'customer',
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
      role: 'customer',
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
      role: 'customer',
      reply:
        `Goodbye! 👋 Have a wonderful day shopping on Vendor Hub. If you ever need order updates, delivery OTP assistance, or product recommendations, just click my icon anytime!`,
      intent: 'farewell',
      quickReplies: ['Browse Marketplace Catalog', 'Track My Order', 'View Active Coupons'],
      timestamp: now
    });
  }

  // CROSS-ROLE SWITCH: CUSTOMER ASKING ABOUT BECOMING A SELLER
  const isSellerQuery =
    cleanMsg.includes('become a seller') ||
    cleanMsg.includes('how to sell') ||
    cleanMsg.includes('register as vendor') ||
    cleanMsg.includes('open a store') ||
    cleanMsg.includes('sell on vendor hub') ||
    cleanMsg.includes('merchant account');

  if (isSellerQuery) {
    return res.json({
      success: true,
      role: 'customer',
      reply:
        `💼 **Start Selling on Vendor Hub**:\n\n` +
        `We welcome verified physical merchants, wholesalers, and retail brands!\n\n` +
        `1. **Register in 2 Minutes**: Visit our **Vendor Portal** and sign up with your business name, GSTIN, and warehouse address.\n` +
        `2. **List Your Products**: Upload your physical inventory with SKU, HSN code, and images.\n` +
        `3. **Express Courier Pickups**: Delhivery and BlueDart pick up directly from your doorstep with automated AWB generation.\n` +
        `4. **Fast Payouts**: Automated T+3 bank transfers with low commission rates (5% - 12%).\n\n` +
        `Would you like to switch this assistant to **Vendor Operations Co-Pilot Mode** to learn all about merchant tools?`,
      intent: 'seller_onboarding',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Vendor Portal Registration',
          description: 'Create your merchant account and start selling nationwide.',
          buttonText: '🏪 Open Vendor Portal',
          link: '/vendor/login',
          badge: 'Merchant Hub'
        }
      ],
      quickReplies: ['Switch to Vendor Mode', 'Browse Customer Shop', 'Active Coupons & Offers'],
      timestamp: now
    });
  }

  // 2. ACTIVE COUPONS, DISCOUNTS, OFFERS & PROMO CODES
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
      role: 'customer',
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

  // 3. ORDER CANCELLATION & ADDRESS MODIFICATION
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
      role: 'customer',
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
      role: 'customer',
      reply:
        `📍 **Updating Shipping Address or Phone Number**:\n\n` +
        `• **Before Courier Dispatch**: If your order is still in **Placed** or **Confirmed** state, you can reach out directly to the merchant via **"Message Merchant"** under your order details to request an address or phone update before shipping label generation.\n` +
        `• **After Handover to Courier**: For security reasons, courier waybills cannot be rerouted mid-transit. If the address is unreachable, the courier will attempt delivery and you can instruct the delivery agent or decline delivery for auto-return and full refund.`,
      intent: 'address_change',
      quickReplies: ['View My Orders', 'Message Merchant', 'Contact Customer Care'],
      timestamp: now
    });
  }

  // 4. ORDER TRACKING & STATUS
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
        role: 'customer',
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
        role: 'customer',
        reply: queriedOrderId
          ? `I couldn't locate Order **#${queriedOrderId}** in our active database. Please double-check the Order ID or visit your "My Orders" screen.`
          : `You don't have any active orders under your current session, or you are browsing as a guest. You can sign in to view your orders, live courier tracking, and doorstep OTPs.`,
        intent: 'order_tracking',
        quickReplies: ['Go to My Orders', 'Browse Marketplace Catalog', 'How does Delivery OTP work?'],
        timestamp: now
      });
    }
  }

  // 5. DOORSTEP DELIVERY OTP (COD PROTECTION)
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
      role: 'customer',
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

  // 6. RETURNS, REPLACEMENTS & DISPUTE CLAIMS
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
      role: 'customer',
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

  // 7. REFUND TIMELINE & FAILED PAYMENTS
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
      role: 'customer',
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

  // 8. SHIPPING CHARGES, DELIVERY TIME & LOCATIONS
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
      role: 'customer',
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

  // 9. PAYMENT OPTIONS & DYNAMIC UPI QR
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
      role: 'customer',
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

  // 10. BRAND WARRANTY, GST TAX INVOICES & AUTHENTICITY
  const isWarrantyQuery =
    cleanMsg.includes('warranty') ||
    cleanMsg.includes('guarantee') ||
    cleanMsg.includes('genuine') ||
    cleanMsg.includes('original') ||
    cleanMsg.includes('invoice') ||
    cleanMsg.includes('tax invoice') ||
    cleanMsg.includes('authenticity') ||
    cleanMsg.includes('fake');

  if (isWarrantyQuery) {
    return res.json({
      success: true,
      role: 'customer',
      reply:
        `🛡️ **100% Authenticity, Manufacturer Warranty & GST Invoices**:\n\n` +
        `• **Verified Inventory**: Every physical item sold on Vendor Hub is stocked in verified physical merchant warehouses and inspected before packaging.\n` +
        `• **Manufacturer Warranty**: All electronics, appliances, and branded items include the official manufacturer warranty card valid at authorized brand service centers nationwide.\n` +
        `• **Official GST Tax Invoice**: Every shipment carton includes a physical printed GST tax invoice. You can also download the digital tax invoice anytime from "My Orders".`,
      intent: 'warranty_authenticity',
      quickReplies: ['Recommend Top Electronics', 'Return & Replacement Window', 'Track My Order'],
      timestamp: now
    });
  }

  // 11. VENDOR STOREFRONTS, SELLER PROFILES & DIRECT CHAT
  const isVendorHelpQuery =
    cleanMsg.includes('vendor') ||
    cleanMsg.includes('seller') ||
    cleanMsg.includes('merchant') ||
    cleanMsg.includes('store') ||
    cleanMsg.includes('contact seller') ||
    cleanMsg.includes('contact merchant') ||
    cleanMsg.includes('message merchant') ||
    cleanMsg.includes('chat with seller') ||
    cleanMsg.includes('store profile');

  if (isVendorHelpQuery) {
    return res.json({
      success: true,
      role: 'customer',
      reply:
        `🏬 **Connecting with Verified Merchants on Vendor Hub**:\n\n` +
        `• **Explore Stores**: Visit the **"Explore Stores"** directory to view physical store profiles, seller ratings, product catalogs, and warehouse locations.\n` +
        `• **Message Merchant**: On any product page or store profile, click **"Message Merchant"** to initiate a 1-on-1 direct chat thread with the merchant regarding bulk pricing, stock inquiries, sizing, or dispatch dates.\n` +
        `• **Merchant SLA**: Verified store owners typically respond to buyer inquiries within **15 minutes** during operational hours.`,
      intent: 'vendor_help',
      actionCards: [
        {
          type: 'navigation_card',
          title: 'Explore Merchant Stores',
          description: 'Browse verified physical stores and direct merchant storefronts.',
          buttonText: '🏬 View Store Directory',
          link: '/stores',
          badge: 'Verified Merchants'
        }
      ],
      quickReplies: ['Explore Stores', 'Recommend Top Deals', 'Track My Order'],
      timestamp: now
    });
  }

  // 12. CUSTOMER SUPPORT & HELPLINE
  const isSupportQuery =
    cleanMsg.includes('customer care') ||
    cleanMsg.includes('support') ||
    cleanMsg.includes('helpline') ||
    cleanMsg.includes('toll free') ||
    cleanMsg.includes('phone number') ||
    cleanMsg.includes('contact us') ||
    cleanMsg.includes('human agent') ||
    cleanMsg.includes('email');

  if (isSupportQuery) {
    return res.json({
      success: true,
      role: 'customer',
      reply:
        `📞 **Vendor Hub Customer Care & Grievance Team**:\n\n` +
        `Our dedicated customer support team is available 7 days a week to ensure your complete satisfaction:\n\n` +
        `• ☎️ **Toll-Free Helpline**: **1800-836-3687** *(Daily 9:00 AM to 9:00 PM IST)*\n` +
        `• ✉️ **Email Support**: \`support@vendour.com\` *(Responses within 24 hours)*\n` +
        `• 📍 **Headquarters**: Vendor Hub Tech Tower, Whitefield, Bengaluru, Karnataka - 560066\n` +
        `• 🛡️ **Escalations**: Order disputes and replacement claims are adjudicated by our platform grievance desk.`,
      intent: 'customer_support',
      quickReplies: ['Check My Orders', 'Raise a Dispute Claim', 'Active Coupons & Deals'],
      timestamp: now
    });
  }

  // 13. PRODUCT SEARCH & RECOMMENDATION INTENT
  const isRecommendationQuery =
    cleanMsg.includes('recommend') ||
    cleanMsg.includes('suggest') ||
    cleanMsg.includes('best') ||
    cleanMsg.includes('top') ||
    cleanMsg.includes('find') ||
    cleanMsg.includes('search') ||
    cleanMsg.includes('look for') ||
    cleanMsg.includes('under') ||
    cleanMsg.includes('below') ||
    cleanMsg.includes('cheapest') ||
    cleanMsg.includes('phone') ||
    cleanMsg.includes('laptop') ||
    cleanMsg.includes('headphone') ||
    cleanMsg.includes('watch') ||
    cleanMsg.includes('shirt') ||
    cleanMsg.includes('shoes') ||
    cleanMsg.includes('electronics') ||
    cleanMsg.includes('fashion') ||
    cleanMsg.includes('home') ||
    cleanMsg.includes('audio');

  if (isRecommendationQuery) {
    // Extract price constraint
    const priceMatch = cleanMsg.match(/(?:under|below|less than|within|budget of)\s*(?:rs\.?|inr|₹)?\s*(\d{2,6})/i);
    const maxPriceFilter = priceMatch ? parseInt(priceMatch[1], 10) : null;

    // Extract target category or keywords
    let categoryTarget = null;
    if (cleanMsg.includes('electronic') || cleanMsg.includes('gadget') || cleanMsg.includes('phone') || cleanMsg.includes('laptop') || cleanMsg.includes('headphone') || cleanMsg.includes('audio')) {
      categoryTarget = 'Electronics';
    } else if (cleanMsg.includes('fashion') || cleanMsg.includes('cloth') || cleanMsg.includes('shirt') || cleanMsg.includes('dress') || cleanMsg.includes('shoe')) {
      categoryTarget = 'Fashion';
    } else if (cleanMsg.includes('home') || cleanMsg.includes('kitchen') || cleanMsg.includes('decor')) {
      categoryTarget = 'Home & Living';
    }

    const queryTokens = cleanMsg
      .replace(/(?:recommend|suggest|best|top|find|search|products?|under|below|less than|rs\.?|inr|₹|\d+)/gi, '')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 2);

    let matchedProducts = [];
    if (isDbConnected()) {
      try {
        const query = { status: 'approved' };
        if (categoryTarget) query.category = categoryTarget;
        if (maxPriceFilter) query.price = { $lte: maxPriceFilter };
        if (queryTokens.length > 0) {
          query.$or = queryTokens.map((t) => ({
            name: { $regex: t, $options: 'i' }
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
        role: 'customer',
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

  // 14. SMART FAQ MATCH
  const matchedFaq = FAQ_KNOWLEDGE_BASE.find(
    (f) =>
      (!f.targetRole || f.targetRole === 'customer') &&
      (f.question.toLowerCase().includes(cleanMsg) ||
        cleanMsg.includes(f.question.toLowerCase().slice(0, 20)) ||
        f.category.toLowerCase().includes(cleanMsg))
  );

  if (matchedFaq) {
    return res.json({
      success: true,
      role: 'customer',
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

  // 15. GUIDED CUSTOMER FALLBACK
  return res.json({
    success: true,
    role: 'customer',
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
}

/**
 * Get curated FAQ categories (Customer and Vendor)
 * GET /api/chatbot/faqs
 */
export const getChatbotFaqs = async (req, res) => {
  try {
    const { role } = req.query || {};
    let faqs = FAQ_KNOWLEDGE_BASE;
    if (role) {
      faqs = faqs.filter((f) => !f.targetRole || f.targetRole === role);
    }
    return res.json({
      success: true,
      faqs,
      count: faqs.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve FAQs',
      error: error.message
    });
  }
};
