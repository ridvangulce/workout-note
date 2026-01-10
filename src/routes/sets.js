const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/sets", async (req, res, next) => {
    try {
        const { workout_id, exercise_id, set_number, reps, weight } = req.body;
        if (!reps) {
            const err = new Error("Reps is missing!");
            err.statusCode = 400;
            throw err;
        }
        if (!exercise_id) {
            const err = new Error("Exercise is missing!");
            err.statusCode = 400;
            throw err;
        }
        if (!workout_id) {
            const err = new Error("Workout is missing!");
            err.statusCode = 400;
            throw err;
        }
        if (!set_number) {
            const err = new Error("Set Number is missing!");
            err.statusCode = 400;
            throw err;
        }
        const workoutCheck = await pool.query(
            `
            SELECT id
            FROM workouts
            WHERE id = $1 AND user_id = $2
            `,[workout_id, 1]
        )
         if (workoutCheck.rowCount === 0) {
            const err = new Error("Workout doesn't belong to user!");
            err.statusCode = 403;
            throw err;
        }
        const exerciseCheck = await pool.query(
            `
            SELECT id, name
            FROM exercises
            WHERE id = $1 AND user_id = $2
            `,[exercise_id, 1]
        )
        if (exerciseCheck.rowCount === 0) {
            const err = new Error("Exercise doesn't belong to user!");
            err.statusCode = 403;
            throw err;
        }

        const result = await pool.query(
            `
            INSERT INTO sets (workout_id,exercise_id, set_number, reps, weight)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
            `, [workout_id, exercise_id, set_number, reps, weight || null])
        res.status(201).json({
            set: result.rows,
            exercise: exerciseCheck.rows
        })
    } catch (err) {
        next(err)
    }
})


module.exports = router;