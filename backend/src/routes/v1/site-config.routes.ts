import { Router } from "express";
import { prisma } from "../../lib/prisma";
import { authGuard } from "../../middleware/auth-middleware";
import { tryCatch } from "../../utils/async-handler";

const router = Router();

// Public: get site config (for footer, header)
router.get("/", tryCatch(async (req, res) => {
  let config = await prisma.siteConfig.findFirst({ where: { id: "singleton" } });
  if (!config) {
    config = await prisma.siteConfig.create({ data: { id: "singleton" } });
  }
  res.json(config);
}));

// Admin only: update site config
router.put("/", authGuard({ accessedBy: ["ADMIN"] }), tryCatch(async (req, res) => {
  const { siteName, logoUrl, tagline, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress } = req.body;
  const config = await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", siteName, logoUrl, tagline, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress },
    update: { siteName, logoUrl, tagline, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress },
  });
  res.json({ success: true, message: "Site config updated", data: config });
}));

export { router as SiteConfigRouter };
