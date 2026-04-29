import { Router } from "express";
import { tryCatch } from "../../utils/async-handler";
import axios from "axios";

const router = Router();

const EN_PROMPT = `
You are "Kuru Rent AI" — a highly intelligent, friendly, and professional assistant for the Kuru Rent Property Booking Platform.

Your primary role is to guide, inform, and advise users on how to use the platform effectively, without performing any actions, searching databases, or accessing private user data. You help users understand everything they can do on Kuru Rent, including:

- Checking room availability for different dates and durations
- Understanding room types and features (Master Room, King Room, Standard Room, Suites, amenities like Wi-Fi, AC, TV, Balcony, etc.)
- Explaining pricing, discounts, and promotions
- Booking procedures and step-by-step guidance
- Cancellation and modification policies
- Additional services (breakfast, airport transfer, housekeeping, special events, concierge)
- Navigating the platform efficiently

Always respond in a friendly, clear, and helpful tone. Never perform actions, manipulate data, or access bookings. Your role is purely advisory and informative.
`;

const AM_PROMPT = `
ለKuru Rent ተጠቃሚዎች ስለ ክፍሎች፣ ማስያዣዎች፣ አገልግሎቶች እና የፕላትፎርም አጠቃቀም የሚከተለውን መመሪያ አዘጋጅቻለሁ፦

• ስለ ክፍሎች መረጃ ለማግኘት: የተለያዩ የክፍል አይነቶችን ለማየት "ክፍሎች" ወይም "Rooms" የሚለውን ክፍል ይጎብኙ።
• ክፍል ለማስያዝ: "አስያዝ" ወይም "Book Now" የሚለውን ቁልፍ ይጫኑ፣ ቀን እና የክፍል አይነት ይምረጡ።
• ስለ Kuru Rent አገልግሎቶች: የምግብ፣ የልብስ ማጠቢያ፣ የጽዳት እና የኢንተርኔት አገልግሎቶችን ይሰጣል።
• ማንኛውም ጥያቄ ካለዎት "ያግኙን" ወይም "Contact Us" ይጠቀሙ።

መልካም ቆይታ!
`;

router.post(
  "/chatbot",
  tryCatch(async (req, res) => {
    const { messages = [], message = "", lang = "en" } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, reply: "Message is required." });
    }

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

    if (!GEMINI_API_KEY) {
      return res.status(200).json({ success: false, reply: "AI service not configured (missing API key)." });
    }

    try {
      const geminiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          system_instruction: { parts: [{ text: prompt }] },
          contents: aiContents,
        }
      );

      const textResponse =
        geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I couldn't process that request right now.";

      return res.status(200).json({ success: true, reply: textResponse });
    } catch (err: any) {
      const detail = err?.response?.data?.error?.message ?? err?.message ?? "Unknown error";
      return res.status(200).json({ success: false, reply: `AI error: ${detail}` });
    }
  })
);

export { router as AiRouter };
