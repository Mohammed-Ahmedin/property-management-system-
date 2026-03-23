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
      You are "Property Manager AI" — an intelligent assistant for the 
      Property Management Web Portal. 

      You help admins, brokers, and staff with:
      - Managing room occupancy and bookings
      - Tracking leads and commissions
      - Summarizing current operations
      - Offering polite, concise, and actionable insights

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
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        system_instruction: { parts: [{ text: characterPrompt }] },
        contents: aiContents,
      }
    );

    const textResponse =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't process that request right now.";

    return { success: true, reply: textResponse };
  } catch (error: any) {
    return {
      success: false,
      reply: `Error: ${error?.response?.data?.error?.message ?? error?.message ?? "Unknown error"}`,
    };
  }
}
