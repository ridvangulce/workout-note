const express = require('express');
const router = express.Router();
const integrationController = require('../controllers/integration.controller');
const authMiddleware = require('../middlewares/auth');

// Protect the route so only logged-in users can search (preventing API quota abuse)
router.get('/youtube-search', authMiddleware, integrationController.searchYoutube);

module.exports = router;
