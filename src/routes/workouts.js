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

router.get("/workouts/:id", async (req, res, next) => {
    try {
        const workoutId = req.params.id;
        const workoutResult = await pool.query(
            `
           SELECT id, workout_date::text AS workout_date, note
           FROM workouts
           WHERE id = $1 AND user_id = $2 
           `, [workoutId, 1]
        )
        if (workoutResult.rowCount === 0) {
            const err = new Error("There's no workout belong to this user!")
            err.statusCode = 400;
            throw err;
        }
        const workout = workoutResult.rows[0];
       
        const exerciseResult = await pool.query(
            `
           SELECT DISTINCT e.id, e.name
           FROM exercises e
           JOIN sets s ON s.exercise_id = e.id
           WHERE s.workout_id = $1
           ORDER BY e.name ASC
           `, [workoutId]
        );
        const exercises = exerciseResult.rows;

        if (exerciseResult.rowCount === 0) {
            workout.exercises = [];
            return res.json({ workout });
        }
        const exerciseIds = exercises.map(e => e.id);
        const setResults = await pool.query(
            `
            SELECT id, set_number, weight, reps, workout_id, exercise_id
            FROM sets
            WHERE workout_id = $1 AND exercise_id = ANY($2)
            ORDER BY exercise_id, set_number
            `, [workoutId, exerciseIds]
        )
        
        const setsByExercise = {};
        for (const set of setResults.rows) {
            if (!setsByExercise[set.exercise_id]) {
                setsByExercise[set.exercise_id] = [];
            }

            setsByExercise[set.exercise_id].push({
                id: set.id,
                set_number: set.set_number,
                reps: set.reps,
                weight: set.weight,
            });
        }
        workout.exercises = exercises.map(ex => ({
            id: ex.id,
            name: ex.name,
            sets: setsByExercise[ex.id] || [],
        }));
        res.json({ workout });
    } catch (err) {
        next(err);
    };
});

module.exports = router;