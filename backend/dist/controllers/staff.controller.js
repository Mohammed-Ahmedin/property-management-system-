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
        // Staff has access only to the property they belong to
        const staffHouse = yield prisma.user.findUnique({
            where: { id: userId },
            select: { staffPropertyId: true },
        });
        if (!(staffHouse === null || staffHouse === void 0 ? void 0 : staffHouse.staffPropertyId)) {
            return res
                .status(403)
                .json({ message: "Access denied. No assigned property." });
        }
        roleWhere.propertyId = staffHouse.staffPropertyId;
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
};
