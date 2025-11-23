// Test the backend API endpoints directly
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  console.log('Ì∑™ Testing Backend API...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const healthData = await healthResponse.json();
    console.log('‚úÖ Health check:', healthData);

    // Test registration
    console.log('\n2. Testing user registration...');
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };

    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('‚úÖ Registration successful');
      console.log('   Token received:', !!registerData.token);
      console.log('   User data:', registerData.user);

      // Test login with the same credentials
      console.log('\n3. Testing login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('‚úÖ Login successful');
        console.log('   Token received:', !!loginData.token);

        // Test protected route
        console.log('\n4. Testing protected route...');
        const goalsResponse = await fetch(`${API_BASE}/goals`, {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (goalsResponse.ok) {
          const goalsData = await goalsResponse.json();
          console.log('‚úÖ Goals endpoint working');
          console.log('   Number of goals:', goalsData.length);
        } else {
          console.log('‚ùå Goals endpoint failed:', goalsResponse.status, goalsResponse.statusText);
        }
      } else {
        const errorData = await loginResponse.json();
        console.log('‚ùå Login failed:', loginResponse.status, errorData);
      }
    } else {
      const errorData = await registerResponse.json();
      console.log('‚ùå Registration failed:', registerResponse.status, errorData);
    }

  } catch (error) {
    console.log('‚ùå Test failed - Server might not be running');
    console.log('   Error:', error.message);
    console.log('\nÌ≤° Make sure the backend server is running on port 5000');
  }
}

testBackend();
