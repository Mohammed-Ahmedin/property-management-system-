"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiConfig = void 0;
const genai_1 = require("@google/genai");
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
exports.aiConfig = new genai_1.GoogleGenAI({ apiKey: GOOGLE_GEMINI_API_KEY });
