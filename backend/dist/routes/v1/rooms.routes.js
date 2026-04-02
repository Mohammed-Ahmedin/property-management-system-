"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsRouter = void 0;
const express_1 = require("express");
const rooms_controller_1 = __importDefault(require("../../controllers/rooms.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.RoomsRouter = router;
// @/api/v1/rooms/
router.get("/", rooms_controller_1.default.getRooms);
// room services
router.post("/:roomId/add-services", rooms_controller_1.default.addServices);
router.put("/:serviceId/update-service", rooms_controller_1.default.updateService);
router.get("/:roomId/get-services", rooms_controller_1.default.getRoomServices);
// managemnt
router.get("/management", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }), rooms_controller_1.default.getRoomsForManagement);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }), rooms_controller_1.default.getRoomStatsForManagement);
router.get("/management/for-list/:propertyId", rooms_controller_1.default.getRoomsForManagmentList);
router.get("/management/:roomId", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "OWNER", "STAFF", "ADMIN"] }), rooms_controller_1.default.getRoomDetailForManagement);
// user
router.get("/:id", rooms_controller_1.default.getRoomById);
// mutations
router.post("/", rooms_controller_1.default.createRoom);
router.put("/:id", rooms_controller_1.default.updateRoom);
router.delete("/:id", rooms_controller_1.default.deleteRoom);
// room images
router.post("/:id/images", rooms_controller_1.default.addRoomImage);
router.delete("/:id/images/:imageId", rooms_controller_1.default.deleteRoomImage);
