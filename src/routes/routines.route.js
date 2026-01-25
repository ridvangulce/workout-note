const express = require("express");
const router = express.Router();
const routineController = require("../controllers/routine.controller");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

router.post("/api/routines", routineController.create);
router.get("/api/routines", routineController.getAll);
router.get("/api/routines/:id", routineController.getOne);
router.delete("/api/routines/:id", routineController.deleteRoutine);
router.put("/api/routines/:id", routineController.updateRoutine);

module.exports = router;
