import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { messages = [], message, lang = "en" } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ success: false, reply: "Message is required." }, { status: 400 });
    }

    const EN_PROMPT = `
You are "BETE Property AI" — a friendly assistant for the BETE Property Booking Platform.
Help users with room availability, booking procedures, pricing, cancellation policies, and platform navigation.
Always respond in a friendly, clear, and helpful tone.
    `;

    const AM_PROMPT = `
ለBETE Property ተጠቃሚዎች ስለ ክፍሎች፣ ማስያዣዎች፣ አገልግሎቶች እና የፕላትፎርም አጠቃቀም መረጃ ይስጡ።
    `;

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
      {
        system_instruction: { parts: [{ text: prompt }] },
        contents: aiContents,
      }
    );

    const reply =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "Sorry, I couldn't process that request right now.";

    return NextResponse.json({ success: true, reply }, { headers: corsHeaders });
  } catch (error: any) {
    const detail = error?.response?.data?.error?.message ?? error?.message ?? "Unknown error";
    return NextResponse.json({ success: false, reply: `AI error: ${detail}` }, { status: 200, headers: corsHeaders });
  }
}
