import { Router } from "express";
import { authGuard } from "../../middleware/auth-middleware";
import favoriteController from "../../controllers/favorites.controller";
const router = Router();

// @/api/v1/favorites/
router.get(
  "/",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }),
  favoriteController.getMyFavorites
);

router.get(
  "/check",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }),
  favoriteController.isFavorited
);

router.post(
  "/",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }),
  favoriteController.addFavorite
);

router.delete(
  "/",
  authGuard({ accessedBy: ["ADMIN", "BROKER", "OWNER", "GUEST"] }),
  favoriteController.removeFavorite
);

export { router as FavoriteRouter };
