-- Extra tables/columns beyond the core schema (database.sql).
-- Mirrors the idempotent migrations in src/scripts/*.js so a fresh Docker
-- database comes up fully featured (nutrition, meals, AI logs, video URLs).

-- Nutrition goals + health profile fields
-- (create_nutrition_goals_table.js + add_profile_fields.js + add_fitness_goal_column.js)
CREATE TABLE IF NOT EXISTS nutrition_goals (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    daily_calorie_target INTEGER,
    daily_protein_target DECIMAL(6,2),
    daily_carbs_target DECIMAL(6,2),
    daily_fat_target DECIMAL(6,2),
    height INTEGER,
    weight DECIMAL(5,2),
    gender VARCHAR(10),
    age INTEGER,
    activity_level VARCHAR(20),
    target_weight DECIMAL(5,2),
    goal_type VARCHAR(20) DEFAULT 'maintain',
    fitness_goal TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Meals (create_meals_table.js)
CREATE TABLE IF NOT EXISTS meals (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    description TEXT NOT NULL,
    calories INTEGER,
    protein DECIMAL(6,2),
    carbs DECIMAL(6,2),
    fat DECIMAL(6,2),
    is_ai_estimated BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, meal_date DESC);

-- AI workout analysis logs (create_ai_logs_table.js)
CREATE TABLE IF NOT EXISTS ai_workout_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    workout_log TEXT NOT NULL,
    analysis TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exercise demonstration video (add_video_url_column.js)
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS video_url TEXT;
