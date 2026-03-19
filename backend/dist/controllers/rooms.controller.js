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
const rooms_validator_1 = require("./validators/rooms.validator");
const prisma_1 = require("../lib/prisma");
exports.default = {
    getRooms: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.propertyId;
        const rooms = yield prisma_1.prisma.room.findMany({
            where: {
                id: propertyId,
            },
            include: {
                images: true,
                features: true,
            },
        });
        res.status(200).json(rooms);
    })),
    getRoomById: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.id;
        const room = yield prisma_1.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                images: true,
                features: true,
                services: true,
            },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        res.status(200).json(room);
    })),
    getRoomsForAdminsList: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.propertyId;
        const rooms = yield prisma_1.prisma.room.findMany({
            where: { propertyId },
            select: {
                name: true,
                id: true,
                images: true,
                bookings: true,
                createdAt: true,
                description: true,
                property: {
                    select: {
                        images: true,
                        id: true,
                        name: true,
                    },
                },
                price: true,
                roomId: true,
                type: true,
            },
        });
        return res.status(200).json(rooms);
    })),
    getRoomsForAdmins: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        console.log(req.user);
        // Extract query params
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortField = req.query.sortField || "createdAt";
        const sortDirection = req.query.sortDirection || "desc";
        const search = req.query.search || "";
        const type = req.query.type || "";
        const propertyId = req.query.propertyId || "";
        // Build role-based access conditions
        const roleWhere = {};
        switch (userRole) {
            case "ADMIN":
                // Admin has access to all rooms
                break;
            case "OWNER":
                // Owner has access to their properties
                roleWhere.property = { ownerId: userId };
                break;
            case "STAFF":
                // Staff has access only to the property they belong to
                const staffHouse = yield prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { staffPropertyId: true },
                });
                if (!(staffHouse === null || staffHouse === void 0 ? void 0 : staffHouse.staffPropertyId)) {
                    return res
                        .status(403)
                        .json({ message: "Access denied. No assigned property." });
                }
                roleWhere.propertyId = staffHouse.staffPropertyId;
                break;
            case "BROKER":
                // Broker has access to rooms in properties they broker
                roleWhere.property = { brokerId: userId };
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
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
        const totalItems = yield prisma_1.prisma.room.count({ where });
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
        const rooms = yield prisma_1.prisma.room.findMany({
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
    createRoom: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const user = req.body.user;
        const role = user === null || user === void 0 ? void 0 : user.role;
        // ✅ Validate request body
        const validatedData = rooms_validator_1.createRoomSchema.parse(req.body);
        // ✅ Check if property exists
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: validatedData.propertyId },
        });
        const roomByRoomId = yield prisma_1.prisma.room.findFirst({
            where: {
                roomId: validatedData.roomId,
                propertyId: validatedData.propertyId,
            },
        });
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (roomByRoomId) {
            return res.status(409).json({
                message: "This room id already registerd in this property",
            });
        }
        // (Optional) Authorization check
        // if (property.ownerId !== user.id && role !== "ADMIN") {
        //   return res.status(403).json({
        //     message: "You are not authorized to add rooms to this property",
        //   });
        // }
        // ✅ Transform validated data to Prisma-compatible structure
        const transformedData = {
            name: validatedData.name,
            roomId: validatedData.roomId,
            type: validatedData.type || "SINGLE",
            price: validatedData.price,
            description: validatedData.description,
            availability: (_a = validatedData.availability) !== null && _a !== void 0 ? _a : true,
            squareMeters: validatedData.squareMeters,
            maxOccupancy: validatedData.maxOccupancy,
            propertyId: validatedData.propertyId,
            // ✅ Nested relational data
            features: ((_b = validatedData.features) === null || _b === void 0 ? void 0 : _b.length)
                ? {
                    create: validatedData.features.map((feature) => {
                        var _a, _b;
                        return ({
                            category: (_a = feature.category) !== null && _a !== void 0 ? _a : null,
                            name: feature.name,
                            value: (_b = feature.value) !== null && _b !== void 0 ? _b : null,
                        });
                    }),
                }
                : undefined,
            images: ((_c = validatedData.images) === null || _c === void 0 ? void 0 : _c.length)
                ? {
                    create: validatedData.images.map((img) => {
                        var _a;
                        return ({
                            url: img.url,
                            name: (_a = img.name) !== null && _a !== void 0 ? _a : null,
                        });
                    }),
                }
                : undefined,
            services: ((_d = validatedData.services) === null || _d === void 0 ? void 0 : _d.length)
                ? {
                    create: validatedData.services.map((service) => {
                        var _a, _b, _c;
                        return ({
                            name: service.name,
                            description: (_a = service.description) !== null && _a !== void 0 ? _a : null,
                            price: (_b = service.price) !== null && _b !== void 0 ? _b : 0,
                            isActive: (_c = service.isActive) !== null && _c !== void 0 ? _c : true,
                        });
                    }),
                }
                : undefined,
        };
        // ✅ Create new room with nested relations
        const newRoom = yield prisma_1.prisma.room.create({
            data: transformedData,
            include: {
                features: true,
                images: true,
                services: true,
            },
        });
        res.status(201).json({
            message: "Room created successfully",
            success: true,
            data: newRoom,
        });
    })),
    deleteRoom: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.body.user;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const role = user === null || user === void 0 ? void 0 : user.role;
        const roomId = req.params.id;
        // Validate body
        // Check property ownership
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: roomId },
        });
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (property.ownerId !== userId && role !== "ADMIN") {
            return res.status(403).json({
                message: "You are not authorized to add rooms to this property",
            });
        }
        res.status(201).json({
            message: "Room deleted successfull",
        });
    })),
    getRoomStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        const roleWhere = {};
        // Role-based filtering — same logic as your getRoomsForAdmins
        switch (userRole) {
            case "ADMIN":
                // Can see all stats
                break;
            case "OWNER":
                roleWhere.property = { ownerId: userId };
                break;
            case "STAFF":
                const staffHouse = yield prisma_1.prisma.user.findUnique({
                    where: { id: userId },
                    select: { staffPropertyId: true },
                });
                if (!(staffHouse === null || staffHouse === void 0 ? void 0 : staffHouse.staffPropertyId)) {
                    return res
                        .status(403)
                        .json({ message: "Access denied. No assigned property." });
                }
                roleWhere.propertyId = staffHouse.staffPropertyId;
                break;
            case "BROKER":
                roleWhere.property = { brokerId: userId };
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
        // Get total rooms
        const totalRooms = yield prisma_1.prisma.room.count({
            where: roleWhere,
        });
        // Example: if your Room model has "status" or "availability" field
        const availableRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, roleWhere), { status: "AVAILABLE" }),
        });
        const bookedRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, roleWhere), { bookings: {
                    some: {
                        status: "CONFIRMED", // adjust depending on your Booking model
                    },
                } }),
        });
        const pendingRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, roleWhere), { bookings: {
                    some: {
                        status: "PENDING",
                    },
                } }),
        });
        // Optional: group by type (e.g., SINGLE, DOUBLE, SUITE)
        const roomsByType = yield prisma_1.prisma.room.groupBy({
            by: ["type"],
            _count: { type: true },
            where: roleWhere,
        });
        // Send response
        res.json({
            totalRooms,
            availableRooms,
            bookedRooms,
            pendingRooms,
        });
    })),
    updateRoom: (0, async_handler_1.tryCatch)(() => __awaiter(void 0, void 0, void 0, function* () { })),
    addServices: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        // Ensure room exists
        const room = yield prisma_1.prisma.room.findUnique({
            where: { id: roomId },
        });
        if (!room) {
            return res.status(404).json({ error: "Room not found" });
        }
        // Handle single or multiple services
        const services = Array.isArray(req.body) ? req.body : [req.body];
        // Validate input
        const validatedServices = services.map((service) => rooms_validator_1.serviceSchema.parse(service));
        // Create multiple services at once
        const createdServices = yield prisma_1.prisma.additionalService.createMany({
            data: validatedServices.map((service) => (Object.assign(Object.assign({}, service), { roomId }))),
        });
        res.status(201).json({
            message: "Services added successfully",
            count: createdServices.count,
        });
    })),
    updateService: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { serviceId } = req.params;
        const validatedData = rooms_validator_1.updateServiceSchema.parse(req.body);
        // 1️⃣ Check if service exists
        const existingService = yield prisma_1.prisma.additionalService.findUnique({
            where: { id: serviceId },
        });
        if (!existingService) {
            return res.status(404).json({ error: "Service not found" });
        }
        // 2️⃣ Update service
        const updatedService = yield prisma_1.prisma.additionalService.update({
            where: { id: serviceId },
            data: validatedData,
        });
        console.log({ updatedService });
        // 3️⃣ Respond
        return res.status(200).json({
            message: "Service updated successfully",
            success: true,
        });
    })),
    getRoomServices: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId } = req.params;
        const roomServices = yield prisma_1.prisma.additionalService.findMany({
            where: {
                roomId: roomId,
            },
        });
        res.json(roomServices);
    })),
};
