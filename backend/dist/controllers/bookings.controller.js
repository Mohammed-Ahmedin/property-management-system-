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
const booking_validator_1 = require("./validators/booking.validator");
exports.default = {
    bookNow: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ 1. Validate input
        const validated = req.body;
        const { checkIn, checkOut, roomId } = validated;
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const roomDoc = yield prisma_1.prisma.room.findFirst({
            where: { id: roomId },
        });
        // ✅ 2. Check room availability
        const overlapping = yield prisma_1.prisma.booking.findFirst({
            where: {
                roomId,
                status: { notIn: ["CANCELLED", "REJECTED"] },
                OR: [
                    { checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } },
                ],
            },
        });
        if (overlapping) {
            console.log("dude---------------");
            return res.status(409).json({
                success: false,
                message: "Room is not available for the selected dates",
            });
        }
        // ✅ 3. Validate additional services
        const validServiceIds = validated.additionalServices.map((s) => s.id);
        if (validServiceIds.length > 0) {
            const found = yield prisma_1.prisma.additionalService.findMany({
                where: { id: { in: validServiceIds }, isActive: true },
                select: { id: true },
            });
            const foundIds = found.map((f) => f.id);
            const invalidIds = validServiceIds.filter((id) => !foundIds.includes(id));
            if (invalidIds.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid or inactive additional service(s): ${invalidIds.join(", ")}`,
                });
            }
        }
        const basePrice = roomDoc.price;
        // ✅ 4. Compute total from backend for safety
        const computedTotal = basePrice - (validated.discount || 0);
        // ✅ 5. Create booking
        const booking = yield prisma_1.prisma.booking.create({
            data: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: validated.guests,
                manualBooked: false,
                totalAmount: computedTotal,
                basePrice: basePrice,
                taxAmount: 0,
                discount: validated.discount,
                currency: "ETB",
                userId: validated.userId,
                roomId: validated.roomId,
                propertyId: roomDoc.propertyId,
                additionalServices: {
                    connect: validated.additionalServices.map((s) => ({ id: s.id })),
                },
            },
        });
        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking,
        });
    })),
    getUserBookings: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // const userId = (req as any).user.id;
        const { userId } = req.params;
        const userBookings = yield prisma_1.prisma.booking.findMany({
            where: {
                userId,
            },
            include: {
                room: {
                    select: {
                        images: true,
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                    },
                },
                property: {
                    select: { name: true, id: true, images: true },
                },
                payment: true,
            },
        });
        res.json(userBookings);
    })),
    getUserBookingDetailById: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const bookingId = req.params.bookingId;
        const bookingDoc = yield prisma_1.prisma.booking.findFirst({
            where: {
                id: bookingId,
            },
            include: {
                room: {
                    select: {
                        images: true,
                        id: true,
                        name: true,
                        description: true,
                        roomId: true,
                    },
                },
                property: {
                    select: { name: true, id: true, images: true },
                },
                payment: true,
            },
        });
        res.json(bookingDoc);
    })),
    manualBooking: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const validated = booking_validator_1.manualBookingSchema.parse(req.body);
            // Check if room exists
            const room = yield prisma_1.prisma.room.findUnique({
                where: { id: validated.roomId },
            });
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found",
                });
            }
            const checkInDate = new Date(validated.checkIn);
            const checkOutDate = new Date(validated.checkOut);
            // ✅ Validate that checkOut is after checkIn
            if (checkOutDate <= checkInDate) {
                return res.status(400).json({
                    success: false,
                    message: "Check-out date must be after check-in date",
                });
            }
            // Find all overlapping bookings for this room
            const overlappingBookings = yield prisma_1.prisma.booking.findMany({
                where: {
                    roomId: validated.roomId,
                    status: { in: ["PENDING", "APPROVED"] },
                    OR: [
                        {
                            checkIn: { lte: checkOutDate },
                            checkOut: { gte: checkInDate },
                        },
                    ],
                },
                select: {
                    checkIn: true,
                    checkOut: true,
                    guestName: true,
                },
            });
            if (overlappingBookings.length > 0) {
                // Prepare array of taken dates
                const takenDates = [];
                overlappingBookings.forEach((booking) => {
                    let current = new Date(booking.checkIn);
                    const end = new Date(booking.checkOut);
                    while (current <= end) {
                        takenDates.push(current.toISOString().split("T")[0]);
                        current.setDate(current.getDate() + 1);
                    }
                });
                return res.status(400).json({
                    success: false,
                    message: "Some dates are already taken",
                    takenDates,
                    overlappingBookings,
                });
            }
            // ✅ Create booking if no conflicts
            const booking = yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const created = yield tx.booking.create({
                    data: {
                        manualBooked: true,
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        guests: validated.guests,
                        guestName: validated.guestName,
                        guestPhone: validated.guestPhone,
                        guestEmail: validated.guestEmail,
                        status: "APPROVED",
                        totalAmount: validated.totalAmount,
                        basePrice: validated.basePrice,
                        taxAmount: validated.taxAmount,
                        discount: validated.discount || 0,
                        currency: validated.currency,
                        roomId: validated.roomId,
                        propertyId: validated.propertyId || room.propertyId,
                        approvedById: req.user.id,
                        payment: {
                            create: {
                                method: validated.paymentMethod,
                                status: "SUCCESS",
                            },
                        },
                    },
                    include: {
                        payment: true,
                        room: true,
                    },
                });
                return created;
            }));
            res.json({
                success: true,
                message: "Manual booking created successfully",
                data: booking,
            });
        }
        catch (error) {
            console.error("Manual booking error:", error);
            res.status(500).json({
                success: false,
                message: (error === null || error === void 0 ? void 0 : error.message) || "Something went wrong",
            });
        }
    }),
    bookDummy: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { roomId, userId } = req.body;
        const roomDoc = yield prisma_1.prisma.room.findFirst({ where: { id: roomId } });
        if (!roomId || !userId) {
            return res.status(400).json({
                success: false,
                message: "roomId and userId are required",
            });
        }
        // Just for testing — fixed dummy data
        const now = new Date();
        const checkIn = new Date(now);
        const checkOut = new Date(now);
        checkOut.setDate(checkOut.getDate() + 2); // 2-day stay
        const booking = yield prisma_1.prisma.booking.create({
            data: {
                checkIn,
                checkOut,
                guests: 2,
                manualBooked: true,
                status: "PENDING",
                totalAmount: 200.0,
                basePrice: 150.0,
                taxAmount: 30.0,
                discount: 0.0,
                propertyId: roomDoc.propertyId,
                currency: "USD",
                userId,
                roomId,
                payment: {
                    create: {
                        method: "ONLINE",
                        status: "PENDING",
                        transactionRef: "tx-23jksddsl",
                    },
                },
            },
            include: {
                user: true,
                room: true,
                payment: true,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Dummy booking created successfully",
            data: booking,
        });
    })),
    // admins
    getAdminsBookings: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const userRole = req.user.role;
        const bookings = yield prisma_1.prisma.booking.findMany({
            where: {
                property: {
                    ownerId: userId,
                },
            },
            include: {
                user: true,
                room: true,
                payment: true,
                additionalServices: true,
            },
        });
        res.json(bookings);
    })),
};
