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
    getCommisionSettings: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const commisionSettings = yield prisma_1.prisma.commissionSetting.findMany({
            include: {
                property: {
                    select: { name: true, id: true },
                },
            },
            orderBy: { type: "asc" },
        });
        res.json(commisionSettings);
    })),
    createPlatformCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const platformCommision = yield prisma_1.prisma.commissionSetting.findFirst({
            where: { type: "PLATFORM" },
        });
        if (platformCommision) {
            res.status(409).json({ message: "Platform commission is already added" });
            return;
        }
        const commission = yield prisma_1.prisma.commissionSetting.create({
            data: {
                type: "PLATFORM",
                name: data.name || "Platform Commission",
                role: data.role || "PLATFORM",
                platformPercent: data.platformPercent,
                brokerPercent: data.brokerPercent,
                isActive: (_b = data.isActive) !== null && _b !== void 0 ? _b : true,
                description: "Commission applied for the platform.",
            },
        });
        // Log to activities
        if (userId) {
            yield prisma_1.prisma.activity.create({
                data: {
                    action: "CREATE_COMMISSION",
                    description: `Commission "${commission.name}" (${commission.role}) created. Platform: ${commission.platformPercent}%, Broker: ${(_c = commission.brokerPercent) !== null && _c !== void 0 ? _c : 0}%`,
                    userId,
                    status: "SUCCESS",
                },
            }).catch(() => { });
        }
        res.json({ success: true, message: "Platform commission added successfully" });
    })),
    createPropertyCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const property = yield prisma_1.prisma.property.findUnique({ where: { id: data.propertyId } });
        if (!property)
            return res.status(404).json({ error: "Property not found" });
        const existing = yield prisma_1.prisma.commissionSetting.findFirst({
            where: { type: "PROPERTY", property: { id: property.id } },
        });
        if (existing) {
            res.status(409).json({ message: "This property already has a commission", success: false });
            return;
        }
        const commission = yield prisma_1.prisma.commissionSetting.create({
            data: {
                type: "PROPERTY",
                name: data.name || `${property.name} Commission`,
                role: data.role || "OWNER",
                property: { connect: { id: data.propertyId } },
                platformPercent: (_b = data.platformPercent) !== null && _b !== void 0 ? _b : 0,
                brokerPercent: data.brokerPercent,
                isActive: (_c = data.isActive) !== null && _c !== void 0 ? _c : true,
            },
        });
        if (userId) {
            yield prisma_1.prisma.activity.create({
                data: {
                    action: "CREATE_COMMISSION",
                    description: `Commission "${commission.name}" (${commission.role}) created for property "${property.name}". Platform: ${commission.platformPercent}%, Broker: ${(_d = commission.brokerPercent) !== null && _d !== void 0 ? _d : 0}%`,
                    userId,
                    status: "SUCCESS",
                },
            }).catch(() => { });
        }
        res.json({ message: "Commission added successfully", success: true });
    })),
    updateCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const { id } = req.params;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const commission = yield prisma_1.prisma.commissionSetting.findUnique({ where: { id } });
        if (!commission)
            return res.status(404).json({ success: false, message: "Commission not found" });
        const updated = yield prisma_1.prisma.commissionSetting.update({
            where: { id },
            data: {
                name: (_b = data.name) !== null && _b !== void 0 ? _b : commission.name,
                role: (_c = data.role) !== null && _c !== void 0 ? _c : commission.role,
                platformPercent: data.platformPercent,
                brokerPercent: (_d = data.brokerPercent) !== null && _d !== void 0 ? _d : null,
                isActive: (_e = data.isActive) !== null && _e !== void 0 ? _e : commission.isActive,
                updatedAt: new Date(),
            },
        });
        if (userId) {
            yield prisma_1.prisma.activity.create({
                data: {
                    action: "UPDATE_COMMISSION",
                    description: `Commission "${updated.name}" (${updated.role}) updated. Platform: ${updated.platformPercent}%, Broker: ${(_f = updated.brokerPercent) !== null && _f !== void 0 ? _f : 0}%`,
                    userId,
                    status: "SUCCESS",
                },
            }).catch(() => { });
        }
        res.json({ success: true, message: "Commission updated successfully", commission: updated });
    })),
};
