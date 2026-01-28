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
            const { date, startDate, endDate } = req.query;

            // Priority: range (startDate & endDate) > specific date > today
            let start = startDate;
            let end = endDate;

            if (!start) {
                start = date || new Date().toISOString().split('T')[0];
            }
            if (!end && date) {
                end = date;
            }

            const summary = await mealRepository.getDailySummary(userId, start, end);
            const goals = await nutritionGoalRepository.getByUserId(userId);

            res.json({
                startDate: start,
                endDate: end || start,
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

            // Analytics Logic
            // If explicit start/end dates are provided (e.g. from filter), use them.
            // Otherwise, calculate based on period/date.

            const { startDate: queryStartDate, endDate: queryEndDate } = req.query;
            let startDate, endDate, effectivePeriod;

            if (queryStartDate && queryEndDate) {
                // Explicit range provided
                startDate = queryStartDate;
                endDate = queryEndDate;

                // Determine effective period for repository
                // If single day, we want 'day' breakdown (meal types).
                // If multiple days, we want 'custom' (date breakdown).
                if (startDate === endDate) {
                    effectivePeriod = 'day';
                } else {
                    effectivePeriod = 'custom';
                }
            } else {
                // Legacy/Default logic
                effectivePeriod = period;
                const targetDate = date ? new Date(date) : new Date();

                if (period === 'day') {
                    startDate = targetDate.toISOString().split('T')[0];
                    endDate = startDate;
                } else if (period === 'week') {
                    endDate = targetDate.toISOString().split('T')[0];
                    const start = new Date(targetDate);
                    start.setDate(start.getDate() - 6);
                    startDate = start.toISOString().split('T')[0];
                } else if (period === 'month') {
                    endDate = targetDate.toISOString().split('T')[0];
                    const start = new Date(targetDate);
                    start.setDate(start.getDate() - 29);
                    startDate = start.toISOString().split('T')[0];
                } else {
                    return res.status(400).json({ error: 'Invalid period. Use day, week, or month.' });
                }
            }

            const data = await mealRepository.getAnalyticsData(userId, effectivePeriod, startDate, endDate);

            res.json({
                period: effectivePeriod,
                startDate,
                endDate,
                data
            });
        } catch (error) {
            next(error);
        }
    },
    /**
     * Update user profile and recalculate goals
     */
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const { height, weight, gender, age, activityLevel, targetWeight, goalType } = req.body;

            // Calculate Goals immediately (Mifflin-St Jeor Equation)
            let bmr;
            if (gender === 'male') {
                bmr = 10 * weight + 6.25 * height - 5 * age + 5;
            } else {
                bmr = 10 * weight + 6.25 * height - 5 * age - 161;
            }

            const activityMultipliers = {
                'sedentary': 1.2,
                'light': 1.375,
                'moderate': 1.55,
                'active': 1.725,
                'very_active': 1.9
            };

            const multiplier = activityMultipliers[activityLevel] || 1.2;
            const tdee = Math.round(bmr * multiplier);

            let calorieAdjustment = 0;
            if (goalType === 'lose') calorieAdjustment = -500;
            else if (goalType === 'gain') calorieAdjustment = 500;

            const dailyCalorieTarget = Math.max(1200, tdee + calorieAdjustment);

            // Macro Split (Protein 2g/kg, Fat 1g/kg, Rest Carbs)
            const dailyProteinTarget = Math.round(weight * 2.0); // 2g per kg
            const dailyFatTarget = Math.round(weight * 1.0);     // 1g per kg

            // 1g Protein = 4kcal, 1g Fat = 9kcal, 1g Carb = 4kcal
            const caloriesFromProtein = dailyProteinTarget * 4;
            const caloriesFromFat = dailyFatTarget * 9;
            const remainingCalories = dailyCalorieTarget - (caloriesFromProtein + caloriesFromFat);
            const dailyCarbsTarget = Math.max(0, Math.round(remainingCalories / 4));

            const goals = await nutritionGoalRepository.upsert(userId, {
                height,
                weight,
                gender,
                age,
                activityLevel,
                targetWeight,
                goalType,
                dailyCalorieTarget,
                dailyProteinTarget,
                dailyCarbsTarget,
                dailyFatTarget
            });

            res.json({ goals });
        } catch (error) {
            next(error);
        }
    }
};

module.exports = mealController;
