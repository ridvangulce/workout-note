const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze meal description using Gemini AI
 * @param {string} description - Meal description (e.g., "2 eggs, toast, coffee")
 * @param {string} language - Language code ('en' or 'tr')
 * @returns {Promise<Object>} Nutritional breakdown
 */
async function analyzeMeal(description, language = 'en') {
    try {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        console.log('Gemini Service: Initializing with API Key ending in ...' + process.env.GEMINI_API_KEY.slice(-4));

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash", // Updated to 2.5 Flash as 1.5 is retired/unavailable
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const languageInstructions = language === 'tr'
            ? 'Porsiyon notunu Türkçe yaz ve Türkiye standartlarındaki porsiyonları baz al.'
            : 'Write portion note in English and use standard serving sizes.';

        const prompt = `
You are a professional nutritionist API. Analyze this meal description and provide highly accurate nutritional estimates based on standard databases (like USDA or similar).

Meal Description: "${description}"

${languageInstructions}

Rules:
1. Be consistent. Identical descriptions must yield identical results.
2. If portion sizes are not specified, assume standard medium servings (e.g., 1 slice of bread = ~30g, 1 egg = ~50g).
3. BE PRECISE. Do not round aggressively unless necessary.
4. Return a SINGLE JSON object.

Required JSON Structure:
{
  "calories": <number, integer>,
  "protein": <number, float, grams>,
  "carbs": <number, float, grams>,
  "fat": <number, float, grams>,
  "portionNote": "<string, brief explanation of assumptions>"
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON directly as we enforced JSON output
        let nutritionData;
        try {
            nutritionData = JSON.parse(text);
        } catch (parseError) {
            console.error('Failed to parse Gemini JSON:', text);
            throw new Error('Invalid JSON response from AI');
        }

        // Validate response structure
        if (!nutritionData.calories || !nutritionData.protein || !nutritionData.carbs || !nutritionData.fat) {
            throw new Error('Invalid response structure from AI');
        }

        // Ensure numbers are integers/decimals
        return {
            calories: Math.round(nutritionData.calories),
            protein: parseFloat(nutritionData.protein.toFixed(1)),
            carbs: parseFloat(nutritionData.carbs.toFixed(1)),
            fat: parseFloat(nutritionData.fat.toFixed(1)),
            portionNote: nutritionData.portionNote || ''
        };

    } catch (error) {
        console.error('Gemini API Error:', error);
        throw new Error(`AI analysis failed: ${error.message}`);
    }
}

module.exports = {
    analyzeMeal
};
