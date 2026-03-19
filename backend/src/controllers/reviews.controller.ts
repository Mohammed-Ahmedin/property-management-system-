import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";
export default {
  // ===== CREATE REVIEW =====
  createReview: tryCatch(async (req, res) => {
    const userId = req.user.id;
    const { content, rating, propertyId } = req.body;

    if (!content || !propertyId) {
      return res
        .status(400)
        .json({ error: "content and propertyId are required" });
    }

    const review = await prisma.$transaction(async (prisma) => {
      // 1. Create review
      const createdReview = await prisma.review.create({
        data: { content, rating, propertyId, userId },
      });

      // 2. Recalculate averageRating and reviewCount
      const aggregate = await prisma.review.aggregate({
        where: { propertyId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const rawAverage = aggregate._avg.rating || 0;
      const averageRating = parseFloat(rawAverage.toFixed(2));

      await prisma.property.update({
        where: { id: propertyId },
        data: {
          averageRating,
          reviewCount: aggregate._count.rating,
        },
      });

      return createdReview;
    });

    res
      .status(201)
      .json({ message: "Review added successfully", success: true });
  }),

  // ===== GET SINGLE REVIEW =====
  getReviews: tryCatch(async (req, res) => {
    const { propertyId } = req.params;
    const review = await prisma.review.findMany({
      where: { propertyId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            image: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!review) return res.status(404).json({ error: "Review not found" });
    res.json({ data: review, success: true });
  }),

  // // ===== LIST ALL REVIEWS (optional: filter by propertyId) =====
  // listReviews: tryCatch(async (req, res) => {
  //   const { propertyId } = req.query;

  //   const reviews = await prisma.review.findMany({
  //     where: propertyId ? { propertyId } : {},
  //     include: { user: true, property: true },
  //     orderBy: { createdAt: "desc" },
  //   });

  //   res.json(reviews);
  // }),

  // ===== UPDATE REVIEW =====
  updateReview: tryCatch(async (req, res) => {
    const { id } = req.params;
    const { content, rating } = req.body;

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review not found" });

    const updatedReview = await prisma.$transaction(async (prisma) => {
      const updated = await prisma.review.update({
        where: { id },
        data: { content, rating },
      });

      // Update property rating
      const aggregate = await prisma.review.aggregate({
        where: { propertyId: review.propertyId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const rawAverage = aggregate._avg.rating || 0;
      const averageRating = parseFloat(rawAverage.toFixed(2));

      await prisma.property.update({
        where: { id: review.propertyId },
        data: {
          averageRating,
          reviewCount: aggregate._count.rating,
        },
      });

      return updated;
    });

    res.json(updatedReview);
  }),

  // ===== DELETE REVIEW =====
  deleteReview: tryCatch(async (req, res) => {
    const { id } = req.params;
    const review = await prisma.review.findUnique({ where: { id } });

    if (!review) return res.status(404).json({ error: "Review not found" });

    await prisma.$transaction(async (prisma) => {
      await prisma.review.delete({ where: { id } });

      // Update property rating
      const aggregate = await prisma.review.aggregate({
        where: { propertyId: review.propertyId },
        _avg: { rating: true },
        _count: { rating: true },
      });

      const rawAverage = aggregate._avg.rating || 0;
      const averageRating = parseFloat(rawAverage.toFixed(2));

      await prisma.property.update({
        where: { id: review.propertyId },
        data: {
          averageRating,
          reviewCount: aggregate._count.rating,
        },
      });
    });

    res.json({ message: "Review deleted successfully" });
  }),

  // ===== GET AVERAGE RATING FOR A GUEST HOUSE =====
  getPropertyRating: tryCatch(async (req, res) => {
    const { propertyId } = req.params;

    const aggregate = await prisma.review.aggregate({
      where: { propertyId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    res.json({
      propertyId,
      averageRating: parseFloat((aggregate._avg.rating || 0).toFixed(2)),
      reviewCount: aggregate._count.rating,
    });
  }),
};
