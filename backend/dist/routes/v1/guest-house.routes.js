"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyRouter = void 0;
const express_1 = require("express");
const guest_houses_controller_1 = __importDefault(require("../../controllers/properties.controller"));
const management_controller_1 = __importDefault(require("../../controllers/management.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.PropertyRouter = router;
// @/api/v1/properties/
router.get("/", guest_houses_controller_1.default.getProperties);
router.get("/owner/get-properties", (0, auth_middleware_1.authGuard)({ accessedBy: ["OWNER"] }), guest_houses_controller_1.default.getOwnerProperties);
router.get("/admin/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["OWNER"] }), guest_houses_controller_1.default.getPropertyByIdForAdmins);
// staffs managment
router.post("/staff/add-staff", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), management_controller_1.default.addStaffToProperty);
router.post("/staff/remove-staff", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), management_controller_1.default.removeStaffFromProperty);
router.get("/staff/for-list", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST", "STAFF"] }), management_controller_1.default.getStaffsForList);
router.get("/staff/get-staffs/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), management_controller_1.default.getGusetHouseStaffs);
// others
router.get("/", guest_houses_controller_1.default.getPropertiesForList);
router.get("/admins/for-list", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), guest_houses_controller_1.default.getPropertiesForList);
router.get("/manage", guest_houses_controller_1.default.getPropertiesForManagement);
router.get("/:id", guest_houses_controller_1.default.getPropertyById);
router.put("/:id", guest_houses_controller_1.default.updateProperty);
router.delete("/:id", guest_houses_controller_1.default.deleteProperty);
router.post("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["OWNER", "ADMIN", "BROKER"] }), guest_houses_controller_1.default.createProperty);
router.post("/dummy", guest_houses_controller_1.default.createDummyProperty);
