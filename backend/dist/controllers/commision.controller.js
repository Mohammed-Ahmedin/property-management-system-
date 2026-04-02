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
        var _a;
        const data = req.body;
        const platformCommision = yield prisma_1.prisma.commissionSetting.findFirst({
            where: { type: "PLATFORM" },
        });
        if (platformCommision) {
            res.status(409).json({
                message: "Platform commision is already added before",
            });
            return;
        }
        // Upsert platform commission (only one allowed)
        const commission = yield prisma_1.prisma.commissionSetting.create({
            data: {
                type: "PLATFORM",
                platformPercent: data.platformPercent,
                brokerPercent: data.brokerPercent,
                isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
                description: data.type === "PLATFORM"
                    ? "Commission applied for the platform."
                    : "Specific commission for a particular property.",
            },
        });
        res.json({
            success: true,
            message: "Platform commison added successfully",
        });
    })),
    createPropertyCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const data = req.body;
        // Optional: validate property exists
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: data.propertyId },
        });
        if (!property)
            return res.status(404).json({ error: "Property not found" });
        const haveAlreadyCommision = yield prisma_1.prisma.commissionSetting.findFirst({
            where: {
                AND: {
                    type: "PROPERTY",
                    propertyId: property.id,
                },
            },
        });
        if (haveAlreadyCommision) {
            res.status(409).json({
                message: "This property already have a own commsion",
                success: false,
            });
            return;
        }
        yield prisma_1.prisma.commissionSetting.create({
            data: {
                type: "PROPERTY",
                propertyId: data.propertyId,
                platformPercent: data.platformPercent,
                brokerPercent: data.brokerPercent,
                isActive: (_a = data.isActive) !== null && _a !== void 0 ? _a : true,
            },
        });
        res.json({
            message: "Added successfull",
            success: true,
        });
    })),
    updateCommision: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const { id } = req.params;
        const data = req.body;
        // --------------------
        // Find existing commission
        // --------------------
        const commission = yield prisma_1.prisma.commissionSetting.findUnique({
            where: { id },
        });
        if (!commission)
            return res.status(404).json({
                success: false,
                message: "Commission not found",
            });
        // --------------------
        // Update commission
        // --------------------
        const updated = yield prisma_1.prisma.commissionSetting.update({
            where: { id },
            data: {
                platformPercent: data.platformPercent,
                brokerPercent: (_a = data.brokerPercent) !== null && _a !== void 0 ? _a : null,
                isActive: (_b = data.isActive) !== null && _b !== void 0 ? _b : commission.isActive,
                updatedAt: new Date(),
            },
        });
        res.json({
            success: true,
            message: "Commission updated successfully",
            commission: updated,
        });
    })),
};
