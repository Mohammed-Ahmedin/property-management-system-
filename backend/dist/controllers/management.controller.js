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
const prisma_1 = require("../lib/prisma"); // adjust this path to your actual Prisma client
exports.default = {
    // ✅ Get all staff members for a property the current user owns
    getGusetHouseStaffs: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.id;
        const property = yield prisma_1.prisma.property.findFirst({
            where: { id: propertyId },
            include: {
                staffs: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        image: true,
                    },
                },
            },
        });
        res.status(200).json(property === null || property === void 0 ? void 0 : property.staffs);
    })),
    getStaffsForList: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const availableStaffs = yield prisma_1.prisma.user.findMany({
            where: {
                role: "STAFF",
                NOT: { staffPropertyId: { not: null } },
            },
        });
        res.status(200).json(availableStaffs);
    })),
    // ✅ Add a user as staff to a property owned by the current user
    addStaffToProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = req.user.id;
        const { propertyId, userId } = req.body;
        const userDoc = yield prisma_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        // Check if current user owns the property
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property || property.ownerId !== ownerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to manage this property.",
            });
        }
        if (userDoc === null || userDoc === void 0 ? void 0 : userDoc.staffPropertyId) {
            return res.status(400).json({
                success: false,
                message: "User is already assigned as staff to a property.",
            });
        }
        // Update user to be staff
        yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                staffAt: {
                    connect: { id: propertyId },
                },
            },
        });
        res.status(200).json({
            success: true,
            message: "User added as staff to property.",
        });
    })),
    // ✅ Remove a staff member from a property (only if you own it)
    removeStaffFromProperty: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = req.user.id;
        const { userId } = req.body;
        const staffUser = yield prisma_1.prisma.user.findUnique({
            where: { id: userId },
            include: {
                staffAt: true,
            },
        });
        if (!staffUser || !staffUser.staffAt) {
            return res.status(404).json({
                success: false,
                message: "Staff user not found or not assigned.",
            });
        }
        if (staffUser.staffAt.ownerId !== ownerId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to remove this staff member.",
            });
        }
        // Disconnect staff from property
        yield prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                staffAt: {
                    disconnect: true,
                },
            },
        });
        res
            .status(200)
            .json({ success: true, message: "Staff removed from property." });
    })),
};
