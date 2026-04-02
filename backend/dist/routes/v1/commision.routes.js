"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommisionRouter = void 0;
const express_1 = require("express");
const commision_controller_1 = __importDefault(require("../../controllers/commision.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.CommisionRouter = router;
// /commision-settings
router.get("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), commision_controller_1.default.getCommisionSettings);
router.put("/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), commision_controller_1.default.updateCommision);
router.post("/platform", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), commision_controller_1.default.createPlatformCommision);
router.post("/property", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), commision_controller_1.default.createPropertyCommision);
