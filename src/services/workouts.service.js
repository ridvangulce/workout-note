const workoutRepo = require("../repositories/workout.repository");
const exerciseRepo = require("../repositories/exercise.repository");
const setRepo = require("../repositories/set.repository");
const AppError = require("../errors/AppError");

const createWorkout = async (userId, data) => {
  const { workout_date, note, sets } = data;

  if (!workout_date) {
    throw new AppError("workout_date is required", 400);
  }

  // Allow multiple workouts per day if user wants, or keep unique check. 
  // User might do morning/evening. Let's keep unique check for now or remove if requested.
  // const exists = await workoutRepo.existsByUserAndDate(userId, workout_date);
  // if (exists) {
  //   throw new AppError("Workout already exist for today!", 409);
  // }

  const workout = await workoutRepo.create({
    userId,
    workout_date,
    note: note || null,
  });

  if (sets && sets.length > 0) {
    for (const set of sets) {
      await setRepo.create({
        workout_id: workout.id,
        exercise_id: set.exercise_id,
        set_number: set.set_number || 1,
        weight: set.weight || 0,
        reps: set.reps || 0,
        rir: set.rir || null,
        note: set.note || null,
        weight_unit: set.weight_unit || 'kg'
      });
    }
  }

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
      reps: set.reps,
      weight: set.weight,
      rir: set.rir,
      note: set.note,
      weight_unit: set.weight_unit
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


const getAllWorkouts = async (userId) => {
  return await workoutRepo.findAllByUser(userId);
}

const deleteWorkout = async (userId, workoutId) => {
  const deleted = await workoutRepo.deleteWorkout(workoutId, userId);
  if (!deleted) {
    throw new AppError("Workout not found or access denied", 404);
  }
  return true;
}

const updateWorkout = async (userId, workoutId, data) => {
  const { workout_date, note, sets } = data;

  // 1. Update Workout Meta
  const updatedWorkout = await workoutRepo.update(userId, workoutId, { workout_date, note });
  if (!updatedWorkout) {
    throw new AppError("Workout not found or access denied", 404);
  }

  // 2. Update Sets (Naive approach: Delete all and re-create)
  // Note: ideally we should diff, but for simplicity we replace.
  if (sets) {
    // Delete existing
    await setRepo.deleteByWorkoutId(workoutId);

    // Insert new
    for (const set of sets) {
      await setRepo.create({
        workout_id: workoutId,
        exercise_id: set.exercise_id,
        set_number: set.set_number || 1,
        weight: set.weight || 0,
        reps: set.reps || 0,
        rir: set.rir || null,
        note: set.note || null,
        weight_unit: set.weight_unit || 'kg'
      });
    }
  }

  return updatedWorkout;
}

module.exports = { createWorkout, getWorkoutById, getAllWorkouts, deleteWorkout, updateWorkout };