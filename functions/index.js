// Firebase Cloud Function to get missing data about a sightseeing attraction using Google Gemini API

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY_SECRET = "GEMINI_API_KEY_PLANMYSCOT";

exports.getAttractionInsights = onCall({ secrets: [GEMINI_API_KEY_SECRET] }, async (request) => {
  // Extract data sent from the app
  const { city, attractionName } = request.data;

//  valuidate input
  if (!attractionName) {
    throw new HttpsError("invalid-argument", "The function must be called with an attraction name.");
  }

  try {

          // console.log("API KEY EXISTS:", !!process.env[GEMINI_API_KEY_SECRET]);
    
    // initialize Gemini API client
    const genAI = new GoogleGenerativeAI(process.env[GEMINI_API_KEY_SECRET]);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
// construct prompt for Gemini
    const prompt = `Provide a concise, engaging 3-sentence description of the sightseeing attraction "${attractionName}" in ${city || 'its local city'}. 
    Focus on why it's famous and one interesting 'insider' tip for a visitor. Keep the tone helpful and travel oriented.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    // return result back to app
    return {
      success: true,
      insight: aiText,
    };

  } catch (error) {
    console.error("Gemini Error:", error);
    throw new HttpsError("internal", "Failed to get insights from Gemini.");
  }
});

