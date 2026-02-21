const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Replace 'GEMINI_API_KEY' with the exact name you used in Google Cloud Secrets Manager
const GEMINI_API_KEY_SECRET = "GEMINI_API_KEY_PLANMYSCOT";

exports.getAttractionInsights = onCall({ secrets: [GEMINI_API_KEY_SECRET] }, async (request) => {
  // 1. Extract data sent from your Expo App
  const { city, attractionName } = request.data;

  // 2. Simple validation
  if (!attractionName) {
    throw new HttpsError("invalid-argument", "The function must be called with an attraction name.");
  }

  try {
    // 3. Initialize Gemini with the secret from process.env (Firebase injects it here)
    const genAI = new GoogleGenerativeAI(process.env[GEMINI_API_KEY_SECRET]);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Construct a specific prompt for your modal
    const prompt = `Provide a concise, engaging 3-sentence description of the sightseeing attraction "${attractionName}" in ${city || 'its local city'}. 
    Focus on why it's famous and one interesting 'insider' tip for a visitor. Keep the tone helpful and travel-oriented.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // 5. Return the result to the app
    return {
      success: true,
      insight: aiText,
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new HttpsError("internal", "Failed to get insights from Gemini.");
  }
});