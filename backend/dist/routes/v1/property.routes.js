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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRouter = void 0;
const express_1 = require("express");
const properties_controller_1 = __importDefault(require("../../controllers/properties.controller"));
const management_controller_1 = __importDefault(require("../../controllers/management.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const reviews_controller_1 = __importDefault(require("../../controllers/reviews.controller"));
const router = (0, express_1.Router)();
exports.PropertyRouter = router;
// @/api/v1/properties/
// client
router.get("/", properties_controller_1.default.getProperties);
router.get("/trendings", properties_controller_1.default.getTrendingProperties);
router.get("/nearby", properties_controller_1.default.getNearbyProperties);
router.get("/location-stats", properties_controller_1.default.getLocationStats);
router.post("/reviews", (0, auth_middleware_1.authGuard)(), reviews_controller_1.default.createReview);
router.get("/reviews/:propertyId", reviews_controller_1.default.getReviews);
router.get("/management", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.getPropertiesForManagement);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.getPropertiesStatsForManagement);
router.get("/management/for-list", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.getPropertiesForList);
router.get("/management/:id", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.getPropertyByIdForManagement);
// staffs management
router.get("/staff/for-list", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), management_controller_1.default.getStaffsForList);
router.post("/staff/add-staff", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), management_controller_1.default.addStaffToProperty);
router.post("/staff/add-broker", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), management_controller_1.default.addBrokerToProperty);
router.post("/staff/remove-staff", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), management_controller_1.default.removeStaffFromProperty);
router.get("/staff/get-staffs/:propertyId", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), management_controller_1.default.getPropertyStaffs);
router.get("/:id", properties_controller_1.default.getPropertyById);
router.put("/:id", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.updateProperty);
router.post("/:id/status", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.changePropertyStatus);
router.post("/:id/void", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.voidProperty);
router.post("/:id/restore", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.restoreProperty);
router.post("/:id/facilities", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.addFacility);
router.post("/:id/images", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.addPropertyImage);
router.delete("/:id/images", properties_controller_1.default.deletePropertyImage);
router.post("/:id/discount", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.setPropertyDiscount);
// Set price per night for private properties (villa/guest house)
router.post("/:id/price", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prisma } = yield Promise.resolve().then(() => __importStar(require("../../lib/prisma")));
    const { id: propertyId } = req.params;
    const { pricePerNight } = req.body;
    if (pricePerNight === undefined || pricePerNight === null)
        return res.status(400).json({ message: "pricePerNight is required" });
    const updated = yield prisma.property.update({
        where: { id: propertyId },
        data: { pricePerNight: Number(pricePerNight) },
    });
    res.json({ success: true, message: "Property price updated", data: updated });
}));
// Book a private property as a whole (villa/guest house)
router.post("/:id/book", (0, auth_middleware_1.authGuard)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const { prisma } = yield Promise.resolve().then(() => __importStar(require("../../lib/prisma")));
    const { initializeChapaPayment } = yield Promise.resolve().then(() => __importStar(require("../../services/payments.service")));
    const { id: propertyId } = req.params;
    const { checkIn, checkOut, guests, userId } = req.body;
    const user = req.user;
    const bookingUserId = userId || user.id;
    try {
        const property = yield prisma.property.findUnique({
            where: { id: propertyId },
            include: { rooms: { take: 1 } },
        });
        if (!property)
            return res.status(404).json({ message: "Property not found" });
        if (!property.pricePerNight)
            return res.status(400).json({ message: "Property price not set. Please contact admin." });
        const room = property.rooms[0];
        if (!room)
            return res.status(400).json({ message: "No rooms found for this property. Please add at least one room in admin." });
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        if (checkOutDate <= checkInDate)
            return res.status(400).json({ message: "Check-out must be after check-in" });
        const totalNights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
        // Check for overlapping bookings
        const overlapping = yield prisma.booking.findFirst({
            where: {
                roomId: room.id,
                status: { notIn: ["CANCELLED", "REJECTED"] },
                OR: [{ checkIn: { lte: checkOutDate }, checkOut: { gte: checkInDate } }],
            },
        });
        if (overlapping)
            return res.status(409).json({ message: "Property is not available for the selected dates" });
        const userDoc = yield prisma.user.findUnique({ where: { id: bookingUserId } });
        if (!userDoc)
            return res.status(401).json({ message: "User not found" });
        // Price calculation using pricePerNight
        const propDiscount = (_a = property.discountPercent) !== null && _a !== void 0 ? _a : 0;
        const effectivePrice = propDiscount > 0 ? property.pricePerNight * (1 - propDiscount / 100) : property.pricePerNight;
        const discountAmount = (property.pricePerNight - effectivePrice) * totalNights;
        const totalAmount = effectivePrice * totalNights;
        const txRef = `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
        const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
        const brokerRecord = yield prisma.managedProperty.findFirst({
            where: { propertyId, role: "BROKER" },
            select: { userId: true },
        });
        const { chapaResponse } = yield initializeChapaPayment({
            data: {
                amount: totalAmount,
                customerName: userDoc.name,
                email: userDoc.email,
                phoneNumber: userDoc.phone,
                txRef,
                callbackUrl: `${CLIENT_FRONTEND_URL}/account/bookings?txRef=${txRef}`,
                returnUrl: `${CLIENT_FRONTEND_URL}/account/bookings?txRef=${txRef}`,
            },
            propertyId,
            brokerId: (brokerRecord === null || brokerRecord === void 0 ? void 0 : brokerRecord.userId) || "",
        });
        if (!(chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.checkout_url) && !((_b = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.data) === null || _b === void 0 ? void 0 : _b.checkout_url)) {
            return res.status(502).json({ message: "Payment initialization failed. Please try again." });
        }
        const newBooking = yield prisma.booking.create({
            data: {
                checkIn: checkInDate,
                checkOut: checkOutDate,
                guests: Number(guests) || 1,
                totalAmount,
                subTotal: effectivePrice * totalNights,
                basePrice: property.pricePerNight,
                taxAmount: 0,
                discount: discountAmount,
                currency: "ETB",
                user: { connect: { id: bookingUserId } },
                room: { connect: { id: room.id } },
                property: { connect: { id: propertyId } },
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
        yield prisma.activity.create({
            data: {
                action: "BOOKED",
                description: `Property booking by ${userDoc.name} for "${property.name}". Check-in: ${checkInDate.toLocaleDateString()}, Check-out: ${checkOutDate.toLocaleDateString()}. Total: ETB ${totalAmount}`,
                userId: bookingUserId,
                bookingId: newBooking.id,
                roomId: room.id,
                propertyId,
                status: "INFO",
            },
        }).catch(() => { });
        return res.status(201).json({
            success: true,
            checkoutUrl: (_c = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.checkout_url) !== null && _c !== void 0 ? _c : (_d = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.data) === null || _d === void 0 ? void 0 : _d.checkout_url,
        });
    }
    catch (e) {
        return res.status(500).json({ message: (e === null || e === void 0 ? void 0 : e.message) || "Booking failed" });
    }
}));
router.post("/:id/license", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prisma } = yield Promise.resolve().then(() => __importStar(require("../../lib/prisma")));
    const { id: propertyId } = req.params;
    const { fileUrl } = req.body;
    if (!fileUrl)
        return res.status(400).json({ message: "fileUrl required" });
    yield prisma.license.upsert({
        where: { propertyId },
        create: { propertyId, fileUrl, status: "PENDING" },
        update: { fileUrl, status: "PENDING" },
    });
    res.json({ success: true, message: "License added" });
}));
router.delete("/:id/license", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prisma } = yield Promise.resolve().then(() => __importStar(require("../../lib/prisma")));
    const { id: propertyId } = req.params;
    yield prisma.license.deleteMany({ where: { propertyId } });
    res.json({ success: true, message: "License removed" });
}));
router.delete("/:id", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.deleteProperty);
router.post("/", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.createProperty);
router.post("/dummy", properties_controller_1.default.createDummyProperty);
