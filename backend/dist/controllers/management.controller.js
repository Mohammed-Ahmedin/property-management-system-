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
const auth_1 = require("../lib/auth");
exports.default = {
    // ✅ Get all staff members across all properties the current user manages
    getStaffsForList: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        let propertyIds = [];
        if (userRole === "ADMIN") {
            const all = yield prisma_1.prisma.property.findMany({ select: { id: true } });
            propertyIds = all.map((p) => p.id);
        }
        else {
            const managed = yield prisma_1.prisma.managedProperty.findMany({
                where: { userId, role: { in: ["OWNER", "BROKER"] } },
                select: { propertyId: true },
            });
            propertyIds = managed.map((m) => m.propertyId);
        }
        if (!propertyIds.length)
            return res.json([]);
        const staffRecords = yield prisma_1.prisma.managedProperty.findMany({
            where: { propertyId: { in: propertyIds }, role: { in: ["STAFF", "BROKER"] } },
            select: {
                role: true,
                user: { select: { id: true, name: true, email: true, image: true, role: true } },
                property: { select: { id: true, name: true } },
            },
        });
        // deduplicate by user id, keep role from ManagedProperty
        const seen = new Set();
        const staffs = staffRecords
            .filter((r) => {
            if (seen.has(r.user.id))
                return false;
            seen.add(r.user.id);
            return true;
        })
            .map((r) => (Object.assign(Object.assign({}, r.user), { role: r.role })));
        res.json(staffs);
    })),
    // ✅ Get all staff members for a property the current user owns
    getPropertyStaffs: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.propertyId;
        const property = yield prisma_1.prisma.property.findFirst({
            where: { id: propertyId },
            include: {
                managers: {
                    where: {
                        role: { in: ["STAFF", "BROKER"] },
                    },
                    select: {
                        role: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });
        let staffs = property.managers.map((m) => {
            return Object.assign(Object.assign({}, m.user), { role: m.role });
        });
        res.status(200).json(staffs);
    })),
    // ✅ Add a staff to a property (create user if not exists)
    addStaffToProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = req.user.id;
        const { propertyId, email, name, phone, password } = req.body;
        // 1️⃣ Check if the property exists and is owned by current user
        let property;
        if (req.user.role === "ADMIN") {
            property = yield prisma_1.prisma.property.findFirst({
                where: {
                    id: propertyId,
                },
            });
        }
        else {
            property = yield prisma_1.prisma.property.findFirst({
                where: {
                    id: propertyId,
                    managers: {
                        some: {
                            OR: [
                                { userId: ownerId, role: "OWNER" },
                                { userId: ownerId, role: "ADMIN" },
                                { userId: ownerId, role: "BROKER" },
                            ],
                        },
                    },
                },
            });
        }
        if (!property) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to manage this property.",
            });
        }
        // 2️⃣ Find or create the user
        let staff = yield prisma_1.prisma.user.findUnique({ where: { email } });
        let staffId = staff === null || staff === void 0 ? void 0 : staff.id;
        if (staffId) {
            // Check if already assigned to this property
            const existing = yield prisma_1.prisma.managedProperty.findUnique({
                where: { userId_propertyId: { userId: staffId, propertyId } },
            });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "User is already assigned to this property.",
                });
            }
            // User exists — just assign them to the property
            yield prisma_1.prisma.managedProperty.create({
                data: { userId: staffId, propertyId, role: "STAFF" },
            });
            return res.status(200).json({
                success: true,
                message: "Existing user successfully added as staff to property.",
            });
        }
        // User doesn't exist — create new account
        const response = yield auth_1.auth.api.signUpEmail({
            body: { email, password, name, role: "STAFF", phone: phone },
        });
        staffId = response.user.id;
        // Create ManagedProperty record with role STAFF
        yield prisma_1.prisma.managedProperty.create({
            data: { userId: staffId, propertyId, role: "STAFF" },
        });
        res.status(200).json({
            success: true,
            message: "User successfully added as staff to property.",
        });
    })),
    // ✅ Remove a staff member from a property (only if you own it)
    removeStaffFromProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = req.user.id;
        const authRole = req.user.role;
        const { propertyId, userId } = req.body;
        let property;
        if (authRole === "ADMIN") {
            property = yield prisma_1.prisma.property.findFirst({
                where: {
                    id: propertyId,
                },
            });
        }
        else {
            // 1️⃣ Check if the property exists and is owned by current user
            property = yield prisma_1.prisma.property.findFirst({
                where: {
                    id: propertyId,
                    managers: {
                        some: {
                            OR: [
                                { userId: ownerId, role: "OWNER" },
                                { userId: ownerId, role: "ADMIN" },
                                { userId: ownerId, role: "BROKER" },
                            ],
                        },
                    },
                },
            });
        }
        if (!property) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to manage this property.",
            });
        }
        // 2️⃣ Check if the user is a staff of this property
        const staffRecord = yield prisma_1.prisma.managedProperty.findUnique({
            where: { userId_propertyId: { userId, propertyId } },
        });
        if (!staffRecord || staffRecord.role === "OWNER") {
            return res.status(404).json({
                success: false,
                message: "Staff user not found or cannot remove owner.",
            });
        }
        // 3️⃣ Delete the ManagedProperty record
        yield prisma_1.prisma.managedProperty.delete({
            where: { id: staffRecord.id },
        });
        res.status(200).json({
            success: true,
            message: "Staff removed from property successfully.",
        });
    })),
    // ✅ Add an approved broker to a property by email
    addBrokerToProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const ownerId = req.user.id;
        const { propertyId, email, name } = req.body;
        if (!email)
            return res.status(400).json({ success: false, message: "Email is required." });
        // Check property ownership
        const property = yield prisma_1.prisma.property.findFirst({
            where: {
                id: propertyId,
                managers: { some: { userId: ownerId, role: "OWNER" } },
            },
        });
        if (!property) {
            return res.status(403).json({ success: false, message: "Not authorized to manage this property." });
        }
        // Find user by email — must exist and be an approved BROKER
        const broker = yield prisma_1.prisma.user.findUnique({ where: { email } });
        if (!broker) {
            return res.status(404).json({ success: false, message: "No user found with this email." });
        }
        if (broker.role !== "BROKER") {
            return res.status(400).json({
                success: false,
                message: "This user is not an approved broker. They must register and be approved by admin first.",
            });
        }
        // Check if already assigned
        const existing = yield prisma_1.prisma.managedProperty.findUnique({
            where: { userId_propertyId: { userId: broker.id, propertyId } },
        });
        if (existing) {
            return res.status(400).json({ success: false, message: "Broker is already assigned to this property." });
        }
        yield prisma_1.prisma.managedProperty.create({
            data: { userId: broker.id, propertyId, role: "BROKER" },
        });
        return res.status(200).json({ success: true, message: "Broker added to property successfully." });
    })),
};
