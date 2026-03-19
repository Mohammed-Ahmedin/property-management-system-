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
const trustedOrigins = ["http://localhost:4000", "myapp://"];
const BASE_URL = process.env.BASE_URL;
exports.auth = (0, better_auth_1.betterAuth)({
    database: (0, prisma_1.prismaAdapter)(prisma_2.prisma, {
        provider: "mysql",
    }),
    trustedOrigins,
    baseURL: BASE_URL,
    databaseHooks: {
        user: {
            create: {
                before: (user) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("user request is here");
                }),
                after: (user) => __awaiter(void 0, void 0, void 0, function* () {
                    console.log("New user created:", user.email, "with role:", user.role);
                }),
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 4,
    },
    advanced: {
    // useSecureCookies: process.env.NODE_ENV === "production",
    // cookies: {
    //   session_token: {
    //     attributes: {
    //       sameSite: "lax",
    //       secure: process.env.NODE_ENV === "production",
    //     },
    //   },
    // },
    },
    session: {
        storeSessionInDatabase: true,
        cookieCache: {
            enabled: false,
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
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                input: true,
            },
        },
    },
});
exports.getSession = exports.auth.api.getSession;
