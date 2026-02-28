// Simple test script to verify axios can connect to the server
// Run this with: node test-connection.js

const axios = require('axios');

const API_BASE_URL = 'http://13.60.249.27/api/v1';

console.log('========================================');
console.log('TESTING CONNECTION TO SERVER');
console.log('========================================');
console.log('Server URL:', API_BASE_URL);
console.log('');

async function testConnection() {
  try {
    console.log('Attempting to login with test credentials...');
    
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
    
    console.log('✅ SUCCESS!');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    console.log('');
    console.log('Server is working correctly!');
    
  } catch (error) {
    console.log('❌ FAILED!');
    
    if (error.response) {
      console.log('Server responded with error:');
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received from server');
      console.log('Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testConnection();
