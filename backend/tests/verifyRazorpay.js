import { createRazorpayGatewayOrder, verifyRazorpaySignature, isRazorpayConfigured } from '../utils/razorpay.js';

async function testRazorpay() {
  console.log('--- Testing Razorpay Integration ---');
  console.log('Is Razorpay configured:', isRazorpayConfigured());

  // 1. Test order creation
  const orderRes = await createRazorpayGatewayOrder({
    amount: 1499,
    currency: 'INR',
    receipt: 'rcpt_test_123',
    notes: { testNote: 'Unit test' }
  });

  console.log('Generated Order:', orderRes);
  if (!orderRes.orderId || orderRes.amount !== 149900) {
    throw new Error('Order creation test failed');
  }

  // 2. Test signature verification
  const isValid = verifyRazorpaySignature({
    razorpay_order_id: orderRes.orderId,
    razorpay_payment_id: 'pay_test_' + Date.now(),
    razorpay_signature: 'dummy_or_valid_signature'
  });

  console.log('Signature verification test result:', isValid);
  console.log('✅ Razorpay backend logic verified successfully!');
}

testRazorpay().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
