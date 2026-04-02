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
const async_handler_1 = require("../utils/async-handler");
const prisma_1 = require("../lib/prisma");
exports.default = {
    getAdminDashboardStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Total counts
            const totalUsers = yield prisma_1.prisma.user.count();
            const totalProperties = yield prisma_1.prisma.property.count();
            const totalAdmins = yield prisma_1.prisma.user.count({
                where: { role: "ADMIN" },
            });
            const activeAdmins = yield prisma_1.prisma.user.count({
                where: { role: "ADMIN" },
            });
            const totalBookings = yield prisma_1.prisma.booking.count();
            const totalRooms = yield prisma_1.prisma.room.count();
            // Total income and avg payment
            const payments = yield prisma_1.prisma.payment.findMany();
            const totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
            const avgPaymentValue = payments.length
                ? totalIncome / payments.length
                : 0;
            const totalTransactions = yield prisma_1.prisma.payment.count({
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
        }
        catch (err) {
            res.status(500).json({ error: "Something went wrong" });
        }
    })),
    getOwnerDashboardStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const [propertiesCount, roomsCount, bookingsCount, staffsCount] = yield Promise.all([
            // Count properties owned by this user
            prisma_1.prisma.property.count({
                where: {
                    managers: { some: { role: "OWNER", userId } },
                },
            }),
            // Count rooms under owner's properties
            prisma_1.prisma.room.count({
                where: {
                    property: {
                        managers: { some: { role: "OWNER", userId } },
                    },
                },
            }),
            // Count bookings under owner's properties
            prisma_1.prisma.booking.count({
                where: {
                    property: {
                        managers: { some: { role: "OWNER", userId } },
                    },
                },
            }),
            // Count staffs (users with STAFF role) under owner's properties
            prisma_1.prisma.managedProperty.count({
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
    })),
    getAdminDashboardSummary: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userRole = req.user.role;
        if (userRole !== "ADMIN") {
            res.status(403).json({
                message: "Are you sure lol",
            });
            return;
        }
        const properties = yield prisma_1.prisma.property.findMany({
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
            const revenue = gh.bookings.reduce((sum, b) => { var _a; return sum + (((_a = b.payment) === null || _a === void 0 ? void 0 : _a.amount) || 0); }, 0);
            return {
                name: gh.name,
                bookings,
                revenue,
            };
        });
        res.json(propertyData);
    })),
    // staff
    getStaffDashboardStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const staffId = req.user.id;
        console.log("---------------", { staffId });
        const managed = yield prisma_1.prisma.managedProperty.findFirst({
            where: { userId: staffId },
            include: {
                property: {
                    include: {
                        rooms: true,
                        bookings: true,
                    },
                },
            },
        });
        if (!(managed === null || managed === void 0 ? void 0 : managed.property))
            return null;
        const property = managed.property;
        // 2. Total rooms
        const totalRooms = property.rooms.length;
        // 3. Total booked/occupied rooms
        const totalBookedRooms = property.bookings.filter((b) => ["BOOKED", "CHECKED_IN"].includes(b.status)).length;
        // 4. Total contribution from PAYMENT_SUCCESS
        const totalContribution = property.bookings
            .filter((b) => b.status === "APPROVED")
            .reduce((acc, b) => acc + 0, 0);
        // 5. Occupancy rate
        const occupancyRate = totalRooms > 0 ? (totalBookedRooms / totalRooms) * 100 : 0;
        res.json({
            property: { id: property.id, name: property.name },
            totalContribution,
            totalRooms,
            occupancyRate: Number(occupancyRate.toFixed(2)),
        });
    })),
    getBrokerDashboardStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        // Get unique property IDs where this user is assigned as BROKER
        const managed = yield prisma_1.prisma.managedProperty.findMany({
            where: { userId, role: "BROKER" },
            select: { propertyId: true },
        });
        // Deduplicate
        const propertyIds = [...new Set(managed.map((m) => m.propertyId))];
        if (!propertyIds.length) {
            return res.json({ propertiesCount: 0, roomsCount: 0, bookingsCount: 0 });
        }
        const [propertiesCount, roomsCount, bookingsCount] = yield Promise.all([
            prisma_1.prisma.property.count({ where: { id: { in: propertyIds } } }),
            prisma_1.prisma.room.count({ where: { propertyId: { in: propertyIds } } }),
            prisma_1.prisma.booking.count({ where: { propertyId: { in: propertyIds } } }),
        ]);
        return res.json({ propertiesCount, roomsCount, bookingsCount });
    })),
};
