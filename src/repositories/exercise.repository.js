const pool = require("../config/db");

const create = async (userId, name) => {
    const result = await pool.query(
        `
        INSERT INTO exercises(name, user_id)
        VALUES($1, $2)
        RETURNING *
        `, [name, userId]
    );
    return result.rows[0];
}
const getExercisesById = async (userId) => {
    const result = await pool.query(
        `
        SELECT name
        FROM exercises
        WHERE user_id = $1
        `, [userId]
    );
    return result.rows;
}


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

const existByName = async (userId, name) => {
    const result = await pool.query(
        `
        SELECT 1
        FROM exercises
        WHERE name = $1 AND user_id = $2
        LIMIT 1
        `,[name, userId]
    )
    return result.rowCount > 0;
}

module.exports = { create, getExercisesById, findByWorkoutId, existByName};