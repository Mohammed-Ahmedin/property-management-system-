import { Router } from "express";
import registrationRequestController from "../../controllers/registration-request.controller";
import { authGuard } from "../../middleware/auth-middleware";
const router = Router();

// requester
router.post("/", registrationRequestController.makeRegistrationRequest);

// admins
router.get(
  "/management",
  authGuard({ accessedBy: ["ADMIN"] }),
  registrationRequestController.getRegistrationRequests
);
router.get(
  "/management/stats",
  authGuard({ accessedBy: ["ADMIN"] }),
  registrationRequestController.getStats
);
router.get(
  "/status/:encryptedId",
  registrationRequestController.getRegistrationStatusForClient
);

router.post(
  "/management/:id/status",
  authGuard({ accessedBy: ["ADMIN"] }),
  registrationRequestController.updateRegistrationRequestStatus
);
router.get(
  "/management/:id",
  authGuard({ accessedBy: ["ADMIN"] }),
  registrationRequestController.getRegistrationRequestById
);

export { router as RegistrationRequestRouter };
