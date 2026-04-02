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
exports.getSession = exports.auth = void 0;
const better_auth_1 = require("better-auth");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("./prisma");
const plugins_1 = require("better-auth/plugins");
const email_1 = require("../utils/email");
const templates_1 = require("../templates");
const CLIENT_FRONTEND_URL = process.env.CLIENT_FRONTEND_URL;
const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL;
const trustedOrigins = [
    "http://localhost:4000",
    "http://localhost:5173",
    "https://solomongetnet.pro.et",
    "https://www.solomongetnet.pro.et",
    "https://property-admin-web.vercel.app",
    "https://property-booking-project-ui9i.vercel.app",
    "https://property-management-system-s61h-f20us0qvf.vercel.app",
    "https://property-management-system-6wk84gdqk-mohammed-ahmedins-projects.vercel.app",
    "https://property-management-system-ifoqipqs3-mohammed-ahmedins-projects.vercel.app",
    "https://property-management-system-s61h-2wxy4q7rh.vercel.app",
    "https://property-management-system-s61h-i1fy4jr1a.vercel.app",
    "https://property-management-system-if6x3e54y-mohammed-ahmedins-projects.vercel.app",
    "https://property-management-system-ifoqipqs3-mohammed-ahmedins-projects.vercel.app",
    "https://property-management-system-s61h.vercel.app",
    "https://property-management-system-cyan.vercel.app",
    "myapp://",
    ...(CLIENT_FRONTEND_URL ? [CLIENT_FRONTEND_URL] : []),
    ...(ADMIN_FRONTEND_URL ? [ADMIN_FRONTEND_URL] : []),
];
const BASE_URL = process.env.BASE_URL;
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: "postgresql",
    }),
    trustedOrigins,
    baseURL: BASE_URL,
    databaseHooks: {
        user: {
            create: {
                before: (user) => __awaiter(void 0, void 0, void 0, function* () { }),
                after: (user) => __awaiter(void 0, void 0, void 0, function* () { }),
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 4,
    },
    advanced: {
        ipAddress: {
            ipAddressHeaders: ["x-client-ip", "x-forwarded-for"],
            disableIpTracking: false,
        },
        useSecureCookies: true,
        cookies: {
            session_token: {
                attributes: {
                    sameSite: "none",
                    secure: true,
                },
            },
        },
    },
    session: {
        storeSessionInDatabase: true,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // cache for 5 minutes
        },
        preserveSessionInDatabase: true,
    },
    plugins: [
        (0, plugins_1.customSession)((_a) => __awaiter(void 0, [_a], void 0, function* ({ user, session }) {
            const userDoc = yield prisma_2.prisma.user.findFirst({
                where: { id: user.id },
            });
            return {
                user: Object.assign(Object.assign({}, user), { role: userDoc === null || userDoc === void 0 ? void 0 : userDoc.role }),
                session,
            };
        })),
        (0, plugins_1.emailOTP)({
            sendVerificationOTP(_a) {
                return __awaiter(this, arguments, void 0, function* ({ email, otp, type }) {
                    if (type === "sign-in") {
                        // Send the OTP for sign in
                    }
                    else if (type === "email-verification") {
                        // Send the OTP for email verification
                    }
                    else {
                        (0, email_1.sendEmail)({
                            html: (0, templates_1.resetPasswordTemplate)({
                                otp,
                                appName: "Property booking",
                                expiryMinutes: 5,
                                typeLabel: "",
                            }),
                            subject: "",
                            to: email,
                            from: "Property booking app",
                        });
                        // Send the OTP for password reset
                    }
                });
            },
            otpLength: 6,
            allowedAttempts: 100,
        }),
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
            },
            phone: {
                type: "string",
                input: true,
            },
            status: {
                type: "string",
                input: true,
                required: false,
                defaultValue: "APPROVED",
            },
        },
    },
});
exports.getSession = exports.auth.api.getSession;
