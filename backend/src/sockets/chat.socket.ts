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
      if (!data.message?.trim() || !data.userId) return;
      try {
        const msg = await prisma.chatMessage.create({
          data: { userId: data.userId, message: data.message.trim(), isAdmin: false },
          include: { user: { select: { id: true, name: true, image: true, role: true } } },
        });
        io.to(`user:${data.userId}`).emit("message:new", msg);
        io.to("admin").emit("message:new", { ...msg, forUserId: data.userId });
        io.to("admin").emit("conversations:update");
      } catch (e: any) {
        console.error("Socket user:message error:", e?.message);
        // Emit error back to sender so client can fall back to REST
        socket.emit("message:error", { error: e?.message });
      }
    });

    // Admin sends a reply to a user
    socket.on("admin:reply", async (data: { userId: string; message: string }) => {
      if (!data.message?.trim() || !data.userId) return;
      try {
        const msg = await prisma.chatMessage.create({
          data: { userId: data.userId, message: data.message.trim(), isAdmin: true },
          include: { user: { select: { id: true, name: true, image: true, role: true } } },
        });
        // Send to the specific user
        io.to(`user:${data.userId}`).emit("message:new", msg);
        // Echo back to all admins viewing that conversation
        io.to("admin").emit("message:new", { ...msg, forUserId: data.userId });
        io.to("admin").emit("conversations:update");
      } catch {}
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
