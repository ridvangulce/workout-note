// List users to find a valid email for testing
require('dotenv').config();
const pool = require('./src/config/db');

async function listUsers() {
  try {
    const result = await pool.query('SELECT id, email, full_name, created_at FROM users ORDER BY created_at DESC LIMIT 5');

    console.log(`\nFound ${result.rows.length} recent users:\n`);
    result.rows.forEach(user => {
      console.log(`ID: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.full_name}`);
      console.log(`Created: ${user.created_at}`);
      console.log('---');
    });

    if (result.rows.length === 0) {
      console.log('No users found. Try registering a test user first!');
      console.log('\nExample:');
      console.log('curl -X POST http://localhost:8080/api/auth/register \\');
      console.log('  -H "Content-Type: application/json" \\');
      console.log('  -d \'{"email":"test@example.com","password":"Test123!@","name":"Test User"}\'');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

listUsers();
