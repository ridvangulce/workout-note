const mealRepository = require('../repositories/meal.repository');
const nutritionGoalRepository = require('../repositories/nutritionGoal.repository');

const mealController = {
    /**
     * Create a new meal
     */
    async createMeal(req, res, next) {
        try {
            const userId = req.user.id;
            const { mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated } = req.body;

            const meal = await mealRepository.create(userId, {
                mealDate,
                mealType,
                description,
                calories,
                protein,
                carbs,
                fat,
                isAiEstimated
            });

            res.status(201).json({ meal });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get user's meals with optional filters
     */
    async getMeals(req, res, next) {
        try {
            const userId = req.user.id;
            const { startDate, endDate, mealType } = req.query;

            const meals = await mealRepository.getByUserId(userId, {
                startDate,
                endDate,
                mealType
            });

            res.json({ meals });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get single meal
     */
    async getMealById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const meal = await mealRepository.getById(userId, id);

            if (!meal) {
                return res.status(404).json({ error: 'Meal not found' });
            }

            res.json({ meal });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update a meal
     */
    async updateMeal(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { mealDate, mealType, description, calories, protein, carbs, fat, isAiEstimated } = req.body;

            const meal = await mealRepository.update(userId, id, {
                mealDate,
                mealType,
                description,
                calories,
                protein,
                carbs,
                fat,
                isAiEstimated
            });

            if (!meal) {
                return res.status(404).json({ error: 'Meal not found' });
            }

            res.json({ meal });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Delete a meal
     */
    async deleteMeal(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const meal = await mealRepository.delete(userId, id);

            if (!meal) {
                return res.status(404).json({ error: 'Meal not found' });
            }

            res.json({ message: 'Meal deleted successfully', meal });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get daily nutrition summary
     */
    async getDailySummary(req, res, next) {
        try {
            const userId = req.user.id;
            const { date } = req.query;
            const summaryDate = date || new Date().toISOString().split('T')[0];

            const summary = await mealRepository.getDailySummary(userId, summaryDate);
            const goals = await nutritionGoalRepository.getByUserId(userId);

            res.json({
                date: summaryDate,
                summary,
                goals: goals || null
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Set nutrition goals
     */
    async setGoals(req, res, next) {
        try {
            const userId = req.user.id;
            const { dailyCalorieTarget, dailyProteinTarget, dailyCarbsTarget, dailyFatTarget } = req.body;

            const goals = await nutritionGoalRepository.upsert(userId, {
                dailyCalorieTarget,
                dailyProteinTarget,
                dailyCarbsTarget,
                dailyFatTarget
            });

            res.json({ goals });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get analytics data for charts
     */
    async getAnalytics(req, res, next) {
        try {
            const userId = req.user.id;
            const { period = 'week', date } = req.query;

            // Calculate date range based on period
            const targetDate = date ? new Date(date) : new Date();
            let startDate, endDate;

            if (period === 'day') {
                // Single day
                startDate = targetDate.toISOString().split('T')[0];
                endDate = startDate;
            } else if (period === 'week') {
                // Last 7 days
                endDate = targetDate.toISOString().split('T')[0];
                const start = new Date(targetDate);
                start.setDate(start.getDate() - 6);
                startDate = start.toISOString().split('T')[0];
            } else if (period === 'month') {
                // Last 30 days
                endDate = targetDate.toISOString().split('T')[0];
                const start = new Date(targetDate);
                start.setDate(start.getDate() - 29);
                startDate = start.toISOString().split('T')[0];
            } else {
                return res.status(400).json({ error: 'Invalid period. Use day, week, or month.' });
            }

            const data = await mealRepository.getAnalyticsData(userId, period, startDate, endDate);

            res.json({
                period,
                startDate,
                endDate,
                data
            });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = mealController;
