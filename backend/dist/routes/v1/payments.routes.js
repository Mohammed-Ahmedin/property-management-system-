"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsRouter = void 0;
const express_1 = require("express");
const payments_controller_1 = __importDefault(require("../../controllers/payments.controller"));
const auth_middleware_1 = require("../../middleware/auth-middleware");
const router = (0, express_1.Router)();
exports.PaymentsRouter = router;
// /payments
router.get("/banks", payments_controller_1.default.getBanks);
router.post("/subaccount", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), payments_controller_1.default.createSubAccount);
router.get("/subaccount", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), payments_controller_1.default.getSubaccountDetail);
router.get("/subaccount/get-all", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), payments_controller_1.default.getSubaccounts);
router.get("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), payments_controller_1.default.getPayments);
router.get("/stats", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }), payments_controller_1.default.getPaymentStats);
router.post("/webhook", payments_controller_1.default.chapaWebhook);
router.post("/init", 
//   authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
payments_controller_1.default.init);
