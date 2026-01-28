const pool = require('../config/db');

const nutritionGoalRepository = {
    /**
     * Get user's nutrition goals
     */
    async getByUserId(userId) {
        const result = await pool.query(
            'SELECT * FROM nutrition_goals WHERE user_id = $1',
            [userId]
        );
        return result.rows[0];
    },

    /**
     * Create or update nutrition goals
     */
    async upsert(userId, { dailyCalorieTarget, dailyProteinTarget, dailyCarbsTarget, dailyFatTarget, height, weight, gender, age, activityLevel, targetWeight, goalType }) {
        const result = await pool.query(
            `INSERT INTO nutrition_goals (
                user_id, 
                daily_calorie_target, 
                daily_protein_target, 
                daily_carbs_target, 
                daily_fat_target,
                height,
                weight,
                gender,
                age,
                activity_level,
                target_weight,
                goal_type,
                updated_at
            )
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
             ON CONFLICT (user_id) 
             DO UPDATE SET 
                daily_calorie_target = COALESCE($2, nutrition_goals.daily_calorie_target),
                daily_protein_target = COALESCE($3, nutrition_goals.daily_protein_target),
                daily_carbs_target = COALESCE($4, nutrition_goals.daily_carbs_target),
                daily_fat_target = COALESCE($5, nutrition_goals.daily_fat_target),
                height = COALESCE($6, nutrition_goals.height),
                weight = COALESCE($7, nutrition_goals.weight),
                gender = COALESCE($8, nutrition_goals.gender),
                age = COALESCE($9, nutrition_goals.age),
                activity_level = COALESCE($10, nutrition_goals.activity_level),
                target_weight = COALESCE($11, nutrition_goals.target_weight),
                goal_type = COALESCE($12, nutrition_goals.goal_type),
                updated_at = NOW()
             RETURNING *`,
            [userId, dailyCalorieTarget, dailyProteinTarget, dailyCarbsTarget, dailyFatTarget, height, weight, gender, age, activityLevel, targetWeight, goalType]
        );
        return result.rows[0];
    },

    /**
     * Delete nutrition goals
     */
    async delete(userId) {
        const result = await pool.query(
            'DELETE FROM nutrition_goals WHERE user_id = $1 RETURNING *',
            [userId]
        );
        return result.rows[0];
    }
};

module.exports = nutritionGoalRepository;
