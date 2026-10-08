import http from 'http';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const reqHeaders = {
      'Content-Type': 'application/json',
      ...headers
    };
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING REGISTRATION & SECURITY APPROVAL CODE TESTS ---');

  const testCustomerEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = 'Password@123';

  // 1. Register Customer
  console.log('\n[1] Registering new customer:', testCustomerEmail);
  const regCustRes = await request('POST', '/api/auth/register-customer', {
    email: testCustomerEmail,
    password: testPassword,
    fullName: 'Ananya Deshmukh',
    mobile: '9876543210',
    city: 'Pune'
  });

  console.log('Customer registration status:', regCustRes.status);
  console.log('Requires verification:', regCustRes.body?.requiresVerification);
  console.log('Demo verification code:', regCustRes.body?.demoCode);
  if (!regCustRes.body?.requiresVerification || !regCustRes.body?.demoCode) {
    throw new Error('Registration should return requiresVerification: true and demoCode');
  }

  const verificationCode = regCustRes.body.demoCode;

  // 2. Attempt login BEFORE verification
  console.log('\n[2] Attempting login before verification...');
  const preLoginRes = await request('POST', '/api/auth/login', {
    type: 'customer',
    email: testCustomerEmail,
    password: testPassword
  });
  console.log('Pre-verification login requiresVerification:', preLoginRes.body?.requiresVerification);
  if (!preLoginRes.body?.requiresVerification) {
    throw new Error('Pre-verification login should be gated and require verification!');
  }

  // If login generated a fresh code, update verificationCode
  const latestVerificationCode = preLoginRes.body?.demoCode || verificationCode;

  // 3. Attempt verification with WRONG code
  console.log('\n[3] Testing verification with invalid code (000000)...');
  const wrongCodeRes = await request('POST', '/api/auth/verify-registration', {
    email: testCustomerEmail,
    code: '000000',
    type: 'customer'
  });
  console.log('Wrong code response status:', wrongCodeRes.status, wrongCodeRes.body?.message);
  if (wrongCodeRes.status !== 400) {
    throw new Error('Expected 400 for wrong verification code');
  }

  // 4. Verify with CORRECT code
  console.log(`\n[4] Verifying with correct code (${latestVerificationCode})...`);
  const correctCodeRes = await request('POST', '/api/auth/verify-registration', {
    email: testCustomerEmail,
    code: latestVerificationCode,
    type: 'customer'
  });
  console.log('Verification status:', correctCodeRes.status);
  console.log('Verified user email:', correctCodeRes.body?.user?.email);
  console.log('Is email verified:', correctCodeRes.body?.user?.isEmailVerified);
  console.log('JWT Token received:', Boolean(correctCodeRes.body?.token));
  if (!correctCodeRes.body?.token || !correctCodeRes.body?.user?.isEmailVerified) {
    throw new Error('Verification failed to return token and verified user');
  }

  // 5. Attempt login AFTER verification
  console.log('\n[5] Attempting login after verification...');
  const postLoginRes = await request('POST', '/api/auth/login', {
    type: 'customer',
    email: testCustomerEmail,
    password: testPassword
  });
  console.log('Post-verification login status:', postLoginRes.status, postLoginRes.body?.message);
  console.log('Post-verification login token received:', Boolean(postLoginRes.body?.token));
  if (!postLoginRes.body?.token) {
    throw new Error('Post-verification login failed');
  }

  // 6. Test Vendor Registration Workflow
  const testVendorEmail = `test.vendor.${Date.now()}@example.com`;
  console.log('\n[6] Registering new vendor:', testVendorEmail);
  const regVendRes = await request('POST', '/api/auth/register-vendor', {
    email: testVendorEmail,
    password: testPassword,
    businessName: 'Shiv Organic Farms',
    ownerName: 'Shivaji Rao',
    mobile: '9123456780',
    location: 'Nashik'
  });
  console.log('Vendor registration status:', regVendRes.status);
  console.log('Vendor requires verification:', regVendRes.body?.requiresVerification);
  console.log('Vendor demo code:', regVendRes.body?.demoCode);
  if (!regVendRes.body?.requiresVerification || !regVendRes.body?.demoCode) {
    throw new Error('Vendor registration should require verification');
  }

  // 7. Verify vendor with code
  console.log(`\n[7] Verifying vendor with code (${regVendRes.body.demoCode})...`);
  const verifyVendRes = await request('POST', '/api/auth/verify-registration', {
    email: testVendorEmail,
    code: regVendRes.body.demoCode,
    type: 'vendor'
  });
  console.log('Vendor verification status:', verifyVendRes.status);
  console.log('Vendor verified token received:', Boolean(verifyVendRes.body?.token));
  if (!verifyVendRes.body?.token) {
    throw new Error('Vendor verification failed');
  }

  console.log('\n=== ALL REGISTRATION & APPROVAL VERIFICATION TESTS PASSED! ===');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
