require('dotenv').config();
const pool = require('../config/db');

async function migrate() {
    try {
        console.log("Starting migration: Create meals table");

        await pool.query(`
            CREATE TABLE IF NOT EXISTS meals (
                id BIGSERIAL PRIMARY KEY,
                user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
                meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
                description TEXT NOT NULL,
                calories INTEGER,
                protein DECIMAL(6,2),
                carbs DECIMAL(6,2),
                fat DECIMAL(6,2),
                is_ai_estimated BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, meal_date DESC);
        `);

        console.log("Migration completed successfully: meals table created.");
        process.exit(0);
    } catch (err) {
        console.error("Migration failed:", err);
        process.exit(1);
    }
}

migrate();
