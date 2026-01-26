const pool = require("../config/db");

async function checkAndCreateTables() {
    try {
        // --- Password Reset Tokens Table ---
        const checkResetTable = await pool.query(`
            SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'password_reset_tokens'
            );
        `);

        if (!checkResetTable.rows[0].exists) {
            console.log('[DB Init] Creating password_reset_tokens table...');

            await pool.query(`
                CREATE TABLE password_reset_tokens (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    token VARCHAR(255) UNIQUE NOT NULL,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT NOW()
                );
            `);

            await pool.query(`
                CREATE INDEX IF NOT EXISTS idx_reset_token ON password_reset_tokens(token);
                CREATE INDEX IF NOT EXISTS idx_reset_user ON password_reset_tokens(user_id);
                CREATE INDEX IF NOT EXISTS idx_reset_expires ON password_reset_tokens(expires_at);
            `);

            console.log('[DB Init] ✅ password_reset_tokens table created');
        } else {
             // console.log('[DB Init] password_reset_tokens table exists');
        }

    } catch (error) {
        console.error('[DB Init] Error checking/creating tables:', error.message);
        // Don't crash process, as database might just be unreachable temporarily
    }
}

module.exports = checkAndCreateTables;
