const express = require("express");

const logger = require("./middlewares/logger")
const errorHandler = require("./middlewares/error")
const healthRoutes = require("./routes/health");
const workoutRoutes = require("./routes/workouts");
const exerciseRoutes = require("./routes/exercises");
const setRoutes = require("./routes/sets");
const app = express();

app.use(express.json());

app.use(logger);

app.use(healthRoutes);

app.use(workoutRoutes);

app.use(exerciseRoutes);

app.use(setRoutes);

app.use(errorHandler);

module.exports = app;