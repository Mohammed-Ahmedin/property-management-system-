"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// src/prisma/client.ts
const client_1 = require("@prisma/client");
exports.prisma = (_a = global.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
// log: ["query", "info", "warn", "error"], // optional, helpful for dev
});
if (process.env.NODE_ENV !== "production") {
    global.prisma = exports.prisma;
}
