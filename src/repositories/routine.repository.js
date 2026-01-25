const pool = require("../config/db");

const create = async (userId, name) => {
    const result = await pool.query(
        `
        INSERT INTO routines(user_id, name)
        VALUES($1, $2)
        RETURNING *
        `, [userId, name]
    );
    return result.rows[0];
};

const addExercise = async (routineId, exerciseId, orderIndex) => {
    const result = await pool.query(
        `
        INSERT INTO routine_exercises(routine_id, exercise_id, order_index)
        VALUES($1, $2, $3)
        RETURNING *
        `, [routineId, exerciseId, orderIndex]
    );
    return result.rows[0];
};

const findAllByUser = async (userId) => {
    const result = await pool.query(
        `
        SELECT r.*, 
               json_agg(
                   json_build_object(
                       'id', e.id,
                       'name', e.name,
                       'order', re.order_index
                   ) ORDER BY re.order_index
               ) FILTER (WHERE e.id IS NOT NULL) as exercises
        FROM routines r
        LEFT JOIN routine_exercises re ON r.id = re.routine_id
        LEFT JOIN exercises e ON re.exercise_id = e.id
        WHERE r.user_id = $1
        GROUP BY r.id
        ORDER BY r.created_at DESC
        `, [userId]
    );
    return result.rows;
};

const findById = async (routineId) => {
    const result = await pool.query(
        `
        SELECT r.*, 
               json_agg(
                   json_build_object(
                       'id', e.id,
                       'name', e.name,
                       'order', re.order_index
                   ) ORDER BY re.order_index
               ) FILTER (WHERE e.id IS NOT NULL) as exercises
        FROM routines r
        LEFT JOIN routine_exercises re ON r.id = re.routine_id
        LEFT JOIN exercises e ON re.exercise_id = e.id
        WHERE r.id = $1
        GROUP BY r.id
        `, [routineId]
    );
    return result.rows[0];
};

const remove = async (userId, routineId) => {
    // Delete links first
    await pool.query('DELETE FROM routine_exercises WHERE routine_id = $1', [routineId]);

    // Delete routine
    const result = await pool.query(
        'DELETE FROM routines WHERE id = $1 AND user_id = $2 RETURNING id',
        [routineId, userId]
    );
    return result.rowCount > 0;
};

const update = async (userId, routineId, name) => {
    const result = await pool.query(
        'UPDATE routines SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
        [name, routineId, userId]
    );
    return result.rows[0];
};

const clearExercises = async (routineId) => {
    await pool.query('DELETE FROM routine_exercises WHERE routine_id = $1', [routineId]);
};

module.exports = { create, addExercise, findAllByUser, findById, remove, update, clearExercises };
