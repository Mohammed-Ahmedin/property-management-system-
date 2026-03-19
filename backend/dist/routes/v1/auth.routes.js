"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const router = (0, express_1.Router)();
exports.AuthRouter = router;
// /authk
router.get("/me", auth_controller_1.default.me);
router.post("/sign-in", auth_controller_1.default.signIn);
router.post("/sign-up", auth_controller_1.default.signUp);
router.post("/sign-out", auth_controller_1.default.signOut);
