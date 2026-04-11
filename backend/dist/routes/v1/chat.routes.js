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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_middleware_1 = require("../../middleware/auth-middleware");
const async_handler_1 = require("../../utils/async-handler");
const router = (0, express_1.Router)();
exports.ChatRouter = router;
// Send a message (any logged-in user)
router.post("/", (0, auth_middleware_1.authGuard)(), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { message } = req.body;
    if (!(message === null || message === void 0 ? void 0 : message.trim()))
        return res.status(400).json({ message: "Message is required" });
    const msg = yield prisma_1.prisma.chatMessage.create({
        data: { userId, message: message.trim(), isAdmin: false },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
    });
    res.status(201).json({ success: true, data: msg });
})));
// Get messages for current user (user sees their own thread)
router.get("/my", (0, auth_middleware_1.authGuard)(), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const messages = yield prisma_1.prisma.chatMessage.findMany({
        where: { userId },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
        orderBy: { createdAt: "asc" },
    });
    res.json({ success: true, data: messages });
})));
// Admin: get all conversations (grouped by user)
router.get("/admin/conversations", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all unique users who have messages
    const userIds = yield prisma_1.prisma.chatMessage.findMany({
        select: { userId: true },
        distinct: ["userId"],
    });
    const conversations = yield Promise.all(userIds.map((_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        const user = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, image: true, email: true },
        });
        const lastMsg = yield prisma_1.prisma.chatMessage.findFirst({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        const unread = yield prisma_1.prisma.chatMessage.count({
            where: { userId, isAdmin: false, read: false },
        });
        return Object.assign(Object.assign({}, user), { lastMessage: (lastMsg === null || lastMsg === void 0 ? void 0 : lastMsg.message) || "", lastAt: (lastMsg === null || lastMsg === void 0 ? void 0 : lastMsg.createdAt) || new Date(), unread });
    })));
    // Sort by most recent message
    conversations.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
    res.json({ success: true, data: conversations });
})));
// Admin: get messages for a specific user
router.get("/admin/:userId", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const messages = yield prisma_1.prisma.chatMessage.findMany({
        where: { userId },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
        orderBy: { createdAt: "asc" },
    });
    // Mark as read
    yield prisma_1.prisma.chatMessage.updateMany({ where: { userId, isAdmin: false, read: false }, data: { read: true } });
    res.json({ success: true, data: messages });
})));
// Admin: reply to a user
router.post("/admin/:userId/reply", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const adminId = req.user.id;
    const { message } = req.body;
    if (!(message === null || message === void 0 ? void 0 : message.trim()))
        return res.status(400).json({ message: "Message is required" });
    // Store admin reply under the user's thread (isAdmin: true)
    const msg = yield prisma_1.prisma.chatMessage.create({
        data: { userId, message: message.trim(), isAdmin: true },
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
    });
    res.status(201).json({ success: true, data: msg });
})));
