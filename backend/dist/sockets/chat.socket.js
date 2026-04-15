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
            // Legacy handler — just notify, don't save (REST handles saving)
            if (!((_a = data.message) === null || _a === void 0 ? void 0 : _a.trim()) || !data.userId)
                return;
            io.to("admin").emit("conversations:update");
        }));
        // Admin sends a reply to a user
        socket.on("admin:reply", (data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            // Legacy handler — just notify, don't save (REST handles saving)
            if (!((_a = data.message) === null || _a === void 0 ? void 0 : _a.trim()) || !data.userId)
                return;
        }));
        // User notifies admin of new message (already saved via REST — no DB write)
        socket.on("user:message:notify", (data) => {
            if (!(data === null || data === void 0 ? void 0 : data.userId) || !(data === null || data === void 0 ? void 0 : data.message))
                return;
            // Forward the already-saved message to admin for real-time display
            io.to("admin").emit("message:new", Object.assign(Object.assign({}, data.message), { forUserId: data.userId }));
            io.to("admin").emit("conversations:update");
        });
        // Admin notifies user of new reply (already saved via REST — no DB write)
        socket.on("admin:reply:notify", (data) => {
            if (!(data === null || data === void 0 ? void 0 : data.userId) || !(data === null || data === void 0 ? void 0 : data.message))
                return;
            // Forward the already-saved message to the user for real-time display
            io.to(`user:${data.userId}`).emit("message:new", data.message);
            io.to("admin").emit("conversations:update");
        });
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
