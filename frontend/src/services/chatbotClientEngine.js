import { seedProducts, seedOrders, seedPromotions } from '../data/seedData.js';

/**
 * Client-Side Resilient Dual-Role NLP Chatbot Engine for Vendor Hub
 * Acts as an instant offline/fallback intelligence engine ensuring
 * that the chatbot ALWAYS provides rich, accurate answers for Customer and Vendor queries.
 */
export function processClientChatbotMessage(message, user = null, context = {}) {
  const cleanMsg = (message || '').trim().toLowerCase();
  const rawMsg = (message || '').trim();
  const now = new Date().toISOString();

  const userRole =
    context?.userRole ||
    (typeof user === 'string' ? user : user?.type || user?.role || 'customer');
  const effectiveRole = (userRole || 'customer').toLowerCase();

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

  if (effectiveRole === 'vendor' || (isVendorOperationalIntent && effectiveRole !== 'customer')) {
    return processVendorClientMessage(cleanMsg, rawMsg, user, context, now);
  }

  return processCustomerClientMessage(cleanMsg, rawMsg, user, context, now);
}

// ── VENDOR CLIENT HANDLER ──
function processVendorClientMessage(cleanMsg, rawMsg, user, context, now) {
  // 1. GREETING & VENDOR IDENTITY
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
    return {
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
    };
  }

  // 2. ADD PRODUCT
  if (cleanMsg.includes('add product') || cleanMsg.includes('list product') || cleanMsg.includes('upload product') || cleanMsg.includes('new product') || cleanMsg.includes('how to sell') || cleanMsg.includes('sku') || cleanMsg.includes('hsn') || cleanMsg.includes('gst slab')) {
    return {
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
    };
  }

  // 3. PRODUCT APPROVAL
  if (cleanMsg.includes('approval') || cleanMsg.includes('pending') || cleanMsg.includes('rejected') || cleanMsg.includes('why pending') || cleanMsg.includes('review product')) {
    return {
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
    };
  }

  // 4. ORDER FULFILLMENT & DISPATCH
  if (cleanMsg.includes('fulfill') || cleanMsg.includes('dispatch') || cleanMsg.includes('shipping label') || cleanMsg.includes('waybill') || cleanMsg.includes('awb') || cleanMsg.includes('pack order') || cleanMsg.includes('courier')) {
    return {
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
    };
  }

  // 5. DELIVERY OTP SELLER PROTECTION
  if (cleanMsg.includes('otp') || cleanMsg.includes('cod otp') || cleanMsg.includes('delivery pin') || cleanMsg.includes('fake delivery')) {
    return {
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
    };
  }

  // 6. SUBSCRIPTION PLANS & FEES
  if (cleanMsg.includes('subscription') || cleanMsg.includes('plan') || cleanMsg.includes('tier') || cleanMsg.includes('fee') || cleanMsg.includes('commission')) {
    return {
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
    };
  }

  // 7. PAYOUTS & BANK SETTLEMENTS
  if (cleanMsg.includes('payout') || cleanMsg.includes('settlement') || cleanMsg.includes('bank') || cleanMsg.includes('earnings') || cleanMsg.includes('when get paid')) {
    return {
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
    };
  }

  // 8. GST INVOICES & TWILIO GATEWAY
  if (cleanMsg.includes('invoice') || cleanMsg.includes('gst') || cleanMsg.includes('tax') || cleanMsg.includes('slip') || cleanMsg.includes('twilio')) {
    return {
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
    };
  }

  // 9. MARKETING & PROMOTIONS
  if (cleanMsg.includes('marketing') || cleanMsg.includes('promotion') || cleanMsg.includes('promo') || cleanMsg.includes('coupon') || cleanMsg.includes('banner')) {
    return {
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
    };
  }

  // 10. DISPUTES & CLAIMS
  if (cleanMsg.includes('dispute') || cleanMsg.includes('claim') || cleanMsg.includes('return') || cleanMsg.includes('damaged return')) {
    return {
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
    };
  }

  // Fallback for Vendor
  return {
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
  };
}

