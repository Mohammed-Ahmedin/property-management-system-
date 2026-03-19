"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = __importDefault(require("../../controllers/dashboard.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.DashboardRouter = router;
// @/dashboard
router.get("/admin", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), dashboard_controller_1.default.getAdminDashboardStats);
router.get("/owner", (0, auth_middleware_1.authGuard)({ accessedBy: ["OWNER"] }), dashboard_controller_1.default.getOwnerDashboardStats);
router.get("/broker", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER"] }), dashboard_controller_1.default.getBrokerDashboardStats);
router.get("/staff", (0, auth_middleware_1.authGuard)({ accessedBy: ["STAFF"] }), dashboard_controller_1.default.getStaffDashboardStats);
