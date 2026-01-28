const pool = require('../config/db');

const mealRepository = {
    /**
     * Create a new meal
     */
    async create(userId, { mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated = true }) {
        const result = await pool.query(
            `INSERT INTO meals (user_id, meal_date, meal_type, description, calories, protein, carbs, fat, is_ai_estimated)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             RETURNING *`,
            [userId, mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated]
        );
        return result.rows[0];
    },

    /**
     * Get all meals for a user with optional date filtering
     */
    async getByUserId(userId, { startDate, endDate, mealType } = {}) {
        let query = 'SELECT * FROM meals WHERE user_id = $1';
        const params = [userId];
        let paramCount = 1;

        if (startDate) {
            paramCount++;
            query += ` AND meal_date >= $${paramCount}`;
            params.push(startDate);
        }

        if (endDate) {
            paramCount++;
            query += ` AND meal_date <= $${paramCount}`;
            params.push(endDate);
        }

        if (mealType) {
            paramCount++;
            query += ` AND meal_type = $${paramCount}`;
            params.push(mealType);
        }

        query += ' ORDER BY meal_date DESC, created_at DESC';

        const result = await pool.query(query, params);
        return result.rows;
    },

    /**
     * Get single meal by ID
     */
    async getById(userId, mealId) {
        const result = await pool.query(
            'SELECT * FROM meals WHERE id = $1 AND user_id = $2',
            [mealId, userId]
        );
        return result.rows[0];
    },

    /**
     * Update a meal
     */
    async update(userId, mealId, { mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated }) {
        const result = await pool.query(
            `UPDATE meals 
             SET meal_date = COALESCE($1, meal_date),
                 meal_type = COALESCE($2, meal_type),
                 description = COALESCE($3, description),
                 calories = COALESCE($4, calories),
                 protein = COALESCE($5, protein),
                 carbs = COALESCE($6, carbs),
                 fat = COALESCE($7, fat),
                 is_ai_estimated = COALESCE($8, is_ai_estimated),
                 updated_at = NOW()
             WHERE id = $9 AND user_id = $10
             RETURNING *`,
            [mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated, mealId, userId]
        );
        return result.rows[0];
    },

    /**
     * Delete a meal
     */
    async delete(userId, mealId) {
        const result = await pool.query(
            'DELETE FROM meals WHERE id = $1 AND user_id = $2 RETURNING *',
            [mealId, userId]
        );
        return result.rows[0];
    },

    /**
     * Get nutrition summary for a date range
     */
    async getDailySummary(userId, startDate, endDate) {
        let query = `
            SELECT 
                COUNT(*) as meal_count,
                COALESCE(SUM(calories), 0) as total_calories,
                COALESCE(SUM(protein), 0) as total_protein,
                COALESCE(SUM(carbs), 0) as total_carbs,
                COALESCE(SUM(fat), 0) as total_fat
             FROM meals
             WHERE user_id = $1 AND meal_date >= $2
        `;

        const params = [userId, startDate];

        if (endDate) {
            query += ` AND meal_date <= $3`;
            params.push(endDate);
        } else {
            query += ` AND meal_date <= $2`; // Fallback to single day if no end date
        }

        const result = await pool.query(query, params);
        return result.rows[0];
    },

    /**
     * Get analytics data for charts
     * @param {number} userId - User ID
     * @param {string} period - 'day', 'week', or 'month'
     * @param {string} startDate - Start date (YYYY-MM-DD)
     * @param {string} endDate - End date (YYYY-MM-DD)
     */
    async getAnalyticsData(userId, period, startDate, endDate) {
        let query;

        if (period === 'day') {
            // For single day, group by meal type to show distribution
            query = `
                SELECT 
                    meal_type as label,
                    COALESCE(SUM(calories), 0) as calories,
                    COALESCE(SUM(protein), 0) as protein,
                    COALESCE(SUM(carbs), 0) as carbs,
                    COALESCE(SUM(fat), 0) as fat
                FROM meals
                WHERE user_id = $1 AND meal_date = $2
                GROUP BY meal_type
                ORDER BY 
                    CASE meal_type
                        WHEN 'breakfast' THEN 1
                        WHEN 'lunch' THEN 2
                        WHEN 'dinner' THEN 3
                        WHEN 'snack' THEN 4
                        ELSE 5
                    END
            `;
            const result = await pool.query(query, [userId, startDate]);
            return result.rows;
        } else {
            // For week/month, group by date
            query = `
                SELECT 
                    meal_date as date,
                    COALESCE(SUM(calories), 0) as calories,
                    COALESCE(SUM(protein), 0) as protein,
                    COALESCE(SUM(carbs), 0) as carbs,
                    COALESCE(SUM(fat), 0) as fat
                FROM meals
                WHERE user_id = $1 AND meal_date >= $2 AND meal_date <= $3
                GROUP BY meal_date
                ORDER BY meal_date ASC
            `;
            const result = await pool.query(query, [userId, startDate, endDate]);
            return result.rows;
        }
    }
};

module.exports = mealRepository;
