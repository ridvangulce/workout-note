const fs = require("fs");
const path = require("path");
const AppError = require("../errors/AppError");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const logDir = path.join(__dirname, "../../logs");
  const logFile = path.join(logDir, "error.log");

  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url} | ${status} | ${err.message}\n`;

  fs.appendFile(logFile, logLine, (fsErr) => {
    if (fsErr) {
      console.error("Log Yazılamadı:", fsErr);
    }
  });

  if (err.isOperational) {
    return res.status(status).json({
      error: err.message,
    });
  }
  
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
};
