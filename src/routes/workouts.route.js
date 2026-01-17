const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const workoutController = require("../controllers/workouts.controller");

router.post("/workouts", authMiddleware, workoutController.createWorkout)

router.get("/workouts/:id", authMiddleware, workoutController.getWorkout);

module.exports = router;