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
exports.getCommissionSplit = getCommissionSplit;
exports.distributeCommission = distributeCommission;
exports.initializeChapaPayment = initializeChapaPayment;
const axios_1 = __importDefault(require("axios"));
const prisma_1 = require("../lib/prisma");
/**
 * Calculates the Chapa split configuration based on user role.
 * Ensures owner always gets the main payout (after other commissions are deducted).
 */
function getCommissionSplit(userRole) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        // Default (no split)
        let result = {
            splitType: "percentage",
            splitValue: 0,
            recipient: "OWNER",
        };
        // Get global commission config
        const commission = yield prisma_1.prisma.commissionSetting.findFirst({
            where: { type: "PLATFORM", isActive: true },
        });
        if (!commission) {
            console.warn("⚠️ No active global CommissionSetting found. Defaulting to 0 commissions.");
            return result;
        }
        const platformPercent = (_a = commission.platformPercent) !== null && _a !== void 0 ? _a : 0;
        const brokerPercent = (_b = commission.brokerPercent) !== null && _b !== void 0 ? _b : 0;
        // --- Logic per role ---
        switch (userRole) {
            case "ADMIN": // Platform account
                result = {
                    splitType: "percentage",
                    splitValue: platformPercent > 1 ? platformPercent / 100 : platformPercent, // e.g. 3 → 0.03
                    recipient: "PLATFORM",
                };
                break;
            case "BROKER": // Broker account
                result = {
                    splitType: "percentage",
                    splitValue: brokerPercent > 1 ? brokerPercent / 100 : brokerPercent, // e.g. 1.5 → 0.015
                    recipient: "BROKER",
                };
                break;
            case "OWNER": // Owner always gets remaining share
                const totalCut = (platformPercent > 1 ? platformPercent / 100 : platformPercent) +
                    (brokerPercent > 1 ? brokerPercent / 100 : brokerPercent);
                result = {
                    splitType: "percentage",
                    splitValue: 1 - totalCut, // remaining portion (e.g., 1 - (0.03 + 0.015) = 0.955)
                    recipient: "OWNER",
                };
                break;
            default:
                result = { splitType: "percentage", splitValue: 1, recipient: "OWNER" };
        }
        return result;
    });
}
function distributeCommission(_a) {
    return __awaiter(this, arguments, void 0, function* ({ totalAmount, propertyId, brokerId, }) {
        var _b, _c, _d;
        // 1️⃣ Fetch commission: property > platform
        const commission = yield prisma_1.prisma.commissionSetting.findFirst({
            where: {
                OR: [
                    { type: "PROPERTY", propertyId, isActive: true },
                    { type: "PLATFORM", isActive: true },
                ],
            },
            orderBy: { type: "desc" }, // property first
        });
        const platformPercent = (_b = commission === null || commission === void 0 ? void 0 : commission.platformPercent) !== null && _b !== void 0 ? _b : 0;
        const brokerPercent = (_c = commission === null || commission === void 0 ? void 0 : commission.brokerPercent) !== null && _c !== void 0 ? _c : 0;
        const hasBroker = !!brokerId;
        const platformSplitValue = platformPercent;
        const brokerSplitValue = hasBroker ? brokerPercent : 0;
        const platformCut = totalAmount * platformSplitValue;
        const brokerCut = totalAmount * brokerSplitValue;
        let ownerCut = totalAmount - (platformCut + brokerCut);
        if (ownerCut < 0)
            ownerCut = 0;
        // 2️⃣ Fetch owner of property
        const owner = yield prisma_1.prisma.managedProperty.findFirst({
            where: { propertyId, role: "OWNER" },
        });
        const ownerId = owner === null || owner === void 0 ? void 0 : owner.userId; // undefined if no owner
        return {
            ownerCut: Number(ownerCut.toFixed(2)),
            platformCut: Number(platformCut.toFixed(2)),
            brokerCut: Number(brokerCut.toFixed(2)),
            total: totalAmount,
            hasBroker,
            commissionType: (_d = commission === null || commission === void 0 ? void 0 : commission.type) !== null && _d !== void 0 ? _d : "PLATFORM",
            platformSplitValue,
            brokerSplitValue,
            ownerId,
        };
    });
}
/**
 * Initialize Chapa payment with dynamic commission
 */
