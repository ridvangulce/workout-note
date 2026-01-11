const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const AppError = require("../errors/AppError");

router.post("/register", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new AppError("E-mail and password required", 400)
        }
        const registerQuery = await pool.query(
            `
            SELECT email
            FROM users
            WHERE email = $1
            `,[email]
        )
        if (registerQuery.rowCount > 0) {
            throw new AppError("User already exist!", 409);
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
            throw new AppError("Email and Password is missing", 400)
        }
        const result = await pool.query(
            `
            SELECT id, email, password_hash
            FROM users
            WHERE email = $1
            `,[email]
        )
        if (result.rowCount === 0) {
            throw new AppError("Invalid credentials", 401)
        }
        const user = result.rows[0];

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new AppError("Invalid credentials", 401)
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