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

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const languageInstructions = language === 'tr'
            ? 'Porsiyon notunu Türkçe yaz.'
            : 'Write portion note in English.';

        const prompt = `
Analyze this meal and provide nutritional estimates in JSON format.
Meal: "${description}"

${languageInstructions}

Return ONLY valid JSON with this exact structure (no markdown, no additional text):
{
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>,
  "portionNote": "<brief portion size assumption>"
}

Example 1: "2 eggs, toast" → {"calories": 300, "protein": 18, "carbs": 25, "fat": 12, "portionNote": "2 medium eggs, 2 slices whole wheat bread"}
Example 2: "tavuklu salata" → {"calories": 350, "protein": 30, "carbs": 15, "fat": 18, "portionNote": "orta boy porsiyon"}

Be realistic with portion sizes if not specified.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Try to extract JSON from response
        let nutritionData;
        try {
            // Remove potential markdown code blocks
            const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            nutritionData = JSON.parse(cleanText);
        } catch (parseError) {
            console.error('Failed to parse Gemini response:', text);
            // Return default estimate if parsing fails
            return {
                calories: 300,
                protein: 15,
                carbs: 30,
                fat: 10,
                portionNote: language === 'tr' ? 'Tahmin edildi' : 'Estimated',
                error: 'Could not parse AI response'
            };
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
