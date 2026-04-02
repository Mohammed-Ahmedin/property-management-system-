"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = require("../utils/async-handler");
const prisma_1 = require("../lib/prisma");
exports.default = {
    // ===== CREATE REVIEW =====
    createReview: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.user.id;
        const { content, rating, propertyId } = req.body;
        if (!content || !propertyId) {
            return res
                .status(400)
                .json({ error: "content and propertyId are required" });
        }
        const review = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Create review
            const createdReview = yield prisma.review.create({
                data: { content, rating, propertyId, userId },
            });
            // 2. Recalculate averageRating and reviewCount
            const aggregate = yield prisma.review.aggregate({
                where: { propertyId },
                _avg: { rating: true },
                _count: { rating: true },
            });
            const rawAverage = aggregate._avg.rating || 0;
            const averageRating = parseFloat(rawAverage.toFixed(2));
            yield prisma.property.update({
                where: { id: propertyId },
                data: {
                    averageRating,
                    reviewCount: aggregate._count.rating,
                },
            });
            return createdReview;
        }));
        res
            .status(201)
            .json({ message: "Review added successfully", success: true });
    })),
    // ===== GET SINGLE REVIEW =====
    getReviews: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { propertyId } = req.params;
        const review = yield prisma_1.prisma.review.findMany({
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
        if (!review)
            return res.status(404).json({ error: "Review not found" });
        res.json({ data: review, success: true });
    })),
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
    updateReview: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { content, rating } = req.body;
        const review = yield prisma_1.prisma.review.findUnique({ where: { id } });
        if (!review)
            return res.status(404).json({ error: "Review not found" });
        const updatedReview = yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            const updated = yield prisma.review.update({
                where: { id },
                data: { content, rating },
            });
            // Update property rating
            const aggregate = yield prisma.review.aggregate({
                where: { propertyId: review.propertyId },
                _avg: { rating: true },
                _count: { rating: true },
            });
            const rawAverage = aggregate._avg.rating || 0;
            const averageRating = parseFloat(rawAverage.toFixed(2));
            yield prisma.property.update({
                where: { id: review.propertyId },
                data: {
                    averageRating,
                    reviewCount: aggregate._count.rating,
                },
            });
            return updated;
        }));
        res.json(updatedReview);
    })),
    // ===== DELETE REVIEW =====
    deleteReview: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const review = yield prisma_1.prisma.review.findUnique({ where: { id } });
        if (!review)
            return res.status(404).json({ error: "Review not found" });
        yield prisma_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.review.delete({ where: { id } });
            // Update property rating
            const aggregate = yield prisma.review.aggregate({
                where: { propertyId: review.propertyId },
                _avg: { rating: true },
                _count: { rating: true },
            });
            const rawAverage = aggregate._avg.rating || 0;
            const averageRating = parseFloat(rawAverage.toFixed(2));
            yield prisma.property.update({
                where: { id: review.propertyId },
                data: {
                    averageRating,
                    reviewCount: aggregate._count.rating,
                },
            });
        }));
        res.json({ message: "Review deleted successfully" });
    })),
    // ===== GET AVERAGE RATING FOR A GUEST HOUSE =====
    getPropertyRating: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { propertyId } = req.params;
        const aggregate = yield prisma_1.prisma.review.aggregate({
            where: { propertyId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        res.json({
            propertyId,
            averageRating: parseFloat((aggregate._avg.rating || 0).toFixed(2)),
            reviewCount: aggregate._count.rating,
        });
    })),
};
