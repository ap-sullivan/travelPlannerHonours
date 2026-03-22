// Firebase Cloud Function to get missing data about a sightseeing attraction using Google Gemini API

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY_SECRET = "GEMINI_API_KEY_PLANMYSCOT";


// Cloud Function to fetch AI insights for missing attraction data
exports.getAttractionInsights = onCall(
  { secrets: [GEMINI_API_KEY_SECRET] },
  async (request) => {
    // Extract data sent from the app
    const { city, attractionName } = request.data;

    //  validate input
    if (!attractionName) {
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with an attraction name.",
      );
    }

    try {
      // initialise Gemini API client
      const genAI = new GoogleGenerativeAI(process.env[GEMINI_API_KEY_SECRET]);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      // construct prompt for Gemini
      const prompt = `Provide a concise, engaging 3-sentence description of the sightseeing attraction "${attractionName}" in ${city || "its local city"}.  Focus on why it's famous and one interesting 'insider' tip for a visitor. Keep the tone helpful and travel oriented.`;

      const result = await model.generateContent(prompt);

      // log usage data for testing
      console.log(result.response.usageMetadata);

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
  },
);


// function to get final itinerary from stored data

exports.generateItinerary = onCall(
  { secrets: [GEMINI_API_KEY_SECRET] },
  async (request) => {
    const { destinations } = request.data;

    // Validate
    if (!destinations || !destinations.length) {
      throw new HttpsError(
        "invalid-argument",
        "Destinations data is required."
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(
        process.env[GEMINI_API_KEY_SECRET]
      );

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      // ✅ Build structured input for prompt
      const formattedData = destinations
        .map((d, i) => {
          return `
City: ${d.name}
Days: ${d.days}

Hotel:
${d.hotel?.name || "Not specified"}

Attractions:
${d.attractions?.map((a) => `- ${a.name}`).join("\n") || "None selected"}
`;
        })
        .join("\n---\n");

      // Prompt
      const prompt = `
You are a travel planning assistant.

Using the trip data below, create a clear, concise, day-by-day itinerary.

Rules:
- Organise by day (Day 1, Day 2, etc.)
- Each day must start with "Day X – City Name"
- Respect the number of days in each city
- Group attractions logically by location and flow
- Start each city's first day with checking into the hotel
- Mention the hotel naturally in the itinerary
- Keep each day short and readable (3–5 bullet points max)
- Do NOT invent attractions — only use the provided ones
- Make it feel like a real travel plan

Trip Data:
${formattedData}

Output format example:

Day 1 – Edinburgh
- Check into hotel
- Visit Edinburgh Castle
- Walk Royal Mile
- Dinner in Old Town

Day 2 – Edinburgh
...

Keep the tone helpful and structured.

Return the itinerary as clean plain text.
Do not use markdown symbols like **, #, or bullet characters like •.
Use simple "-" for bullet points only.
`;

      const result = await model.generateContent(prompt);

      // log usage data for testing
      console.log(result.response.usageMetadata);

      const response = await result.response;
      const aiText = response.text();

      return {
        success: true,
        itinerary: aiText,
      };
    } catch (error) {
      console.error("Gemini Error:", error);
      throw new HttpsError(
        "internal",
        "Failed to generate itinerary."
      );
    }
  }
);