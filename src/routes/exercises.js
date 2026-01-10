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
        const 
    } catch (err) {
        next(err);
    }
})