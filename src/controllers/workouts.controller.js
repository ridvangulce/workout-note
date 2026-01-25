const workoutsService = require("../services/workouts.service");

const createWorkout = async (req, res, next) => {
  try {
    const { workout_date, note, sets } = req.body;
    const userId = req.user.id;
    const workout = await workoutsService.createWorkout(
      userId,
      { workout_date, note, sets }
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
    return res.json({ workout })
  } catch (err) {
    next(err)
  }
}
const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const workouts = await workoutsService.getAllWorkouts(userId);
    res.status(200).json(workouts);
  } catch (err) { next(err); }
}

const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    await workoutsService.deleteWorkout(userId, id);
    res.status(204).end();
  } catch (err) { next(err); }
}

const updateWorkout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { workout_date, note, sets } = req.body;
    const updated = await workoutsService.updateWorkout(userId, id, { workout_date, note, sets });
    res.json(updated);
  } catch (err) { next(err); }
}

module.exports = { createWorkout, getWorkout, getAll, deleteWorkout, updateWorkout }