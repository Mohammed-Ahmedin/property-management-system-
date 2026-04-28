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
      // Broker/Staff: return guests who booked properties managed by this user
      const managed = await prisma.managedProperty.findMany({
        where: { userId, role: { in: ["BROKER", "STAFF"] } },
        select: { propertyId: true },
      });
      const propertyIds = managed.map((m) => m.propertyId);

      if (!propertyIds.length) return res.json([]);

      // Get unique userIds from bookings on managed properties
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
    const { name, role, phone, image, companyName, companyDescription, businessFileUrl, nationalId } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(phone !== undefined && { phone }),
        ...(image !== undefined && { image }),
      },
    });

    // Also update the linked registration request if registration fields are provided
    const hasRegFields = companyName !== undefined || companyDescription !== undefined || businessFileUrl !== undefined || nationalId !== undefined || phone !== undefined;
    if (hasRegFields) {
      const regRequest = await prisma.registrationRequest.findFirst({ where: { email: user.email } });
      if (regRequest) {
        const existingJson = (regRequest.json as any) || {};
        await prisma.registrationRequest.update({
          where: { id: regRequest.id },
          data: {
            ...(phone !== undefined && { phone }),
            ...(nationalId !== undefined && { nationalId }),
            json: {
              ...existingJson,
              ...(companyName !== undefined && { companyName }),
              ...(companyDescription !== undefined && { companyDescription }),
              ...(businessFileUrl !== undefined && { businessFileUrl }),
            },
          },
        });
      }
    }

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

  createUser: tryCatch(async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "name, email, password and role are required" });
    }

    // Check if email already exists
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "A user with this email already exists" });
    }

    // Hash password using better-auth's scrypt
    const { auth } = await import("../lib/auth");
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(password);

    // Create user + credential account in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          id: crypto.randomUUID(),
          name,
          email,
          emailVerified: true,
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      await tx.account.create({
        data: {
          id: crypto.randomUUID(),
          userId: newUser.id,
          accountId: newUser.id,
          providerId: "credential",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return newUser;
    });

    res.status(201).json({ message: "User created successfully", data: user });
  }),

  deleteUser: tryCatch(async (req, res) => {
    const { id } = req.params;

    await prisma.user.delete({ where: { id } });

    res.json({ message: "User deleted successfully" });
  }),
};
