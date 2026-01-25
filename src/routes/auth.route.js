const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const AppError = require("../errors/AppError");
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh", authController.refresh)

router.post("/logout", authController.logout)

module.exports = router;