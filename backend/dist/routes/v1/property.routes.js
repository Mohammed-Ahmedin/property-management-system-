"use strict";
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
router.post("/:id/facilities", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.addFacility);
router.post("/:id/images", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.addPropertyImage);
router.delete("/:id/images", properties_controller_1.default.deletePropertyImage);
router.delete("/:id", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.deleteProperty);
router.post("/", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), properties_controller_1.default.createProperty);
router.post("/dummy", properties_controller_1.default.createDummyProperty);
