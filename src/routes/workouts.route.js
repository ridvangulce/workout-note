const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const workoutController = require("../controllers/workouts.controller");

router.post("/api/workouts", authMiddleware, workoutController.createWorkout) // Matches previous format, consistent
router.get("/api/workouts", authMiddleware, workoutController.getAll);
router.get("/api/workouts/:id", authMiddleware, workoutController.getWorkout);
router.put("/api/workouts/:id", authMiddleware, workoutController.updateWorkout);
router.delete("/api/workouts/:id", authMiddleware, workoutController.deleteWorkout);

module.exports = router;