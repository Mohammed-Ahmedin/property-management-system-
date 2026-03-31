import { Router } from "express";
import { tryCatch } from "../../utils/async-handler";
import { prisma } from "../../lib/prisma";
import { authGuard } from "../../middleware/auth-middleware";

const router = Router();

router.get(
  "/",
  authGuard({ cantAccessBy: ["GUEST"] }),
  tryCatch(async (req, res) => {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    let propertyIds: string[] = [];

    if (userRole !== "ADMIN") {
      const managed = await prisma.managedProperty.findMany({
        where: { userId, role: { in: [userRole] } },
        select: { propertyId: true },
      });
      propertyIds = managed.map((m) => m.propertyId);
    }

    const where = propertyIds.length
      ? { propertyId: { in: propertyIds } }
      : userRole === "ADMIN" ? {} : { userId };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { timestamp: "desc" },
        skip,
        take: Number(limit),
      }),
      prisma.activity.count({ where }),
    ]);

    res.json({ data: activities, total, page: Number(page), limit: Number(limit) });
  })
);

export { router as ActivitiesRouter };
