const routineRepo = require("../repositories/routine.repository");
const AppError = require("../errors/AppError");

const createRoutine = async (userId, name, exercises) => {
    if (!name) throw new AppError("Routine name is required", 400);

    const routine = await routineRepo.create(userId, name);

    if (exercises && Array.isArray(exercises)) {
        for (let i = 0; i < exercises.length; i++) {
            await routineRepo.addExercise(routine.id, exercises[i], i);
        }
    }

    return await routineRepo.findById(routine.id);
};

const getUserRoutines = async (userId) => {
    return await routineRepo.findAllByUser(userId);
};

const getRoutine = async (routineId) => {
    const routine = await routineRepo.findById(routineId);
    if (!routine) throw new AppError("Routine not found", 404);
    return routine;
};

const deleteRoutine = async (userId, routineId) => {
    // Validate ownership implicitly via remove query params
    const deleted = await routineRepo.remove(userId, routineId);
    if (!deleted) throw new AppError("Routine not found or access denied", 404);
    return true;
};

const updateRoutine = async (userId, routineId, name, exercises) => {
    if (!name) throw new AppError("Name is required", 400);

    // Update basic info
    const updated = await routineRepo.update(userId, routineId, name);
    if (!updated) throw new AppError("Routine not found or access denied", 404);

    // Update exercises if provided
    if (exercises && Array.isArray(exercises)) {
        await routineRepo.clearExercises(routineId);
        for (let i = 0; i < exercises.length; i++) {
            await routineRepo.addExercise(routineId, exercises[i], i);
        }
    }

    return await routineRepo.findById(routineId);
};

module.exports = { createRoutine, getUserRoutines, getRoutine, deleteRoutine, updateRoutine };
