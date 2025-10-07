// Delete kardesler restaurant
const https = require('https');

const deleteRestaurant = (restaurantId) => {
  const options = {
    hostname: 'masapp-backend.onrender.com',
    port: 443,
    path: `/api/restaurants/${restaurantId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  console.log(`🗑️ Deleting restaurant: ${restaurantId}`);

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
          console.log('🎉 Restaurant deleted successfully!');
        } else {
          console.log('❌ Delete failed:', response.message);
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

  req.end();
};

// Delete kardesler restaurant
deleteRestaurant('15b81eb1-8d11-4345-a315-ddb760940c57');
