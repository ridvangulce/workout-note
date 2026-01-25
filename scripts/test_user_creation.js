const authService = require('../src/services/auth.service');
const pool = require('../src/config/db');

const verifyUserCreation = async () => {
    const email = `test_user_${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    try {
        console.log(`Creating user with email: ${email}`);
        await authService.register(email, password, name);

        // Get the user
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        const userId = userRes.rows[0].id;
        console.log(`User created with ID: ${userId}`);

        // Check exercises
        const exercisesRes = await pool.query('SELECT name, target_muscle_group, secondary_muscles FROM exercises WHERE user_id = $1', [userId]);
        const exercises = exercisesRes.rows;

        console.log(`Found ${exercises.length} default exercises.`);

        if (exercises.length === 0) {
            console.error('FAILED: No exercises created!');
            process.exit(1);
        }

        const sampleExercise = exercises.find(e => e.name === 'Barbell Bench Press');
        if (sampleExercise) {
            console.log('Sample Exercise (Barbell Bench Press):', sampleExercise);
            if (sampleExercise.target_muscle_group === 'Chest' && sampleExercise.secondary_muscles === 'Triceps, Shoulders') {
                console.log('SUCCESS: Muscle groups assigned correctly.');
            } else {
                console.error('FAILED: Incorrect muscle groups for sample exercise.');
                process.exit(1);
            }
        } else {
            console.error('FAILED: Sample exercise not found.');
            process.exit(1);
        }

    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    } finally {
        await pool.end();
    }
};

verifyUserCreation();
