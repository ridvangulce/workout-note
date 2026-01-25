const pool = require('../config/db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Alter exercises table to add order_index
        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='exercises' AND column_name='order_index') THEN
                    ALTER TABLE exercises ADD COLUMN order_index INT DEFAULT 0;
                END IF;
            END $$;
        `);
        console.log('Altered table: exercises (added order_index)');

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
