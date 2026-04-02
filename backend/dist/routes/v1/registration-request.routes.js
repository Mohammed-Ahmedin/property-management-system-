"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationRequestRouter = void 0;
const express_1 = require("express");
const registration_request_controller_1 = __importDefault(require("../../controllers/registration-request.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.RegistrationRequestRouter = router;
// requester
router.post("/", registration_request_controller_1.default.makeRegistrationRequest);
// admins
router.get("/management", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), registration_request_controller_1.default.getRegistrationRequests);
router.get("/management/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), registration_request_controller_1.default.getStats);
router.get("/status/:encryptedId", registration_request_controller_1.default.getRegistrationStatusForClient);
router.post("/management/:id/status", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), registration_request_controller_1.default.updateRegistrationRequestStatus);
router.get("/management/:id", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), registration_request_controller_1.default.getRegistrationRequestById);
