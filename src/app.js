const express = require("express");
const cors = require("cors");

const logger = require("./middlewares/logger")
const errorHandler = require("./middlewares/error")
const healthRoutes = require("./routes/health.route");
const workoutRoutes = require("./routes/workouts.route");
const exerciseRoutes = require("./routes/exercises.route");
const routineRoutes = require("./routes/routines.route");
const setRoutes = require("./routes/sets.route");
const cookieParser = require("cookie-parser");
const auth = require("./routes/auth.route");
const viewRoutes = require("./routes/views.route");
const integrationRoutes = require("./routes/integration.routes");
const mealRoutes = require("./routes/meal.routes");
const app = express();

app.use(express.json());

// CORS Configuration for Next.js frontend
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

app.use(logger);

// Enable trust proxy for Vercel/proxies
app.set('trust proxy', 1);


const path = require('path');
app.use(viewRoutes);
app.use(express.static(path.join(__dirname, '../public')));
app.use(cookieParser());
app.use('/api/auth', auth); // Public routes first
app.use('/api/integrations', integrationRoutes);
app.use('/api/meals', mealRoutes);

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
