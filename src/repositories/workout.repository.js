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
        `, [userId, workout_date]
    )
    return result.rowCount > 0;
}


const findAllByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT w.id, w.workout_date::text AS workout_date, w.note, count(s.id) as total_sets 
        FROM workouts w
        LEFT JOIN sets s ON w.id = s.workout_id
        WHERE w.user_id = $1
        GROUP BY w.id, w.workout_date, w.note
        ORDER BY w.workout_date DESC
        `, [userId]
    );
    return result.rows;
}

const deleteWorkout = async (workoutId, userId) => {
    // Sets will be deleted via cascade if configured, or we delete manually.
    // Let's delete sets manually to be safe if cascade isn't set up.
    await pool.query('DELETE FROM sets WHERE workout_id = $1', [workoutId]);

    const result = await pool.query(
        'DELETE FROM workouts WHERE id = $1 AND user_id = $2 RETURNING id',
        [workoutId, userId]
    );
    return result.rowCount > 0;
}

const update = async (userId, workoutId, { workout_date, note }) => {
    const result = await pool.query(
        `
        UPDATE workouts
        SET workout_date = $1, note = $2
        WHERE id = $3 AND user_id = $4
        RETURNING *
        `, [workout_date, note, workoutId, userId]
    );
    return result.rows[0];
}

module.exports = { create, findByIdAndUser, existsByUserAndDate, findAllByUser, deleteWorkout, update }