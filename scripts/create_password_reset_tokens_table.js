require('dotenv').config();
const pool = require('../src/config/db');

async function createTable() {
  try {
    console.log('Checking for password_reset_tokens table...');

    // Check if table exists
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'password_reset_tokens'
      );
    `);

    const tableExists = checkTable.rows[0].exists;

    if (tableExists) {
      console.log('ℹ️ Table password_reset_tokens already exists.');
    } else {
      console.log('Creating password_reset_tokens table...');

      await pool.query(`
        CREATE TABLE password_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await pool.query(`
        CREATE INDEX idx_reset_token ON password_reset_tokens(token);
        CREATE INDEX idx_reset_user ON password_reset_tokens(user_id);
        CREATE INDEX idx_reset_expires ON password_reset_tokens(expires_at);
      `);

      console.log('✅ Table password_reset_tokens created successfully!');
    }

  } catch (error) {
    console.error('❌ Error creating table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createTable();
