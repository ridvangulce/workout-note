// Quick script to check if password_reset_tokens table exists and create it if needed
require('dotenv').config();
const pool = require('./src/config/db');

async function checkAndCreateTable() {
  try {
    // Check if table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'password_reset_tokens'
      );
    `);

    const tableExists = checkTable.rows[0].exists;
    console.log(`Table password_reset_tokens exists: ${tableExists}`);

    if (!tableExists) {
      console.log('Creating password_reset_tokens table...');

      await pool.query(`
        CREATE TABLE password_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);

      await pool.query(`
        CREATE INDEX idx_reset_token ON password_reset_tokens(token);
        CREATE INDEX idx_reset_user ON password_reset_tokens(user_id);
        CREATE INDEX idx_reset_expires ON password_reset_tokens(expires_at);
      `);

      console.log('✅ Table created successfully!');
    }

    // Check for recent reset tokens
    const tokens = await pool.query(`
      SELECT id, user_id, token, expires_at, used, created_at
      FROM password_reset_tokens
      ORDER BY created_at DESC
      LIMIT 5
    `);

    console.log(`\nRecent password reset tokens: ${tokens.rows.length}`);
    tokens.rows.forEach(t => {
      console.log(`- Token for user ${t.user_id}, created: ${t.created_at}, used: ${t.used}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkAndCreateTable();
