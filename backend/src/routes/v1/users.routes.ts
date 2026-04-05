import { Router } from "express";
import userController from "../../controllers/users.controller";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

router.get("/management", authGuard({ accessedBy: ["ADMIN"] }), userController.getUsers);
router.get("/management/stats", authGuard({ accessedBy: ["ADMIN"] }), userController.getStats);
router.get("/clients", authGuard({ accessedBy: ["BROKER", "ADMIN"] }), userController.getClients);
router.put("/management/:id", authGuard({ accessedBy: ["ADMIN"] }), userController.updateUser);
router.post("/management/:id/ban", authGuard({ accessedBy: ["ADMIN"] }), userController.banUser);
router.post("/management/:id/unban", authGuard({ accessedBy: ["ADMIN"] }), userController.unbanUser);
router.delete("/management/:id", authGuard({ accessedBy: ["ADMIN"] }), userController.deleteUser);

// Get current authenticated user (used as mobile fallback for profile tab)
router.get("/me", authGuard(), async (req, res) => {
  const user = (req as any).user;
  res.json({ user });
});

export { router as UsersRouter };
