const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');
const authMiddleware = require('../middlewares/auth');

// YouTube search (for exercise videos)
router.get('/youtube-search', authMiddleware, integrationController.searchYoutube);

// Gemini AI meal analysis
router.get('/analyze-meal', authMiddleware, integrationController.analyzeMeal);

module.exports = router;
