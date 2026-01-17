const workoutRepo = require("../repositories/workout.repository");
const exerciseRepo = require("../repositories/exercise.repository");
const setRepo = require("../repositories/set.repository");
const AppError = require("../errors/AppError");

const createWorkout = async (userId, data) => {
  const { workout_date, note } = data;

  if (!workout_date) {
    throw new AppError("workout_date is required", 400);
  }
  
  const exists = await workoutRepo.existsByUserAndDate(userId, workout_date);
  if (exists) {
    throw new AppError("Workout already exist for today!", 409);
  }

  const workout = await workoutRepo.create({
    userId,
    workout_date,
    note: note || null,
  });

  return workout;
}

const getWorkoutById = async (workoutId, userId) => {
  const workout = await workoutRepo.findByIdAndUser(
    workoutId,
    userId
  )
  if (!workout) {
    throw new AppError("Workout not found", 404);
  }

  const exercises = await exerciseRepo.findByWorkoutId(workoutId);
  if (exercises.length === 0) {
    return { ...workout, exercises: [] };
  }

  const sets = await setRepo.findByWorkoutId(workoutId);

  const setsByExercise = {};

  for (const set of sets) {
    if (!setsByExercise[set.exercise_id]) {
      setsByExercise[set.exercise_id] = [];
    }
    setsByExercise[set.exercise_id].push({
      id: set.id,
      set_number: set.set_number,
      res: set.reps,
      weight: set.weight,
    })
  }
  return {
    ...workout,
    exercises: exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: setsByExercise[ex.id] || [],
    })),
  }
}


module.exports = { createWorkout, getWorkoutById};