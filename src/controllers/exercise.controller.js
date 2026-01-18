const exerciseService = require("../services/exercise.service");

const createExercise = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const name = req.body;
        const exercise = await exerciseService.createExercise(userId, { name })
        
        res.status(201).json({ exercise });
 } catch (err) {
        next(err);
    };
};

const getExercises = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const exercise = await exerciseService.getExercises(userId);
        return res.status(200).json({ exercise });
    } catch (err) {
        next(err)
    }
}

module.exports = {createExercise, getExercises}