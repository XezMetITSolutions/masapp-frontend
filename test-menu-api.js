// Test menu API endpoints
const https = require('https');

const testMenuAPI = (method, path, data = null) => {
  const options = {
    hostname: 'masapp-backend.onrender.com',
    port: 443,
    path: path,
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    const postData = JSON.stringify(data);
    options.headers['Content-Length'] = Buffer.byteLength(postData);
  }

  console.log(`🔍 Testing: ${method} ${path}`);

  const req = https.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('✅ Response:', JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('📄 Raw response:', responseData);
      }
      console.log('---\n');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request error:', error.message);
  });

  if (data) {
    req.write(JSON.stringify(data));
  }
  
  req.end();
};

// Test restaurant ID
const restaurantId = 'f6811f51-c0b4-4a81-bbb9-6d1a1da3803f';

// Test GET categories
testMenuAPI('GET', `/api/restaurants/${restaurantId}/menu/categories`);

// Wait and test POST category
setTimeout(() => {
  testMenuAPI('POST', `/api/restaurants/${restaurantId}/menu/categories`, {
    name: 'Test Kategori',
    description: 'Test açıklama',
    order: 1
  });
}, 2000);

// Wait and test GET categories again
setTimeout(() => {
  testMenuAPI('GET', `/api/restaurants/${restaurantId}/menu/categories`);
}, 4000);
