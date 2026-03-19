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
router.post("/:roomId/add-services", rooms_controller_1.default.addServices);
router.put("/:serviceId/update-service", rooms_controller_1.default.updateService);
router.get("/:roomId/get-services", rooms_controller_1.default.getRoomServices);
router.get("/for-admins", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "OWNER", "STAFF"] }), rooms_controller_1.default.getRoomsForAdmins);
router.get("/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "OWNER", "STAFF"] }), rooms_controller_1.default.getRoomStats);
router.get("/for-list/:propertyId", rooms_controller_1.default.getRoomsForAdminsList);
router.get("/:id", rooms_controller_1.default.getRoomById);
router.post("/", rooms_controller_1.default.createRoom);
router.delete("/:id", rooms_controller_1.default.deleteRoom);
// router.post("/dummy", roomsController.createDummyRooms);
router.put("/dummy", rooms_controller_1.default.updateRoom);
