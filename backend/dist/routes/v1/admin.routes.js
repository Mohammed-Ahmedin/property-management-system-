"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsRouter = void 0;
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../../controllers/auth.controller"));
const router = (0, express_1.Router)();
exports.AdminsRouter = router;
// /management
router.get("/me", auth_controller_1.default.me);
