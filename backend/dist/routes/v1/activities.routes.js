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
exports.ActivitiesRouter = void 0;
const express_1 = require("express");
const async_handler_1 = require("../../utils/async-handler");
const prisma_1 = require("../../lib/prisma");
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.ActivitiesRouter = router;
router.get("/", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    let where = {};
    if (userRole === "ADMIN") {
        // Admin sees all activities
        where = {};
    }
    else if (userRole === "BROKER") {
        // Broker sees only activities they performed
        where = { userId };
    }
    else if (userRole === "OWNER" || userRole === "STAFF") {
        // Owner/Staff see all activities in their assigned properties
        const managed = yield prisma_1.prisma.managedProperty.findMany({
            where: { userId, role: { in: [userRole] } },
            select: { propertyId: true },
        });
        const propertyIds = [...new Set(managed.map((m) => m.propertyId))];
        where = propertyIds.length ? { propertyId: { in: propertyIds } } : { userId };
    }
    else {
        where = { userId };
    }
    const [activities, total] = yield Promise.all([
        prisma_1.prisma.activity.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
            orderBy: { timestamp: "desc" },
            skip,
            take: Number(limit),
        }),
        prisma_1.prisma.activity.count({ where }),
    ]);
    res.json({ data: activities, total, page: Number(page), limit: Number(limit) });
})));
