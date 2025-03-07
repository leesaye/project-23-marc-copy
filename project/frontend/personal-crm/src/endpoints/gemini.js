import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai"

//  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    const apiKey = "AIzaSyBhs7tC1Uv4BY9xoxCTEX1XJvmyd_6g4Ko"
//   const apiKey = "aslkd";
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
    const chatSession = model.startChat({
      generationConfig,
      history: [
      ],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    console.log(result.response.text());
    return response.text()
  }

 export default run;
