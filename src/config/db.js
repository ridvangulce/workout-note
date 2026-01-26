const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is missing");
}

const isProduction = process.env.NODE_ENV === "production";
const useSSL = process.env.DB_SSL === "true" || isProduction;

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});


console.log(`[DB Config] useSSL=${useSSL} ssl=${useSSL ? "ON" : "OFF"}`);


module.exports = pool;
