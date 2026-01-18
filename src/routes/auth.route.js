const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const AppError = require("../errors/AppError");
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

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
        const accessToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
        );
        const refreshToken = crypto.randomBytes(64).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await pool.query(
            `
            INSERT INTO refresh_tokens(user_id, token, expires_at)
            VALUES($1, $2, $3)
            RETURNING *
            `,[user.id, refreshToken, expiresAt]
        )
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV ? true : false,
            sameSite: "strict",
            expires: expiresAt,
        });
        res.json({ accessToken });
    } catch (err) {
        next(err);
    }
})

router.post("/refresh", async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new AppError("Unauthorized", 401);
        }
        const result = await pool.query(
            `
            SELECT user_id, expires_at
            FROM refresh_tokens
            WHERE token = $1
            `, [refreshToken]
        );
        const tokenRow = result.rows[0];
        if (new Date(tokenRow.expiresAt) < new Date()) {
             await pool.query(
                `
                DELETE FROM refresh_tokens
                WHERE token = $1
                `,[refreshToken]
            );

            throw new AppError("Unauthorized", 401);
        }
        const newAccessToken = jwt.sign(
        { sub: tokenRow.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        next(err)
    }
})

router.post("/logout", async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(204).end();
        }
        await pool.query(
            `
            DELETE FROM refresh_tokens
            WHERE token = $1
            `, [refreshToken],
        );
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV ? true : false, 
        });
        res.status(204).end();
    } catch (err) {
        next(err)
    }
})

module.exports = router;