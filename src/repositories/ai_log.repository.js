const pool = require('../config/db');

const AiLogRepository = {
    async create({ userId, workoutLog, analysis }) {
        const query = `
            INSERT INTO ai_workout_logs (user_id, workout_log, analysis)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userId, workoutLog, analysis];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async findByUserId(userId) {
        const query = `
            SELECT * FROM ai_workout_logs
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    }
};

module.exports = AiLogRepository;
