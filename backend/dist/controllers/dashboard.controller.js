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
        const [propertiesCount, roomsCount, bookingsCount, guestsCount, ownersCount, adminsCount,] = yield Promise.all([
            prisma_1.prisma.property.count({}),
            prisma_1.prisma.room.count({}),
            prisma_1.prisma.booking.count({}),
            prisma_1.prisma.user.count({
                where: {
                    role: "GUEST",
                },
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "OWNER",
                },
            }),
            prisma_1.prisma.user.count({
                where: {
                    role: "ADMIN",
                },
            }),
        ]);
        res.json({
            propertiesCount,
            roomsCount,
            bookingsCount,
            guestsCount,
            ownersCount,
            adminsCount,
        });
    })),
    getOwnerDashboardStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const [propertiesCount, roomsCount, bookingsCount] = yield Promise.all([
            prisma_1.prisma.property.count({
                where: {
                    ownerId: userId,
                },
            }),
            prisma_1.prisma.room.count({
                where: {
                    property: {
                        ownerId: userId,
                    },
                },
            }),
            prisma_1.prisma.booking.count({
                where: {
                    property: {
                        ownerId: userId,
                    },
                },
            }),
        ]);
        return res.json({
            propertiesCount,
            roomsCount,
            bookingsCount,
        });
    })),
    getStaffDashboardStats: () => { },
    getBrokerDashboardStats: () => { },
};
