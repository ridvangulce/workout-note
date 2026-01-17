const pool = require("../config/db");

const findByWorkoutId = async (workoutId) => {
    const result = await pool.query(
        `
        SELECT DISTINCT e.id, e.name
        FROM exercises e
        JOIN sets s ON s.exercise_id = e.id
        WHERE s.workout_id = $1
        ORDER BY e.name ASC
        `, [workoutId]
    )
    return result.rows;
};

module.exports = { findByWorkoutId };