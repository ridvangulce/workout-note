const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Jest globalSetup: runs once before the whole test run.
// Ensures the target database exists AND has the schema loaded so that
// integration tests hit real tables instead of failing with 500s.
module.exports = async function globalSetup() {
    const connectionString =
        process.env.DATABASE_URL || process.env.POSTGRES_URL;

    if (!connectionString) {
        throw new Error(
            "[test globalSetup] DATABASE_URL is not set — cannot prepare the test database."
        );
    }

    const isLocal =
        connectionString.includes("localhost") ||
        connectionString.includes("127.0.0.1") ||
        connectionString.includes("@db:") ||
        connectionString.includes("@db-test:");

    const pool = new Pool({
        connectionString,
        ssl: isLocal ? false : { rejectUnauthorized: false },
    });

    // Wait for the database to accept connections (compose starts it in parallel).
    const maxAttempts = 30;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            await pool.query("SELECT 1");
            break;
        } catch (error) {
            if (attempt === maxAttempts) {
                await pool.end();
                throw new Error(
                    `[test globalSetup] Database not reachable after ${maxAttempts} attempts: ${error.message}`
                );
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    // Apply the schema. All files are idempotent (CREATE TABLE IF NOT EXISTS),
    // so the test DB mirrors the Docker/production schema.
    const schemaFiles = [
        path.join(__dirname, "../../database.sql"),
        path.join(__dirname, "../../docker/init/02-extensions.sql"),
    ];
    for (const file of schemaFiles) {
        if (fs.existsSync(file)) {
            await pool.query(fs.readFileSync(file, "utf8"));
        }
    }

    await pool.end();
    // eslint-disable-next-line no-console
    console.log("[test globalSetup] ✅ Test database schema ready");
};
