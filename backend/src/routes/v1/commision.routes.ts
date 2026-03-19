import { Router } from "express";
import commisionController from "../../controllers/commision.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

// /commision-settings
router.get(
  "/",
  authGuard({ accessedBy: ["ADMIN"] }),
  commisionController.getCommisionSettings
);
router.put(
  "/:id",
  authGuard({ accessedBy: ["ADMIN"] }),
  commisionController.updateCommision
);
router.post(
  "/platform",
  authGuard({ accessedBy: ["ADMIN"] }),
  commisionController.createPlatformCommision
);

router.post(
  "/property",
  authGuard({ accessedBy: ["ADMIN"] }),
  commisionController.createPropertyCommision
);

export { router as CommisionRouter };
