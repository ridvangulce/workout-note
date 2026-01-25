const pool = require('../config/db');

const listExercises = async () => {
    try {
        const res = await pool.query('SELECT DISTINCT name FROM exercises');
        console.log(JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listExercises();
