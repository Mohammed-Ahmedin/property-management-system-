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
            include: { property: { select: { name: true, id: true } } },
            orderBy: { type: "asc" },
        });
        res.json(commisionSettings);
    })),
    createPlatformCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const data = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const existing = yield prisma_1.prisma.commissionSetting.findFirst({ where: { type: "PLATFORM" } });
        if (existing) {
            res.status(409).json({ message: "Platform commission already exists" });
            return;
        }
        const commission = yield prisma_1.prisma.commissionSetting.create({
            data: {
                type: "PLATFORM",
                name: data.name || "Platform Commission",
                role: data.role || "PLATFORM",
                calcType: data.calcType || "PERCENTAGE",
                platformPercent: (_b = data.platformPercent) !== null && _b !== void 0 ? _b : 0,
                flatAmount: (_c = data.flatAmount) !== null && _c !== void 0 ? _c : null,
                brokerPercent: (_d = data.brokerPercent) !== null && _d !== void 0 ? _d : null,
                isActive: (_e = data.isActive) !== null && _e !== void 0 ? _e : true,
                description: "Commission applied for the platform.",
            },
        });
        if (userId) {
            const desc = commission.calcType === "FLAT_AMOUNT"
                ? `Commission "${commission.name}" (${commission.role}) created. Flat amount: ETB ${commission.flatAmount}`
                : `Commission "${commission.name}" (${commission.role}) created. Platform: ${commission.platformPercent}%, Broker: ${(_f = commission.brokerPercent) !== null && _f !== void 0 ? _f : 0}%`;
            yield prisma_1.prisma.activity.create({
                data: { action: "COMMISSION_CREATED", description: desc, userId, status: "INFO" },
            }).catch(() => { });
        }
        res.json({ success: true, message: "Platform commission added successfully" });
    })),
    createPropertyCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
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
                calcType: data.calcType || "PERCENTAGE",
                property: { connect: { id: data.propertyId } },
                platformPercent: (_b = data.platformPercent) !== null && _b !== void 0 ? _b : 0,
                flatAmount: (_c = data.flatAmount) !== null && _c !== void 0 ? _c : null,
                brokerPercent: (_d = data.brokerPercent) !== null && _d !== void 0 ? _d : null,
                isActive: (_e = data.isActive) !== null && _e !== void 0 ? _e : true,
            },
        });
        if (userId) {
            const desc = commission.calcType === "FLAT_AMOUNT"
                ? `Commission "${commission.name}" (${commission.role}) created for "${property.name}". Flat amount: ETB ${commission.flatAmount}`
                : `Commission "${commission.name}" (${commission.role}) created for "${property.name}". Platform: ${commission.platformPercent}%, Broker: ${(_f = commission.brokerPercent) !== null && _f !== void 0 ? _f : 0}%`;
            yield prisma_1.prisma.activity.create({
                data: { action: "COMMISSION_CREATED", description: desc, userId, status: "INFO" },
            }).catch(() => { });
        }
        res.json({ message: "Commission added successfully", success: true });
    })),
    updateCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
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
                calcType: (_d = data.calcType) !== null && _d !== void 0 ? _d : commission.calcType,
                platformPercent: (_e = data.platformPercent) !== null && _e !== void 0 ? _e : commission.platformPercent,
                flatAmount: (_f = data.flatAmount) !== null && _f !== void 0 ? _f : null,
                brokerPercent: (_g = data.brokerPercent) !== null && _g !== void 0 ? _g : null,
                isActive: (_h = data.isActive) !== null && _h !== void 0 ? _h : commission.isActive,
                updatedAt: new Date(),
            },
        });
        if (userId) {
            const desc = updated.calcType === "FLAT_AMOUNT"
                ? `Commission "${updated.name}" (${updated.role}) updated. Flat amount: ETB ${updated.flatAmount}`
                : `Commission "${updated.name}" (${updated.role}) updated. Platform: ${updated.platformPercent}%, Broker: ${(_j = updated.brokerPercent) !== null && _j !== void 0 ? _j : 0}%`;
            yield prisma_1.prisma.activity.create({
                data: { action: "COMMISSION_UPDATED", description: desc, userId, status: "INFO" },
            }).catch(() => { });
        }
        res.json({ success: true, message: "Commission updated successfully", commission: updated });
    })),
};
