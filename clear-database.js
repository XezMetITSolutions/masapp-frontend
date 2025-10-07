// Clear all restaurants from PostgreSQL
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://masapp_backend_user:JL5J37jJW4Jup4rutJiYkJ5qjvnIFCSt@dpg-d3imqq2dbo4c73fsa5e0-a.frankfurt-postgres.render.com/masapp_backend',
  ssl: {
    rejectUnauthorized: false
  }
});

async function clearDatabase() {
  try {
    await client.connect();
    console.log('🔗 Connected to PostgreSQL');
    
    // Delete all restaurants
    const result = await client.query('DELETE FROM restaurants');
    console.log(`🗑️ Deleted ${result.rowCount} restaurants`);
    
    // Verify deletion
    const count = await client.query('SELECT COUNT(*) FROM restaurants');
    console.log(`📊 Remaining restaurants: ${count.rows[0].count}`);
    
    console.log('✅ Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

clearDatabase();
