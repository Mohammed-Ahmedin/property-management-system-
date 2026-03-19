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
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
const validators_1 = require("./validators");
const prisma_1 = require("../lib/prisma");
/* -------------------- Controller -------------------- */
exports.default = {
    // ✅ Add to favorites
    addFavorite: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!(session === null || session === void 0 ? void 0 : session.user))
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = validators_1.AddFavoriteSchema.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ error: "Invalid input", details: parsed.error.format() });
        }
        const { roomId, propertyId } = parsed.data;
        const favorite = yield prisma_1.prisma.favorite.upsert({
            where: {
                userId_roomId_propertyId: {
                    userId: session.user.id,
                    roomId: roomId !== null && roomId !== void 0 ? roomId : null,
                    propertyId: propertyId !== null && propertyId !== void 0 ? propertyId : null,
                },
            },
            create: {
                userId: session.user.id,
                roomId,
                propertyId,
            },
            update: {}, // No update needed (idempotent)
            include: {
                room: true,
                property: true,
            },
        });
        res.status(201).json({ message: "Added to favorites", favorite });
    })),
    // ✅ Remove from favorites
    removeFavorite: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!(session === null || session === void 0 ? void 0 : session.user))
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = validators_1.AddFavoriteSchema.safeParse(req.body);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ error: "Invalid input", details: parsed.error.format() });
        }
        const { roomId, propertyId } = parsed.data;
        const existing = yield prisma_1.prisma.favorite.findUnique({
            where: {
                userId_roomId_propertyId: {
                    userId: session.user.id,
                    roomId: roomId !== null && roomId !== void 0 ? roomId : null,
                    propertyId: propertyId !== null && propertyId !== void 0 ? propertyId : null,
                },
            },
        });
        if (!existing) {
            return res.status(404).json({ error: "Favorite not found" });
        }
        yield prisma_1.prisma.favorite.delete({
            where: { id: existing.id },
        });
        res.json({ message: "Removed from favorites" });
    })),
    // ✅ Get all favorites for the logged-in user
    getMyFavorites: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!(session === null || session === void 0 ? void 0 : session.user))
            return res.status(401).json({ error: "Unauthorized" });
        const favorites = yield prisma_1.prisma.favorite.findMany({
            where: { userId: session.user.id },
            include: {
                room: { include: { property: true } },
                property: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ favorites });
    })),
    // ✅ Check if a specific room/property is favorited
    isFavorited: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield auth_1.auth.api.getSession({
            headers: (0, node_1.fromNodeHeaders)(req.headers),
        });
        if (!(session === null || session === void 0 ? void 0 : session.user))
            return res.status(401).json({ error: "Unauthorized" });
        const parsed = validators_1.AddFavoriteSchema.safeParse(req.query);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ error: "Invalid query", details: parsed.error.format() });
        }
        const { roomId, propertyId } = parsed.data;
        const favorite = yield prisma_1.prisma.favorite.findUnique({
            where: {
                userId_roomId_propertyId: {
                    userId: session.user.id,
                    roomId: roomId !== null && roomId !== void 0 ? roomId : null,
                    propertyId: propertyId !== null && propertyId !== void 0 ? propertyId : null,
                },
            },
        });
        res.json({ favorited: !!favorite });
    })),
};
