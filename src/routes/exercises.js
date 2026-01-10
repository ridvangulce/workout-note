const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/exercises", async (req, res, next) => {
    try {
        
    } catch (err) {
        next(err);
    }
})