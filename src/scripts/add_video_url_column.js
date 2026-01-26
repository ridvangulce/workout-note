require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
    try {
        console.log("Starting migration: Add video_url to exercises table");

        // Add video_url column if it doesn't exist
        await pool.query(`
            ALTER TABLE exercises 
            ADD COLUMN IF NOT EXISTS video_url TEXT;
        `);

        console.log("Migration completed successfully: video_url column added.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
