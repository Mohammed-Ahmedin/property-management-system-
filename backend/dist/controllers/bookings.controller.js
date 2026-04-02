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
const payments_service_1 = require("../services/payments.service");
exports.default = {
    bookNow: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const validated = req.body;
        const { checkIn, checkOut, roomId, userId, additionalServices, guests } = validated;
        const userDoc = yield prisma_1.prisma.user.findFirst({
            where: {
                id: userId,
            },
        });
        console.log({ validated });
        if (!userDoc) {
            res.status(401).json({
                message: "User not found please login again",
            });
            return;
        }
        // Parse dates safely
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date",
            });
        }
        // Calculate total nights
        const oneDay = 1000 * 60 * 60 * 24;
        const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / oneDay);
        const roomDoc = yield prisma_1.prisma.room.findFirst({ where: { id: roomId } });
        if (guests > (roomDoc === null || roomDoc === void 0 ? void 0 : roomDoc.maxOccupancy)) {
            return res.status(400).json({
                success: false,
                message: "You have add",
            });
        }
        if (!roomDoc) {
            return res.status(404).json({
                success: false,
                message: "Room not found",
            });
        }
        // Check room availability
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
            return res.status(409).json({
                success: false,
                message: "Room is not available for the selected dates",
            });
        }
        // Validate additional services
        const validServiceIds = validated.additionalServices.map((s) => s.id);
        let additionalServicesTotal = 0;
        if (validServiceIds.length > 0) {
            const services = yield prisma_1.prisma.additionalService.findMany({
                where: { id: { in: validServiceIds }, isActive: true },
                select: { id: true, price: true },
            });
            const foundIds = services.map((s) => s.id);
            const invalidIds = validServiceIds.filter((id) => !foundIds.includes(id));
            if (invalidIds.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid or inactive additional service(s): ${invalidIds.join(", ")}`,
                });
            }
            // Sum additional service prices
            additionalServicesTotal = services.reduce((sum, s) => sum + (s.price || 0), 0);
        }
        // Compute total price (per night * nights)
        const perNightTotal = roomDoc.price;
        const totalAmount = perNightTotal * totalNights + additionalServicesTotal;
        const txRef = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
        // Find broker assigned to this property (if any)
        const brokerRecord = yield prisma_1.prisma.managedProperty.findFirst({
            where: { propertyId: roomDoc.propertyId, role: "BROKER" },
            select: { userId: true },
        });
        const brokerId = (brokerRecord === null || brokerRecord === void 0 ? void 0 : brokerRecord.userId) || "";
        const { chapaResponse, commission, subaccounts } = yield (0, payments_service_1.initializeChapaPayment)({
            data: {
                amount: totalAmount,
                customerName: userDoc.name,
                email: userDoc.email,
                phoneNumber: userDoc.phone,
                txRef,
                callbackUrl: `${CLIENT_FRONTEND_URL}/account/bookings`,
                returnUrl: `${CLIENT_FRONTEND_URL}/account/bookings`,
            },
            propertyId: roomDoc.propertyId,
            brokerId,
        });
        if (!(chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.checkout_url) && !((_a = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.data) === null || _a === void 0 ? void 0 : _a.checkout_url)) {
            return res.status(502).json({
                success: false,
                message: "Payment initialization failed. Please try again.",
            });
        }
        // Create booking
        yield prisma_1.prisma.booking.create({
            data: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: validated.guests,
                manualBooked: false,
                totalAmount,
                subTotal: roomDoc.price * totalNights,
                basePrice: roomDoc.price,
                taxAmount: 0,
                discount: (_b = validated.discount) !== null && _b !== void 0 ? _b : 0,
                currency: "ETB",
                user: { connect: { id: validated.userId } },
                room: { connect: { id: validated.roomId } },
                property: { connect: { id: roomDoc.propertyId } },
                additionalServices: {
                    connect: validated.additionalServices.map((s) => ({ id: s.id })),
                },
                payment: {
                    create: {
                        transactionRef: txRef,
                        status: "PENDING",
                        method: "ONLINE",
                        pendingAmount: totalAmount,
                    },
                },
            },
        });
        return res.status(201).json({
            success: true,
            checkoutUrl: (_c = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.checkout_url) !== null && _c !== void 0 ? _c : (_d = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.data) === null || _d === void 0 ? void 0 : _d.checkout_url,
        });
    })),
    getUserBookings: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        console.log({ userId });
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
                        roomId: true,
                    },
                },
                property: {
                    select: {
                        name: true,
                        id: true,
                        images: true,
                        about: { select: { description: true } },
                    },
                },
                payment: {
                    select: { status: true, id: true, amount: true, pendingAmount: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ data: userBookings, success: true });
    })),
    getUserBookingDetailById: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const bookingId = req.params.bookingId;
        const bookingDoc = yield prisma_1.prisma.booking.findFirst({
            where: {
                id: bookingId,
            },
            include: {
                payment: {
                    select: {
                        amount: true,
                        pendingAmount: true,
                        method: true,
                        transactionRef: true,
                        phoneNumber: true,
                        status: true,
                    },
                },
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
                    select: {
                        name: true,
                        id: true,
                        images: true,
                        about: { select: { description: true } },
                    },
                },
                additionalServices: true,
            },
        });
        console.log({ payment: bookingDoc.payment });
        res.json({
            data: bookingDoc,
            success: true,
        });
    })),
    // management
    manualBooking: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        const userId = user === null || user === void 0 ? void 0 : user.id;
        const userRole = user === null || user === void 0 ? void 0 : user.role;
        try {
            const validated = booking_validator_1.manualBookingSchema.parse(req.body);
            // Check if room exists
            const room = yield prisma_1.prisma.room.findUnique({
                where: { id: validated.roomId },
                include: { property: { include: { managers: true } } },
            });
            if (!room) {
                return res.status(404).json({
                    success: false,
                    message: "Room not found",
                });
            }
            // Check access via ManagedProperty
            let hasAccess = false;
            if (userRole === "ADMIN") {
                hasAccess = true;
            }
            else {
                const managed = yield prisma_1.prisma.managedProperty.findFirst({
                    where: {
                        userId,
                        propertyId: room.propertyId,
                        role: { in: ["OWNER", "STAFF", "BROKER"] },
                    },
                });
                hasAccess = !!managed;
            }
            if (!hasAccess) {
                return res.status(403).json({
                    success: false,
                    message: "You are not authorized to create bookings for this room",
                });
            }
            const checkInDate = new Date(validated.checkIn);
            const checkOutDate = new Date(validated.checkOut);
            if (checkOutDate <= checkInDate) {
                return res.status(400).json({
                    success: false,
                    message: "Check-out date must be after check-in date",
                });
            }
            // Find overlapping bookings
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
                select: { checkIn: true, checkOut: true, guestName: true },
            });
            if (overlappingBookings.length > 0) {
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
            // Create booking
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
                        subTotal: validated.basePrice,
                        basePrice: validated.basePrice,
                        taxAmount: validated.taxAmount,
                        discount: validated.discount || 0,
                        currency: validated.currency,
                        roomId: validated.roomId,
                        propertyId: validated.propertyId || room.propertyId,
                        approvedById: userId,
                        payment: {
                            create: {
                                method: validated.paymentMethod,
                                status: "SUCCESS",
                                amount: validated.totalAmount,
                                phoneNumber: validated.guestPhone,
                            },
                        },
                    },
                    include: { payment: true, room: true },
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
    })),
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
                subTotal: 150.0,
                basePrice: 150.0,
                taxAmount: 30.0,
                discount: 0.0,
                property: { connect: { id: roomDoc.propertyId } },
                currency: "USD",
                user: { connect: { id: userId } },
                room: { connect: { id: roomId } },
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
    getBookingsForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                propertyIds = [...new Set(managed.map((m) => m.propertyId))];
                if (!propertyIds.length) {
                    return res.status(200).json([]);
                }
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
        // Fetch bookings with authorization
        const bookings = yield prisma_1.prisma.booking.findMany({
            where: propertyIds.length
                ? { room: { propertyId: { in: propertyIds } } }
                : {},
            include: {
                user: true,
                room: true,
                property: { select: { id: true, name: true } },
                payment: true,
                additionalServices: true,
                approvedBy: { select: { id: true, name: true, role: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    })),
    getBookingStatsForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    where: { userId, role: { in: [userRole, "STAFF", "BROKER", "OWNER"] } },
                    select: { propertyId: true },
                });
                propertyIds = managed.map((m) => m.propertyId);
                if (!propertyIds.length) {
                    return res.json({
                        totalBookings: 0,
                        upcomingBookings: 0,
                        pastBookings: 0,
                        totalGuests: 0,
                        totalRevenue: 0,
                    });
                }
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
        // Base filter
        const bookingWhere = propertyIds.length
            ? { room: { propertyId: { in: propertyIds } } }
            : {};
        // Fetch booking stats
        const [totalBookings, upcomingBookings, pastBookings, totalGuests, totalRevenue,] = yield Promise.all([
            prisma_1.prisma.booking.count({ where: bookingWhere }),
            prisma_1.prisma.booking.count({
                where: Object.assign(Object.assign({}, bookingWhere), { checkIn: { gte: new Date() } }),
            }),
            prisma_1.prisma.booking.count({
                where: Object.assign(Object.assign({}, bookingWhere), { checkOut: { lt: new Date() } }),
            }),
            prisma_1.prisma.booking
                .aggregate({
                _sum: { guests: true },
                where: bookingWhere,
            })
                .then((res) => { var _a; return (_a = res._sum.guests) !== null && _a !== void 0 ? _a : 0; }),
            prisma_1.prisma.booking
                .aggregate({
                _sum: { totalAmount: true }, // make sure you have `totalAmount` on booking/payment
                where: bookingWhere,
            })
                .then((res) => { var _a; return (_a = res._sum.totalAmount) !== null && _a !== void 0 ? _a : 0; }),
        ]);
        return res.json({
            totalBookings,
            upcomingBookings,
            pastBookings,
            totalGuests,
            totalRevenue,
        });
    })),
    getRecentBookingForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
                    where: { userId, role: { in: [userRole, "STAFF", "BROKER", "OWNER"] } },
                    select: { propertyId: true },
                });
                propertyIds = managed.map((m) => m.propertyId);
                if (!propertyIds.length) {
                    return res.json([]);
                }
                break;
            default:
                return res.status(403).json({ message: "Access denied" });
        }
        // Fetch bookings with authorization
        const bookings = yield prisma_1.prisma.booking.findMany({
            where: propertyIds.length
                ? { room: { propertyId: { in: propertyIds } } }
                : {},
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                room: {
                    select: {
                        name: true,
                        id: true,
                        roomId: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        status: true,
                    },
                },
            },
            take: 8,
            orderBy: { createdAt: "desc" },
        });
        res.json(bookings);
    })),
    getBookingDetailForManagement: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { bookingId } = req.params;
        const booking = yield prisma_1.prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                approvedBy: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                room: {
                    select: {
                        id: true,
                        name: true,
                        roomId: true,
                        price: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        name: true,
                        location: true,
                    },
                },
                payment: {
                    select: {
                        id: true,
                        status: true,
                        method: true,
                        amount: true,
                        transactionRef: true,
                        phoneNumber: true,
                    },
                },
                activities: {
                    select: {
                        id: true,
                        action: true,
                        timestamp: true,
                        description: true,
                    },
                    orderBy: { timestamp: "desc" },
                },
                additionalServices: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                    },
                },
            },
        });
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        return res.json(booking);
    })),
    changeBookingStatus: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { bookingId } = req.params;
        const { status, reason } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;
        const validStatuses = ["APPROVED", "REJECTED", "CANCELLED", "PENDING_OWNER_APPROVAL", "PENDING_OWNER_REJECTION", "PENDING"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update.", success: false });
        }
        // ADMIN cannot approve/reject bookings
        if (userRole === "ADMIN" && ["APPROVED", "REJECTED", "PENDING_OWNER_APPROVAL", "PENDING_OWNER_REJECTION"].includes(status)) {
            return res.status(403).json({ message: "Admins cannot approve or reject bookings.", success: false });
        }
        // BROKER cannot cancel bookings
        if (userRole === "BROKER" && status === "CANCELLED") {
            return res.status(403).json({ message: "Brokers cannot cancel bookings.", success: false });
        }
        // Determine which properties the user can access
        let propertyIds = [];
        switch (userRole) {
            case "ADMIN":
                break;
            case "OWNER":
            case "STAFF":
            case "BROKER":
                const managed = yield prisma_1.prisma.managedProperty.findMany({
                    where: { userId, role: { in: [userRole] } },
                    select: { propertyId: true },
                });
                propertyIds = managed.map((m) => m.propertyId);
                if (!propertyIds.length) {
                    return res.status(403).json({ message: "Access denied. No assigned properties.", success: false });
                }
                break;
            default:
                return res.status(403).json({ message: "Access denied.", success: false });
        }
        const booking = yield prisma_1.prisma.booking.findUnique({
            where: { id: bookingId },
            select: { id: true, propertyId: true, status: true, checkIn: true, checkOut: true, roomId: true },
        });
        if (!booking)
            return res.status(404).json({ message: "Booking not found.", success: false });
        if (propertyIds.length && !propertyIds.includes(booking.propertyId)) {
            return res.status(403).json({ message: "Unauthorized property.", success: false });
        }
        if (booking.status === "APPROVED" && status === "APPROVED") {
            return res.status(400).json({ message: "Booking already approved.", success: false });
        }
        if (booking.status === "CANCELLED" && status !== "CANCELLED") {
            return res.status(400).json({ message: "Booking already cancelled.", success: false });
        }
        // Broker approve/reject → set to PENDING_OWNER_APPROVAL or PENDING_OWNER_REJECTION
        const isBrokerAction = userRole === "BROKER" && ["APPROVED", "REJECTED"].includes(status);
        const effectiveStatus = isBrokerAction
            ? (status === "APPROVED" ? "PENDING_OWNER_APPROVAL" : "PENDING_OWNER_REJECTION")
            : status;
        // Owner: cancel broker rejection → back to PENDING
        const isOwnerCancelRejection = userRole === "OWNER" && status === "PENDING" && booking.status === "PENDING_OWNER_REJECTION";
        const now = new Date();
        const activityDesc = isBrokerAction
            ? `Broker pre-${status.toLowerCase()} booking #${bookingId.slice(0, 8)} on ${now.toLocaleString()}. Waiting for owner response.`
            : isOwnerCancelRejection
                ? `Owner cancelled broker rejection for booking #${bookingId.slice(0, 8)} on ${now.toLocaleString()}. Booking returned to PENDING.`
                : `Booking ${status.toLowerCase()} by ${userRole} on ${now.toLocaleString()}. Booking ID: ${bookingId.slice(0, 8)}.${reason ? ` Reason: ${reason}` : ""}`;
        yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            if (["CANCELLED", "REJECTED"].includes(effectiveStatus)) {
                yield tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: effectiveStatus,
                        cancelledCheckIn: booking.checkIn,
                        cancelledCheckOut: booking.checkOut,
                        approvedById: null,
                        rejectionReason: reason || null,
                        updatedAt: now,
                    },
                });
                const payment = yield tx.payment.findUnique({ where: { bookingId: booking.id } });
                if (payment) {
                    yield tx.payment.update({
                        where: { id: payment.id },
                        data: { status: payment.status === "SUCCESS" ? "REFUNDED" : "CANCELLED" },
                    });
                }
                yield tx.activity.create({
                    data: {
                        bookingId: booking.id,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        userId,
                        action: effectiveStatus === "REJECTED" ? "REJECTED_BOOKING" : "CANCELLED_BOOKING",
                        description: activityDesc,
                    },
                });
            }
            else if (effectiveStatus === "PENDING_OWNER_APPROVAL" || effectiveStatus === "PENDING_OWNER_REJECTION") {
                yield tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: effectiveStatus,
                        brokerApprovedAt: now,
                        rejectionReason: effectiveStatus === "PENDING_OWNER_REJECTION" ? (reason || null) : null,
                        updatedAt: now,
                    },
                });
                yield tx.activity.create({
                    data: {
                        bookingId: booking.id,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        userId,
                        action: "UPDATED_BOOKING",
                        description: activityDesc,
                    },
                });
            }
            else if (effectiveStatus === "PENDING" && isOwnerCancelRejection) {
                // Owner cancels broker rejection → back to PENDING
                yield tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: "PENDING",
                        rejectionReason: null,
                        brokerApprovedAt: null,
                        updatedAt: now,
                    },
                });
                yield tx.activity.create({
                    data: {
                        bookingId: booking.id,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        userId,
                        action: "UPDATED_BOOKING",
                        description: activityDesc,
                    },
                });
            }
            else {
                // APPROVED by owner/staff
                yield tx.booking.update({
                    where: { id: bookingId },
                    data: {
                        status: effectiveStatus,
                        approvedById: effectiveStatus === "APPROVED" ? userId : null,
                        updatedAt: now,
                    },
                });
                if (effectiveStatus === "APPROVED") {
                    const payment = yield tx.payment.findUnique({ where: { bookingId: booking.id } });
                    if (payment && payment.status === "PENDING") {
                        yield tx.payment.update({
                            where: { id: payment.id },
                            data: { status: "SUCCESS", amount: (_a = payment.pendingAmount) !== null && _a !== void 0 ? _a : payment.amount },
                        });
                    }
                }
                yield tx.activity.create({
                    data: {
                        bookingId: booking.id,
                        propertyId: booking.propertyId,
                        roomId: booking.roomId,
                        userId,
                        action: "APPROVED_BOOKING",
                        description: activityDesc,
                    },
                });
            }
        }));
        const responseMessage = isBrokerAction
            ? `Booking sent to owner for ${status.toLowerCase()} approval.`
            : isOwnerCancelRejection
                ? "Broker rejection cancelled. Booking returned to pending."
                : `Booking ${effectiveStatus.toLowerCase()} successfully.`;
        return res.status(200).json({ message: responseMessage, success: true });
    })),
};
