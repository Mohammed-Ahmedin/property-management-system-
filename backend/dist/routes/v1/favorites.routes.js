"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavoriteRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../../middleware/auth-middleware");
const favorites_controller_1 = __importDefault(require("../../controllers/favorites.controller"));
const router = (0, express_1.Router)();
exports.FavoriteRouter = router;
// @/api/v1/favorites/
router.get("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }), favorites_controller_1.default.getMyFavorites);
router.get("/check", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }), favorites_controller_1.default.isFavorited);
router.post("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }), favorites_controller_1.default.addFavorite);
router.delete("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }), favorites_controller_1.default.removeFavorite);
