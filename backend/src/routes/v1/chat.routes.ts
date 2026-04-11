import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authGuard } from "../../middleware/auth-middleware";
import { tryCatch } from "../../utils/async-handler";

const router = Router();

// Send a message (any logged-in user)
router.post("/", authGuard(), tryCatch(async (req, res) => {
  const userId = (req as any).user.id;
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: "Message is required" });
  const msg = await prisma.chatMessage.create({
    data: { userId, message: message.trim(), isAdmin: false },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  });
  res.status(201).json({ success: true, data: msg });
}));

// Get messages for current user (user sees their own thread)
router.get("/my", authGuard(), tryCatch(async (req, res) => {
  const userId = (req as any).user.id;
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  res.json({ success: true, data: messages });
}));

// Admin: get all conversations (grouped by user)
router.get("/admin/conversations", authGuard({ accessedBy: ["ADMIN"] }), tryCatch(async (req, res) => {
  const users = await prisma.chatMessage.findMany({
    distinct: ["userId"],
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, image: true, email: true } } },
  });
  const unread = await prisma.chatMessage.groupBy({
    by: ["userId"],
    where: { isAdmin: false, read: false },
    _count: { id: true },
  });
  const unreadMap = Object.fromEntries(unread.map(u => [u.userId, u._count.id]));
  res.json({ success: true, data: users.map(m => ({ ...m.user, lastMessage: m.message, lastAt: m.createdAt, unread: unreadMap[m.userId] || 0 })) });
}));

// Admin: get messages for a specific user
router.get("/admin/:userId", authGuard({ accessedBy: ["ADMIN"] }), tryCatch(async (req, res) => {
  const { userId } = req.params;
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
    orderBy: { createdAt: "asc" },
  });
  // Mark as read
  await prisma.chatMessage.updateMany({ where: { userId, isAdmin: false, read: false }, data: { read: true } });
  res.json({ success: true, data: messages });
}));

// Admin: reply to a user
router.post("/admin/:userId/reply", authGuard({ accessedBy: ["ADMIN"] }), tryCatch(async (req, res) => {
  const { userId } = req.params;
  const adminId = (req as any).user.id;
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: "Message is required" });
  // Store admin reply under the user's thread (isAdmin: true)
  const msg = await prisma.chatMessage.create({
    data: { userId, message: message.trim(), isAdmin: true },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  });
  res.status(201).json({ success: true, data: msg });
}));

export { router as ChatRouter };
