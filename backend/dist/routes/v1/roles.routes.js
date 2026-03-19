"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesRouter = void 0;
const express_1 = require("express");
const owner_controller_1 = __importDefault(require("../../controllers/owner.controller"));
const staff_controller_1 = __importDefault(require("../../controllers/staff.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.RolesRouter = router;
// /roles
router.get("/staff/rooms", (0, auth_middleware_1.authGuard)({ accessedBy: ["STAFF"] }), staff_controller_1.default.getRooms);
// owners
router.get("/owner/rooms", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), owner_controller_1.default.getRooms);
router.get("/owner/rooms/:id", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), owner_controller_1.default.getRoomById);
router.get("/owner/rooms-stats", (0, auth_middleware_1.authGuard)({ cantAccessBy: ["GUEST"] }), owner_controller_1.default.getRoomStats);
