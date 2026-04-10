// Firebase Cloud Function to get missing data about a sightseeing attraction using Google Gemini API

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY_SECRET = "GEMINI_API_KEY_PLANMYSCOT";

// function to fetch AI insights for missing attraction data
exports.getAttractionInsights = onCall(
  { secrets: [GEMINI_API_KEY_SECRET] },
  async (request) => {
    // Extract data sent from the app
    const { city, attractionName } = request.data;

    //  validate input
    if (!attractionName) {
      throw new HttpsError(
        "The function must be called with an attraction name.",
      );
    }

    try {
      // initialise Gemini API client
      const genAI = new GoogleGenerativeAI(process.env[GEMINI_API_KEY_SECRET]);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      // construct prompt for Gemini
      const prompt = `Provide a concise, engaging 2 to 3 sentence description of the sightseeing attraction "${attractionName}" in ${city || "its local city"}.  Focus on why you would visit it and give any interesting facts or tips if relevant. Keep the tone helpful and travel oriented.`;

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

    // validate input
    if (!destinations || !destinations.length) {
      throw new HttpsError(
        "invalid-argument",
        "Destinations data is required.",
      );
    }

    try {
      // initialise
      const genAI = new GoogleGenerativeAI(process.env[GEMINI_API_KEY_SECRET]);

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      // format input data for prompt (comes from summary screen build AI input function)
      const formattedData = destinations
        .map((d) => {
          return `
        City: ${d.name}
        Days: ${d.days}
        Season: ${d.season || "Not specified"}
        Hotel:
        ${d.hotel?.name || "Not specified"}

        Attractions:
        ${
          d.attractions?.length
            ? d.attractions.map((a) => `- ${a.name}`).join("\n")
            : "None selected"
        }
        `;
                })
                .join("\n---\n");

      //construct prompt
      const prompt = `
You are a travel planning assistant.

Using the structured trip data below, create a clear, concise, day-by-day itinerary.

Rules:
- Strictly follow the number of days for each city
- Do NOT invent attractions — only use the ones provided
- If a there are many more days than attractions then create some leisure days with general suggestions (e.g. "Explore local culture, try local cuisine")
- Spread attractions logically across the days
- Write each day as a smooth, engaging paragraph (not bullet points)
- Structure each day naturally (morning to afternoon to evening)
- Include helpful travel tips where appropriate
- Keep each day concise but engaging, with a focus on why the attractions are worth visiting
- Take into consideration the season for any relevant tips (e.g. "Since you're visiting in winter, this museum is a great indoor option")

Return ONLY valid JSON in this format:

[
  {
    "day": 1,
    "city": "Edinburgh",
    "plan": "A natural flowing paragraph describing the day. ",
    "accommodation": "Hotel name for the city, if provided, otherwise 'No hotel selected'"
  }
]

Do NOT include markdown, explanations, or extra text.
Do NOT wrap in \`\`\`.

Use this trip Data:
${formattedData}
`;

      // gemini call
      const result = await model.generateContent(prompt);

      const response = await result.response;
      const aiText = response.text();

      //  log usage for testing
      console.log("USAGE:", response.usageMetadata);

      // clean and parse JSON
      let parsed;

      try {
        const cleanText = aiText
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

        parsed = JSON.parse(cleanText);
      } catch (err) {
        console.error("JSON PARSE ERROR:", aiText);
        throw new HttpsError("internal", "returned invalid JSON format.");
      }

      // return to app
      return {
        success: true,
        itinerary: parsed,
      };
    } catch (error) {
      console.error("Gemini Error:", error);

      throw new HttpsError("internal", "Failed to generate itinerary.");
    }
  },
);
