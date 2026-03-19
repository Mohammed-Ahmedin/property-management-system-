import { tryCatch } from "../utils/async-handler";
import { auth } from "../lib/auth";
import { fromNodeHeaders } from "better-auth/node";
import { AddFavoriteSchema } from "./validators";
import { prisma } from "../lib/prisma";
/* -------------------- Controller -------------------- */

export default {
  // ✅ Add to favorites
  addFavorite: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    const parsed = AddFavoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parsed.error.format() });
    }

    const { roomId, propertyId } = parsed.data;

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_roomId_propertyId: {
          userId: session.user.id,
          roomId: roomId ?? null,
          propertyId: propertyId ?? null,
        },
      },
      create: {
        userId: session.user.id,
        roomId,
        propertyId,
      },
      update: {}, // No update needed (idempotent)
      include: {
        room: true,
        property: true,
      },
    });

    res.status(201).json({ message: "Added to favorites", favorite });
  }),

  // ✅ Remove from favorites
  removeFavorite: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    const parsed = AddFavoriteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid input", details: parsed.error.format() });
    }

    const { roomId, propertyId } = parsed.data;

    const existing = await prisma.favorite.findUnique({
      where: {
        userId_roomId_propertyId: {
          userId: session.user.id,
          roomId: roomId ?? null,
          propertyId: propertyId ?? null,
        },
      },
    });

    if (!existing) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    await prisma.favorite.delete({
      where: { id: existing.id },
    });

    res.json({ message: "Removed from favorites" });
  }),

  // ✅ Get all favorites for the logged-in user
  getMyFavorites: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        room: { include: { property: true } },
        property: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ favorites });
  }),

  // ✅ Check if a specific room/property is favorited
  isFavorited: tryCatch(async (req, res, next) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (!session?.user) return res.status(401).json({ error: "Unauthorized" });

    const parsed = AddFavoriteSchema.safeParse(req.query);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ error: "Invalid query", details: parsed.error.format() });
    }

    const { roomId, propertyId } = parsed.data;

    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_roomId_propertyId: {
          userId: session.user.id,
          roomId: roomId ?? null,
          propertyId: propertyId ?? null,
        },
      },
    });

    res.json({ favorited: !!favorite });
  }),
};
