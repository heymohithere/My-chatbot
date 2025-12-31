import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const _tavily = tavily({ apiKey: process.env.TAVILY_API_KEY });

export async function askAI(message) {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: message }],
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.log("Groq error:", err);
    return "AI Error.";
  }
}

export async function webSearch(query) {
  try {
    const q = String(query);  // Force string (prevents 422 error)

    const response = await _tavily.search(
      q,   // MUST be a string
      {
        search_depth: "advanced",
        include_answer: true,
        include_images: false,
        max_results: 5
      }
    );

    return response.results || [];

  } catch (error) {
    console.error("Tavily Error:", error);
    return [];
  }
}

