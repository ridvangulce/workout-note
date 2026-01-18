const authService = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const { email, password} = req.body;
        const userId = req?.user?.id;
        const register = await authService.register(
            email,
            password,
            userId
        );
        res.status(201).json({register})
    } catch (err) {
        next(err)
    }
}


module.exports = {register}