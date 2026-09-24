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
  console.log('🤖 Running HubBot Chatbot Verification Tests...\n');
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
    assert(result.status === 200 && result.data.success && result.data.faqs.length >= 6, 'getChatbotFaqs returns curated FAQ dictionary');
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

  // 5. Intent: Product Recommendation
  {
    const { req, res, getResult } = mockReqRes({ message: 'Can you recommend any wireless headphones or accessories?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'product_recommendation' &&
      Array.isArray(result.data.actionCards) &&
      result.data.actionCards.length > 0,
      'processChatbotMessage returns product recommendations'
    );
  }

  // 6. Intent: Vendor & Storefront Help
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

  // 7. Intent: Payment Methods
  {
    const { req, res, getResult } = mockReqRes({ message: 'How does the UPI QR payment work?', userId: 'c1' });
    await processChatbotMessage(req, res);
    const result = getResult();
    assert(
      result.status === 200 &&
      result.data.intent === 'payment' &&
      result.data.reply?.includes('UPI'),
      'processChatbotMessage handles payment methods intent'
    );
  }

  console.log(`\n🎉 Results: ${passed}/${total} chatbot tests passed!\n`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error in tests:', err);
  process.exit(1);
});
