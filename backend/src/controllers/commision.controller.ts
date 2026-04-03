import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  getCommisionSettings: tryCatch(async (req, res) => {
    const commisionSettings = await prisma.commissionSetting.findMany({
      include: {
        property: {
          select: { name: true, id: true },
        },
      },
      orderBy: { type: "asc" },
    });

    res.json(commisionSettings);
  }),
  createPlatformCommision: tryCatch(async (req, res) => {
    const data = req.body;
    const userId = (req as any).user?.id;

    const platformCommision = await prisma.commissionSetting.findFirst({
      where: { type: "PLATFORM" },
    });

    if (platformCommision) {
      res.status(409).json({ message: "Platform commission is already added" });
      return;
    }

    const commission = await prisma.commissionSetting.create({
      data: {
        type: "PLATFORM",
        name: data.name || "Platform Commission",
        role: data.role || "PLATFORM",
        platformPercent: data.platformPercent,
        brokerPercent: data.brokerPercent,
        isActive: data.isActive ?? true,
        description: "Commission applied for the platform.",
      },
    });

    // Log to activities
    if (userId) {
      await prisma.activity.create({
        data: {
          action: "CREATE_COMMISSION",
          description: `Commission "${commission.name}" (${commission.role}) created. Platform: ${commission.platformPercent}%, Broker: ${commission.brokerPercent ?? 0}%`,
          userId,
          status: "SUCCESS",
        } as any,
      }).catch(() => {});
    }

    res.json({ success: true, message: "Platform commission added successfully" });
  }),
  createPropertyCommision: tryCatch(async (req, res) => {
    const data = req.body;
    const userId = (req as any).user?.id;

    const property = await prisma.property.findUnique({ where: { id: data.propertyId } });
    if (!property) return res.status(404).json({ error: "Property not found" });

    const existing = await prisma.commissionSetting.findFirst({
      where: { type: "PROPERTY", property: { id: property.id } },
    });
    if (existing) {
      res.status(409).json({ message: "This property already has a commission", success: false });
      return;
    }

    const commission = await prisma.commissionSetting.create({
      data: {
        type: "PROPERTY",
        name: data.name || `${property.name} Commission`,
        role: data.role || "OWNER",
        property: { connect: { id: data.propertyId } },
        platformPercent: data.platformPercent ?? 0,
        brokerPercent: data.brokerPercent,
        isActive: data.isActive ?? true,
      },
    });

    if (userId) {
      await prisma.activity.create({
        data: {
          action: "CREATE_COMMISSION",
          description: `Commission "${commission.name}" (${commission.role}) created for property "${property.name}". Platform: ${commission.platformPercent}%, Broker: ${commission.brokerPercent ?? 0}%`,
          userId,
          status: "SUCCESS",
        } as any,
      }).catch(() => {});
    }

    res.json({ message: "Commission added successfully", success: true });
  }),
  updateCommision: tryCatch(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const userId = (req as any).user?.id;

    const commission = await prisma.commissionSetting.findUnique({ where: { id } });
    if (!commission) return res.status(404).json({ success: false, message: "Commission not found" });

    const updated = await prisma.commissionSetting.update({
      where: { id },
      data: {
        name: data.name ?? commission.name,
        role: data.role ?? commission.role,
        platformPercent: data.platformPercent,
        brokerPercent: data.brokerPercent ?? null,
        isActive: data.isActive ?? commission.isActive,
        updatedAt: new Date(),
      },
    });

    if (userId) {
      await prisma.activity.create({
        data: {
          action: "UPDATE_COMMISSION",
          description: `Commission "${updated.name}" (${updated.role}) updated. Platform: ${updated.platformPercent}%, Broker: ${updated.brokerPercent ?? 0}%`,
          userId,
          status: "SUCCESS",
        } as any,
      }).catch(() => {});
    }

    res.json({ success: true, message: "Commission updated successfully", commission: updated });
  }),
};
