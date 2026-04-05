"use strict";
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
// Get current authenticated user (used as mobile fallback for profile tab)
router.get("/me", (0, auth_middleware_1.authGuard)(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    res.json({ user });
}));
