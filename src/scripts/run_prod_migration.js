const { Pool } = require('pg');
require('dotenv').config();

async function migrate() {
    const connectionString = process.env.PROD_DATABASE_URL;

    if (!connectionString) {
        console.error('❌ PROD_DATABASE_URL is not defined in .env');
        process.exit(1);
    }

    console.log('🔌 Connecting to production database...');

    // Disable SSL validation for simplicity if needed, or adjust based on provider requirements
    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully.');

        console.log('🛠 Checking nutrition_goals table for fitness_goal column...');

        const checkColumnQuery = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='nutrition_goals' AND column_name='fitness_goal';
        `;

        const res = await client.query(checkColumnQuery);

        if (res.rows.length === 0) {
            console.log('⚠️ Column fitness_goal missing. Adding it now...');
            await client.query(`
                ALTER TABLE nutrition_goals 
                ADD COLUMN IF NOT EXISTS fitness_goal TEXT;
            `);
            console.log('✅ Column fitness_goal added successfully.');
        } else {
            console.log('✅ Column fitness_goal already exists.');
        }

        console.log('🛠 Checking for ai_workout_logs table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS ai_workout_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                workout_log TEXT NOT NULL,
                analysis TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Checked/Created ai_workout_logs table successfully.');

        client.release();
    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
    }
}

migrate();
