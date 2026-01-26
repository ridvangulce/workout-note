const { validationResult } = require('express-validator');
const AppError = require('../errors/AppError');

/**
 * Middleware to check validation results from express-validator
 * Returns 400 with validation errors if any
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value
    }));

    throw new AppError(
      'Validation failed',
      400,
      errorMessages
    );
  }

  next();
};

module.exports = { validateRequest };
