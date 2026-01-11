const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({
            error: "Missing authorization header!",
        });
    }

    if (!authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            error: "Invalid format!",
        })
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payload.sub,
        }
        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}