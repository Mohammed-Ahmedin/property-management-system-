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
    getClients: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        let guests = [];
        if (userRole === "ADMIN") {
            guests = yield prisma_1.prisma.user.findMany({
                where: { role: "GUEST" },
                select: { id: true, name: true, email: true, image: true, phone: true, banned: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            });
        }
        else {
            // Broker/Staff: return guests who booked properties managed by this user
            const managed = yield prisma_1.prisma.managedProperty.findMany({
                where: { userId, role: { in: ["BROKER", "STAFF"] } },
                select: { propertyId: true },
            });
            const propertyIds = managed.map((m) => m.propertyId);
            if (!propertyIds.length)
                return res.json([]);
            // Get unique userIds from bookings on managed properties
            const bookings = yield prisma_1.prisma.booking.findMany({
                where: { propertyId: { in: propertyIds }, userId: { not: null } },
                select: { userId: true },
                distinct: ["userId"],
            });
            const userIds = bookings.map((b) => b.userId).filter(Boolean);
            if (!userIds.length)
                return res.json([]);
            guests = yield prisma_1.prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, name: true, email: true, image: true, phone: true, banned: true, createdAt: true },
                orderBy: { createdAt: "desc" },
            });
        }
        res.json(guests);
    })),
    getUsers: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const users = yield prisma_1.prisma.user.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json({ data: users });
    })),
    getStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const [totalUsers, verifiedUsers, bannedUsers, usersToday, roleCounts] = yield Promise.all([
            prisma_1.prisma.user.count(),
            prisma_1.prisma.user.count({ where: { emailVerified: true } }),
            prisma_1.prisma.user.count({ where: { banned: true } }),
            prisma_1.prisma.user.count({
                where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
            }),
            prisma_1.prisma.user.groupBy({ by: ["role"], _count: { role: true } }),
        ]);
        const getCount = (role) => { var _a; return ((_a = roleCounts.find((r) => r.role === role)) === null || _a === void 0 ? void 0 : _a._count.role) || 0; };
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
    })),
    updateUser: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { name, role } = req.body;
        const user = yield prisma_1.prisma.user.update({
            where: { id },
            data: Object.assign(Object.assign({}, (name && { name })), (role && { role })),
        });
        res.json({ message: "User updated successfully", data: user });
    })),
    banUser: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { banReason, banExpires } = req.body;
        yield prisma_1.prisma.user.update({
            where: { id },
            data: {
                banned: true,
                banReason: banReason || "Banned by admin",
                banExpires: banExpires ? new Date(banExpires) : null,
            },
        });
        res.json({ message: "User banned successfully" });
    })),
    unbanUser: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        yield prisma_1.prisma.user.update({
            where: { id },
            data: { banned: false, banReason: null, banExpires: null },
        });
        res.json({ message: "User unbanned successfully" });
    })),
    deleteUser: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        yield prisma_1.prisma.user.delete({ where: { id } });
        res.json({ message: "User deleted successfully" });
    })),
};
