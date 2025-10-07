// Test script to create Kardeşler restaurant
const https = require('https');

const restaurantData = {
  name: "Kardeşler Lokantası",
  username: "kardesler",
  email: "info@kardesler.com", 
  password: "123456",
  phone: "0532 123 45 67",
  address: "İstanbul, Türkiye",
  features: ["qr_menu", "table_management", "basic_reports", "advanced_analytics"]
};

const postData = JSON.stringify(restaurantData);

const options = {
  hostname: 'masapp-backend.onrender.com',
  port: 443,
  path: '/api/restaurants',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('🚀 Creating Kardeşler restaurant...');

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
        console.log('🎉 Restaurant created successfully!');
        console.log(`📍 Restaurant ID: ${response.data.id}`);
        console.log(`👤 Username: ${response.data.username}`);
        console.log(`🎯 Features: ${response.data.features.join(', ')}`);
      } else {
        console.log('❌ Failed to create restaurant:', response.message);
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
