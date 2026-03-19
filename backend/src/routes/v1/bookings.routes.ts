import { Router } from "express";
import BookingsController from "../../controllers/bookings.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/bookings
router.get(
  "/user",
  authGuard({ accessedBy: ["GUEST"] }),
  BookingsController.getUserBookings
);
router.get(
  "/user/:userId",
  authGuard({ accessedBy: ["GUEST"] }),
  BookingsController.getUserBookingDetailById
);
router.post("/", BookingsController.bookNow);

// management
router.get(
  "/management",
  authGuard({ cantAccessBy: ["GUEST"] }),
  BookingsController.getBookingsForManagement
);
router.get(
  "/management/recent",
  authGuard({ cantAccessBy: ["GUEST"] }),
  BookingsController.getRecentBookingForManagement
);
router.get(
  "/management/stats",
  authGuard({ cantAccessBy: ["GUEST"] }),
  BookingsController.getBookingStatsForManagement
);
router.post(
  "/management/:bookingId/status",
  authGuard({ cantAccessBy: ["GUEST", "BROKER"] }),
  BookingsController.changeBookingStatus
);

router.get(
  "/management/:bookingId",
  authGuard({ cantAccessBy: ["GUEST", "BROKER"] }),
  BookingsController.getBookingDetailForManagement
);
router.post(
  "/management/manual-booking",
  authGuard({ cantAccessBy: ["GUEST"] }),
  BookingsController.manualBooking
);

// user
router.get("/:bookingId", BookingsController.getUserBookingDetailById);

export { router as BookingsRouter };
