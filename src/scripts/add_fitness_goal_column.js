require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
    try {
        console.log("Starting migration: Add fitness_goal column to nutrition_goals table");

        await pool.query(`
            ALTER TABLE nutrition_goals 
            ADD COLUMN IF NOT EXISTS fitness_goal TEXT;
        `);

        console.log("Migration completed successfully: fitness_goal column added.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
