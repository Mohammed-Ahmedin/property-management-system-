import { Router } from "express";
import authController from "../../controllers/auth.controller";
const router = Router();

// /management
router.get("/me", authController.me);

export { router as AdminsRouter };