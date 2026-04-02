"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRouter = void 0;
const express_1 = require("express");
const users_controller_1 = __importDefault(require("../../controllers/users.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.UsersRouter = router;
router.get("/management", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.getUsers);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.getStats);
router.get("/clients", (0, auth_middleware_1.authGuard)({ accessedBy: ["BROKER", "ADMIN"] }), users_controller_1.default.getClients);
router.put("/management/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.updateUser);
router.post("/management/:id/ban", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.banUser);
router.post("/management/:id/unban", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.unbanUser);
router.delete("/management/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), users_controller_1.default.deleteUser);
