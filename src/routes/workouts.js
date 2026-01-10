const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/workouts", async (req, res, next) => {
    try {
        const { workout_date, note } = req.body;

        if (!workout_date) {
            const err = new Error("workout_date is required!");
            err.statusCode = 400;
            throw err;
        }

        const result = await pool.query(
            `
            INSERT INTO workouts(user_id, workout_date, note)
            VALUES($1, $2, $3)
            RETURNING *
            `,
            [1, workout_date, note || null]
        );
        res.status(201).json({
            workout: result.rows[0],
        })
    } catch (err) {
        next(err);
    }
})

router.get("/workouts", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page || "1", 10);
        const limit = parseInt(req.query.limit || "10", 10);
        const offset = (page - 1) * limit;
        const result = await pool.query(`
            SELECT w.id, w.workout_date::text AS workout_date, w.note
            FROM workouts w
            WHERE w.user_id = $1
            ORDER BY workout_date ASC
            LIMIT $2 OFFSET $3
            `, [1, limit, offset]);
        res.json({
            page,
            limit,
            workouts: result.rows,
        })
    } catch (err) {
        next(err);
    }
})
module.exports = router;