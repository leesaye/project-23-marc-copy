import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"

  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(prompt) {
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(prompt);
      const response = result.response;

      if (!response) {
        throw new Error("Empty response from Gemini API, please try to reload the page.");
      }

      return response.text();
    } catch (error) {
      console.error("Error with Gemini API:", error);
      if (error.message.includes("429")){
        return "Oops, you have made too many requests and have hit the rate limit. Please try again in 1 minute.";
      }
      return "Oops! Something went wrong. Please try again.";
    }
  }


 export default run;
