const authService = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const userId = req?.user?.id;
        const register = await authService.register(
            email,
            password,
            name,
            userId
        );
        res.status(201).json({ register })
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

const refresh = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        const accessToken = await authService.refresh(refreshToken);
        res.json({ accessToken });
    } catch (err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const refreshToken = req?.cookies?.refreshToken;
        await authService.logout(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
        });
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name } = req.body;
        const updatedUser = await authService.updateProfile(userId, name);
        res.json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
        next(err);
    }
}

const updatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        await authService.updatePassword(userId, currentPassword, newPassword);
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        next(err);
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        await authService.forgotPassword(email);
        // Always return success to prevent email enumeration
        res.json({ message: "If your email exists, you will receive a password reset link" });
    } catch (err) {
        next(err);
    }
}

const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        await authService.resetPassword(token, newPassword);
        res.json({ message: "Password reset successfully" });
    } catch (err) {
        next(err);
    }
}

const verifyResetToken = async (req, res, next) => {
    try {
        const { token } = req.params;
        const result = await authService.verifyResetToken(token);
        res.json(result);
    } catch (err) {
        next(err);
    }
}

module.exports = { register, login, refresh, logout, updateProfile, updatePassword, forgotPassword, resetPassword, verifyResetToken }
