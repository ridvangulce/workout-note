const exerciseRepo = require("../repositories/exercise.repository");
const AppError = require("../errors/AppError");

const createExercise = async (userId, { name, target_muscle_group, secondary_muscles, video_url }) => {
    if (!name) {
        throw new AppError("Name is missing!", 404);
    }
    const isExerciseExist = await exerciseRepo.existByName(userId, name);
    if (isExerciseExist) {
        throw new AppError("Exercise already exist!", 409);
    }
    const exercise = await exerciseRepo.create(userId, name, target_muscle_group, secondary_muscles, video_url);
    return exercise;
};

const getExercises = async (userId) => {
    const exercises = await exerciseRepo.getExercisesById(userId);
    return exercises;
};

const updateExercise = async (userId, exerciseId, data) => {
    const updated = await exerciseRepo.update(userId, exerciseId, data);
    if (!updated) throw new AppError("Exercise not found or not authorized", 404);
    return updated;
};

const deleteExercise = async (userId, exerciseId) => {
    const deleted = await exerciseRepo.remove(userId, exerciseId);
    if (!deleted) throw new AppError("Exercise not found or not authorized", 404);
    return true;
};

const reorderExercises = async (userId, orderedIds) => {
    // orderedIds is array of exercise IDs in the desired order
    const orderMap = orderedIds.map((id, index) => ({ id, order: index }));
    await exerciseRepo.updateOrder(userId, orderMap);
    return true;
};

module.exports = { createExercise, getExercises, updateExercise, deleteExercise, reorderExercises };