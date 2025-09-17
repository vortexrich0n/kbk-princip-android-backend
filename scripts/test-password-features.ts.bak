import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';
let authToken = '';

async function testLogin() {
  console.log('\n📝 Testing Login...');
  const response = await fetch(`${BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hybridbrothersw@gmail.com',
      password: 'Admin123!'
    })
  });

  const data = await response.json();

  if (response.ok && data.token) {
    authToken = data.token;
    console.log('✅ Login successful');
    return true;
  } else {
    console.error('❌ Login failed:', data);
    return false;
  }
}

async function testChangePassword() {
  console.log('\n🔐 Testing Change Password...');

  const response = await fetch(`${BASE_URL}/api/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      currentPassword: 'Admin123!',
      newPassword: 'Admin123!New'
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Password changed successfully');

    // Change it back
    const revertResponse = await fetch(`${BASE_URL}/api/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        currentPassword: 'Admin123!New',
        newPassword: 'Admin123!'
      })
    });

    if (revertResponse.ok) {
      console.log('✅ Password reverted back');
    }
    return true;
  } else {
    console.error('❌ Change password failed:', data);
    return false;
  }
}

async function testForgotPassword() {
  console.log('\n📧 Testing Forgot Password...');

  const response = await fetch(`${BASE_URL}/api/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'hybridbrothersw@gmail.com'
    })
  });

  const data = await response.json();

  if (response.ok) {
    console.log('✅ Password reset email sent (check your inbox)');
    console.log('Response:', data);
    return true;
  } else {
    console.error('❌ Forgot password failed:', data);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Password Features Tests...\n');

  try {
    await testLogin();
    await testChangePassword();
    await testForgotPassword();

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

runTests();