function initializeChapaPayment(_a) {
    return __awaiter(this, arguments, void 0, function* ({ data, propertyId, brokerId, }) {
        var _b, _c, _d;
        // 1️⃣ Safe name splitting
        const nameParts = data.customerName.trim().split(" ");
        const firstName = nameParts[0] || "Unknown";
        const lastName = nameParts[1] || "";
        // 2️⃣ Calculate commission
        const commission = yield distributeCommission({
            totalAmount: data.amount,
            propertyId,
            brokerId,
        });
        // 3️⃣ Fetch platform subaccount
        const platformSubAccount = yield prisma_1.prisma.chapaSubAccount.findFirst({
            where: { type: "PLATFORM", status: "ACTIVE" },
        });
        // if (!platformSubAccount)
        //   throw new Error("No active platform Chapa subaccount found");
        // 4️⃣ Fetch broker subaccount if broker exists
        const brokerSubAccount = brokerId
            ? yield prisma_1.prisma.chapaSubAccount.findFirst({
                where: { ownerId: brokerId, status: "ACTIVE" },
            })
            : null;
        // 5️⃣ Fetch owner subaccount if owner exists
        const ownerSubAccount = commission.ownerId &&
            (yield prisma_1.prisma.chapaSubAccount.findFirst({
                where: { ownerId: commission.ownerId, status: "ACTIVE" },
            }));
        // 6️⃣ Build Chapa subaccounts array
        const subaccounts = [];
        if (platformSubAccount) {
            subaccounts.push({
                id: platformSubAccount.chapaSubId,
                split_type: "percentage",
                split_value: commission.platformSplitValue,
            });
        }
        if (brokerSubAccount) {
            subaccounts.push({
                id: brokerSubAccount.chapaSubId,
                split_type: "percentage",
                split_value: commission.brokerSplitValue,
            });
        }
        if (ownerSubAccount) {
            const ownerSplitValue = 1 - (commission.platformSplitValue + commission.brokerSplitValue);
            subaccounts.push({
                id: ownerSubAccount.chapaSubId,
                split_type: "percentage",
                split_value: ownerSplitValue > 0 ? ownerSplitValue : 0,
            });
        }
        // 7️⃣ Build payment options — only include subaccounts if we have real ones
        // Chapa rejects example.com / test emails — use a safe fallback
        const safeEmail = ((_b = data.email) === null || _b === void 0 ? void 0 : _b.endsWith("@example.com")) || !data.email
            ? "noreply@chapa.co"
            : data.email;
        const paymentOptions = Object.assign(Object.assign({ first_name: firstName, last_name: lastName || firstName, email: safeEmail, phone_number: data.phoneNumber || "0900000000", currency: "ETB", amount: String(data.amount), tx_ref: data.txRef }, (data.callbackUrl && { callback_url: data.callbackUrl })), (data.returnUrl && { return_url: data.returnUrl }));
        // Only attach subaccounts if we have real DB-backed ones
        if (subaccounts.length > 0) {
            paymentOptions.subaccounts = subaccounts;
        }
        try {
            const response = yield axios_1.default.post(`https://api.chapa.co/v1/transaction/initialize`, paymentOptions, {
                headers: {
                    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            });
            return {
                chapaResponse: response.data,
                commission,
                subaccounts,
            };
        }
        catch (error) {
            console.error("Chapa error response:", JSON.stringify((_d = (_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.data) !== null && _d !== void 0 ? _d : error === null || error === void 0 ? void 0 : error.message));
            throw error;
        }
    });
}
