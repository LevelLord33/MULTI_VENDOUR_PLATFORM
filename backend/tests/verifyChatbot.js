import { processChatbotMessage, getChatbotFaqs } from '../controllers/chatbotController.js';

function mockReqRes(body = {}) {
  let responseData = null;
  let responseStatus = 200;
  const res = {
    status(code) {
      responseStatus = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    }
  };
  const req = { body };
  return { req, res, getResult: () => ({ status: responseStatus, data: responseData }) };
}

async function runTests() {
  console.log('🤖 Running Comprehensive HubBot Chatbot Verification Tests...\n');
  let passed = 0;
  let total = 0;

  const assert = (condition, desc) => {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${desc}`);
    }
  };

  // 1. FAQs Endpoint
  {
    const { req, res, getResult } = mockReqRes();
    await getChatbotFaqs(req, res);
    const result = getResult();
    assert(result.status === 200 && result.data.success && result.data.faqs.length >= 8, 'getChatbotFaqs returns comprehensive FAQ dictionary');
  }

  // 2. Intent: Order Tracking
  {
    const { req, res, getResult } = mockReqRes({ message: 'Where is my order ord1?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'order_tracking' &&
      result.data.reply?.includes('ord1') &&
      Array.isArray(result.data.actionCards),
      'processChatbotMessage handles order tracking for ord1'
    );
  }

  // 3. Intent: Doorstep COD OTP
  {
    const { req, res, getResult } = mockReqRes({ message: 'How does the Cash on Delivery COD OTP work?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'delivery_otp' &&
      result.data.reply?.includes('OTP'),
      'processChatbotMessage handles COD OTP intent'
    );
  }

  // 4. Intent: Returns & Replacement
  {
    const { req, res, getResult } = mockReqRes({ message: 'I need to return a damaged item and get replacement', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'returns' &&
      result.data.reply?.includes('7-Day'),
      'processChatbotMessage handles returns & disputes intent'
    );
  }

  // 5. Intent: Active Coupons & Discounts
  {
    const { req, res, getResult } = mockReqRes({ message: 'Are there any discount coupon codes or promo offers?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'coupons' &&
      Array.isArray(result.data.actionCards) &&
      result.data.actionCards.length > 0 &&
      result.data.reply?.includes('TECH20'),
      'processChatbotMessage returns active coupons with actionable cards'
    );
  }

  // 6. Intent: Order Cancellation
  {
    const { req, res, getResult } = mockReqRes({ message: 'Can I cancel my order or stop it?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'order_cancellation' &&
      result.data.reply?.includes('Instant Cancellation'),
      'processChatbotMessage handles order cancellation query'
    );
  }

  // 7. Intent: Shipping Charges & Delivery Time
  {
    const { req, res, getResult } = mockReqRes({ message: 'What are the shipping charges and delivery time to Delhi?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'shipping_info' &&
      result.data.reply?.includes('FREE Standard Delivery'),
      'processChatbotMessage handles shipping charges & delivery speed query'
    );
  }

  // 8. Intent: Product Search with Price Filter
  {
    const { req, res, getResult } = mockReqRes({ message: 'Recommend top rated headphones under 3000', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'product_recommendation' &&
      Array.isArray(result.data.actionCards) &&
      result.data.actionCards.length > 0,
      'processChatbotMessage handles category search with price filter'
    );
  }

  // 9. Intent: Vendor & Storefront Help
  {
    const { req, res, getResult } = mockReqRes({ message: 'How can I contact the vendor or store owner?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_help' &&
      result.data.reply?.includes('Message Merchant'),
      'processChatbotMessage handles vendor contact intent'
    );
  }

  // 10. Intent: Payment Methods
  {
    const { req, res, getResult } = mockReqRes({ message: 'How does the UPI QR payment work and is it safe?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'payment' &&
      result.data.reply?.includes('UPI'),
      'processChatbotMessage handles payment methods intent'
    );
  }

  // 11. Intent: Customer Care & Helpline
  {
    const { req, res, getResult } = mockReqRes({ message: 'What is customer care phone number or helpline?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'customer_support' &&
      result.data.reply?.includes('1800-836-3687'),
      'processChatbotMessage provides customer care toll-free helpline'
    );
  }

  // 12. Intent: Greetings & Warm Welcome
  {
    const { req, res, getResult } = mockReqRes({ message: 'Hello good morning!', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'greeting' &&
      result.data.reply?.includes('HubBot'),
      'processChatbotMessage greets user and lists capabilities'
    );
  }

  // 13. Vendor Intent: Greeting & Operations Co-Pilot
  {
    const { req, res, getResult } = mockReqRes({ message: 'Hello HubBot!', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.role === 'vendor' &&
      result.data.intent === 'vendor_greeting' &&
      result.data.reply?.includes('Vendor Operations Co-Pilot'),
      'processChatbotMessage boots Vendor Co-Pilot when userRole is vendor'
    );
  }

  // 14. Vendor Intent: Add Product & Listing Checklist
  {
    const { req, res, getResult } = mockReqRes({ message: 'How do I add a product and what are the HSN requirements?', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_add_product' &&
      result.data.reply?.includes('GST slab') &&
      Array.isArray(result.data.actionCards) &&
      result.data.actionCards.length > 0,
      'processChatbotMessage handles vendor product listing checklist'
    );
  }

  // 15. Vendor Intent: Order Dispatch & Waybill
  {
    const { req, res, getResult } = mockReqRes({ message: 'How do I dispatch orders and assign Delhivery courier waybill?', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_orders_dispatch' &&
      result.data.reply?.includes('Delhivery') &&
      result.data.actionCards?.length > 0,
      'processChatbotMessage handles vendor fulfillment & waybill guidance'
    );
  }

  // 16. Vendor Intent: Subscriptions & Commission Tiers
  {
    const { req, res, getResult } = mockReqRes({ message: 'What are the vendor subscription plans and commission rates?', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_subscriptions' &&
      result.data.reply?.includes('Growth Plan') &&
      result.data.reply?.includes('Pro Merchant'),
      'processChatbotMessage details vendor subscription tiers and commission'
    );
  }

  // 17. Vendor Intent: Payouts & Settlement
  {
    const { req, res, getResult } = mockReqRes({ message: 'When will I receive payout and how does settlement work?', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_payouts' &&
      result.data.reply?.includes('T+3'),
      'processChatbotMessage details T+3 bank settlement and commission formula'
    );
  }

  // 18. Vendor Intent: Disputes & Return Defense
  {
    const { req, res, getResult } = mockReqRes({ message: 'A customer raised a return dispute claim for broken item', userRole: 'vendor', userId: 'v1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'vendor_disputes' &&
      result.data.reply?.includes('48-Hour Response Window'),
      'processChatbotMessage provides merchant dispute defense guidance'
    );
  }

  // 19. Role-filtered FAQs
  {
    const req = { query: { role: 'vendor' } };
    let responseData = null;
    let responseStatus = 200;
    const res = {
      status(code) { responseStatus = code; return this; },
      json(data) { responseData = data; return this; }
    };
    await getChatbotFaqs(req, res);
    assert(
      responseStatus === 200 &&
      responseData.success &&
      responseData.faqs.some(f => f.targetRole === 'vendor'),
      'getChatbotFaqs supports role-filtered vendor FAQs'
    );
  }

  console.log(`\n🎉 Results: ${passed}/${total} chatbot verification tests passed!\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
