const pool = require('../config/db');

const migrate = async () => {
    try {
        console.log('Starting migration: Adding muscle groups to exercises...');

        await pool.query(`
            ALTER TABLE exercises 
            ADD COLUMN IF NOT EXISTS target_muscle_group TEXT,
            ADD COLUMN IF NOT EXISTS secondary_muscles TEXT;
        `);

        console.log('Migration successful: Columns added.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
