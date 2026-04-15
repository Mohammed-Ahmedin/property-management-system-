import { Server, Socket } from "socket.io";
import { prisma } from "../lib/prisma";

// Map userId -> socketId for online tracking
const onlineUsers = new Map<string, string>();

export function registerChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth?.userId as string | undefined;
    const isAdmin = socket.handshake.auth?.isAdmin === true;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      // Join personal room
      socket.join(`user:${userId}`);
    }
    if (isAdmin) {
      socket.join("admin");
    }

    // User sends a message to admin
    socket.on("user:message", async (data: { message: string; userId: string }) => {
      // Legacy handler — just notify, don't save (REST handles saving)
      if (!data.message?.trim() || !data.userId) return;
      io.to("admin").emit("conversations:update");
    });

    // Admin sends a reply to a user
    socket.on("admin:reply", async (data: { userId: string; message: string }) => {
      // Legacy handler — just notify, don't save (REST handles saving)
      if (!data.message?.trim() || !data.userId) return;
    });

    // User notifies admin of new message (already saved via REST — no DB write)
    socket.on("user:message:notify", (data: { userId: string; message: any }) => {
      if (!data?.userId || !data?.message) return;
      // Forward the already-saved message to admin for real-time display
      io.to("admin").emit("message:new", { ...data.message, forUserId: data.userId });
      io.to("admin").emit("conversations:update");
    });

    // Admin notifies user of new reply (already saved via REST — no DB write)
    socket.on("admin:reply:notify", (data: { userId: string; message: any }) => {
      if (!data?.userId || !data?.message) return;
      // Forward the already-saved message to the user for real-time display
      io.to(`user:${data.userId}`).emit("message:new", data.message);
      io.to("admin").emit("conversations:update");
    });

    // Admin joins a specific user conversation room
    socket.on("admin:join", (targetUserId: string) => {
      socket.join(`conv:${targetUserId}`);
    });

    socket.on("disconnect", () => {
      if (userId) onlineUsers.delete(userId);
    });
  });
}
