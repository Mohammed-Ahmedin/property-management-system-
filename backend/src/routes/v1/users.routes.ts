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

// Upload avatar image for current user
router.post("/upload-avatar", authGuard(), async (req: any, res) => {
  try {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const files = (req as any).files;
    const file = files?.file;
    if (!file) return res.status(400).json({ message: "No file provided" });

    const buffer = Buffer.isBuffer(file.data) ? file.data : Buffer.from(file.data);
    const base64 = buffer.toString("base64");
    const mimeType = file.mimetype || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, { folder: "avatars" });
    res.json({ url: result.secure_url });
  } catch (e: any) {
    res.status(500).json({ message: e?.message || "Upload failed" });
  }
});

export { router as UsersRouter };
