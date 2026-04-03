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
                property: {
                    select: { discountPercent: true, id: true, name: true },
                },
                bookings: {
                    where: { status: { in: ["PENDING", "APPROVED"] } },
                    select: { checkIn: true, checkOut: true },
                },
            },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        // Compute real availability: no active bookings overlapping today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const hasActiveBooking = room.bookings.some((b) => b.checkIn && b.checkOut && new Date(b.checkOut) >= today);
        res.status(200).json({
            data: Object.assign(Object.assign({}, room), { availability: !hasActiveBooking }),
            success: true,
        });
    })),
    //management
    getRoomsForManagmentList: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    getRoomsForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        // Extract query params
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortField = req.query.sortField || "createdAt";
        const sortDirection = req.query.sortDirection || "desc";
        const search = req.query.search || "";
        const type = req.query.type || "";
        const propertyId = req.query.propertyId || "";
        // Role-based property access
        let propertyIds = [];
        switch (userRole) {
            case "ADMIN":
                // Admin sees all properties
                break;
            case "OWNER":
            case "STAFF":
            case "BROKER":
                // Find properties assigned via ManagedProperty
                const managed = yield prisma_1.prisma.managedProperty.findMany({
                    where: {
                        userId,
                        role: userRole,
                    },
                    select: { propertyId: true },
                });
                propertyIds = managed.map((m) => m.propertyId);
                if (propertyIds.length === 0) {
                    return res.json([]);
                }
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
        // Build filtering conditions
        const where = {};
        if (propertyIds.length)
            where.propertyId = { in: propertyIds };
        if (propertyId)
            where.propertyId = propertyId;
        if (type)
            where.type = type;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { property: { name: { contains: search, mode: "insensitive" } } },
            ];
        }
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
                message: "This room ID is already used in this property. Please use a different room ID.",
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
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const role = user === null || user === void 0 ? void 0 : user.role;
        const roomId = req.params.id;
        const room = yield prisma_1.prisma.room.findUnique({
            where: { id: roomId },
            include: { property: { include: { managers: true } } },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const managed = yield prisma_1.prisma.managedProperty.findFirst({
            where: { userId, propertyId: room.property.id, role: { in: ["OWNER", "ADMIN"] } },
        });
        if (!managed && role !== "ADMIN") {
            return res.status(403).json({ message: "You are not authorized to delete rooms in this property" });
        }
        // Delete dependents first to avoid FK violations
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // Get booking IDs for this room
            const bookings = yield tx.booking.findMany({
                where: { roomId },
                select: { id: true },
            });
            const bookingIds = bookings.map((b) => b.id);
            // Delete booking dependents
            if (bookingIds.length) {
                yield tx.commission.deleteMany({ where: { bookingId: { in: bookingIds } } });
                yield tx.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
                yield tx.activity.deleteMany({ where: { bookingId: { in: bookingIds } } });
            }
            yield tx.booking.deleteMany({ where: { roomId } });
            yield tx.additionalService.deleteMany({ where: { roomId } });
            yield tx.roomFeature.deleteMany({ where: { roomId } });
            yield tx.roomImage.deleteMany({ where: { roomId } });
            yield tx.favorite.deleteMany({ where: { roomId } });
            yield tx.activity.deleteMany({ where: { roomId } });
            yield tx.room.delete({ where: { id: roomId } });
        }));
        res.status(200).json({ message: "Room deleted successfully", success: true });
    })),
    getRoomDetailForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        const roomId = req.params.roomId;
        // Find the room with its property
        const room = yield prisma_1.prisma.room.findUnique({
            where: { id: roomId },
            include: {
                property: { include: { managers: { include: { user: true } } } },
                features: true,
                services: true,
                images: true,
                bookings: true,
                _count: {
                    select: { bookings: true, features: true, services: true },
                },
            },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const property = room.property;
        // Check access via ManagedProperty
        let hasAccess = false;
        if (userRole === "ADMIN") {
            hasAccess = true;
        }
        else {
            const managed = yield prisma_1.prisma.managedProperty.findFirst({
                where: {
                    userId,
                    propertyId: property.id,
                    role: { in: ["OWNER", "STAFF", "BROKER"] }, // roles allowed
                },
            });
            hasAccess = !!managed;
        }
        if (!hasAccess) {
            return res.status(403).json({ message: "Access denied" });
        }
        // Prepare staffs array for consistency
        const staffs = property.managers
            .filter((m) => m.role === "STAFF")
            .map((m) => m.user);
        // Send response
        res.json(Object.assign(Object.assign({}, room), { property: Object.assign(Object.assign({}, property), { staffs }) }));
    })),
    getRoomStatsForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        // Determine properties the user can access
        let propertyIds = [];
        switch (userRole) {
            case "ADMIN":
                // Admin can access all properties
                break;
            case "OWNER":
            case "STAFF":
            case "BROKER":
                const managed = yield prisma_1.prisma.managedProperty.findMany({
                    where: { userId, role: userRole },
                    select: { propertyId: true },
                });
                propertyIds = managed.map((m) => m.propertyId);
                if (!propertyIds.length) {
                    return res.json({
                        totalRooms: 0,
                        availableRooms: 0,
                        bookedRooms: 0,
                        pendingRooms: 0,
                        roomsByType: 0,
                    });
                }
                break;
            default:
                return res.json({
                    totalRooms: 0,
                    availableRooms: 0,
                    bookedRooms: 0,
                    pendingRooms: 0,
                    roomsByType: 0,
                });
        }
        const where = propertyIds.length
            ? { propertyId: { in: propertyIds } }
            : {};
        // Total rooms
        const totalRooms = yield prisma_1.prisma.room.count({ where });
        // Example fields — adjust according to your schema
        const availableRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, where), { availability: true }),
        });
        const bookedRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, where), { bookings: { some: { status: "APPROVED" } } }),
        });
        const pendingRooms = yield prisma_1.prisma.room.count({
            where: Object.assign(Object.assign({}, where), { bookings: { some: { status: "PENDING" } } }),
        });
        // Optional: group by type
        const roomsByType = yield prisma_1.prisma.room.groupBy({
            by: ["type"],
            _count: { type: true },
            where,
        });
        res.json({
            totalRooms,
            availableRooms,
            bookedRooms,
            pendingRooms,
            roomsByType,
        });
    })),
    updateRoom: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.id;
        const { name, type, price, description, maxOccupancy, squareMeters, availability } = req.body;
        const room = yield prisma_1.prisma.room.findUnique({ where: { id: roomId } });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        const updated = yield prisma_1.prisma.room.update({
            where: { id: roomId },
            data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name !== undefined && { name })), (type !== undefined && { type })), (price !== undefined && { price: Number(price) })), (description !== undefined && { description })), (maxOccupancy !== undefined && { maxOccupancy: Number(maxOccupancy) })), (squareMeters !== undefined && { squareMeters: Number(squareMeters) })), (availability !== undefined && { availability: Boolean(availability) })),
        });
        res.json({ success: true, message: "Room updated successfully", data: updated });
    })),
    addRoomImage: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const roomId = req.params.id;
        const { url, name } = req.body;
        if (!url)
            return res.status(400).json({ message: "url is required" });
        const image = yield prisma_1.prisma.roomImage.create({ data: { url, name: name || "", roomId } });
        res.status(201).json({ success: true, message: "Image added", data: image });
    })),
    deleteRoomImage: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { imageId } = req.params;
        yield prisma_1.prisma.roomImage.delete({ where: { id: imageId } });
        res.json({ success: true, message: "Image deleted" });
    })),
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
    createDummyRoom: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = "17703781-ab43-4801-911a-3f68f63f655a";
        const property = yield prisma_1.prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!property) {
            throw new Error("Property not found");
        }
        // Generate dummy data
        const dummyRoomData = {
            name: `Room ${Math.floor(Math.random() * 1000)}`,
            roomId: `R-${Math.floor(Math.random() * 10000)}`,
            type: "SINGLE", // or "DOUBLE", etc.
            price: Math.floor(Math.random() * 5000) + 1000, // random price
            description: "This is a dummy room created for testing purposes.",
            availability: true,
            squareMeters: Math.floor(Math.random() * 50) + 10,
            maxOccupancy: Math.floor(Math.random() * 4) + 1,
            propertyId,
            features: {
                create: [
                    { category: "Comfort", name: "Air Conditioning", value: "Yes" },
                    { category: "Entertainment", name: "Smart TV", value: "Yes" },
                ],
            },
            images: {
                create: [
                    {
                        url: "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg",
                        name: "Room Image 1",
                    },
                    {
                        url: "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg",
                        name: "Room Image 2",
                    },
                ],
            },
            services: {
                create: [
                    {
                        name: "Breakfast",
                        description: "Buffet breakfast included",
                        price: 500,
                    },
                    {
                        name: "Laundry",
                        description: "Laundry service available",
                        price: 200,
                    },
                ],
            },
        };
        // Create room
        const newRoom = yield prisma_1.prisma.room.create({
            data: dummyRoomData,
            include: {
                features: true,
                images: true,
                services: true,
            },
        });
        res.json("success");
    })),
};
