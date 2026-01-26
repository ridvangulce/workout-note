const authRepo = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const crypto = require("crypto");
const AppError = require("../errors/AppError");
const emailService = require("./email.service");

const exerciseRepo = require("../repositories/exercise.repository");
const defaultExercises = require("../constants/defaultExercises");

const register = async (email, password, fullName, userId) => {
    if (userId) {
        throw new AppError("User already logged in!", 402);
    }
    if (!email) {
        throw new AppError("Email is missing!", 404);
    }
    if (!password) {
        throw new AppError("Password is missing!", 404);
    }
    const checkUser = await authRepo.checkUser(email);
    if (checkUser) {
        throw new AppError("User already exist!", 401);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const registerQuery = await authRepo.register(
        email,
        hashedPassword,
        fullName
    );

    // Seed Default Exercises
    if (registerQuery && registerQuery[0]) {
        const newUserId = registerQuery[0].id;
        await exerciseRepo.createBatch(newUserId, defaultExercises);
    }

    return registerQuery;
};

const login = async (userId, email, password) => {
    if (userId) throw new AppError("User already logged in!", 400);
    if (!email) throw new AppError("Email is required!", 400);
    if (!password) throw new AppError("Password is required!", 400);

    const user = await authRepo.getUserByEmail(email);
    if (!user) {
        console.error(`[AUTH DEBUG] Login failed: User not found for email ${email}`);
        throw new AppError("Invalid credentials!", 401);
    }
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        console.error(`[AUTH DEBUG] Login failed: Password mismatch for user ${email}`);
        throw new AppError("Invalid credentials!", 401);
    }

    const accessToken = jwt.sign(
        { sub: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await authRepo.saveRefreshToken(user.id, refreshToken, expiresAt);

    return {
        accessToken,
        refreshToken,
        expiresAt,
        user: { id: user.id, email: user.email, name: user.full_name }
    };
};

const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Unauthorized", 401);
    }
    const tokenRow = await authRepo.findRefreshToken(refreshToken);
    if (!tokenRow) {
        throw new AppError("Unauthorized", 401);
    }
    if (new Date(tokenRow.expires_at) < new Date()) {
        await authRepository.deleteRefreshToken(refreshToken);
        throw new AppError("Unauthorized", 401);
    }
    return jwt.sign(
        { sub: tokenRow.user_id },
        process.env.JWT_SECRET,
        { expiresIn: "10m" }
    );
}

const logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError("Unauthorized!", 401);
    }
    await authRepo.deleteRefreshToken(refreshToken);
}


const updateProfile = async (userId, name) => {
    if (!name) throw new AppError("Name is required", 400);
    const user = await authRepo.updateProfile(userId, name);
    return { id: user.id, email: user.email, name: user.full_name };
}

const updatePassword = async (userId, currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) throw new AppError("All fields required", 400);

    const user = await authRepo.getUserById(userId);
    if (!user) throw new AppError("User not found", 404);

    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) throw new AppError("Incorrect current password", 401);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await authRepo.updatePassword(userId, hashedPassword);
}

const forgotPassword = async (email) => {
    // Find user by email
    const user = await authRepo.getUserByEmail(email);
    if (!user) {
        // Don't reveal if user exists or not for security
        return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    // Save token to database
    await authRepo.savePasswordResetToken(user.id, resetToken, expiresAt);

    // Send email
    await emailService.sendPasswordResetEmail(email, resetToken);
}

const resetPassword = async (token, newPassword) => {
    // Find token in database
    const resetToken = await authRepo.findPasswordResetToken(token);
    if (!resetToken) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
        throw new AppError('Reset token has expired', 400);
    }

    // Check if token was already used
    if (resetToken.used) {
        throw new AppError('Reset token has already been used', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await authRepo.updatePassword(resetToken.user_id, hashedPassword);

    // Mark token as used
    await authRepo.markPasswordResetTokenAsUsed(token);
}

const verifyResetToken = async (token) => {
    const resetToken = await authRepo.findPasswordResetToken(token);
    if (!resetToken) {
        return { valid: false, message: 'Invalid token' };
    }

    if (new Date(resetToken.expires_at) < new Date()) {
        return { valid: false, message: 'Token expired' };
    }

    if (resetToken.used) {
        return { valid: false, message: 'Token already used' };
    }

    return { valid: true };
}

module.exports = { register, login, refresh, logout, updateProfile, updatePassword, forgotPassword, resetPassword, verifyResetToken };
