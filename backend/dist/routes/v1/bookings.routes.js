"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsRouter = void 0;
const express_1 = require("express");
const bookings_controller_1 = __importDefault(require("../../controllers/bookings.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.BookingsRouter = router;
// @/bookings
router.get("/user", (0, auth_middleware_1.authGuard)(), bookings_controller_1.default.getUserBookings);
router.get("/user/:bookingId", (0, auth_middleware_1.authGuard)(), bookings_controller_1.default.getUserBookingDetailById);
router.post("/", bookings_controller_1.default.bookNow);
// management
router.get("/management", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.getBookingsForManagement);
router.get("/management/recent", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.getRecentBookingForManagement);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.getBookingStatsForManagement);
router.post("/management/:bookingId/status", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.changeBookingStatus);
router.get("/management/:bookingId", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.getBookingDetailForManagement);
router.post("/management/manual-booking", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.manualBooking);
// user
router.get("/:bookingId", bookings_controller_1.default.getUserBookingDetailById);
