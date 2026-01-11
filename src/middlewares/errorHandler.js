const AppError = require("../errors/AppError");
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  // Operational error → client’a gösterilebilir
  if (err.isOperational) {
    return res.status(statusCode).json({
      error: err.message
    });
  }

  // Programmer / unknown error
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    error: "Internal Server Error"
  });
};