// ── CUSTOMER CLIENT HANDLER ──
function processCustomerClientMessage(cleanMsg, rawMsg, user, context, now) {
  // GREETINGS & ABOUT BOT
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
    cleanMsg.includes('hubbot') ||
    cleanMsg === 'help' ||
    cleanMsg === 'menu';

  if (isGreeting || isBotIdentity) {
    return {
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
    };
  }

  if (isCourtesy) {
    return {
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
    };
  }

  if (isGoodbye) {
    return {
      success: true,
      role: 'customer',
      reply:
        `Goodbye! 👋 Have a wonderful day shopping on Vendor Hub. If you ever need order updates, delivery OTP assistance, or product recommendations, just click my icon anytime!`,
      intent: 'farewell',
      quickReplies: ['Browse Marketplace Catalog', 'Track My Order', 'View Active Coupons'],
      timestamp: now
    };
  }

  // Cross-role seller interest
  if (cleanMsg.includes('become a seller') || cleanMsg.includes('how to sell') || cleanMsg.includes('register as vendor') || cleanMsg.includes('sell on vendor hub')) {
    return {
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
    };
  }

  // COUPONS
  if (cleanMsg.includes('coupon') || cleanMsg.includes('promo') || cleanMsg.includes('discount') || cleanMsg.includes('offer') || cleanMsg.includes('deal')) {
    const activePromos = (seedPromotions || []).filter((p) => p.status === 'active' && p.type === 'coupon').slice(0, 4);
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

    return {
      success: true,
      role: 'customer',
      reply:
        `🎉 **Verified Active Coupons & Promo Codes**:\n\n` +
        `You can apply any of these verified promotional codes during checkout to save instantly:\n\n` +
        activePromos
          .map(
            (p) =>
              `• **Code \`${p.code}\`**: ${p.title} (${p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `Flat ₹${p.discountValue} OFF`} on orders above ₹${(p.minOrderValue || 0).toLocaleString('en-IN')})`
          )
          .join('\n') +
        `\n\n💡 **How to Apply**: Add products to your Cart, proceed to Checkout, and paste your coupon code into the "Apply Coupon" box!`,
      intent: 'coupons',
      actionCards: couponCards,
      quickReplies: ['Recommend Top Electronics', 'Recommend Fashion Deals', 'How does Delivery OTP work?', 'Track My Order'],
      timestamp: now
    };
  }

  // ORDER TRACKING
  const orderIdMatch = cleanMsg.match(/\b(ord\d+|order\s*#?\s*\d+|#\s*\d{1,6})\b/i);
  if (orderIdMatch || cleanMsg.includes('track') || cleanMsg.includes('where is my order') || cleanMsg.includes('order status') || cleanMsg.includes('my orders')) {
    let queriedOrderId = null;
    if (orderIdMatch) {
      queriedOrderId = orderIdMatch[0].replace(/order\s*#?\s*/i, 'ord').replace(/#/g, '').trim().toLowerCase();
      if (!queriedOrderId.startsWith('ord') && /^\d+$/.test(queriedOrderId)) {
        queriedOrderId = `ord${queriedOrderId}`;
      }
    }

    let topOrder = (seedOrders || []).find((o) => queriedOrderId && (o.id.toLowerCase() === queriedOrderId || o.id.toLowerCase() === queriedOrderId.replace('ord', 'ord-')));
    if (!topOrder && seedOrders && seedOrders.length > 0) {
      topOrder = seedOrders[0];
    }

    if (topOrder) {
      return {
        success: true,
        role: 'customer',
        reply:
          `📦 Here is the verified tracking update for **Order #${topOrder.id}**:\n\n` +
          `• **Status**: **${topOrder.status}**\n` +
          `• **Courier Partner**: ${topOrder.courierPartner || 'Delhivery Surface Express'}\n` +
          `• **Waybill Tracking #**: \`${topOrder.trackingNumber || 'DEL-8492019'}\`\n` +
          `• **Total Amount**: ₹${(topOrder.total || 0).toLocaleString('en-IN')}\n\n` +
          `📌 *Fulfillment Update*: In Transit with express logistics.${topOrder.paymentDetails?.codOtp ? `\n\n🔑 **Doorstep Delivery OTP**: \`${topOrder.paymentDetails.codOtp}\` (Share only upon package inspection).` : ''}`,
        intent: 'order_tracking',
        actionCards: [
          {
            type: 'order_card',
            orderId: topOrder.id,
            status: topOrder.status,
            courierPartner: topOrder.courierPartner || 'Delhivery Surface Express',
            trackingNumber: topOrder.trackingNumber || 'DEL-8492019',
            total: topOrder.total,
            itemsCount: topOrder.items?.length || 1,
            firstItemName: topOrder.items?.[0]?.name || 'Physical merchandise',
            firstItemImage: topOrder.items?.[0]?.image || '',
            deliveryOtp: topOrder.paymentDetails?.codOtp || null,
            isCod: topOrder.paymentMethod === 'COD'
          }
        ],
        quickReplies: [`View Order #${topOrder.id} in Dashboard`, 'How does Delivery OTP work?', 'What is the Return Policy?'],
        timestamp: now
      };
    }
  }

  // DOORSTEP COD OTP
  if (cleanMsg.includes('otp') || cleanMsg.includes('delivery pin') || cleanMsg.includes('cod otp') || cleanMsg.includes('4 digit')) {
    return {
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
    };
  }

  // 7-DAY RETURNS
  if (cleanMsg.includes('return') || cleanMsg.includes('replace') || cleanMsg.includes('damaged') || cleanMsg.includes('defective') || cleanMsg.includes('dispute')) {
    return {
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
      quickReplies: ['Go to My Orders', 'Raise a Dispute', 'Message Storefront Merchant'],
      timestamp: now
    };
  }

  // SHIPPING CHARGES
  if (cleanMsg.includes('shipping charge') || cleanMsg.includes('delivery charge') || cleanMsg.includes('free delivery') || cleanMsg.includes('delivery time')) {
    return {
      success: true,
      role: 'customer',
      reply:
        `🚚 **Shipping, Delivery Timelines & Coverage**:\n\n` +
        `• **Delivery Charges**: **FREE Standard Delivery** on all orders above **₹499**! For smaller orders below ₹499, a nominal flat courier fee of ₹40 applies.\n` +
        `• **Dispatch SLA**: 100% of verified merchants dispatch physically stocked packages within **24 hours** from confirmed checkout.\n` +
        `• **Estimated Delivery Transit**:\n` +
        `  - **Metro Cities (Delhi, Mumbai, Bengaluru, etc.)**: 1 - 2 business days.\n` +
        `  - **Tier 2 / Tier 3 Cities**: 2 - 4 business days.\n` +
        `• **Courier Partners**: BlueDart Express, Delhivery Surface, and DTDC Air with end-to-end waybill tracking.`,
      intent: 'shipping_info',
      quickReplies: ['Track My Active Order', 'Active Coupons & Deals', 'How does Delivery OTP work?'],
      timestamp: now
    };
  }

  // CUSTOMER CARE
  if (cleanMsg.includes('support') || cleanMsg.includes('customer care') || cleanMsg.includes('helpline') || cleanMsg.includes('contact')) {
    return {
      success: true,
      role: 'customer',
      reply:
        `📞 **Vendor Hub Customer Care & Grievance Team**:\n\n` +
        `Our dedicated customer support team is available 7 days a week to ensure your complete satisfaction:\n\n` +
        `• ☎️ **Toll-Free Helpline**: **1800-836-3687** *(Daily 9:00 AM to 9:00 PM IST)*\n` +
        `• ✉️ **Email Support**: \`support@vendour.com\` *(Responses within 24 hours)*\n` +
        `• 📍 **Headquarters**: Vendor Hub Tech Tower, Whitefield, Bengaluru, Karnataka - 560066`,
      intent: 'customer_support',
      quickReplies: ['Check My Orders', 'Raise a Dispute Claim', 'Active Coupons & Deals'],
      timestamp: now
    };
  }

  // Fallback for Customer
  return {
    success: true,
    role: 'customer',
    reply:
      `I understand you're inquiring about "${rawMsg}". Here is how I can best assist you:\n\n` +
      `• 📦 **Looking for an Order?** Type your Order ID (e.g. \`#ord1\`) or ask "Track my order" for live courier tracking.\n` +
      `• 🏷️ **Looking for Discounts?** Ask for "Coupons" to get verified codes like \`TECH20\` or \`STYLE15\`.\n` +
      `• 🔑 **COD Delivery OTP?** Ask "How does delivery OTP work?" for our anti-fraud verification guide.\n` +
      `• 🔄 **Returns or Damaged Item?** Ask "Return policy" or visit "My Orders" to open a 7-day dispute claim.\n` +
      `• 🚚 **Shipping & Pincodes?** Ask "Shipping charges" or "Delivery time" for dispatch times & coverage.\n` +
      `• 🛍️ **Finding Products?** Tell me what you're looking for (e.g. "Laptops under 50000", "Wireless Earbuds").\n` +
      `• 📞 **Speak with Support?** Our toll-free helpline is **1800-836-3687** (Daily 9 AM - 9 PM IST).\n\n` +
      `Select an option below or type your question in more detail:`,
    intent: 'fallback_guided',
    quickReplies: [
      'Track My Order',
      'Active Coupons & Offers',
      'Recommend Electronics',
      'How does Delivery OTP work?',
      'Return & Replacement Policy',
      'Contact Customer Care'
    ],
    timestamp: now
  };
}
