import { chapaConfig } from "../config/chapa";
import { tryCatch } from "../utils/async-handler";
import { prisma } from "../lib/prisma";
import z from "zod";
import {
  getCommissionSplit,
  initializeChapaPayment,
} from "../services/payments.service";

const subAccountSchema = z.object({
  bankCode: z.number().positive(),
  accountNumber: z
    .string()
    .min(8)
    .max(20)
    .regex(/^\d+$/, "Account number must be digits only"),
  accountName: z.string().min(3).max(100),
  businessName: z.string().min(2).max(100),
  propertyId: z.string().optional(),
});

import crypto from "crypto";
import { ITransactionWebhookResponse } from "../types/chapa.type";
import { SplitType } from "chapa-nodejs";

const CHAPA_WEBHOOK_SECRET = process.env.CHAPA_WEBHOOK_SECRET!;

export default {
  createSubAccount: tryCatch(async (req, res) => {
    const userId = req.user?.id;
    const userRole = req.user?.role;

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
    const existingSubAccount = await prisma.chapaSubAccount.findFirst({
      where: { ownerId: userId },
    });

    // ✅ Enforce role-based rules
    if (userRole === "ADMIN") {
      const platformAccount = await prisma.chapaSubAccount.findFirst({
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

    const { recipient, splitValue } = await getCommissionSplit(userRole);

    // ✅ Create subaccount via Chapa API
    let chapaResponse;
    try {
      chapaResponse = await chapaConfig.createSubaccount({
        account_name: accountName,
        account_number: accountNumber,
        bank_code: bankCode,
        business_name: businessName,
        split_type: SplitType.PERCENTAGE,
        split_value: 0.03,
      });
    } catch (err) {
      console.log("-----------------------------", err);
      res.status(502).json({
        message: "Failed to create subaccount with Chapa",
        success: false,
      });
    }

    if (!chapaResponse?.data?.subaccount_id) {
      return res.status(500).json({ message: "Invalid response from Chapa" });
    }

    // ✅ Save to database
    const createdSubAccount = await prisma.chapaSubAccount.create({
      data: {
        owner: { connect: { id: userId } },
        ...(propertyId ? { property: { connect: { id: propertyId } } } : {}),
        accountName,
        accountNumber,
        chapaSubId: chapaResponse.data.subaccount_id,
        bankCode: bankCode.toString(),
        splitType: "percentage",
        splitValue: 0,
        type: userRole === "ADMIN" ? "PLATFORM" : (userRole as any),
        businessName,
      },
    } as any);

    return res.status(201).json({
      message: "Subaccount created successfully",
      subAccount: createdSubAccount,
    });
  }),
  getBanks: tryCatch(async (req, res) => {
    try {
      const response = await chapaConfig.getBanks();
      res.json({ response: response });
    } catch (error) {
      res.status(400).json({ message: "Some error occured" });
    }
  }),
  init: tryCatch(async (req, res) => {
    const txRef = await chapaConfig.genTxRef();

    const { chapaResponse, commission, subaccounts } =
      await initializeChapaPayment({
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
  }),
  getSubaccountDetail: tryCatch(async (req, res) => {
    const userRole = req.user.role;
    const userId = req.user.id;

    let subAccountDoc;

    if (userRole === "ADMIN") {
      subAccountDoc = await prisma.chapaSubAccount.findFirst({
        where: { type: "PLATFORM" },
      });
    } else {
      subAccountDoc = await prisma.chapaSubAccount.findFirst({
        where: {
          ownerId: userId,
        },
      });
    }

    res.json(subAccountDoc);
  }),
  getSubaccounts: tryCatch(async (req, res) => {
    const subAccounts = await prisma.chapaSubAccount.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(subAccounts);
  }),
  chapaWebhook: tryCatch(async (req, res) => {
    try {
      const body: ITransactionWebhookResponse = req.body;

      const hashedSignature = crypto
        .createHmac("sha256", CHAPA_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");

      const incomingSignature =
        req.headers["x-chapa-signature"] || req.headers["chapa-signature"];

      // Validate the webhook signature
      if (hashedSignature != incomingSignature) {
        return res.status(400).json({
          message: "Invalid signature",
        });
      }

      const {
        tx_ref,
        status,
        reference: transaction_id,
        payment_method,
        amount,
        mobile,
      } = body;

      // Validate the status and tx_ref (transaction reference)
      if (!tx_ref || !status) {
        return res.status(400).json({
          message: "Invalid data received",
        });
      }

      // Find the payment by transaction reference
      const payment = await prisma.payment.findFirst({
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
      await prisma.$transaction(async (tx) => {
        const paymentDoc = await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: dbStatus as any,
            transactionId: transaction_id,
            amount: Number(amount),
            phoneNumber: mobile,
          },
        });

        if (dbStatus === "SUCCESS") {
          await tx.booking.update({
            where: { id: paymentDoc.bookingId },
            data: { status: "APPROVED" },
          });
        }
      });

      // Log activity when payment succeeds — booking is now APPROVED (Reserved)
      if (dbStatus === "SUCCESS") {
        // Get booking details for the activity description
        const bookingDoc = await prisma.booking.findUnique({
          where: { id: payment.bookingId },
          select: { propertyId: true, roomId: true, userId: true, totalAmount: true },
        }).catch(() => null);

        await prisma.activity.create({
          data: {
            action: "APPROVED_BOOKING",
            description: `Booking RESERVED after successful payment. Transaction: ${transaction_id || tx_ref}. Amount: ETB ${amount}. Booking is now reserved — no further approval needed.`,
            bookingId: payment.bookingId,
            propertyId: bookingDoc?.propertyId,
            roomId: bookingDoc?.roomId,
            userId: bookingDoc?.userId,
            status: "INFO",
          },
        }).catch(() => {});
      }

      // Return success response
      return res.json({
        message: "Payment status updated successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Some error occured please try again",
      });
    }
  }),

  // Verify payment by txRef — called by frontend on return from Chapa
  verifyPayment: tryCatch(async (req, res) => {
    const { txRef } = req.params;
    if (!txRef) return res.status(400).json({ message: "txRef required" });

    const payment = await prisma.payment.findFirst({
      where: { transactionRef: txRef },
      include: { booking: true },
    });

    if (!payment) return res.status(404).json({ message: "Payment not found" });

    // If already SUCCESS, just return current state
    if (payment.status === "SUCCESS") {
      return res.json({ success: true, status: "SUCCESS", bookingStatus: payment.booking?.status });
    }

    // Verify with Chapa API
    try {
      const verifyRes = await chapaConfig.verify({ tx_ref: txRef });
      const chapaStatus = (verifyRes as any)?.data?.status || (verifyRes as any)?.status;

      if (chapaStatus === "success") {
        await prisma.$transaction(async (tx) => {
          await tx.payment.update({
            where: { id: payment.id },
            data: {
              status: "SUCCESS",
              amount: Number((verifyRes as any)?.data?.amount || payment.amount),
            },
          });
          await tx.booking.update({
            where: { id: payment.bookingId },
            data: { status: "APPROVED" },
          });
        });

        // Log APPROVED_BOOKING activity so admin sees "Reserved"
        await prisma.activity.create({
          data: {
            action: "APPROVED_BOOKING",
            description: `Booking RESERVED after payment verification. Transaction: ${txRef}. Booking is now reserved — no further approval needed.`,
            bookingId: payment.bookingId,
            propertyId: payment.booking?.propertyId,
            status: "INFO",
          },
        }).catch(() => {});

        return res.json({ success: true, status: "SUCCESS", bookingStatus: "APPROVED" });
      } else if (chapaStatus === "failed") {
        await prisma.payment.update({ where: { id: payment.id }, data: { status: "FAILED" } });
        return res.json({ success: false, status: "FAILED", bookingStatus: payment.booking?.status });
      }
    } catch (err) {
      // Chapa verify failed — fall back to current DB state
    }

    return res.json({ success: false, status: payment.status, bookingStatus: payment.booking?.status });
  }),

  // payments;
  getPayments: tryCatch(async (req, res) => {
    const user = req.user as { id: string; role: string };
    const { id: userId, role } = user;

    let payments = [];

    if (role === "ADMIN") {
      // Admin sees all payments
      payments = await prisma.payment.findMany({
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
    } else {
      // Non-admins: filter via managed properties
      let roleFilter: string[] = [];

      if (role === "STAFF") roleFilter = ["STAFF"];
      else if (role === "BROKER") roleFilter = ["BROKER"];
      else if (role === "OWNER") roleFilter = ["OWNER"];

      // Find properties managed by this user
      const managedProperties = await prisma.property.findMany({
        where: {
          managers: {
            some: { userId, role: { in: roleFilter as any } },
          },
        },
        select: { id: true },
        orderBy: { createdAt: "desc" },
      });

      const managedPropertyIds = managedProperties.map((gh) => gh.id);

      if (managedPropertyIds.length > 0) {
        payments = await prisma.payment.findMany({
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
  }),
  getPaymentStats: tryCatch(async (req, res) => {
    const user = req.user as { id: string; role: string };
    const { id: userId, role } = user;

    let payments = [];

    if (role === "ADMIN") {
      payments = await prisma.payment.findMany({
        include: {
          booking: {
            select: {
              id: true,
              property: { select: { id: true, name: true } },
            },
          },
        },
      });
    } else {
      let roleFilter: string[] = [];

      if (role === "STAFF") roleFilter = ["STAFF"];
      else if (role === "BROKER") roleFilter = ["BROKER"];
      else if (role === "OWNER") roleFilter = ["OWNER"];

      const managedProperties = await prisma.property.findMany({
        where: {
          managers: {
            some: { userId, role: { in: roleFilter as any } },
          },
        },
        select: { id: true },
      });

      const managedPropertyIds = managedProperties.map((gh) => gh.id);

      if (managedPropertyIds.length > 0) {
        payments = await prisma.payment.findMany({
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
    }, {} as Record<string, number>);

    // Group by property
    const propertyStats = Object.values(
      payments.reduce((acc, p) => {
        const gh = p.booking?.property?.name || "Unknown";
        if (!acc[gh]) acc[gh] = { property: gh, totalAmount: 0, count: 0 };
        acc[gh].totalAmount += p.amount || 0;
        acc[gh].count++;
        return acc;
      }, {} as Record<string, { property: string; totalAmount: number; count: number }>)
    );

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
  }),
};
