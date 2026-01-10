const { Pool } = require("pg");
const { NODE_ENV } = require("./env");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
        NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
});

module.exports = pool;