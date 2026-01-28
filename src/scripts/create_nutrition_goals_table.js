require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
    try {
        console.log("Starting migration: Create nutrition_goals table");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS nutrition_goals (
                user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                daily_calorie_target INTEGER,
                daily_protein_target DECIMAL(6,2),
                daily_carbs_target DECIMAL(6,2),
                daily_fat_target DECIMAL(6,2),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("Migration completed successfully: nutrition_goals table created.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
