const express = require('express');
const path = require('path');
const router = express.Router();

const publicPath = path.join(__dirname, '../../public');

router.get('/', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
router.get('/login', (req, res) => res.sendFile(path.join(publicPath, 'login.html')));
router.get('/register', (req, res) => res.sendFile(path.join(publicPath, 'register.html')));
router.get('/dashboard', (req, res) => res.sendFile(path.join(publicPath, 'dashboard.html')));
router.get('/nutrition', (req, res) => res.sendFile(path.join(publicPath, 'nutrition.html')));
router.get('/workout-log', (req, res) => res.sendFile(path.join(publicPath, 'workout-log.html')));
router.get('/forgot-password', (req, res) => res.sendFile(path.join(publicPath, 'forgot-password.html')));
router.get('/reset-password', (req, res) => res.sendFile(path.join(publicPath, 'reset-password.html')));

module.exports = router;
