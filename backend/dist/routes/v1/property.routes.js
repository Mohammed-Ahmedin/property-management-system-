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
