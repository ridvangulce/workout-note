const pool = require("../config/db");

const findByWorkoutId = async (workoutId) => {
    const result = await pool.query(
        `
    SELECT id, exercise_id, set_number, reps, weight, rir, note, weight_unit
    FROM sets
    WHERE workout_id = $1
    ORDER BY exercise_id, set_number        
    `, [workoutId]
    )
    return result.rows;
};

const deleteByWorkoutId = async (workoutId) => {
    await pool.query('DELETE FROM sets WHERE workout_id = $1', [workoutId]);
}

const create = async ({ workout_id, exercise_id, set_number, weight, reps, rir, note, weight_unit }) => {
    const result = await pool.query(
        `
        INSERT INTO sets(workout_id, exercise_id, set_number, weight, reps, rir, note, weight_unit)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
        `, [workout_id, exercise_id, set_number, weight, reps, rir, note, weight_unit || 'kg']
    );
    return result.rows[0];
}

module.exports = { findByWorkoutId, create, deleteByWorkoutId };