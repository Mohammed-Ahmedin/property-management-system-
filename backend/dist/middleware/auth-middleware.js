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
exports.authGuard = void 0;
const auth_1 = require("../lib/auth");
const node_1 = require("better-auth/node");
const prisma_1 = require("../lib/prisma");
const authGuard = (options) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            let sessionUser = null;
            // 1. Try cookie-based session (desktop/same-origin)
            const authSession = yield auth_1.auth.api.getSession({
                headers: (0, node_1.fromNodeHeaders)(req.headers),
            });
            if ((_a = authSession === null || authSession === void 0 ? void 0 : authSession.user) === null || _a === void 0 ? void 0 : _a.id) {
                sessionUser = authSession.user;
            }
            else {
                // 2. Fallback: Bearer token (mobile / cross-origin)
                const authHeader = req.headers["authorization"];
                const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) ? authHeader.slice(7) : null;
                if (token) {
                    const sessionDoc = yield prisma_1.prisma.session.findFirst({
                        where: { token },
                        include: { user: true },
                    });
                    if (sessionDoc === null || sessionDoc === void 0 ? void 0 : sessionDoc.user) {
                        sessionUser = sessionDoc.user;
                    }
                }
            }
            if (!(sessionUser === null || sessionUser === void 0 ? void 0 : sessionUser.id)) {
                return res.status(401).json({ message: "User not logged in" });
            }
            req.user = Object.assign({}, sessionUser);
            if (!options)
                return next();
            const userRole = sessionUser.role;
            if (options.cantAccessBy && userRole && options.cantAccessBy.includes(userRole)) {
                return res.status(403).json({ message: "You are not allowed to access this resource" });
            }
            if (options.accessedBy && userRole && !options.accessedBy.includes(userRole)) {
                return res.status(403).json({ message: "You don't have permission to access this resource" });
            }
            next();
        }
        catch (err) {
            console.error("AuthGuard error:", err);
            res.status(500).json({ message: "Internal server error" });
        }
    });
};
exports.authGuard = authGuard;
