require('dotenv').config();
const pool = require('../config/db');

const createAiLogsTable = async () => {
    const client = await pool.connect();
    try {
        console.log('Creating ai_workout_logs table...');

        await client.query(`
            CREATE TABLE IF NOT EXISTS ai_workout_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                workout_log TEXT NOT NULL,
                analysis TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('ai_workout_logs table created successfully!');
    } catch (err) {
        console.error('Error creating ai_workout_logs table:', err);
    } finally {
        client.release();
        process.exit();
    }
};

createAiLogsTable();
