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
exports.SiteConfigRouter = void 0;
const express_1 = require("express");
const prisma_1 = require("../../lib/prisma");
const auth_middleware_1 = require("../../middleware/auth-middleware");
const async_handler_1 = require("../../utils/async-handler");
const router = (0, express_1.Router)();
exports.SiteConfigRouter = router;
// Public: get site config (for footer, header)
router.get("/", (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let config = yield prisma_1.prisma.siteConfig.findFirst({ where: { id: "singleton" } });
    if (!config) {
        config = yield prisma_1.prisma.siteConfig.create({ data: { id: "singleton" } });
    }
    res.json(config);
})));
// Admin only: update site config
router.put("/", (0, auth_middleware_1.authGuard)({ accessedBy: ["ADMIN"] }), (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { siteName, logoUrl, tagline, heroTitle, heroSubtitle, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress, extraSocials } = req.body;
    const config = yield prisma_1.prisma.siteConfig.upsert({
        where: { id: "singleton" },
        create: { id: "singleton", siteName, logoUrl, tagline, heroTitle, heroSubtitle, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress, extraSocials },
        update: { siteName, logoUrl, tagline, heroTitle, heroSubtitle, youtube, tiktok, telegram, instagram, contactPhone, contactEmail, contactAddress, extraSocials },
    });
    res.json({ success: true, message: "Site config updated", data: config });
})));
