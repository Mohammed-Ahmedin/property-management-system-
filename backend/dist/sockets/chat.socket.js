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
exports.registerChatSocket = registerChatSocket;
const prisma_1 = require("../lib/prisma");
// Map userId -> socketId for online tracking
const onlineUsers = new Map();
function registerChatSocket(io) {
    io.on("connection", (socket) => {
        var _a, _b;
        const userId = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.userId;
        const isAdmin = ((_b = socket.handshake.auth) === null || _b === void 0 ? void 0 : _b.isAdmin) === true;
        if (userId) {
            onlineUsers.set(userId, socket.id);
            // Join personal room
            socket.join(`user:${userId}`);
        }
        if (isAdmin) {
            socket.join("admin");
        }
        // User sends a message to admin
        socket.on("user:message", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = data.message) === null || _a === void 0 ? void 0 : _a.trim()) || !data.userId)
                return;
            try {
                const msg = yield prisma_1.prisma.chatMessage.create({
                    data: { userId: data.userId, message: data.message.trim(), isAdmin: false },
                    include: { user: { select: { id: true, name: true, image: true, role: true } } },
                });
                io.to(`user:${data.userId}`).emit("message:new", msg);
                io.to("admin").emit("message:new", Object.assign(Object.assign({}, msg), { forUserId: data.userId }));
                io.to("admin").emit("conversations:update");
            }
            catch (e) {
                console.error("Socket user:message error:", e === null || e === void 0 ? void 0 : e.message);
                // Emit error back to sender so client can fall back to REST
                socket.emit("message:error", { error: e === null || e === void 0 ? void 0 : e.message });
            }
        }));
        // Admin sends a reply to a user
        socket.on("admin:reply", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = data.message) === null || _a === void 0 ? void 0 : _a.trim()) || !data.userId)
                return;
            try {
                const msg = yield prisma_1.prisma.chatMessage.create({
                    data: { userId: data.userId, message: data.message.trim(), isAdmin: true },
                    include: { user: { select: { id: true, name: true, image: true, role: true } } },
                });
                // Send to the specific user
                io.to(`user:${data.userId}`).emit("message:new", msg);
                // Echo back to all admins viewing that conversation
                io.to("admin").emit("message:new", Object.assign(Object.assign({}, msg), { forUserId: data.userId }));
                io.to("admin").emit("conversations:update");
            }
            catch (_b) { }
        }));
        // Admin joins a specific user conversation room
        socket.on("admin:join", (targetUserId) => {
            socket.join(`conv:${targetUserId}`);
        });
        socket.on("disconnect", () => {
            if (userId)
                onlineUsers.delete(userId);
        });
    });
}
