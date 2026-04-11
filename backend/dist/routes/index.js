"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = require("express");
const property_routes_1 = require("./v1/property.routes");
const auth_routes_1 = require("./v1/auth.routes");
const users_routes_1 = require("./v1/users.routes");
const rooms_routes_1 = require("./v1/rooms.routes");
const bookings_routes_1 = require("./v1/bookings.routes");
const favorites_routes_1 = require("./v1/favorites.routes");
const dashboard_routes_1 = require("./v1/dashboard.routes");
const registration_request_routes_1 = require("./v1/registration-request.routes");
const commision_routes_1 = require("./v1/commision.routes");
const payments_routes_1 = require("./v1/payments.routes");
const ai_routes_1 = require("./v1/ai.routes");
const activities_routes_1 = require("./v1/activities.routes");
const site_config_routes_1 = require("./v1/site-config.routes");
const chat_routes_1 = require("./v1/chat.routes");
const rootRouter = (0, express_1.Router)();
rootRouter.get("/", (req, res) => {
    res.json({ message: "Server is running successfully" });
});
rootRouter.get("/api/v1/health", (req, res) => {
    res.json({ ok: true });
});
// Change password endpoint — works with Bearer token (mobile) and cookies (desktop)
rootRouter.post("/api/v1/auth/change-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { prisma } = yield Promise.resolve().then(() => __importStar(require("../lib/prisma")));
        const { auth } = yield Promise.resolve().then(() => __importStar(require("../lib/auth")));
        const { fromNodeHeaders } = yield Promise.resolve().then(() => __importStar(require("better-auth/node")));
        let userId = null;
        // Try cookie session first
        const session = yield auth.api.getSession({ headers: fromNodeHeaders(req.headers) }).catch(() => null);
        if ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id) {
            userId = session.user.id;
        }
        else {
            // Try Bearer token
            const token = (_b = req.headers["authorization"]) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", "");
            if (token) {
                const sessionDoc = yield prisma.session.findFirst({ where: { token }, select: { userId: true } });
                if (sessionDoc === null || sessionDoc === void 0 ? void 0 : sessionDoc.userId)
                    userId = sessionDoc.userId;
            }
        }
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword)
            return res.status(400).json({ message: "currentPassword and newPassword are required" });
        if (newPassword.length < 4)
            return res.status(400).json({ message: "New password must be at least 4 characters" });
        // Use better-auth's built-in password verification and hashing
        const ctx = yield auth.$context;
        const account = yield prisma.account.findFirst({ where: { userId, providerId: "credential" } });
        if (!(account === null || account === void 0 ? void 0 : account.password))
            return res.status(400).json({ message: "No password set for this account" });
        const valid = yield ctx.password.verify({ hash: account.password, password: currentPassword });
        if (!valid)
            return res.status(400).json({ message: "Current password is incorrect" });
        const hashed = yield ctx.password.hash(newPassword);
        yield prisma.account.update({ where: { id: account.id }, data: { password: hashed } });
        return res.json({ success: true, message: "Password changed successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: (err === null || err === void 0 ? void 0 : err.message) || "Failed to change password" });
    }
}));
// Public stats endpoint — no auth required
rootRouter.get("/api/v1/public/stats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prisma } = yield Promise.resolve().then(() => __importStar(require("../lib/prisma")));
        const [totalProperties, totalBookings, totalReviews] = yield Promise.all([
            prisma.property.count({ where: { status: "APPROVED", visibility: true } }),
            prisma.booking.count({ where: { status: "APPROVED" } }),
            prisma.review.count(),
        ]);
        res.json({ totalProperties, totalBookings, totalReviews });
    }
    catch (_a) {
        res.json({ totalProperties: 0, totalBookings: 0, totalReviews: 0 });
    }
}));
rootRouter.use("/api/v1/properties", property_routes_1.PropertyRouter);
rootRouter.use("/api/v1/auth", auth_routes_1.AuthRouter);
rootRouter.use("/api/v1/users", users_routes_1.UsersRouter);
rootRouter.use("/api/v1/rooms", rooms_routes_1.RoomsRouter);
rootRouter.use("/api/v1/dashboard", dashboard_routes_1.DashboardRouter);
rootRouter.use("/api/v1/bookings", bookings_routes_1.BookingsRouter);
rootRouter.use("/api/v1/favorites", favorites_routes_1.FavoriteRouter);
rootRouter.use("/api/v1/payments", payments_routes_1.PaymentsRouter);
rootRouter.use("/api/v1/commision-settings", commision_routes_1.CommisionRouter);
rootRouter.use("/api/v1/registration-requests", registration_request_routes_1.RegistrationRequestRouter);
rootRouter.use("/api/v1/ai", ai_routes_1.AiRouter);
rootRouter.use("/api/v1/activities", activities_routes_1.ActivitiesRouter);
rootRouter.use("/api/v1/site-config", site_config_routes_1.SiteConfigRouter);
rootRouter.use("/api/v1/chat", chat_routes_1.ChatRouter);
exports.default = rootRouter;
