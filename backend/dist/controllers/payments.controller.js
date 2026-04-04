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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chapa_1 = require("../config/chapa");
const async_handler_1 = require("../utils/async-handler");
const prisma_1 = require("../lib/prisma");
const zod_1 = __importDefault(require("zod"));
const payments_service_1 = require("../services/payments.service");
const subAccountSchema = zod_1.default.object({
    bankCode: zod_1.default.number().positive(),
    accountNumber: zod_1.default
        .string()
        .min(8)
        .max(20)
        .regex(/^\d+$/, "Account number must be digits only"),
    accountName: zod_1.default.string().min(3).max(100),
    businessName: zod_1.default.string().min(2).max(100),
    propertyId: zod_1.default.string().optional(),
});
const crypto_1 = __importDefault(require("crypto"));
const chapa_nodejs_1 = require("chapa-nodejs");
const CHAPA_WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET;
exports.default = {
    createSubAccount: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const userRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        if (!userId || !userRole) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // ✅ Validate body input
        const parsed = subAccountSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Invalid data", success: false });
        }
        const { bankCode, accountNumber, accountName, businessName, propertyId } = parsed.data;
        // ✅ Check for existing subaccount
        const existingSubAccount = yield prisma_1.prisma.chapaSubAccount.findFirst({
            where: { ownerId: userId },
        });
        // ✅ Enforce role-based rules
        if (userRole === "ADMIN") {
            const platformAccount = yield prisma_1.prisma.chapaSubAccount.findFirst({
                where: { type: "PLATFORM" },
            });
            if (platformAccount) {
                return res.status(409).json({
                    message: "The platform already has a subaccount.",
                    success: false,
                });
            }
        }
        if (existingSubAccount) {
            return res.status(409).json({
                message: "You already have a subaccount.",
                success: false,
            });
        }
        const { recipient, splitValue } = yield (0, payments_service_1.getCommissionSplit)(userRole);
        // ✅ Create subaccount via Chapa API
        let chapaResponse;
        try {
            chapaResponse = yield chapa_1.chapaConfig.createSubaccount({
                account_name: accountName,
                account_number: accountNumber,
                bank_code: bankCode,
                business_name: businessName,
                split_type: chapa_nodejs_1.SplitType.PERCENTAGE,
                split_value: 0.03,
            });
        }
        catch (err) {
            console.log("-----------------------------", err);
            res.status(502).json({
                message: "Failed to create subaccount with Chapa",
                success: false,
            });
        }
        if (!((_c = chapaResponse === null || chapaResponse === void 0 ? void 0 : chapaResponse.data) === null || _c === void 0 ? void 0 : _c.subaccount_id)) {
            return res.status(500).json({ message: "Invalid response from Chapa" });
        }
        // ✅ Save to database
        const createdSubAccount = yield prisma_1.prisma.chapaSubAccount.create({
            data: Object.assign(Object.assign({ owner: { connect: { id: userId } } }, (propertyId ? { property: { connect: { id: propertyId } } } : {})), { accountName,
                accountNumber, chapaSubId: chapaResponse.data.subaccount_id, bankCode: bankCode.toString(), splitType: "percentage", splitValue: 0, type: userRole === "ADMIN" ? "PLATFORM" : userRole, businessName }),
        });
        return res.status(201).json({
            message: "Subaccount created successfully",
            subAccount: createdSubAccount,
        });
    })),
    getBanks: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield chapa_1.chapaConfig.getBanks();
            res.json({ response: response });
        }
        catch (error) {
            res.status(400).json({ message: "Some error occured" });
        }
    })),
    init: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const txRef = yield chapa_1.chapaConfig.genTxRef();
        const { chapaResponse, commission, subaccounts } = yield (0, payments_service_1.initializeChapaPayment)({
            data: {
                amount: 1000,
                customerName: "Solomon getnet",
                email: "sola@gmail.com",
                phoneNumber: "0925760943",
                txRef: txRef,
            },
            propertyId: "",
            brokerId: "",
        });
        console.log({ checkoutUrl: chapaResponse });
        res.json({
            checkoutUrl: chapaResponse,
            success: true,
        });
    })),
    getSubaccountDetail: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userRole = req.user.role;
        const userId = req.user.id;
        let subAccountDoc;
        if (userRole === "ADMIN") {
            subAccountDoc = yield prisma_1.prisma.chapaSubAccount.findFirst({
                where: { type: "PLATFORM" },
            });
        }
        else {
            subAccountDoc = yield prisma_1.prisma.chapaSubAccount.findFirst({
                where: {
                    ownerId: userId,
                },
            });
        }
        res.json(subAccountDoc);
    })),
    getSubaccounts: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const subAccounts = yield prisma_1.prisma.chapaSubAccount.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(subAccounts);
    })),
    chapaWebhook: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const body = req.body;
            const hashedSignature = crypto_1.default
                .createHmac("sha256", CHAPA_WEBHOOK_SECRET)
                .update(JSON.stringify(body))
                .digest("hex");
            const incomingSignature = req.headers["x-chapa-signature"] || req.headers["chapa-signature"];
            // Validate the webhook signature
            if (hashedSignature != incomingSignature) {
                return res.status(400).json({
                    message: "Invalid signature",
                });
            }
            const { tx_ref, status, reference: transaction_id, payment_method, amount, mobile, } = body;
            // Validate the status and tx_ref (transaction reference)
            if (!tx_ref || !status) {
                return res.status(400).json({
                    message: "Invalid data received",
                });
            }
            // Find the payment by transaction reference
            const payment = yield prisma_1.prisma.payment.findFirst({
                where: {
                    transactionRef: tx_ref,
                },
            });
            if (!payment) {
                return res.status(404).json({
                    message: "Not found",
                });
            }
            let dbStatus;
            switch (status) {
                case "success":
                    dbStatus = "SUCCESS";
                    break;
                case "failed":
                    dbStatus = "FAILED";
                    break;
                case "pending":
                    dbStatus = "PENDING";
                    break;
                case "canceled":
                    dbStatus = "CANCELLED";
                    break;
                case "refunded":
                    dbStatus = "REFUNDED";
                    break;
            }
            // ✅ AWAITED — was missing before, causing silent failure
            yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                const paymentDoc = yield tx.payment.update({
                    where: { id: payment.id },
                    data: {
                        status: dbStatus,
                        transactionId: transaction_id,
                        amount: Number(amount),
                        phoneNumber: mobile,
                    },
                });
                if (dbStatus === "SUCCESS") {
                    yield tx.booking.update({
                        where: { id: paymentDoc.bookingId },
                        data: { status: "APPROVED" },
                    });
                }
            }));
            // Log activity when payment succeeds — booking is now APPROVED (Reserved)
            if (dbStatus === "SUCCESS") {
                // Get booking details for the activity description
                const bookingDoc = yield prisma_1.prisma.booking.findUnique({
                    where: { id: payment.bookingId },
                    select: { propertyId: true, roomId: true, userId: true, totalAmount: true, guestName: true, user: { select: { name: true } } },
                }).catch(() => null);
                const clientName = (bookingDoc === null || bookingDoc === void 0 ? void 0 : bookingDoc.guestName) || ((_a = bookingDoc === null || bookingDoc === void 0 ? void 0 : bookingDoc.user) === null || _a === void 0 ? void 0 : _a.name) || "Guest";
                yield prisma_1.prisma.activity.create({
                    data: {
                        action: "APPROVED_BOOKING",
                        description: `Booking RESERVED for "${clientName}" after successful payment. Transaction: ${transaction_id || tx_ref}. Amount: ETB ${amount}. Booking is now reserved — no further approval needed.`,
                        bookingId: payment.bookingId,
                        propertyId: bookingDoc === null || bookingDoc === void 0 ? void 0 : bookingDoc.propertyId,
                        roomId: bookingDoc === null || bookingDoc === void 0 ? void 0 : bookingDoc.roomId,
                        userId: bookingDoc === null || bookingDoc === void 0 ? void 0 : bookingDoc.userId,
                        status: "INFO",
                    },
                }).catch(() => { });
            }
            // Return success response
            return res.json({
                message: "Payment status updated successfully",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Some error occured please try again",
            });
        }
    })),
    // Verify payment by txRef — called by frontend on return from Chapa
    verifyPayment: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const { txRef } = req.params;
        if (!txRef)
            return res.status(400).json({ message: "txRef required" });
        const payment = yield prisma_1.prisma.payment.findFirst({
            where: { transactionRef: txRef },
            include: { booking: true },
        });
        if (!payment)
            return res.status(404).json({ message: "Payment not found" });
        // If already SUCCESS, just return current state
        if (payment.status === "SUCCESS") {
            return res.json({ success: true, status: "SUCCESS", bookingStatus: (_a = payment.booking) === null || _a === void 0 ? void 0 : _a.status });
        }
        // Verify with Chapa API
        try {
            const verifyRes = yield chapa_1.chapaConfig.verify({ tx_ref: txRef });
            const chapaStatus = ((_b = verifyRes === null || verifyRes === void 0 ? void 0 : verifyRes.data) === null || _b === void 0 ? void 0 : _b.status) || (verifyRes === null || verifyRes === void 0 ? void 0 : verifyRes.status);
            if (chapaStatus === "success") {
                yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    yield tx.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: "SUCCESS",
                            amount: Number(((_a = verifyRes === null || verifyRes === void 0 ? void 0 : verifyRes.data) === null || _a === void 0 ? void 0 : _a.amount) || payment.amount),
                        },
                    });
                    yield tx.booking.update({
                        where: { id: payment.bookingId },
                        data: { status: "APPROVED" },
                    });
                }));
                // Log APPROVED_BOOKING activity so admin sees "Reserved"
                yield prisma_1.prisma.activity.create({
                    data: {
                        action: "APPROVED_BOOKING",
                        description: `Booking RESERVED for "${((_d = (_c = payment.booking) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.name) || ((_e = payment.booking) === null || _e === void 0 ? void 0 : _e.guestName) || "Guest"}" after payment verification. Transaction: ${txRef}. Booking is now reserved — no further approval needed.`,
                        bookingId: payment.bookingId,
                        propertyId: (_f = payment.booking) === null || _f === void 0 ? void 0 : _f.propertyId,
                        status: "INFO",
                    },
                }).catch(() => { });
                return res.json({ success: true, status: "SUCCESS", bookingStatus: "APPROVED" });
            }
            else if (chapaStatus === "failed") {
                yield prisma_1.prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
                return res.json({ success: false, status: "FAILED", bookingStatus: (_g = payment.booking) === null || _g === void 0 ? void 0 : _g.status });
            }
        }
        catch (err) {
            // Chapa verify failed — fall back to current DB state
        }
        return res.json({ success: false, status: payment.status, bookingStatus: (_h = payment.booking) === null || _h === void 0 ? void 0 : _h.status });
    })),
    // payments;
    getPayments: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        const { id: userId, role } = user;
        let payments = [];
        if (role === "ADMIN") {
            // Admin sees all payments
            payments = yield prisma_1.prisma.payment.findMany({
                include: {
                    booking: {
                        select: {
                            id: true,
                            property: { select: { id: true, name: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        }
        else {
            // Non-admins: filter via managed properties
            let roleFilter = [];
            if (role === "STAFF")
                roleFilter = ["STAFF"];
            else if (role === "BROKER")
                roleFilter = ["BROKER"];
            else if (role === "OWNER")
                roleFilter = ["OWNER"];
            // Find properties managed by this user
            const managedProperties = yield prisma_1.prisma.property.findMany({
                where: {
                    managers: {
                        some: { userId, role: { in: roleFilter } },
                    },
                },
                select: { id: true },
                orderBy: { createdAt: "desc" },
            });
            const managedPropertyIds = managedProperties.map((gh) => gh.id);
            if (managedPropertyIds.length > 0) {
                payments = yield prisma_1.prisma.payment.findMany({
                    where: {
                        booking: { propertyId: { in: managedPropertyIds } },
                    },
                    include: {
                        booking: {
                            select: {
                                id: true,
                                property: { select: { id: true, name: true } },
                            },
                        },
                        chapaSubAccount: true,
                    },
                    orderBy: { createdAt: "desc" },
                });
            }
        }
        res.json(payments);
    })),
    getPaymentStats: (0, async_handler_1.tryCatch)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user = req.user;
        const { id: userId, role } = user;
        let payments = [];
        if (role === "ADMIN") {
            payments = yield prisma_1.prisma.payment.findMany({
                include: {
                    booking: {
                        select: {
                            id: true,
                            property: { select: { id: true, name: true } },
                        },
                    },
                },
            });
        }
        else {
            let roleFilter = [];
            if (role === "STAFF")
                roleFilter = ["STAFF"];
            else if (role === "BROKER")
                roleFilter = ["BROKER"];
            else if (role === "OWNER")
                roleFilter = ["OWNER"];
            const managedProperties = yield prisma_1.prisma.property.findMany({
                where: {
                    managers: {
                        some: { userId, role: { in: roleFilter } },
                    },
                },
                select: { id: true },
            });
            const managedPropertyIds = managedProperties.map((gh) => gh.id);
            if (managedPropertyIds.length > 0) {
                payments = yield prisma_1.prisma.payment.findMany({
                    where: {
                        booking: { propertyId: { in: managedPropertyIds } },
                    },
                    include: {
                        booking: {
                            select: {
                                id: true,
                                property: { select: { id: true, name: true } },
                            },
                        },
                    },
                });
            }
        }
        // ---- STATS CALCULATION ----
        const totalPayments = payments.length;
        const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
        const successfulPayments = payments.filter((p) => p.status === "SUCCESS");
        const pendingPayments = payments.filter((p) => p.status === "PENDING");
        const failedPayments = payments.filter((p) => p.status === "FAILED");
        const onlinePayments = payments.filter((p) => p.method === "ONLINE");
        const cashPayments = payments.filter((p) => p.method === "CASH");
        // Calculate monthly totals (for charts)
        const monthlyStats = payments.reduce((acc, p) => {
            const month = p.createdAt.toISOString().slice(0, 7); // e.g., "2025-10"
            acc[month] = (acc[month] || 0) + (p.amount || 0);
            return acc;
        }, {});
        // Group by property
        const propertyStats = Object.values(payments.reduce((acc, p) => {
            var _a, _b;
            const gh = ((_b = (_a = p.booking) === null || _a === void 0 ? void 0 : _a.property) === null || _b === void 0 ? void 0 : _b.name) || "Unknown";
            if (!acc[gh])
                acc[gh] = { property: gh, totalAmount: 0, count: 0 };
            acc[gh].totalAmount += p.amount || 0;
            acc[gh].count++;
            return acc;
        }, {}));
        res.json({
            totalPayments, // #1 Total number of payments
            totalAmount, // #2 Total amount collected
            successRate: totalPayments
                ? ((successfulPayments.length / totalPayments) * 100).toFixed(2) + "%"
                : "0%", // #3 Success rate
            paymentMethodBreakdown: {
                online: onlinePayments.length,
                cash: cashPayments.length,
            }, // #4 Payment method stats
            statusBreakdown: {
                success: successfulPayments.length,
                pending: pendingPayments.length,
                failed: failedPayments.length,
            }, // #5 Payment status stats
            monthlyTotals: monthlyStats, // #6 Monthly totals (for chart)
            propertyStats, // #7 Property breakdown
        });
    })),
};
