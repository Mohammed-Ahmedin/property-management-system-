import { Router } from "express";
import DashboardController from "../../controllers/dashboard.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// @/dashboard
router.get(
  "/admin/stats",
  authGuard({ accessedBy: ["ADMIN"] }),
  DashboardController.getAdminDashboardStats
);
router.get(
  "/admin/summary",
  authGuard({ accessedBy: ["ADMIN"] }),
  DashboardController.getAdminDashboardSummary
);

// owner
router.get(
  "/owner",
  authGuard({ accessedBy: ["OWNER"] }),
  DashboardController.getOwnerDashboardStats
);

// borkder
router.get(
  "/broker",
  authGuard({ accessedBy: ["BROKER"] }),
  DashboardController.getBrokerDashboardStats
);

// staffs
router.get(
  "/staff/stats",
  authGuard({ accessedBy: ["STAFF"] }),
  DashboardController.getStaffDashboardStats
);

export { router as DashboardRouter };
