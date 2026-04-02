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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const async_handler_1 = require("../utils/async-handler");
const prisma_1 = require("../lib/prisma");
const templates_1 = require("../templates");
const email_1 = require("../utils/email");
const auth_1 = require("../lib/auth");
const encryption_1 = require("../utils/encryption");
exports.default = {
    makeRegistrationRequest: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { companyName, companyDescription, businessFileUrl, contactName, email, password, phone, registrationType, nationalId, } = req.body;
        if (!contactName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        const existing = yield prisma_1.prisma.registrationRequest.findFirst({
            where: { email, status: { not: "REJECTED" } },
        });
        if (existing) {
            // If there's already an approved request, check if user actually exists
            if (existing.status === "APPROVED") {
                const userExists = yield prisma_1.prisma.user.findFirst({ where: { email } });
                if (userExists) {
                    return res.status(409).json({ success: false, message: "Email already in use" });
                }
                // User wasn't created despite approval — allow re-submission by deleting old request
                yield prisma_1.prisma.registrationRequest.delete({ where: { id: existing.id } });
            }
            else if (existing.status === "PENDING") {
                // Allow re-submission if the pending request is older than 5 minutes (likely abandoned)
                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                if (existing.createdAt < fiveMinutesAgo) {
                    yield prisma_1.prisma.registrationRequest.delete({ where: { id: existing.id } });
                }
                else {
                    return res.status(409).json({ success: false, message: "A registration request with this email is already pending. Please wait a few minutes before trying again." });
                }
            }
        }
        // Also check if user already exists in the system
        const userAlreadyExists = yield prisma_1.prisma.user.findFirst({ where: { email } });
        if (userAlreadyExists) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }
        // Hashing Password👇🏼
        const encryptedPassword = (0, encryption_1.encryptData)(password);
        let savedRegistration;
        if (registrationType === "OWNER") {
            savedRegistration = yield prisma_1.prisma.registrationRequest.create({
                data: {
                    contactName,
                    email,
                    phone,
                    registrationType: "OWNER",
                    json: {
                        companyName,
                        companyDescription,
                        businessFileUrl,
                        password: encryptedPassword,
                    },
                },
            });
        }
        else {
            savedRegistration = yield prisma_1.prisma.registrationRequest.create({
                data: {
                    contactName,
                    email,
                    phone,
                    nationalId,
                    registrationType: "BROKER",
                    json: {
                        password: encryptedPassword,
                    },
                },
            });
        }
        // const encryptId = encryptData(savedRegistration.id);
        let redirectUrl = `${process.env.FRONTEND_URL}/registrations/status/${savedRegistration.id}`;
        // ✅ Send Email Notification
        try {
            yield (0, email_1.sendEmail)({
                to: email,
                subject: "Your Registration Request is Under Review",
                html: (0, templates_1.underReviewTemplate)(contactName, companyName, redirectUrl),
            });
        }
        catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }
        res.json({
            success: true,
            message: "Registration request submitted successfully",
        });
    })),
    getRegistrationRequests: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const requests = yield prisma_1.prisma.registrationRequest.findMany({
            orderBy: { createdAt: "desc" },
        });
        const flattened = requests.map((_a) => {
            var { json } = _a, rest = __rest(_a, ["json"]);
            return (Object.assign(Object.assign({}, rest), json));
        });
        res.json(flattened);
    })),
    getRegistrationRequestById: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const request = yield prisma_1.prisma.registrationRequest.findUnique({
            where: { id },
        });
        if (!request) {
            return res
                .status(404)
                .json({ success: false, message: "Request not found" });
        }
        const { json } = request, rest = __rest(request, ["json"]);
        res.json({ success: true, request: Object.assign(Object.assign({}, rest), json) });
    })),
    updateRegistrationRequestStatus: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const { newStatus } = req.body;
        if (!["PENDING", "APPROVED", "REJECTED"].includes(newStatus)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be PENDING, APPROVED, or REJECTED.",
            });
        }
        const request = yield prisma_1.prisma.registrationRequest.findUnique({
            where: { id },
        });
        if (!request) {
            return res
                .status(404)
                .json({ success: false, message: "Request not found" });
        }
        const updated = yield prisma_1.prisma.registrationRequest.update({
            where: { id },
            data: { status: newStatus },
        });
        const jsonData = updated.json;
        const decryptPassword = (0, encryption_1.decryptData)(jsonData.password);
        if (updated.status === "APPROVED") {
            // Create the user account
            const signUpResult = yield auth_1.auth.api.signUpEmail({
                body: {
                    email: updated.email,
                    name: updated.contactName,
                    password: decryptPassword,
                    role: updated.registrationType,
                    phone: updated.phone,
                    image: "",
                },
            });
            // Ensure role is set correctly (better-auth may not persist custom fields)
            try {
                yield prisma_1.prisma.user.update({
                    where: { email: updated.email },
                    data: {
                        role: updated.registrationType,
                        phone: updated.phone,
                        status: "APPROVED",
                    },
                });
            }
            catch (_a) {
                // user update failed but account was created — non-fatal
            }
        }
        // const encryptId = encryptData(updated.id);
        let redirectUrl = `${process.env.FRONTEND_URL}/registrations/status/${updated.id}`;
        // Send email notification
        yield (0, email_1.sendEmail)({
            from: `"Property Portal" <${process.env.SMTP_USER}>`,
            to: request.email,
            subject: `Your Registration Request Has Been ${newStatus}`,
            html: (0, templates_1.registrationStatusEmailTemplate)(newStatus, request.contactName, redirectUrl),
        });
        res.json({
            success: true,
            message: "Status updated and email sent successfully",
            request: updated,
        });
    })),
    getStats: (0, async_handler_1.tryCatch)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const [brokersCount, ownersCount, pendingCount, approvedCount, rejectedCount, total,] = yield Promise.all([
            prisma_1.prisma.registrationRequest.count({
                where: { registrationType: "BROKER" },
            }),
            prisma_1.prisma.registrationRequest.count({
                where: { registrationType: "OWNER" },
            }),
            prisma_1.prisma.registrationRequest.count({ where: { status: "PENDING" } }),
            prisma_1.prisma.registrationRequest.count({ where: { status: "APPROVED" } }),
            prisma_1.prisma.registrationRequest.count({ where: { status: "REJECTED" } }),
            prisma_1.prisma.registrationRequest.count(),
        ]);
        return res.json({
            brokersCount,
            ownersCount,
            total,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
        });
    })),
    getRegistrationStatusForClient: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const encryptedRegistrationId = req.params.encryptedId;
        // const decryptId = decryptData(encryptedRegistrationId);
        const registrationRequestDoc = yield prisma_1.prisma.registrationRequest.findFirst({
            where: {
                id: encryptedRegistrationId,
            },
        });
        res.json({
            status: registrationRequestDoc.status,
        });
    })),
};
