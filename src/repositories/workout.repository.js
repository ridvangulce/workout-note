const pool = require("../config/db");

const create = async ({ userId, workout_date, note }) => {
    const result = await pool.query(
        `
        INSERT INTO workouts(user_id, workout_date, note)
        VALUES($1, $2, $3)
        RETURNING id, workout_date::text AS workout_date, note
        `, [userId, workout_date, note]
    )
    return result.rows[0];
}

const findByIdAndUser = async (workoutId, userId) => {
    const result = await pool.query(
        `
        SELECT id, workout_date::text AS workout_date, note
        FROM workouts
        WHERE id = $1 AND user_id = $2
        `, [workoutId, userId]
    );
    return result.rows[0] || null;
}

const existsByUserAndDate = async (userId, workout_date) => {
    const result = await pool.query(
        `
        SELECT 1
        FROM workouts
        WHERE user_id = $1 AND workout_date = $2
        LIMIT 1
        `,[userId, workout_date]
    )
    return result.rowCount > 0;
}


module.exports={create, findByIdAndUser, existsByUserAndDate}