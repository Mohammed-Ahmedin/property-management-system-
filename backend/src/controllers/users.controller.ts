import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  getClients: tryCatch(async (req, res) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    let guests: any[] = [];

    if (userRole === "ADMIN") {
      guests = await prisma.user.findMany({
        where: { role: "GUEST" },
        select: { id: true, name: true, email: true, image: true, phone: true, banned: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Broker: return guests who booked properties managed by this broker
      const managed = await prisma.managedProperty.findMany({
        where: { userId, role: "BROKER" },
        select: { propertyId: true },
      });
      const propertyIds = managed.map((m) => m.propertyId);

      if (!propertyIds.length) return res.json([]);

      // Get unique userIds from bookings on broker's properties
      const bookings = await prisma.booking.findMany({
        where: { propertyId: { in: propertyIds }, userId: { not: null } },
        select: { userId: true },
        distinct: ["userId"],
      });

      const userIds = bookings.map((b) => b.userId).filter(Boolean) as string[];
      if (!userIds.length) return res.json([]);

      guests = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true, image: true, phone: true, banned: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      });
    }

    res.json(guests);
  }),

  getUsers: tryCatch(async (req, res, next) => {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json({ data: users });
  }),

  getStats: tryCatch(async (req, res) => {
    const [totalUsers, verifiedUsers, bannedUsers, usersToday, roleCounts] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { emailVerified: true } }),
        prisma.user.count({ where: { banned: true } }),
        prisma.user.count({
          where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        }),
        prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
      ]);

    const getCount = (role: string) =>
      roleCounts.find((r) => r.role === role)?._count.role || 0;

    res.json({
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      bannedUsers,
      usersToday,
      totalAdmins: getCount("ADMIN"),
      totalStaffs: getCount("STAFF"),
      totalOwners: getCount("OWNER"),
      totalBrokers: getCount("BROKER"),
      totalGuests: getCount("GUEST"),
    });
  }),

  updateUser: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { name, role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { ...(name && { name }), ...(role && { role }) },
    });

    res.json({ message: "User updated successfully", data: user });
  }),

  banUser: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { banReason, banExpires } = req.body;

    await prisma.user.update({
      where: { id },
      data: {
        banned: true,
        banReason: banReason || "Banned by admin",
        banExpires: banExpires ? new Date(banExpires) : null,
      },
    });

    res.json({ message: "User banned successfully" });
  }),

  unbanUser: tryCatch(async (req, res) => {
    const { id } = req.params;

    await prisma.user.update({
      where: { id },
      data: { banned: false, banReason: null, banExpires: null },
    });

    res.json({ message: "User unbanned successfully" });
  }),

  deleteUser: tryCatch(async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  }),
};
