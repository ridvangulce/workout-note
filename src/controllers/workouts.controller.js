const workoutsService = require("../services/workouts.service");

const createWorkout = async (req, res, next) => {
  try {
    const { workout_date, note } = req.body;
    const userId = req.user.id;
    const workout = await workoutsService.createWorkout(
      userId,
      { workout_date, note }
    );

    res.status(201).json({ workout });
  } catch (err) {
    next(err)
  }
}

const getWorkout = async (req, res, next) => {
    try {
        const workoutId = req.params.id;
        const userId = req.user.id;
        const workout = await workoutsService.getWorkoutById(
            workoutId,
            userId
        )
        return res.json({workout})
    } catch (err) {
        next(err)
    }
}
module.exports = {createWorkout, getWorkout}