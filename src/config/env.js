require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 8080,
    NODE_ENV: process.env.NODE_ENV || "development",
    VERSION: process.env.VERSION || "1.0.0"
}