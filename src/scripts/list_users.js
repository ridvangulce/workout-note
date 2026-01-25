const pool = require('../config/db');

const listUsers = async () => {
    try {
        const res = await pool.query('SELECT id, email FROM users');
        console.log('Current Users:', res.rows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

listUsers();
