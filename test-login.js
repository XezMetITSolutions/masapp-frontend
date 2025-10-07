// Test login API
const https = require('https');

const testLogin = (username, password) => {
  const loginData = {
    username: username,
    password: password
  };

  const postData = JSON.stringify(loginData);

  const options = {
    hostname: 'masapp-backend.onrender.com',
    port: 443,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  console.log(`🔐 Testing login for: ${username}`);

  const req = https.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('✅ Response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('🎉 Login successful!');
          console.log(`👤 Restaurant: ${response.data.name}`);
          console.log(`🏪 Username: ${response.data.username}`);
          console.log(`🎯 Features: ${response.data.features.join(', ')}`);
        } else {
          console.log('❌ Login failed:', response.message);
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message);
        console.log('📄 Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  req.write(postData);
  req.end();
};

// Test existing restaurant
console.log('=== Testing existing restaurant ===');
testLogin('kardesler', '123456');

// Test with different credentials
setTimeout(() => {
  console.log('\n=== Testing with wrong password ===');
  testLogin('kardesler', 'wrongpassword');
}, 2000);

// Test non-existent restaurant
setTimeout(() => {
  console.log('\n=== Testing non-existent restaurant ===');
  testLogin('nonexistent', '123456');
}, 4000);
