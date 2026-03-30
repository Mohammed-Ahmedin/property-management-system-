import { fromNodeHeaders } from "better-auth/node";
import { tryCatch } from "../utils/async-handler";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export default {
  getAdminDashboardStats: tryCatch(async (req, res) => {
    try {
      // Total counts
      const totalUsers = await prisma.user.count();
      const totalProperties = await prisma.property.count();
      const totalAdmins = await prisma.user.count({
        where: { role: "ADMIN" },
      });
      const activeAdmins = await prisma.user.count({
        where: { role: "ADMIN" },
      });
      const totalBookings = await prisma.booking.count();
      const totalRooms = await prisma.room.count();

      // Total income and avg payment
      const payments = await prisma.payment.findMany();
      const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
      const avgPaymentValue = payments.length
        ? totalIncome / payments.length
        : 0;

      const totalTransactions = await prisma.payment.count({
        where: { status: "SUCCESS" },
      });
      res.json({
        totalUsers,
        totalProperties,
        totalAdmins,
        activeAdmins,
        totalBookings,
        totalRooms,
        totalIncome,
        totalTransactions,
        avgPaymentValue,
      });
    } catch (err) {
      res.status(500).json({ error: "Something went wrong" });
    }
  }),
  getOwnerDashboardStats: tryCatch(async (req, res) => {
    const userId = (req as any).user.id;

    const [propertiesCount, roomsCount, bookingsCount, staffsCount] =
      await Promise.all([
        // Count properties owned by this user
        prisma.property.count({
          where: {
            managers: { some: { role: "OWNER", userId } },
          },
        }),

        // Count rooms under owner's properties
        prisma.room.count({
          where: {
            property: {
              managers: { some: { role: "OWNER", userId } },
            },
          },
        }),

        // Count bookings under owner's properties
        prisma.booking.count({
          where: {
            property: {
              managers: { some: { role: "OWNER", userId } },
            },
          },
        }),

        // Count staffs (users with STAFF role) under owner's properties
        prisma.managedProperty.count({
          where: {
            property: {
              managers: { some: { role: "OWNER", userId } },
            },
            role: "STAFF",
          },
        }),
      ]);

    return res.json({
      propertiesCount,
      roomsCount,
      bookingsCount,
      staffsCount,
    });
  }),
  getAdminDashboardSummary: tryCatch(async (req, res) => {
    const userRole = req.user.role;

    if (userRole !== "ADMIN") {
      res.status(403).json({
        message: "Are you sure lol",
      });
      return;
    }

    const properties = await prisma.property.findMany({
      include: {
        bookings: {
          include: {
            payment: true,
          },
        },
      },
    });

    const propertyData = properties.map((gh) => {
      const bookings = gh.bookings.length;
      const revenue = gh.bookings.reduce(
        (sum, b) => sum + (b.payment?.amount || 0),
        0
      );
      return {
        name: gh.name,
        bookings,
        revenue,
      };
    });

    res.json(propertyData);
  }),

  // staff
  getStaffDashboardStats: tryCatch(async (req, res) => {
    const staffId = req.user.id;

    console.log("---------------", { staffId });
    const managed = await prisma.managedProperty.findFirst({
      where: { userId: staffId! },
      include: {
        property: {
          include: {
            rooms: true,
            bookings: true,
          },
        },
      },
    });

    if (!managed?.property) return null;

    const property = managed.property;

    // 2. Total rooms
    const totalRooms = property.rooms.length;

    // 3. Total booked/occupied rooms
    const totalBookedRooms = property.bookings.filter((b) =>
      ["BOOKED", "CHECKED_IN"].includes(b.status)
    ).length;

    // 4. Total contribution from PAYMENT_SUCCESS
    const totalContribution = property.bookings
      .filter((b) => b.status === "APPROVED")
      .reduce((acc, b) => acc + 0, 0);

    // 5. Occupancy rate
    const occupancyRate =
      totalRooms > 0 ? (totalBookedRooms / totalRooms) * 100 : 0;

    res.json({
      property: { id: property.id, name: property.name },
      totalContribution,
      totalRooms,
      occupancyRate: Number(occupancyRate.toFixed(2)),
    });
  }),
  getBrokerDashboardStats: tryCatch(async (req, res) => {
    const userId = (req as any).user.id;

    // Get all property IDs where this user is assigned (any role)
    const managed = await prisma.managedProperty.findMany({
      where: { userId },
      select: { propertyId: true },
    });
    const propertyIds = managed.map((m) => m.propertyId);

    if (!propertyIds.length) {
      return res.json({ propertiesCount: 0, roomsCount: 0, bookingsCount: 0 });
    }

    const [propertiesCount, roomsCount, bookingsCount] = await Promise.all([
      prisma.property.count({ where: { id: { in: propertyIds } } }),
      prisma.room.count({ where: { propertyId: { in: propertyIds } } }),
      prisma.booking.count({ where: { propertyId: { in: propertyIds } } }),
    ]);

    return res.json({ propertiesCount, roomsCount, bookingsCount });
  }),
};
