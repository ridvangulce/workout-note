const authRepo = require("../repositories/auth.repository");
const bcrypt = require("bcrypt");
const AppError = require("../errors/AppError");

const register = async (email, password, userId) => {
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
        hashedPassword
    )
    
    return registerQuery;
};

module.exports = { register };
