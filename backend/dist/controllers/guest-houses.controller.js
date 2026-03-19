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
const client_1 = require("@prisma/client");
const async_handler_1 = require("../utils/async-handler");
const guest_houses_validator_1 = require("./validators/properties.validator");
exports.default = {
    getProperties: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract query params with defaults
        const { minPrice, maxPrice, city, subcity, type, search } = req.query;
        // Parse numeric filters safely
        const min = parseInt(minPrice || "0", 10);
        const max = parseInt(maxPrice || "10000", 10);
        // 🧠 Build dynamic Prisma filters
        const filters = { AND: [] };
        // Filter by city or subcity
        if (city || subcity) {
            filters.AND.push({
                location: Object.assign(Object.assign({}, (city && { city: { equals: city, mode: "insensitive" } })), (subcity && { subcity: { equals: subcity, mode: "insensitive" } })),
            });
        }
        // Filter by property type
        if (type) {
            filters.AND.push({
                type: type === null || type === void 0 ? void 0 : type.toUpperCase(),
            });
        }
        // Filter by price range
        if (min > 0 || max < 10000) {
            filters.AND.push({
                rooms: {
                    some: {
                        price: {
                            gte: min,
                            lte: max,
                        },
                    },
                },
            });
        }
        // Global search filter
        if (search) {
            filters.AND.push({
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                    { location: { city: { contains: search, mode: "insensitive" } } },
                    { location: { subcity: { contains: search, mode: "insensitive" } } },
                    {
                        about: {
                            some: {
                                review: {
                                    some: {
                                        comment: { contains: search, mode: "insensitive" },
                                    },
                                },
                            },
                        },
                    },
                ],
            });
        }
        // Query database
        const properties = yield prisma.property.findMany({
            where: filters.AND.length > 0 ? filters : undefined,
            include: {
                rooms: true,
                location: true,
                about: true,
                images: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        console.log(properties);
        res.json(properties);
    })),
    getPropertiesForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract query params with defaults
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const sortField = req.query.sortField || "createdAt";
        const sortDirection = req.query.sortDirection || "desc";
        const search = req.query.search || "";
        // Build the where clause for filtering
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { address: { contains: search } },
            ];
        }
        // Total count for pagination
        const totalItems = yield prisma.property.count({ where });
        // Pagination calculations
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;
        const hasMore = page < totalPages;
        const previousPage = page > 1 ? page - 1 : null;
        const nextPage = hasMore ? page + 1 : null;
        // Sorting
        const validSortFields = ["id", "name", "address", "createdAt", "updatedAt"];
        const orderBy = {};
        if (validSortFields.includes(sortField)) {
            orderBy[sortField] = sortDirection;
        }
        else {
            orderBy["createdAt"] = "desc";
        }
        // Fetch properties with pagination, filtering, and sorting
        const properties = yield prisma.property.findMany({
            where,
            skip,
            take: Number(limit),
            orderBy,
            include: {
                about: true,
                contact: true,
                images: true,
                location: true,
                reviews: true,
                rooms: true,
            },
        });
        res.json({
            data: properties,
            pagination: {
                currentPage: Number(page),
                totalPages,
                totalItems,
                limit: Number(limit),
                hasMore,
                previousPage,
                nextPage,
            },
            sort: {
                field: sortField,
                direction: sortDirection,
            },
            filters: {
                search,
            },
        });
    })),
    getPropertiesForList: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { role, id: userId } = req.user;
        let propertiesDoc;
        if (role === "ADMIN") {
            // Admin sees all properties
            propertiesDoc = yield prisma.property.findMany({
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    rooms: { select: { id: true, name: true, roomId: true } },
                },
            });
        }
        else if (role === "STAFF") {
            // Staff sees only properties they are assigned to
            propertiesDoc = yield prisma.property.findMany({
                where: { staffs: { some: { id: userId } } },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    rooms: { select: { id: true, name: true, roomId: true } },
                },
            });
        }
        else if (role === "BROKER") {
            // Broker sees only properties they broker
            propertiesDoc = yield prisma.property.findMany({
                where: { brokerId: userId },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    rooms: { select: { id: true, name: true, roomId: true } },
                },
            });
        }
        else if (role === "OWNER") {
            // Broker sees only properties they broker
            propertiesDoc = yield prisma.property.findMany({
                where: { ownerId: userId },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    rooms: { select: { id: true, name: true, roomId: true } },
                },
            });
        }
        res.json(propertiesDoc);
    })),
    getPropertyById: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.id;
        const propertyDoc = yield prisma.property.findFirst({
            where: {
                id: propertyId,
            },
            include: {
                about: true,
                images: true,
                reviews: true,
                location: true,
                contact: true,
                facilities: true,
                rooms: {
                    include: {
                        images: true,
                        features: true,
                        services: true,
                    },
                },
            },
        });
        res.json(propertyDoc);
    })),
    createProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = req.user.id;
        if (!req.body) {
            return res.status(400).json({ message: "Missing property data" });
        }
        console.log(req.body);
        // Validate property data
        const validatedData = guest_houses_validator_1.createPropertySchema.parse(req.body);
        // Images will come directly from client as an array
        const uploadedImages = (_a = validatedData.images) !== null && _a !== void 0 ? _a : [];
        const createdPropertyData = prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // Create property with nested relations
            const createdProperty = yield prisma.property.create({
                data: {
                    name: validatedData.name,
                    address: validatedData.address,
                    type: validatedData.type || client_1.PropertyType.SHARED,
                    ownerId: userId,
                    about: validatedData.about
                        ? { create: validatedData.about }
                        : undefined,
                    location: validatedData.location
                        ? { create: validatedData.location }
                        : undefined,
                    facilities: validatedData.facilities
                        ? { create: validatedData.facilities }
                        : undefined,
                    contact: validatedData.contact
                        ? { create: validatedData.contact }
                        : undefined,
                    images: uploadedImages.length
                        ? { create: uploadedImages }
                        : undefined,
                },
                include: {
                    about: true,
                    location: true,
                    facilities: true,
                    contact: true,
                    images: true,
                },
            });
            yield prisma.license.create({
                data: {
                    fileUrl: validatedData.license.fileUrl,
                    propertyId: createdProperty.id,
                    submittedBy: userId,
                },
            });
            return createdProperty;
        }));
        res.status(201).json({
            message: "Property created successfully",
            succes: true,
        });
    })),
    updateProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const role = user === null || user === void 0 ? void 0 : user.role;
        const propertyId = req.params.id;
        if (!req.body) {
            return res.status(400).json({ message: "Missing property data" });
        }
        // Validate update data
        const validatedData = guest_houses_validator_1.updatePropertySchema.parse(req.body);
        // Find the property
        const propertyDoc = yield prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!propertyDoc) {
            return res.status(404).json({ message: "Property not found" });
        }
        // Authorization check: owner or admin
        if (propertyDoc.ownerId !== userId && role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "You can't update this property" });
        }
        // Update nested relations
        const updatedProperty = yield prisma.property.update({
            where: { id: propertyId },
            data: {
                name: validatedData.name,
                address: validatedData.address,
                type: validatedData.type,
                about: validatedData.about
                    ? {
                        upsert: {
                            create: validatedData.about,
                            update: validatedData.about,
                        },
                    }
                    : undefined,
                location: validatedData.location
                    ? {
                        upsert: {
                            create: validatedData.location,
                            update: validatedData.location,
                        },
                    }
                    : undefined,
                facilities: validatedData.facilities
                    ? {
                        deleteMany: {}, // remove old
                        create: validatedData.facilities, // insert new
                    }
                    : undefined,
                contact: validatedData.contact
                    ? {
                        upsert: {
                            create: validatedData.contact,
                            update: validatedData.contact,
                        },
                    }
                    : undefined,
                images: validatedData.images
                    ? {
                        deleteMany: {}, // remove old images
                        create: validatedData.images, // insert new images
                    }
                    : undefined,
            },
            include: {
                about: true,
                location: true,
                facilities: true,
                contact: true,
                images: true,
            },
        });
        res.json({
            message: "Property updated successfully",
            data: updatedProperty,
        });
    })),
    deleteProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user; // ideally type properly via custom Request type
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const role = user === null || user === void 0 ? void 0 : user.role;
        const propertyId = req.params.id;
        // Check if property exists
        const propertyDoc = yield prisma.property.findUnique({
            where: { id: propertyId },
        });
        if (!propertyDoc) {
            return res.status(404).json({ message: "Property not found" });
        }
        // Ownership / role check
        if (propertyDoc.ownerId !== userId && role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "You can't delete this property" });
        }
        // Perform delete
        yield prisma.property.delete({
            where: { id: propertyId },
        });
        return res.json({ message: "Deleted successfully" });
    })),
    createDummyProperty: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = "qf4UTmNkDcrlmEsTn3cDM6bQVmQVZ5jy"; // Example owner ID
        const uploadedImages = [
            {
                url: "https://res.cloudinary.com/demo/image/upload/v1234567890/guest1.jpg",
                name: "guest1.jpg",
            },
            {
                url: "https://res.cloudinary.com/demo/image/upload/v1234567890/guest2.jpg",
                name: "guest2.jpg",
            },
        ];
        const dummyPropertyData = {
            name: "Sunny Stay Property",
            address: "123 Bole Street, Addis Ababa, Ethiopia",
            type: client_1.PropertyType.SHARED,
            ownerId: userId,
            about: {
                description: "Sunny Stay Property offers comfortable rooms with modern amenities and a cozy atmosphere. Perfect for travelers and families.",
            },
            location: {
                continent: "Africa",
                country: "Ethiopia",
                city: "Addis Ababa",
                subcity: "Bole",
                nearby: "Near Friendship Square",
            },
            facilities: [
                { name: "Free Wi-Fi" },
                { name: "Breakfast included" },
                { name: "Parking available" },
                { name: "24/7 Reception" },
                { name: "Swimming Pool" },
            ],
            contact: {
                phone: "+251912345678",
                email: "info@sunnystay.com",
            },
            images: uploadedImages,
        };
        // Usage with Prisma
        const createdProperty = yield prisma.property.create({
            data: {
                name: dummyPropertyData.name,
                address: dummyPropertyData.address,
                type: dummyPropertyData.type,
                ownerId: dummyPropertyData.ownerId,
                about: { create: dummyPropertyData.about },
                location: { create: dummyPropertyData.location },
                facilities: { create: dummyPropertyData.facilities },
                contact: { create: dummyPropertyData.contact },
                images: { create: dummyPropertyData.images },
            },
            include: {
                about: true,
                location: true,
                facilities: true,
                contact: true,
            },
        });
        console.log(createdProperty);
        res.send(createdProperty);
    })),
    // admins
    getOwnerProperties: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        // Fetch properties with pagination, filtering, and sorting
        const properties = yield prisma.property.findMany({
            where: {
                ownerId: userId,
            },
            include: {
                about: true,
                images: true,
                _count: {
                    select: {
                        rooms: true,
                    },
                },
            },
        });
        res.json({
            data: properties,
        });
    })),
    getPropertyByIdForAdmins: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const propertyId = req.params.id;
        const propertyDoc = yield prisma.property.findFirst({
            where: {
                id: propertyId,
            },
            include: {
                rooms: true,
                about: true,
                contact: true,
                facilities: true,
                images: true,
                license: true,
                location: true,
                staffs: true,
                bookings: true,
            },
        });
        res.json(propertyDoc);
    })),
};
