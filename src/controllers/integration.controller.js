const axios = require('axios');

const searchYoutube = async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'YouTube API configuration missing' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                maxResults: 5,
                q: q,
                type: 'video',
                key: apiKey
            }
        });

        const items = response.data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url,
            channel: item.snippet.channelTitle
        }));

        res.json(items);
    } catch (error) {
        console.error('YouTube Search Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch videos from YouTube' });
    }
};

const analyzeMeal = async (req, res, next) => {
    try {
        const { description, language = 'en' } = req.query;

        if (!description || description.trim().length === 0) {
            return res.status(400).json({ error: 'Meal description is required' });
        }

        const geminiService = require('../services/gemini.service');
        const nutritionData = await geminiService.analyzeMeal(description, language);

        res.json(nutritionData);
    } catch (error) {
        console.error('Analyze meal error:', error);
        res.status(500).json({ error: 'Failed to analyze meal', details: error.message });
    }
};



const aiLogRepository = require('../repositories/ai_log.repository');

const evaluateWorkout = async (req, res, next) => {
    try {
        const { workoutLog, language = 'en' } = req.body;
        const userId = req.user.id;

        if (!workoutLog || workoutLog.trim().length === 0) {
            return res.status(400).json({ error: 'Workout log is required' });
        }

        // Fetch user profile/goals
        const nutritionGoalRepository = require('../repositories/nutritionGoal.repository');
        const userGoals = await nutritionGoalRepository.getByUserId(userId);

        let userContext = "";
        if (userGoals) {
            userContext = `
            User Profile:
            - Weight: ${userGoals.weight || 'N/A'} kg
            - Height: ${userGoals.height || 'N/A'} cm
            - Gender: ${userGoals.gender || 'N/A'}
            - Age: ${userGoals.age || 'N/A'}
            - Activity Level: ${userGoals.activity_level || 'N/A'}
            - Target Weight: ${userGoals.target_weight || 'N/A'} kg
            - Main Fitness Goal: ${userGoals.fitness_goal || 'Not specified'}
            - Goal Type: ${userGoals.goal_type || 'N/A'}
            `;
        } else {
            userContext = "User profile not set.";
        }

        const geminiService = require('../services/gemini.service');
        const evaluation = await geminiService.evaluateWorkout(workoutLog, language, userContext);

        // Save to database
        await aiLogRepository.create({
            userId,
            workoutLog,
            analysis: evaluation.analysis
        });

        res.json(evaluation);
    } catch (error) {
        console.error('Evaluate workout error:', error);
        res.status(500).json({ error: 'Failed to evaluate workout', details: error.message });
    }
};

const getWorkoutHistory = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const history = await aiLogRepository.findByUserId(userId);
        res.json(history);
    } catch (error) {
        console.error('Get workout history error:', error);
        res.status(500).json({ error: 'Failed to fetch workout history' });
    }
};

module.exports = {
    searchYoutube,
    analyzeMeal,
    evaluateWorkout,
    getWorkoutHistory
};
