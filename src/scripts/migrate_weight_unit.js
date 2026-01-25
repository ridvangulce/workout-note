const pool = require('../config/db');

const migrate = async () => {
    try {
        console.log('Starting migration for weight_unit...');

        await pool.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sets' AND column_name='weight_unit') THEN
                    ALTER TABLE sets ADD COLUMN weight_unit VARCHAR(10) DEFAULT 'kg';
                END IF;
            END $$;
        `);
        console.log('Altered table: sets (added weight_unit)');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
