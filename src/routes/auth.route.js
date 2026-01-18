const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const router = express.Router();
const crypto = require("crypto");
const AppError = require("../errors/AppError");
const authController = require("../controllers/auth.controller");

router.post("/register", authController.register);

router.post("/login", authController.login);

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