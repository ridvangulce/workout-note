const rateLimit = require('express-rate-limit');

// Disable rate limiting in test environment
const isTestEnv = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;

// No-op middleware for test environment
const noopLimiter = (req, res, next) => next();

/**
 * Rate limiter for login endpoint
 * 5 attempts per 15 minutes per IP
 */
const loginLimiter = isTestEnv ? noopLimiter : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for registration endpoint
 * 3 attempts per hour per IP
 */
const registerLimiter = isTestEnv ? noopLimiter : rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  message: 'Too many registration attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for password update/reset
 * 3 attempts per hour per IP
 */
const passwordLimiter = isTestEnv ? noopLimiter : rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 requests per windowMs
  message: 'Too many password change attempts, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
const apiLimiter = isTestEnv ? noopLimiter : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  passwordLimiter,
  apiLimiter,
};
