const axios = require('axios');
require('dotenv').config();

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('No API Key found in .env');
        return;
    }

    try {
        console.log('Fetching models with key ending in: ...' + apiKey.slice(-4));
        const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        console.log('Available Models:');
        if (response.data && response.data.models) {
            response.data.models.forEach(model => {
                if (model.name.includes('gemini')) {
                    console.log(`- ${model.name} (Supported: ${model.supportedGenerationMethods.join(', ')})`);
                }
            });
        } else {
            console.log('No models found or unexpected format:', response.data);
        }
    } catch (error) {
        console.error('Error fetching models:', error.response ? error.response.data : error.message);
    }
}

listModels();
