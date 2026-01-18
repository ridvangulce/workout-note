const pool = require("../config/db");

const register = async (email, hashedPassword) => {
    const result = await pool.query(
        `
        INSERT INTO users(email, password_hash)
        VALUES($1, $2)
        RETURNING *
        `, [email, hashedPassword]
    );
    return result.rows;
}

const checkUser = async (email) => {
    const result = await pool.query(
        `
        SELECT 1
        FROM users
        WHERE email = $1
        LIMIT 1
        `,[email]
    )
    return result.rowCount > 0;
}


module.exports = { register, checkUser };