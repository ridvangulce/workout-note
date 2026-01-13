const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const AppError = require("../errors/AppError");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new AppError("Invalid or expired token", 401);
    }

    const userId = payload.sub;

    const userResult = await pool.query(
      `SELECT id FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      throw new AppError("Unauthorized", 401);
    }

    req.user = {
      id: userId,
    };

    next();
  } catch (err) {
    next(err);
  }
};
