const exerciseService = require("../services/exercise.service");

const createExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, target_muscle_group, secondary_muscles, video_url } = req.body;
        const exercise = await exerciseService.createExercise(userId, { name, target_muscle_group, secondary_muscles, video_url })

        res.status(201).json({ exercise });
    } catch (err) {
        next(err);
    };
};

const getExercises = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const exercise = await exerciseService.getExercises(userId);
        return res.status(200).json(exercise);
    } catch (err) {
        next(err)
    }
}

const updateExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, target_muscle_group, secondary_muscles, video_url } = req.body;
        const updated = await exerciseService.updateExercise(userId, id, { name, target_muscle_group, secondary_muscles, video_url });
        res.json(updated);
    } catch (err) { next(err); }
};

const deleteExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await exerciseService.deleteExercise(userId, id);
        res.status(204).end();
    } catch (err) { next(err); }
};

const reorderExercises = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { orderedIds } = req.body; // Array of IDs
        await exerciseService.reorderExercises(userId, orderedIds);
        res.status(200).json({ message: 'Order updated' });
    } catch (err) { next(err); }
};

module.exports = { createExercise, getExercises, updateExercise, deleteExercise, reorderExercises }