const pool = require('../config/db');

const EXERCISE_MAPPING = [
    { keywords: ['bench press', 'push-up', 'flys', 'chest press', 'pec deck', 'dips'], target: 'Chest', secondary: 'Triceps, Shoulders' },
    { keywords: ['pull-up', 'lat pull', 'chin-up', 'rows', 'seated row', 'face pull', 'back extension'], target: 'Back', secondary: 'Biceps, Shoulders' },
    { keywords: ['shoulder press', 'lateral raise', 'front raise', 'ohp', 'overhead press'], target: 'Shoulders', secondary: 'Triceps' },
    { keywords: ['squat', 'leg press', 'leg extension', 'lunges', 'split squat'], target: 'Quads', secondary: 'Glutes, Hamstrings' },
    { keywords: ['deadlift', 'leg curl', 'rdl'], target: 'Hamstrings', secondary: 'Glutes, Back' },
    { keywords: ['bicep curl', 'hammer curl', 'preacher curl', 'machine biceps', 'biceps'], target: 'Biceps', secondary: 'Forearms' },
    { keywords: ['tricep pushdown', 'skullcrusher', 'tricep extension', 'triceps'], target: 'Triceps', secondary: 'Shoulders' },
    { keywords: ['calf raise'], target: 'Calves', secondary: '' },
    { keywords: ['plank', 'crunch', 'leg raise', 'russian twist', 'abs'], target: 'Abs', secondary: '' },
    { keywords: ['farmers walk'], target: 'Forearms', secondary: 'Shoulders, Back' }
];

const migrate = async () => {
    try {
        console.log('Starting migration: Auto-populating muscle groups...');

        const res = await pool.query('SELECT id, name FROM exercises WHERE target_muscle_group IS NULL');
        const exercises = res.rows;

        let updatedCount = 0;

        for (const ex of exercises) {
            const name = ex.name.toLowerCase();
            let mapping = EXERCISE_MAPPING.find(m => m.keywords.some(k => name.includes(k)));

            if (mapping) {
                await pool.query(
                    'UPDATE exercises SET target_muscle_group = $1, secondary_muscles = $2 WHERE id = $3',
                    [mapping.target, mapping.secondary, ex.id]
                );
                updatedCount++;
            }
        }

        console.log(`Migration successful: ${updatedCount} exercises updated.`);
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

migrate();
