const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const AppError = require("../errors/AppError");

router.post("/sets", async (req, res, next) => {
    try {
        const { workout_id, exercise_id, set_number, reps, weight } = req.body;
        if (!reps) {
            throw new AppError("Reps is missing!", 400);
        }
        if (!exercise_id) {
            throw new AppError("Exercise is missing!", 400);
        }
        if (!workout_id) {
            throw new AppError("Workout is missing!", 400);
        }
        if (!set_number) {
            throw new AppError("Set Number is missing!", 400);
        }
        const workoutCheck = await pool.query(
            `
            SELECT id
            FROM workouts
            WHERE id = $1 AND user_id = $2
            `,[workout_id, 1]
        )
         if (workoutCheck.rowCount === 0) {
            throw new AppError("Workout doesn't belong to user!", 403);
        }
        const exerciseCheck = await pool.query(
            `
            SELECT id, name
            FROM exercises
            WHERE id = $1 AND user_id = $2
            `,[exercise_id, 1]
        )
        if (exerciseCheck.rowCount === 0) {
            throw new AppError("Exercise doesn't belong to user!", 403);
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