import axios from "axios";
import { chapaConfig } from "../config/chapa";
import { prisma } from "../lib/prisma";
export type CommissionSplit = {
  splitType: "percentage" | "flat";
  splitValue: number; // e.g. 0.03 for 3%
  recipient: "OWNER" | "BROKER" | "PLATFORM";
};
import { SplitType } from "chapa-nodejs";
/**
 * Calculates the Chapa split configuration based on user role.
 * Ensures owner always gets the main payout (after other commissions are deducted).
 */
export async function getCommissionSplit(
  userRole: string
): Promise<CommissionSplit> {
  // Default (no split)
  let result: CommissionSplit = {
    splitType: "percentage",
    splitValue: 0,
    recipient: "OWNER",
  };

  // Get global commission config
  const commission = await prisma.commissionSetting.findFirst({
    where: { type: "PLATFORM", isActive: true },
  });

  if (!commission) {
    console.warn(
      "⚠️ No active global CommissionSetting found. Defaulting to 0 commissions."
    );
    return result;
  }

  const platformPercent = commission.platformPercent ?? 0;
  const brokerPercent = commission.brokerPercent ?? 0;

  // --- Logic per role ---
  switch (userRole) {
    case "ADMIN": // Platform account
      result = {
        splitType: "percentage",
        splitValue:
          platformPercent > 1 ? platformPercent / 100 : platformPercent, // e.g. 3 → 0.03
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
      const totalCut =
        (platformPercent > 1 ? platformPercent / 100 : platformPercent) +
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
}

interface DistributeCommissionInput {
  totalAmount: number;
  propertyId: string;
  brokerId?: string; // optional: when broker is involved
}

export interface InitializePaymentInput {
  customerName: string;
  email: string;
  phoneNumber: string;
  amount: number;
  txRef: string;
  callbackUrl?: string;
  returnUrl?: string;
}

interface DistributeCommissionInput {
  totalAmount: number;
  propertyId: string;
  brokerId?: string;
}

export async function distributeCommission({
  totalAmount,
  propertyId,
  brokerId,
}: DistributeCommissionInput) {
  // 1️⃣ Fetch commission: property > platform
  const commission = await prisma.commissionSetting.findFirst({
    where: {
      OR: [
        { type: "PROPERTY", propertyId, isActive: true },
        { type: "PLATFORM", isActive: true },
      ],
    },
    orderBy: { type: "desc" }, // property first
  });

  const platformPercent = commission?.platformPercent ?? 0;
  const brokerPercent = commission?.brokerPercent ?? 0;
  const hasBroker = !!brokerId;

  const platformSplitValue = platformPercent;
  const brokerSplitValue = hasBroker ? brokerPercent : 0;

  const platformCut = totalAmount * platformSplitValue;
  const brokerCut = totalAmount * brokerSplitValue;
  let ownerCut = totalAmount - (platformCut + brokerCut);
  if (ownerCut < 0) ownerCut = 0;

  // 2️⃣ Fetch owner of property
  const owner = await prisma.managedProperty.findFirst({
    where: { propertyId, role: "OWNER" },
  });
  const ownerId = owner?.userId; // undefined if no owner

  return {
    ownerCut: Number(ownerCut.toFixed(2)),
    platformCut: Number(platformCut.toFixed(2)),
    brokerCut: Number(brokerCut.toFixed(2)),
    total: totalAmount,
    hasBroker,
    commissionType: commission?.type ?? "PLATFORM",
    platformSplitValue,
    brokerSplitValue,
    ownerId,
  };
}

/**
 * Initialize Chapa payment with dynamic commission
 */
export async function initializeChapaPayment({
  data,
  propertyId,
  brokerId,
}: {
  data: InitializePaymentInput;
  propertyId: string;
  brokerId?: string;
}) {
  // 1️⃣ Safe name splitting
  const nameParts = data.customerName.trim().split(" ");
  const firstName = nameParts[0] || "Unknown";
  const lastName = nameParts[1] || "";

  // 2️⃣ Calculate commission
  const commission = await distributeCommission({
    totalAmount: data.amount,
    propertyId,
    brokerId,
  });

  // 3️⃣ Fetch platform subaccount
  const platformSubAccount = await prisma.chapaSubAccount.findFirst({
    where: { type: "PLATFORM", status: "ACTIVE" },
  });
  // if (!platformSubAccount)
  //   throw new Error("No active platform Chapa subaccount found");

  // 4️⃣ Fetch broker subaccount if broker exists
  const brokerSubAccount = brokerId
    ? await prisma.chapaSubAccount.findFirst({
        where: { ownerId: brokerId, status: "ACTIVE" },
      })
    : null;

  // 5️⃣ Fetch owner subaccount if owner exists
  const ownerSubAccount =
    commission.ownerId &&
    (await prisma.chapaSubAccount.findFirst({
      where: { ownerId: commission.ownerId, status: "ACTIVE" },
    }));

  // 6️⃣ Build Chapa subaccounts array
  const subaccounts: {
    id: string;
    split_type: "percentage" | "flat";
    split_value: number;
  }[] = [];

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
    const ownerSplitValue =
      1 - (commission.platformSplitValue + commission.brokerSplitValue);
    subaccounts.push({
      id: ownerSubAccount.chapaSubId,
      split_type: "percentage",
      split_value: ownerSplitValue > 0 ? ownerSplitValue : 0,
    });
  }

  // 7️⃣ Build payment options — only include subaccounts if we have real ones
  // Chapa rejects example.com / test emails — use a safe fallback
  const safeEmail = data.email?.endsWith("@example.com") || !data.email
    ? "noreply@chapa.co"
    : data.email;

  const paymentOptions: Record<string, any> = {
    first_name: firstName,
    last_name: lastName || firstName,
    email: safeEmail,
    phone_number: data.phoneNumber || "0900000000",
    currency: "ETB",
    amount: String(data.amount),
    tx_ref: data.txRef,
    ...(data.callbackUrl && { callback_url: data.callbackUrl }),
    ...(data.returnUrl && { return_url: data.returnUrl }),
  };

  // Only attach subaccounts if we have real DB-backed ones
  if (subaccounts.length > 0) {
    paymentOptions.subaccounts = subaccounts;
  }

  try {
    const response = await axios.post(
      `https://api.chapa.co/v1/transaction/initialize`,
      paymentOptions,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      chapaResponse: response.data,
      commission,
      subaccounts,
    };
  } catch (error: any) {
    console.error("Chapa error response:", JSON.stringify(error?.response?.data ?? error?.message));
    throw error;
  }
}
