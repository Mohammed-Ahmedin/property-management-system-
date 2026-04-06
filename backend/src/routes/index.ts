import { Router } from "express";
import { PropertyRouter } from "./v1/property.routes";
import { AuthRouter } from "./v1/auth.routes";
import { UsersRouter } from "./v1/users.routes";
import { RoomsRouter } from "./v1/rooms.routes";
import { BookingsRouter } from "./v1/bookings.routes";
import { FavoriteRouter } from "./v1/favorites.routes";
import { DashboardRouter } from "./v1/dashboard.routes";
import { RegistrationRequestRouter } from "./v1/registration-request.routes";
import { CommisionRouter } from "./v1/commision.routes";
import { PaymentsRouter } from "./v1/payments.routes";
import { AiRouter } from "./v1/ai.routes";
import { ActivitiesRouter } from "./v1/activities.routes";

const rootRouter = Router();

rootRouter.get("/", (req, res) => {
  res.json({ message: "Server is running successfully" });
});

rootRouter.get("/api/v1/health", (req, res) => {
  res.json({ ok: true });
});

// Change password endpoint — works with Bearer token (mobile) and cookies (desktop)
rootRouter.post("/api/v1/auth/change-password", async (req, res) => {
  try {
    const { prisma } = await import("../lib/prisma");
    const { auth } = await import("../lib/auth");
    const { fromNodeHeaders } = await import("better-auth/node");
    let userId: string | null = null;

    // Try cookie session first
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) }).catch(() => null);
    if (session?.user?.id) {
      userId = session.user.id;
    } else {
      // Try Bearer token
      const token = req.headers["authorization"]?.replace("Bearer ", "");
      if (token) {
        const sessionDoc = await prisma.session.findFirst({ where: { token }, select: { userId: true } });
        if (sessionDoc?.userId) userId = sessionDoc.userId;
      }
    }

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ message: "currentPassword and newPassword are required" });
    if (newPassword.length < 4) return res.status(400).json({ message: "New password must be at least 4 characters" });

    // Use better-auth's built-in password verification and hashing
    const ctx = await auth.$context;
    const account = await prisma.account.findFirst({ where: { userId, providerId: "credential" } });
    if (!account?.password) return res.status(400).json({ message: "No password set for this account" });

    const valid = await ctx.password.verify({ hash: account.password, password: currentPassword });
    if (!valid) return res.status(400).json({ message: "Current password is incorrect" });

    const hashed = await ctx.password.hash(newPassword);
    await prisma.account.update({ where: { id: account.id }, data: { password: hashed } });

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err?.message || "Failed to change password" });
  }
});

// Public stats endpoint — no auth required
rootRouter.get("/api/v1/public/stats", async (req, res) => {
  try {
    const { prisma } = await import("../lib/prisma");
    const [totalProperties, totalBookings, totalReviews] = await Promise.all([
      prisma.property.count({ where: { status: "APPROVED", visibility: true } }),
      prisma.booking.count({ where: { status: "APPROVED" } }),
      prisma.review.count(),
    ]);
    res.json({ totalProperties, totalBookings, totalReviews });
  } catch {
    res.json({ totalProperties: 0, totalBookings: 0, totalReviews: 0 });
  }
});

rootRouter.use("/api/v1/properties", PropertyRouter);
rootRouter.use("/api/v1/auth", AuthRouter);
rootRouter.use("/api/v1/users", UsersRouter);
rootRouter.use("/api/v1/rooms", RoomsRouter);
rootRouter.use("/api/v1/dashboard", DashboardRouter);
rootRouter.use("/api/v1/bookings", BookingsRouter);
rootRouter.use("/api/v1/favorites", FavoriteRouter);
rootRouter.use("/api/v1/payments", PaymentsRouter);
rootRouter.use("/api/v1/commision-settings", CommisionRouter);
rootRouter.use("/api/v1/registration-requests", RegistrationRequestRouter);
rootRouter.use("/api/v1/ai", AiRouter);
rootRouter.use("/api/v1/activities", ActivitiesRouter);

export default rootRouter;
