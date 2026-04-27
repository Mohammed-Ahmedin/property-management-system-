import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

function withCors(response: NextResponse, origin: string | null) {
  response.headers.set("Access-Control-Allow-Origin", origin ?? "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin");
  return withCors(new NextResponse(null, { status: 204 }), origin);
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
  try {
    const { messages = [], message, lang = "en" } = await req.json();

    if (!message?.trim()) {
      return withCors(
        NextResponse.json({ success: false, reply: "Message is required." }, { status: 400 }),
        origin
      );
    }

    const EN_PROMPT = `You are "Kuru Rent AI" — a friendly assistant for the Kuru Rent Property Booking Platform. Always refer to yourself as "Kuru Rent AI". Help users with room availability, booking procedures, pricing, cancellation policies, and platform navigation. Always respond in a friendly, clear, and helpful tone.`;
    const AM_PROMPT = `ስምህ "Kuru Rent AI" ነው። ለKuru Rent ተጠቃሚዎች ስለ ክፍሎች፣ ማስያዣዎች፣ አገልግሎቶች እና የፕላትፎርም አጠቃቀም መረጃ ይስጡ።`;
    const prompt = lang === "am" ? AM_PROMPT : EN_PROMPT;

    const aiContents = [
      ...messages
        .filter((m: { role: string; content: string }) => m.content?.trim())
        .map((m: { role: string; content: string }) => ({
          role: m.role === "ASSISTANT" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      { role: "user", parts: [{ text: message }] },
    ];

    const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      { system_instruction: { parts: [{ text: prompt }] }, contents: aiContents }
    );

    const reply =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't process that request right now.";

    return withCors(NextResponse.json({ success: true, reply }), origin);
  } catch (error: any) {
    const detail = error?.response?.data?.error?.message ?? error?.message ?? "Unknown error";
    return withCors(NextResponse.json({ success: false, reply: `AI error: ${detail}` }), origin);
  }
}
