class AppError extends Error{
    constructor(message, statusCode, details = null) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
        this.details = details; // Optional array of validation errors
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
