const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const mealController = require('../controllers/meal.controller');

// All routes require authentication
router.use(authMiddleware);

// Meal CRUD
router.post('/', mealController.createMeal);
router.get('/', mealController.getMeals);
router.get('/summary', mealController.getDailySummary);
router.get('/analytics', mealController.getAnalytics);
router.get('/:id', mealController.getMealById);
router.put('/:id', mealController.updateMeal);
router.delete('/:id', mealController.deleteMeal);

// Nutrition goals
router.post('/goals', mealController.setGoals);

module.exports = router;
