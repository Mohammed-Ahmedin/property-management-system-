import { Router } from "express";
import authController from "../../controllers/auth.controller";
const router = Router();

// /authk
router.get("/me", authController.me);
router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", authController.signOut);

export { router as AuthRouter };