const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const exerciseController = require("../controllers/exercise.controller");


router.post("/exercises", authMiddleware, exerciseController.createExercise);
router.get("/exercises", authMiddleware, exerciseController.getExercises)

module.exports = router;