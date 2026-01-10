const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.post("/exercises", async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            const err = new Error("Username is missing!");
            err.statusCode = 400;
            throw err;
        }
        const result = await pool.query(
            `
            INSERT INTO exercises (user_id, name)
            VALUES($1, $2)
            RETURNING *
            `,[1, name]
        )
        res.status(201).json({
            exercise: result.rows,
        })
    } catch (err) {
        next(err);
    }
})

router.get("/exercises", async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT id, name
            FROM exercises
            WHERE user_id = $1
            ORDER BY name ASC
            `,[1]
        );
        res.json({
            exercises: result.rows,
        });
    } catch (err) {
        next(err);
    }
})

module.exports = router;