const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or POSTGRES_URL is missing");
}

const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
// Use SSL for all non-local connections (like Supabase)
const useSSL = !isLocal;

const pool = new Pool({
  connectionString,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});


console.log(`[DB Config] useSSL=${useSSL} ssl=${useSSL ? "ON" : "OFF"}`);


module.exports = pool;
