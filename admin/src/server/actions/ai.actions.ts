"use server";

import { aiConfig } from "../config/ai";


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
      ...messages.map((m) => ({
        role: m.role === "ASSISTANT" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const aiResponse = await aiConfig.models.generateContent({
      model: "gemini-2.5-flash",
      config: { systemInstruction: characterPrompt },
      contents: aiContents,
    });

    const textResponse =
      aiResponse?.text ??
      aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't process that request right now.";

    return { success: true, reply: textResponse };
  } catch (error) {
    console.error("Guesthouse Management AI Error:", error);
    return {
      success: false,
      reply:
        "Something went wrong while generating the response. Please try again later.",
    };
  }
}
