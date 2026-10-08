import assert from 'assert';
import { processChatbotMessage } from '../controllers/chatbotController.js';

function mockReqRes(body, query = {}) {
  let result = { status: 200, data: null };
  const req = { body, query };
  const res = {
    status(code) {
      result.status = code;
      return this;
    },
    json(data) {
      result.data = data;
      return this;
    }
  };
  return { req, res, getResult: () => result };
}

async function runExpandedTests() {
  console.log('🤖 Running Comprehensive Expanded Chatbot Queries Tests...\n');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}`);
      console.error(err);
    }
  }

  // 1. Customer Account / Registration query
  await test('handles customer registration and password query', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'how do i register or reset my password?', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer' && r.intent === 'customer_account');
  });

  // 2. Local Store Directory query
  await test('handles local store directory query across cities', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'are there any local stores in chennai or bangalore?', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer' && r.intent === 'customer_stores');
  });

  // 3. Wishlist & Comparison query
  await test('handles wishlist and specs comparison matrix query', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'how do i compare products side by side and use wishlist', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer' && r.intent === 'customer_compare');
  });

  // 4. Voice Assistant query
  await test('handles voice assistant and speech mode instructions', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'how do i use voice assistant mode and speech to text', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer' && r.intent === 'customer_voice_guide');
  });

  // 5. Vendor Onboarding & Registration query
  await test('handles vendor onboarding and documents required', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'how to register as vendor and what documents to sell', userRole: 'vendor' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'vendor' && r.intent === 'vendor_onboarding');
  });

  // 6. Vendor Rating SLA query
  await test('handles vendor ratings and customer reviews query', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'how do customer ratings and seller review scores work?', userRole: 'vendor' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'vendor' && r.intent === 'vendor_ratings');
  });

  // 7. Conversational Courtesies
  await test('handles polite courtesies and gratitude smoothly', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'thank you so much for your help!', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer' && (r.intent === 'customer_courtesy' || r.intent === 'courtesy'));
  });

  // 8. Semantic FAQ Match on informal question
  await test('handles informal question via weighted semantic FAQ matching', async () => {
    const { req, res, getResult } = mockReqRes({ message: 'what if the courier guy is late delivering parcel', userRole: 'customer' });
    await processChatbotMessage(req, res);
    const r = getResult().data;
    assert(r.success && r.role === 'customer');
    assert(r.reply.includes('Delivery') || r.reply.includes('Fulfillment') || r.reply.includes('Tracking'));
  });

  console.log(`\n🎉 Results: ${passed}/${total} expanded chatbot query tests passed!\n`);
  process.exit(passed === total ? 0 : 1);
}

runExpandedTests();
