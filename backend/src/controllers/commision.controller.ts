import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";

export default {
  getCommisionSettings: tryCatch(async (req, res) => {
    const commisionSettings = await prisma.commissionSetting.findMany({
      include: { property: { select: { name: true, id: true } } },
      orderBy: { type: "asc" },
    });
    res.json(commisionSettings);
  }),

  createPlatformCommision: tryCatch(async (req, res) => {
    const data = req.body;
    const userId = (req as any).user?.id;

    const existing = await prisma.commissionSetting.findFirst({ where: { type: "PLATFORM" } });
    if (existing) {
      res.status(409).json({ message: "Platform commission already exists" });
      return;
    }

    const commission = await prisma.commissionSetting.create({
      data: {
        type: "PLATFORM",
        name: data.name || "Platform Commission",
        role: data.role || "PLATFORM",
        calcType: data.calcType || "PERCENTAGE",
        platformPercent: data.platformPercent ?? 0,
        flatAmount: data.flatAmount ?? null,
        brokerPercent: data.brokerPercent ?? null,
        isActive: data.isActive ?? true,
        description: "Commission applied for the platform.",
      },
    });

    if (userId) {
      const desc = commission.calcType === "FLAT_AMOUNT"
        ? `Commission "${commission.name}" (${commission.role}) created. Flat amount: ETB ${commission.flatAmount}`
        : `Commission "${commission.name}" (${commission.role}) created. Platform: ${commission.platformPercent}%, Broker: ${commission.brokerPercent ?? 0}%`;
      await prisma.activity.create({
        data: { action: "COMMISSION_CREATED", description: desc, userId, status: "INFO" },
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
        calcType: data.calcType || "PERCENTAGE",
        property: { connect: { id: data.propertyId } },
        platformPercent: data.platformPercent ?? 0,
        flatAmount: data.flatAmount ?? null,
        brokerPercent: data.brokerPercent ?? null,
        isActive: data.isActive ?? true,
      },
    });

    if (userId) {
      const desc = commission.calcType === "FLAT_AMOUNT"
        ? `Commission "${commission.name}" (${commission.role}) created for "${property.name}". Flat amount: ETB ${commission.flatAmount}`
        : `Commission "${commission.name}" (${commission.role}) created for "${property.name}". Platform: ${commission.platformPercent}%, Broker: ${commission.brokerPercent ?? 0}%`;
      await prisma.activity.create({
        data: { action: "COMMISSION_CREATED", description: desc, userId, status: "INFO" },
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
        calcType: data.calcType ?? commission.calcType,
        platformPercent: data.platformPercent ?? commission.platformPercent,
        flatAmount: data.flatAmount ?? null,
        brokerPercent: data.brokerPercent ?? null,
        isActive: data.isActive ?? commission.isActive,
        updatedAt: new Date(),
      },
    });

    if (userId) {
      const desc = updated.calcType === "FLAT_AMOUNT"
        ? `Commission "${updated.name}" (${updated.role}) updated. Flat amount: ETB ${updated.flatAmount}`
        : `Commission "${updated.name}" (${updated.role}) updated. Platform: ${updated.platformPercent}%, Broker: ${updated.brokerPercent ?? 0}%`;
      await prisma.activity.create({
        data: { action: "COMMISSION_UPDATED", description: desc, userId, status: "INFO" },
      }).catch(() => {});
    }

    res.json({ success: true, message: "Commission updated successfully", commission: updated });
  }),
};
