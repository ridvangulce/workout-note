const express = require("express");

const logger = require("./middlewares/logger")
const errorHandler = require("./middlewares/error")
const healthRoutes = require("./routes/health.route");
const workoutRoutes = require("./routes/workouts.route");
const exerciseRoutes = require("./routes/exercises.route");
const routineRoutes = require("./routes/routines.route");
const setRoutes = require("./routes/sets.route");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.route");
const app = express();

app.use(express.json());
app.use(logger);
const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use('/api/auth', auth); // Public routes first

app.use(healthRoutes);
app.use(workoutRoutes); // These define their own /api/ paths
app.use(exerciseRoutes);
app.use(setRoutes);

// Fix routine routes mounting to prevent middleware leak
// Remove /api prefix from route file if mounting here, OR keep root mount but put AFTER public routes
// Best practice: Mount at path. But route file has /api/routines in it?
// Let's rely on ordering for now: Public First.
app.use(routineRoutes);

app.use(errorHandler);


module.exports = app;