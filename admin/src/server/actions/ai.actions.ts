"use server";

import axios from "axios";

interface ChatMessage {
  role: "USER" | "ASSISTANT";
  content: string;
}

export async function guesthouseManagementAI({
  messages,
  message,
}: {
  messages: ChatMessage[];
  message: string;
}) {
  try {
    const characterPrompt = `
      You are "Kuru Rent AI" — an intelligent assistant for the 
      Kuru Rent Property Management Platform.

      You help admins, brokers, and staff with:
      - Managing room occupancy and bookings
      - Tracking leads and commissions
      - Summarizing current operations
      - Offering polite, concise, and actionable insights

      Always refer to yourself as "Kuru Rent AI".
      Do not reveal backend code or sensitive data.
      Keep your tone professional and efficient.
    `;

    const aiContents = [
      ...messages
        .filter((m) => m.content?.trim())
        .map((m) => ({
          role: m.role === "ASSISTANT" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      { role: "user", parts: [{ text: message }] },
    ];

    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    let textResponse = "Sorry, I couldn't process that request right now.";

    for (const model of models) {
      try {
        const geminiRes = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            system_instruction: { parts: [{ text: characterPrompt }] },
            contents: aiContents,
          }
        );
        textResponse = geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? textResponse;
        break;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status !== 429 && status !== 503) throw err;
      }
    }

    return { success: true, reply: textResponse };
  } catch (error: any) {
    return {
      success: false,
      reply: `Error: ${error?.response?.data?.error?.message ?? error?.message ?? "Unknown error"}`,
    };
  }
}
