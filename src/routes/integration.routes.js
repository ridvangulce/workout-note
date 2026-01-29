const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');
const authMiddleware = require('../middlewares/auth');

// YouTube search (for exercise videos)
router.get('/youtube-search', authMiddleware, integrationController.searchYoutube);

// Gemini AI meal analysis
router.get('/analyze-meal', authMiddleware, integrationController.analyzeMeal);

// Gemini AI trainer workout evaluation
router.post('/evaluate-workout', authMiddleware, integrationController.evaluateWorkout);

// Get AI workout history
router.get('/ai-trainer/history', authMiddleware, integrationController.getWorkoutHistory);

module.exports = router;
