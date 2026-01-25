const routineService = require("../services/routine.service");

const create = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, exercises } = req.body; // exercises is array of IDs
        const routine = await routineService.createRoutine(userId, name, exercises);
        res.status(201).json(routine);
    } catch (error) {
        next(error);
    }
};

const getAll = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const routines = await routineService.getUserRoutines(userId);
        res.status(200).json(routines);
    } catch (error) {
        next(error);
    }
};

const getOne = async (req, res, next) => {
    try {
        const { id } = req.params;
        const routine = await routineService.getRoutine(id);
        res.status(200).json(routine);
    } catch (error) {
        next(error);
    }
};

const deleteRoutine = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        await routineService.deleteRoutine(userId, id);
        res.status(204).end();
    } catch (error) { next(error); }
};

const updateRoutine = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, exercises } = req.body;
        const updated = await routineService.updateRoutine(userId, id, name, exercises);
        res.json(updated);
    } catch (error) { next(error); }
};

module.exports = { create, getAll, getOne, deleteRoutine, updateRoutine };
