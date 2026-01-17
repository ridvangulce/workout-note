const pool = require("../config/db");

const findByWorkoutId = async (workoutId) => {
    const result = await pool.query(
        `
    SELECT id, exercise_id, set_number, reps, weight
    FROM sets
    WHERE workout_id = $1
    ORDER BY exercise_id, set_number        
    `, [workoutId]
    )
    return result.rows;
};

module.exports = { findByWorkoutId };