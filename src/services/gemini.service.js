const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyze meal description using Gemini AI
 * @param {string} description
 * @param {string} language - 'en' | 'tr'
 * @returns {Promise<Object>}
 */
async function analyzeMeal(description, language = "en") {
    try {
        console.log(
            "Gemini Service initialized with API key ending in ..." +
            process.env.GEMINI_API_KEY.slice(-4)
        );

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json",
            },
        });

        const languageInstructions =
            language === "tr"
                ? "Portion note'u Türkçe yaz ve Türkiye'de yaygın kullanılan porsiyonları baz al."
                : "Write the portion note in English and use common standard serving sizes.";

        const prompt = `
You are a professional nutritionist API.

Meal Description:
"${description}"

${languageInstructions}

Strict Rules:
1. Convert spoon-based measurements to grams using fixed standards:
   - Oats: 1 tablespoon = 8 grams
   - Yogurt: 1 tablespoon = 20 grams
   - Honey: 1 teaspoon = 7 grams
2. If a range is given (e.g. 5–6 tablespoons), use the average.
3. If portion sizes are missing, assume realistic standard portions.
4. First calculate protein, carbs, and fat.
5. Then calculate calories strictly as:
   - protein × 4
   - carbs × 4
   - fat × 9
6. Calories MUST match macro-derived calories within ±5%.
7. Prefer realistic food values over abstract math.
8. Be deterministic. Identical input must yield identical output.
9. Return ONE valid JSON object only. No extra text.

Required JSON structure:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "portionNote": string,
  "estimationAccuracy": "high" | "medium" | "low"
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let nutritionData;
        try {
            nutritionData = JSON.parse(text);
        } catch (err) {
            console.error("Gemini raw response:", text);
            throw new Error("Invalid JSON returned from AI");
        }

        // ✅ Validate required numeric fields
        const requiredFields = ["calories", "protein", "carbs", "fat"];
        for (const field of requiredFields) {
            if (typeof nutritionData[field] !== "number" || isNaN(nutritionData[field])) {
                throw new Error(`Invalid or missing field: ${field}`);
            }
        }

        // ✅ Macro–calorie consistency guard
        const macroCalories =
            nutritionData.protein * 4 +
            nutritionData.carbs * 4 +
            nutritionData.fat * 9;

        const diffRatio =
            Math.abs(macroCalories - nutritionData.calories) / macroCalories;

        if (diffRatio > 0.1) {
            throw new Error("Macro-calorie inconsistency detected");
        }

        // ✅ Final normalized response
        return {
            calories: Math.round(nutritionData.calories),
            protein: Number(nutritionData.protein.toFixed(1)),
            carbs: Number(nutritionData.carbs.toFixed(1)),
            fat: Number(nutritionData.fat.toFixed(1)),
            portionNote: nutritionData.portionNote || "",
            estimationAccuracy: nutritionData.estimationAccuracy || "medium",
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error(`AI analysis failed: ${error.message}`);
    }
}

module.exports = {
    analyzeMeal,
};
