// Simple test script to verify API connectivity
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:3003/api/health');
    const healthData = await healthResponse.text();
    console.log('Health response:', healthData);

    console.log('\nTesting OTP endpoint...');
    const otpResponse = await fetch('http://localhost:3003/api/auth/forgot-password/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mobile: '9769406488' })
    });
    
    const otpData = await otpResponse.text();
    console.log('OTP response status:', otpResponse.status);
    console.log('OTP response:', otpData);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();