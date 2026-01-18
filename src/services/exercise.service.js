const AppError = require("../errors/AppError");
const exerciseRepo = require("../repositories/exercise.repository");


const createExercise = async (userId, data) => {
    const { name } = data;
    if (!name) {
        throw new AppError("Missing exercise name!", 400);
    }
    const exist = await exerciseRepo.existByName(userId, name);
    if (exist) {
        throw new AppError("This exercise already exist!", 409);
    }

    const exercise = exerciseRepo.create(userId, name);
    return exercise;
}

const getExercises = async (userId) => {
    const exercises = await exerciseRepo.getExercisesById(userId);
    return exercises;
}

module.exports = { createExercise, getExercises };