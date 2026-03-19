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
exports.default = {
    getRooms: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        // Extract query params
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortField = req.query.sortField || "createdAt";
        const sortDirection = req.query.sortDirection || "desc";
        const search = req.query.search || "";
        const type = req.query.type || "";
        const propertyId = req.query.propertyId || "";
        // Only owner role-based access
        const roleWhere = {};
        roleWhere.property = { ownerId: userId };
        // Build filtering conditions
        const where = Object.assign({}, roleWhere);
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { property: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
        if (type)
            where.type = type;
        if (propertyId)
            where.propertyId = propertyId;
        // Pagination
        const totalItems = yield prisma.room.count({ where });
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
        // Sorting
        const validSortFields = [
            "id",
            "name",
            "type",
            "price",
            "createdAt",
            "updatedAt",
        ];
        const orderBy = {};
        orderBy[validSortFields.includes(sortField) ? sortField : "createdAt"] =
            sortDirection;
        // Fetch rooms
        const rooms = yield prisma.room.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                features: true,
                services: true,
                images: true,
                bookings: true,
                property: true,
                _count: { select: { bookings: true } },
            },
        });
        // Response
        res.json({
            data: rooms || [],
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                limit,
                hasMore: page < totalPages,
                previousPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            },
            sort: { field: sortField, direction: sortDirection },
            filters: { search, type, propertyId },
        });
    })),
    getRoomStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        // Get total rooms
        const totalRooms = yield prisma.room.count({
            where: {
                property: {
                    ownerId: userId,
                },
            },
        });
        // Example: if your Room model has "status" or "availability" field
        const availableRooms = yield prisma.room.count({
            where: {
                property: {
                    ownerId: userId,
                },
                availability: true,
            },
        });
        const bookedRooms = yield prisma.room.count({
            where: {
                property: {
                    ownerId: userId,
                },
                bookings: {
                    some: {
                        status: "APPROVED",
                    },
                },
            },
        });
        const pendingRooms = yield prisma.room.count({
            where: {
                property: {
                    ownerId: userId,
                },
                bookings: {
                    some: {
                        status: "PENDING",
                    },
                },
            },
        });
        // Send response
        res.json({
            totalRooms,
            availableRooms,
            bookedRooms,
            pendingRooms,
        });
    })),
    getRoomById: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.id;
        const room = yield prisma.room.findUnique({
            where: { id: roomId },
            include: {
                images: true,
                features: true,
                services: true,
                bookings: true,
                _count: {
                    select: { bookings: true, features: true, services: true },
                },
            },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room);
    })),
};
