const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();
const exerciseController = require("../controllers/exercise.controller");


router.post("/api/exercises", authMiddleware, exerciseController.createExercise);
router.get("/api/exercises", authMiddleware, exerciseController.getExercises);
router.put("/api/exercises/:id", authMiddleware, exerciseController.updateExercise);
router.delete("/api/exercises/:id", authMiddleware, exerciseController.deleteExercise);
router.post("/api/exercises/reorder", authMiddleware, exerciseController.reorderExercises);

module.exports = router;