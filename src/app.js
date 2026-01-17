const express = require("express");

const logger = require("./middlewares/logger")
const errorHandler = require("./middlewares/error")
const healthRoutes = require("./routes/health.route");
const workoutRoutes = require("./routes/workouts.route");
const exerciseRoutes = require("./routes/exercises.route");
const setRoutes = require("./routes/sets.route");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.route");
const app = express();

app.use(express.json());
app.use(logger);
app.use(cookieParser());
app.use(healthRoutes);

app.use(workoutRoutes);

app.use(exerciseRoutes);

app.use(setRoutes);

app.use(auth)

app.use(errorHandler);


module.exports = app;