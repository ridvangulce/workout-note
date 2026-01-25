const pool = require('../config/db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // 1. Create routines table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS routines (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Created table: routines');

        // 2. Create routine_exercises table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS routine_exercises (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                routine_id UUID REFERENCES routines(id) ON DELETE CASCADE,
                exercise_id BIGINT REFERENCES exercises(id) ON DELETE CASCADE,
                order_index INT DEFAULT 0
            );
        `);
        console.log('Created table: routine_exercises');

        // 3. Alter sets table to add RIR and note
        // Check if columns exist first to avoid errors
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sets' AND column_name='rir') THEN
                    ALTER TABLE sets ADD COLUMN rir INT;
                END IF;

                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sets' AND column_name='note') THEN
                    ALTER TABLE sets ADD COLUMN note TEXT;
                END IF;
            END $$;
        `);
        console.log('Altered table: sets (added rir, note)');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
