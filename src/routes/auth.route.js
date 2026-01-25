const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const AppError = require("../errors/AppError");
const authController = require("../controllers/auth.controller");
const authenticateJWT = require("../middlewares/auth");

router.post("/register", authController.register);

router.post("/login", authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);

router.put('/profile', authenticateJWT, authController.updateProfile);
router.put('/password', authenticateJWT, authController.updatePassword);

module.exports = router;