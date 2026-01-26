const fs = require("fs");
const path = require("path");

module.exports = (err, req, res, next) => {
  const status = err.statusCode || 500;

  // Vercel serverless ortamında dosyaya yazmak sorun çıkarır.
  // Local'de dosyaya yaz, Vercel'de sadece console'a yaz.
  const isVercel = !!process.env.VERCEL;

  if (!isVercel) {
    const logDir = path.join(process.cwd(), "logs");
    const logFile = path.join(logDir, "error.log");

    try {
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url} | ${status} | ${err.message}\n`;

      fs.appendFileSync(logFile, logLine);
    } catch (fsErr) {
      console.error("Log Yazılamadı:", fsErr);
    }
  }

  // Vercel logs'a düşer
  console.error(`[ERROR] ${req.method} ${req.url} | ${status} | ${err.message}`);
  if (err.stack) console.error(err.stack);

  if (err.isOperational) {
    const response = {
      error: err.message,
    };

    // Include validation details if present
    if (err.details) {
      response.details = err.details;
    }

    return res.status(status).json(response);
  }

  return res.status(500).json({
    error: "Internal Server Error",
  });
};
