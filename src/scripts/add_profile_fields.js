require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
    try {
        console.log("Starting migration: Add profile fields to nutrition_goals table");

        // Add columns if they don't exist
        await pool.query(`
            ALTER TABLE nutrition_goals 
            ADD COLUMN IF NOT EXISTS height INTEGER,
            ADD COLUMN IF NOT EXISTS weight DECIMAL(5,2),
            ADD COLUMN IF NOT EXISTS gender VARCHAR(10),
            ADD COLUMN IF NOT EXISTS age INTEGER,
            ADD COLUMN IF NOT EXISTS activity_level VARCHAR(20),
            ADD COLUMN IF NOT EXISTS target_weight DECIMAL(5,2),
            ADD COLUMN IF NOT EXISTS goal_type VARCHAR(20) DEFAULT 'maintain';
        `);

        console.log("Migration completed successfully: Profile fields added.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
