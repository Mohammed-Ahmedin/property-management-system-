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
    const platformCommision = await prisma.commissionSetting.findFirst({
      where: { type: "PLATFORM" },
    });

    if (platformCommision) {
      res.status(409).json({
        message: "Platform commision is already added before",
      });
      return;
    }

    // Upsert platform commission (only one allowed)
    const commission = await prisma.commissionSetting.create({
      data: {
        type: "PLATFORM",
        platformPercent: data.platformPercent,
        brokerPercent: data.brokerPercent,
        isActive: data.isActive ?? true,
        description:
          data.type === "PLATFORM"
            ? "Commission applied for the platform."
            : "Specific commission for a particular property.",
      },
    });

    res.json({
      success: true,
      message: "Platform commison added successfully",
    });
  }),
  createPropertyCommision: tryCatch(async (req, res) => {
    const data = req.body;

    // Optional: validate property exists
    const property = await prisma.property.findUnique({
      where: { id: data.propertyId },
    });

    if (!property)
      return res.status(404).json({ error: "Property not found" });

    const haveAlreadyCommision = await prisma.commissionSetting.findFirst({
      where: {
        AND: {
          type: "PROPERTY",
          propertyId: property.id,
        },
      },
    });

    if (haveAlreadyCommision) {
      res.status(409).json({
        message: "This property already have a own commsion",
        success: false,
      });
      return;
    }

    await prisma.commissionSetting.create({
      data: {
        type: "PROPERTY",
        propertyId: data.propertyId,
        platformPercent: data.platformPercent,
        brokerPercent: data.brokerPercent,
        isActive: data.isActive ?? true,
      },
    });

    res.json({
      message: "Added successfull",
      success: true,
    });
  }),
  updateCommision: tryCatch(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    // --------------------
    // Find existing commission
    // --------------------
    const commission = await prisma.commissionSetting.findUnique({
      where: { id },
    });

    if (!commission)
      return res.status(404).json({
        success: false,
        message: "Commission not found",
      });

    // --------------------
    // Update commission
    // --------------------
    const updated = await prisma.commissionSetting.update({
      where: { id },
      data: {
        platformPercent: data.platformPercent,
        brokerPercent: data.brokerPercent ?? null,
        isActive: data.isActive ?? commission.isActive,
        updatedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Commission updated successfully",
      commission: updated,
    });
  }),
};
