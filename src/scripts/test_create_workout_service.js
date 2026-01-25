const service = require('../services/workouts.service');
const pool = require('../config/db');

async function test() {
    try {
        console.log("Creating workout...");
        const workout = await service.createWorkout(1, {
            workout_date: new Date().toISOString(),
            note: "Test Workout Script",
            sets: [
                {
                    exercise_id: 10,
                    set_number: 1,
                    weight: 100,
                    reps: 10,
                    rir: 2,
                    note: "Easy",
                    weight_unit: "kg"
                }
            ]
        });
        console.log("Workout Created:", workout);

        console.log("Verifying sets...");
        const res = await pool.query("SELECT * FROM sets WHERE workout_id = $1", [workout.id]);
        console.log("Sets Found:", res.rows);

    } catch (e) {
        console.error(e);
    } finally {
        pool.end();
    }
}

test();
