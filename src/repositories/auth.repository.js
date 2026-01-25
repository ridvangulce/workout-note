const pool = require("../config/db");

const register = async (email, hashedPassword, fullName) => {
    const result = await pool.query(
        `
        INSERT INTO users(email, password_hash, full_name)
        VALUES($1, $2, $3)
        RETURNING *
        `, [email, hashedPassword, fullName]
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
        `, [email]
    )
    return result.rows[0];
}

const getUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT id, email, password_hash, created_at, full_name
        FROM users
        WHERE email = $1
        LIMIT 1
        `, [email]
    );
    return result.rows[0];
}

const saveRefreshToken = async (userId, refreshToken, expiresAt) => {
    const result = await pool.query(
        `
        INSERT INTO refresh_tokens(user_id, token, expires_at)
        VALUES($1, $2, $3)
        RETURNING *
        `, [userId, refreshToken, expiresAt]
    )
    return result.rows[0];
}

const findRefreshToken = async (refreshToken) => {
    const result = await pool.query(
        `
        SELECT user_id, expires_at
        FROM refresh_tokens
        WHERE token = $1
        `, [refreshToken]
    )
    return result.rows[0];
}

const deleteRefreshToken = async (token) => {
    await pool.query(
        `
    DELETE FROM refresh_tokens
    WHERE token = $1
    `,
        [token]
    );
};

const updateProfile = async (userId, name) => {
    const result = await pool.query(
        `
        UPDATE users
        SET full_name = $2
        WHERE id = $1
        RETURNING id, email, full_name
        `, [userId, name]
    );
    return result.rows[0];
};

const updatePassword = async (userId, hashedPassword) => {
    await pool.query(
        `
        UPDATE users
        SET password_hash = $2
        WHERE id = $1
        `, [userId, hashedPassword]
    );
};

const getUserById = async (userId) => {
    const result = await pool.query(
        `
        SELECT id, email, password_hash, full_name
        FROM users
        WHERE id = $1
        LIMIT 1
        `, [userId]
    );
    return result.rows[0];
};

module.exports = { register, checkUser, getUserByEmail, saveRefreshToken, findRefreshToken, deleteRefreshToken, updateProfile, updatePassword, getUserById };