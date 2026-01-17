const express = require("express");
const router = express.Router();
const { VERSION } = require("../config/env");
const pool = require("../config/db");

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/version", (req, res) => {
  res.json({ version: VERSION });
});

router.get("/crash", (req, res, next) => {
    next(new Error("Test Error!"));
})
router.get("/db-health", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT 1 AS ok");
    res.json({ db: "ok", result: result.rows[0] });
  } catch (err) {
    next(err)
  }
})

module.exports = router;
