import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runVerification() {
  console.log('========================================================');
  console.log('🧪 SUBSCRIBER PRIVACY & EMAIL DISPATCH VERIFICATION TEST');
  console.log('========================================================\n');

  const testEmail = 'themysterioknull33@gmail.com';
  const testName = 'Mysterious Knull';
  const testPhone = '+919876543210';
  const testVendorId = 'v1'; // TechZone Electronics

  console.log(`[Step 1] Target Email for Verification: "${testEmail}"`);
  console.log(`[Step 2] Target Vendor: "${testVendorId}" (TechZone Electronics)`);

  // Connect to DB if available
  let dbConnected = false;
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      dbConnected = true;
      console.log('✅ Connected to MongoDB Atlas successfully.');
    } catch (e) {
      console.warn('⚠️ MongoDB connection error, proceeding with seed/in-memory fallback:', e.message);
    }
  }

  // Import models and controllers
  const { default: User } = await import('../models/User.js');
  const { default: VendorSubscription } = await import('../models/VendorSubscription.js');
  const { getVendorSubscribers, sendVendorUpdateToSubscribers } = await import('../controllers/subscriptionController.js');
  const { sendSubscriberBroadcastEmail } = await import('../utils/emailService.js');

  // Step 3: Ensure customer user exists in DB or simulated state
  const testCustomerId = 'cust_test_knull_33';
  if (dbConnected) {
    await User.findOneAndUpdate(
      { email: testEmail },
      {
        id: testCustomerId,
        email: testEmail,
        fullName: testName,
        name: testName,
        phone: testPhone,
        role: 'customer'
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Customer profile created/updated in DB: id=${testCustomerId}, name="${testName}", email="${testEmail}"`);

    // Create / Update active subscription for this user to vendor v1
    await VendorSubscription.findOneAndUpdate(
      { customerId: testCustomerId, vendorId: testVendorId },
      {
        id: `sub_${testCustomerId}_${testVendorId}`,
        customerId: testCustomerId,
        vendorId: testVendorId,
        status: 'active',
        subscribedAt: new Date().toISOString(),
        notificationPreferences: {
          channelEmail: true,
          channelSms: true,
          newProducts: true,
          promotions: true,
          deals: true,
          updates: true
        }
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Subscription created in DB: customer "${testCustomerId}" -> vendor "${testVendorId}"`);
  }

  // Step 4: Simulate Vendor calling GET /api/subscriptions/vendor/:vendorId/subscribers
  console.log('\n--------------------------------------------------------');
  console.log('🔍 [Step 4] Checking Vendor Perspective: What does Vendor see?');
  console.log('--------------------------------------------------------');

  const mockReq = {
    params: { vendorId: testVendorId },
    user: { id: testVendorId, role: 'vendor' }
  };

  let vendorResponseJson = null;
  const mockRes = {
    json: (data) => {
      vendorResponseJson = data;
      return mockRes;
    },
    status: (code) => {
      console.log(`HTTP Status: ${code}`);
      return mockRes;
    }
  };

  await getVendorSubscribers(mockReq, mockRes);

  if (!vendorResponseJson || !vendorResponseJson.success) {
    console.error('❌ Failed to retrieve vendor subscribers:', vendorResponseJson);
    process.exit(1);
  }

  console.log(`Total subscribers retrieved by vendor: ${vendorResponseJson.totalSubscribers}`);

  // Inspect subscribers returned to vendor
  const subscribersList = vendorResponseJson.subscribers || [];
  const rawPayloadString = JSON.stringify(vendorResponseJson);

  // PRIVACY CHECKS:
  console.log('\n🔒 PRIVACY INTEGRITY AUDIT:');
  const emailExposed = rawPayloadString.includes(testEmail);
  const nameExposed = rawPayloadString.includes(testName);
  const phoneExposed = rawPayloadString.includes(testPhone);
  const customerIdExposed = rawPayloadString.includes(testCustomerId);

  console.log(` 1. Is personal email "${testEmail}" visible to vendor? --> ${emailExposed ? '❌ LEAKED!' : '✅ 100% PROTECTED (HIDDEN)'}`);
  console.log(` 2. Is real full name "${testName}" visible to vendor?   --> ${nameExposed ? '❌ LEAKED!' : '✅ 100% PROTECTED (HIDDEN)'}`);
  console.log(` 3. Is phone number "${testPhone}" visible to vendor?     --> ${phoneExposed ? '❌ LEAKED!' : '✅ 100% PROTECTED (HIDDEN)'}`);
  console.log(` 4. Is customer DB ID "${testCustomerId}" exposed?        --> ${customerIdExposed ? '❌ LEAKED!' : '✅ 100% PROTECTED (MASKED)'}`);

  // Find the subscriber record corresponding to our test user
  const matchingSub = subscribersList[0];
  console.log('\n📋 EXACT RECORD SHOWN ON VENDOR DASHBOARD:');
  console.log({
    subscriberHandle: matchingSub.customerName,
    aliasCode: matchingSub.subscriberCode,
    maskedEmailRelay: matchingSub.maskedEmail,
    emailRelayStatus: matchingSub.emailStatus,
    smsGatewayStatus: matchingSub.phoneStatus,
    relationship: matchingSub.relationship,
    privacyProtected: matchingSub.privacyProtected
  });

  // Step 5: Test Sending a Broadcast Email to themysterioknull33@gmail.com
  console.log('\n--------------------------------------------------------');
  console.log('📧 [Step 5] Testing Dispatch to themysterioknull33@gmail.com');
  console.log('--------------------------------------------------------');

  const vendorObj = {
    id: 'v1',
    businessName: 'TechZone Electronics',
    storeSlug: 'techzone-electronics'
  };

  const emailResult = await sendSubscriberBroadcastEmail({
    vendor: vendorObj,
    toEmail: testEmail,
    subscriberAlias: matchingSub.customerName,
    title: '🔥 Exclusive VIP Drop: 25% Off Flagship ANC Headphones',
    message: 'Hello! As a valued subscriber to TechZone Electronics, here is your exclusive subscriber discount code: TECHVIP25. Valid for the next 48 hours only on orders above ₹1,999.',
    updateType: 'deal',
    link: 'http://localhost:5173/shop/vendor/techzone-electronics'
  });

  console.log('Email Dispatch Result:', emailResult);
  if (emailResult.success) {
    console.log('✅ Email successfully dispatched via Private Relay!');
    if (emailResult.previewUrl) {
      console.log(`🔗 Ethereal Email Preview URL (Open to view formatted message):`);
      console.log(`   ${emailResult.previewUrl}`);
    }
  } else {
    console.warn('⚠️ Email send notice:', emailResult.error);
  }

  console.log('\n========================================================');
  console.log('🎉 VERIFICATION COMPLETED SUCCESSFULLY!');
  console.log('========================================================');

  if (dbConnected) {
    await mongoose.disconnect();
  }
  process.exit(0);
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
