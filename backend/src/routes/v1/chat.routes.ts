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
  // Get all unique users who have messages
  const userIds = await prisma.chatMessage.findMany({
    select: { userId: true },
    distinct: ["userId"],
  });

  const conversations = await Promise.all(
    userIds.map(async ({ userId }) => {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, image: true, email: true },
      });
      const lastMsg = await prisma.chatMessage.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });
      let unread = 0;
      try {
        unread = await prisma.chatMessage.count({
          where: { userId, isAdmin: false, read: false },
        });
      } catch {}
      return { ...user, lastMessage: lastMsg?.message || "", lastAt: lastMsg?.createdAt || new Date(), unread };
    })
  );

  // Sort by most recent message
  conversations.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  res.json({ success: true, data: conversations });
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
  try {
    await prisma.chatMessage.updateMany({ where: { userId, isAdmin: false, read: false }, data: { read: true } });
  } catch {}
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
