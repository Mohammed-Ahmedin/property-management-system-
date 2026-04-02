"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRouter = void 0;
const express_1 = require("express");
const async_handler_1 = require("../../utils/async-handler");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
exports.AiRouter = router;
const EN_PROMPT = `
You are "BETE Property AI" — a highly intelligent, friendly, and professional assistant for the BETE Property Booking Platform.

Your primary role is to guide, inform, and advise users on how to use the platform effectively, without performing any actions, searching databases, or accessing private user data. You help users understand everything they can do on BETE Property, including:

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
ለBETE Property ተጠቃሚዎች ስለ ክፍሎች፣ ማስያዣዎች፣ አገልግሎቶች እና የፕላትፎርም አጠቃቀም የሚከተለውን መመሪያ አዘጋጅቻለሁ፦

• ስለ ክፍሎች መረጃ ለማግኘት: የተለያዩ የክፍል አይነቶችን ለማየት "ክፍሎች" ወይም "Rooms" የሚለውን ክፍል ይጎብኙ።
• ክፍል ለማስያዝ: "አስያዝ" ወይም "Book Now" የሚለውን ቁልፍ ይጫኑ፣ ቀን እና የክፍል አይነት ይምረጡ።
• ስለ BETE Property አገልግሎቶች: የምግብ፣ የልብስ ማጠቢያ፣ የጽዳት እና የኢንተርኔት አገልግሎቶችን ይሰጣል።
• ማንኛውም ጥያቄ ካለዎት "ያግኙን" ወይም "Contact Us" ይጠቀሙ።

መልካም ቆይታ!
`;
router.post("/chatbot", (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    const { messages = [], message = "", lang = "en" } = req.body;
    if (!(message === null || message === void 0 ? void 0 : message.trim())) {
        return res.status(400).json({ success: false, reply: "Message is required." });
    }
    const prompt = lang === "am" ? AM_PROMPT : EN_PROMPT;
    const aiContents = [
        ...messages
            .filter((m) => { var _a; return (_a = m.content) === null || _a === void 0 ? void 0 : _a.trim(); })
            .map((m) => ({
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
        const geminiRes = yield axios_1.default.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            system_instruction: { parts: [{ text: prompt }] },
            contents: aiContents,
        });
        const textResponse = (_g = (_f = (_e = (_d = (_c = (_b = (_a = geminiRes.data) === null || _a === void 0 ? void 0 : _a.candidates) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.content) === null || _d === void 0 ? void 0 : _d.parts) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.text) !== null && _g !== void 0 ? _g : "Sorry, I couldn't process that request right now.";
        return res.status(200).json({ success: true, reply: textResponse });
    }
    catch (err) {
        const detail = (_m = (_l = (_k = (_j = (_h = err === null || err === void 0 ? void 0 : err.response) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.error) === null || _k === void 0 ? void 0 : _k.message) !== null && _l !== void 0 ? _l : err === null || err === void 0 ? void 0 : err.message) !== null && _m !== void 0 ? _m : "Unknown error";
        return res.status(200).json({ success: false, reply: `AI error: ${detail}` });
    }
})));
