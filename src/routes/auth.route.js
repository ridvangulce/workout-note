const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validation");
const { loginLimiter, registerLimiter, passwordLimiter } = require("../middlewares/rateLimiter");
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} = require("../middlewares/validators");

// Public routes with validation and rate limiting
router.post("/register", registerLimiter, registerValidation, validateRequest, authController.register);
router.post("/login", loginLimiter, loginValidation, validateRequest, authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", authController.logout);

// Protected routes with authentication and validation
router.put('/profile', authMiddleware, updateProfileValidation, validateRequest, authController.updateProfile);
router.put('/password', authMiddleware, passwordLimiter, updatePasswordValidation, validateRequest, authController.updatePassword);

// Password reset routes (public)
router.post('/forgot-password', passwordLimiter, forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', passwordLimiter, resetPasswordValidation, validateRequest, authController.resetPassword);
router.get('/verify-reset-token/:token', authController.verifyResetToken);

module.exports = router;
