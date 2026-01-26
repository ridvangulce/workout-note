const { body } = require('express-validator');

/**
 * Validation rules for user registration
 * Returns translation keys for frontend i18n
 */
const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('validation.email.invalid')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('validation.email.max'),

  body('password')
    .isLength({ min: 8, max: 128 })
    .withMessage('validation.password.length')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('validation.password.strength'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('validation.name.required')
    .isLength({ min: 2, max: 100 })
    .withMessage('validation.name.length')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s'-]+$/)
    .withMessage('validation.name.format')
    .escape(),
];

/**
 * Validation rules for user login
 */
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('validation.email.invalid')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('validation.password.required'),
];

/**
 * Validation rules for profile update
 */
const updateProfileValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('validation.name.required')
    .isLength({ min: 2, max: 100 })
    .withMessage('validation.name.length')
    .matches(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s'-]+$/)
    .withMessage('validation.name.format')
    .escape(),
];

/**
 * Validation rules for password update
 */
const updatePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('validation.password.current_required'),

  body('newPassword')
    .isLength({ min: 8, max: 128 })
    .withMessage('validation.password.length')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('validation.password.strength')
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage('validation.password.different'),
];

module.exports = {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  updatePasswordValidation,
};
