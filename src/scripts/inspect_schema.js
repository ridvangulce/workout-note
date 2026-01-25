const pool = require('../config/db');

const inspectSchema = async () => {
    try {
        const tables = ['users', 'exercises', 'routines', 'workouts', 'sets', 'workout_logs'];

        for (const table of tables) {
            const res = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);

            if (res.rows.length > 0) {
                console.log(`\nTable: ${table}`);
                res.rows.forEach(row => console.log(`  - ${row.column_name} (${row.data_type})`));
            } else {
                console.log(`\nTable: ${table} (DOES NOT EXIST)`);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

inspectSchema();
