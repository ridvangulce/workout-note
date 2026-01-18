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

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const userId = req?.user?.id;

        const result = await authService.login(userId, email, password);

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: result.expiresAt,
        });

        return res.status(200).json({
            accessToken: result.accessToken,
            user: result.user,
        });
    } catch (err) {
        next(err);
    }
};


module.exports = {register, login}