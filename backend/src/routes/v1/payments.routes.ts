import { Router } from "express";
import paymentController from "../../controllers/payments.controller";
import { authGuard } from "../../middleware/auth-middleware";
const router = Router();

// /payments
router.get("/banks", paymentController.getBanks);
router.post(
  "/subaccount",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
  paymentController.createSubAccount
);
router.get(
  "/subaccount",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
  paymentController.getSubaccountDetail
);
router.get(
  "/subaccount/get-all",
  authGuard({ accessedBy: ["ADMIN"] }),
  paymentController.getSubaccounts
);
router.get(
  "/",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
  paymentController.getPayments
);
router.get(
  "/stats",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
  paymentController.getPaymentStats
);
router.post("/webhook", paymentController.chapaWebhook);
router.post(
  "/init",
  //   authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER"] }),
  paymentController.init
);

export { router as PaymentsRouter };
