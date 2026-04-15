import { Router } from "express";
import userController from "../../controllers/users.controller";
import { authGuard } from "../../middleware/auth-middleware";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get("/management", authGuard({ accessedBy: ["ADMIN"] }), userController.getUsers);
router.get("/management/stats", authGuard({ accessedBy: ["ADMIN"] }), userController.getStats);
router.get("/clients", authGuard({ accessedBy: ["BROKER", "ADMIN"] }), userController.getClients);
router.put("/management/:id", authGuard({ accessedBy: ["ADMIN"] }), userController.updateUser);
router.post("/management/:id/ban", authGuard({ accessedBy: ["ADMIN"] }), userController.banUser);
router.post("/management/:id/unban", authGuard({ accessedBy: ["ADMIN"] }), userController.unbanUser);
router.delete("/management/:id", authGuard({ accessedBy: ["ADMIN"] }), userController.deleteUser);

// Get current authenticated user
router.get("/me", authGuard(), async (req: any, res) => {
  res.json({ user: req.user });
});

// Update current user's profile (name + image) — direct DB update bypasses Better Auth limitations
router.put("/me", authGuard(), async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { name, image } = req.body;
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name ? { name } : {}),
        ...(image ? { image } : {}),
      },
    });
    res.json({ success: true, user: updated });
  } catch (e: any) {
    res.status(500).json({ message: e?.message || "Update failed" });
  }
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

    // express-fileupload stores files in req.files
    const files = req.files;
    if (!files || Object.keys(files).length === 0) {
      return res.status(400).json({ message: "No file provided" });
    }

    // Get the file — could be under 'file' or first key
    const file = files.file || files[Object.keys(files)[0]];
    if (!file) return res.status(400).json({ message: "No file found" });

    // Handle both single file and array
    const fileObj = Array.isArray(file) ? file[0] : file;
    const buffer = fileObj.data;
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ message: "Empty file" });
    }

    const base64 = buffer.toString("base64");
    const mimeType = fileObj.mimetype || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, { folder: "avatars" });
    res.json({ url: result.secure_url });
  } catch (e: any) {
    res.status(500).json({ message: e?.message || "Upload failed" });
  }
});

export { router as UsersRouter };
