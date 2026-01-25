const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
    throw new Error("DATABASE_URL or POSTGRES_URL is missing");
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }, // Supabase/Vercel için en stabil
});

module.exports = pool;
