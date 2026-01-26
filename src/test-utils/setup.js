require('dotenv').config();
const pool = require('../config/db');

// Clean database before each test
beforeEach(async () => {
  try {
    // Clear only existing tables (adjust based on your actual schema)
    await pool.query('TRUNCATE refresh_tokens, routines, exercises, users CASCADE');
  } catch (error) {
    // Silently continue if tables don't exist (first run)
  }
});

// Close database connection after all tests
afterAll(async () => {
  await pool.end();
});

// Suppress console.log during tests (optional)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
};
