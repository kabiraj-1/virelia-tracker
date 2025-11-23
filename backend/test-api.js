// Simple test script to verify API endpoints
import fetch from 'node-fetch';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('��� Testing Virelia Tracker API...\n');
    
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test auth endpoints
    console.log('\n2. Testing authentication...');
    
    // Try to register a test user
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    
    console.log('   Registering test user...');
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful');
      
      // Test goals endpoint with the new token
      console.log('\n3. Testing goals endpoint...');
      const goalsResponse = await fetch(`${API_BASE}/goals`, {
        headers: { 
          'Authorization': `Bearer ${registerData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json();
        console.log('✅ Goals endpoint working. User has', goalsData.length, 'goals');
      } else {
        console.log('❌ Goals endpoint failed:', goalsResponse.status);
      }
    } else {
      console.log('❌ Registration failed:', registerResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();
