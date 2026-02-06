import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ ONLY MODEL THAT WORKS WITH AI STUDIO KEY
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = `
You are an event planning assistant.
Generate a JSON object for an event based on the user's description.
Today's date is Thursday, February 5, 2026. Use this to resolve relative dates like "tomorrow", "this weekend", or "next Sunday".

Schema:
{
  "title": "string",
  "description": "string",
  "category": "tech | health | business | music | social | education | sports",
  "suggestedCapacity": number,
  "suggestedTicketType": "free | paid",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "city": "string (e.g., 'Bangalore', 'Mumbai', 'New York')",
  "venue": "string"
}

Notes:
- **Location Priority**: Use the location explicitly mentioned after "in" or "at" as the "city" (e.g., in "A party in Goa at Juhu Beach", the "city" is "Goa" and "venue" is "Juhu Beach").
- **Never "Correct" Geography**: Even if a venue (like Juhu Beach) is technically in another city (like Mumbai), always use the city name the user provided (like Goa).
- **State as City**: If the user mentions a state (like "Goa", "Maharashtra", etc.) as the location, use that as the "city" field.
- **Overnight Support**: Ensure "endDate" is correctly calculated for overnight events.
- If a field is not mentioned, provide a reasonable guess based on the event type.
Return ONLY raw JSON.
`;

    const result = await model.generateContent(
      `${systemPrompt}\nUser description: ${prompt}`
    );

    const text = result.response.text();
    const clean = text.replace(/```json|```/g, "").trim();
    const json = JSON.parse(clean);

    return NextResponse.json(json);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || "Gemini failed" },
      { status: 500 }
    );
  }
}
