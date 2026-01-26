const pool = require("../config/db");

const create = async (userId, name, targetMuscleGroup = null, secondaryMuscles = null, videoUrl = null) => {
    // Get max order_index to append
    const maxOrderRes = await pool.query('SELECT MAX(order_index) as max_order FROM exercises WHERE user_id = $1', [userId]);
    const nextOrder = (maxOrderRes.rows[0].max_order || 0) + 1;

    const result = await pool.query(
        `
        INSERT INTO exercises(name, user_id, order_index, target_muscle_group, secondary_muscles, video_url)
        VALUES($1, $2, $3, $4, $5, $6)
        RETURNING *
        `, [name, userId, nextOrder, targetMuscleGroup, secondaryMuscles, videoUrl]
    );
    return result.rows[0];
}

const getExercisesById = async (userId) => {
    const result = await pool.query(
        `
        SELECT id, name, order_index, target_muscle_group, secondary_muscles, video_url
        FROM exercises
        WHERE user_id = $1
        ORDER BY order_index ASC, id ASC
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
        `, [name, userId]
    )
    return result.rowCount > 0;
}

const update = async (userId, exerciseId, { name, target_muscle_group, secondary_muscles, video_url }) => {
    const result = await pool.query(
        `
        UPDATE exercises
        SET name = COALESCE($1, name),
            target_muscle_group = COALESCE($2, target_muscle_group),
            secondary_muscles = COALESCE($3, secondary_muscles),
            video_url = COALESCE($4, video_url)
        WHERE id = $5 AND user_id = $6
        RETURNING *
        `, [name, target_muscle_group, secondary_muscles, video_url, exerciseId, userId]
    );
    return result.rows[0];
}

const remove = async (userId, exerciseId) => {
    // Delete sets first? Or cascade? Assuming foreign keys have cascade on delete or we handle it gracefully.
    // Given previous migration failures with FKs, let's assume we might need to be careful.
    // But usually DELETE on exercise will fail if sets exist unless cascade is on.
    // For now simple delete.
    const result = await pool.query(
        `
        DELETE FROM exercises
        WHERE id = $1 AND user_id = $2
        RETURNING id
        `, [exerciseId, userId]
    );
    return result.rowCount > 0;
}

const updateOrder = async (userId, exerciseOrder) => {
    // exerciseOrder is array of { id, order }
    // Batch update? Or loop. Loop is simpler for now.
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        for (const item of exerciseOrder) {
            await client.query(
                'UPDATE exercises SET order_index = $1 WHERE id = $2 AND user_id = $3',
                [item.order, item.id, userId]
            );
        }
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}

const createBatch = async (userId, exercises) => {
    if (!exercises || exercises.length === 0) return;

    // Construct param placeholders like ($1, $2, $3, $4, $5)...
    // We need (name, user_id, order_index, target_muscle_group, secondary_muscles)

    const values = [];
    const placeholders = exercises.map((ex, index) => {
        const offset = index * 5;
        // Handle both string array (legacy support) and object array
        const name = typeof ex === 'string' ? ex : ex.name;
        const target = typeof ex === 'string' ? null : ex.target;
        const secondary = typeof ex === 'string' ? null : ex.secondary;

        values.push(name, userId, index + 1, target, secondary);
        return `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`;
    }).join(', ');

    const result = await pool.query(
        `
        INSERT INTO exercises(name, user_id, order_index, target_muscle_group, secondary_muscles)
        VALUES ${placeholders}
        RETURNING *
        `, values
    );
    return result.rows;
}

module.exports = { create, createBatch, getExercisesById, findByWorkoutId, existByName, update, remove, updateOrder };