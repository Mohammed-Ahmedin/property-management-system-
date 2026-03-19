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
router.get("/", auth_middleware_1.authGuard, bookings_controller_1.default.getUserBookings);
router.get("/admins", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.getAdminsBookings);
router.get("/user-bookings/:userId", bookings_controller_1.default.getUserBookings);
router.get("/:bookingId", bookings_controller_1.default.getUserBookingDetailById);
router.post("/", bookings_controller_1.default.bookNow);
router.post("/manual-booking", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), bookings_controller_1.default.manualBooking);
router.post("/dummy", bookings_controller_1.default.bookDummy);
