const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();


router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = new Error("email and password required");
            err.statusCode = 400;
            throw err;
        }
        const registerQuery = await pool.query(
            `
            SELECT email
            FROM users
            WHERE email = $1
            `,[email]
        )
        if (registerQuery) {
            const err = new Error("User already exist!");
            err.statusCode = 402;
            throw err;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            `
            INSERT INTO users(email, password_hash)
            VALUES($1, $2)
            `, [email, hashedPassword]
        );
        res.status(201).json({ message: "user registered" });

    } catch (err) {
        next(err);
    }
})


router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            const err = new Error("Email and Password is missing");
            err.statusCode = 400;
            throw err;
        }
        const result = await pool.query(
            `
            SELECT id, email, password_hash
            FROM users
            WHERE email = $1
            `,[email]
        )
        if (result.rowCount === 0) {
            const err = new Error("invalid credentials");
            err.statusCode = 401;
            throw err;
        }
        const user = result.rows[0];

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            const err = new Error("invalid credentials");
            err.statusCode = 401;
            throw err;
        };
        const token = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (err) {
        next(err);
    }
})

module.exports = router;