"use client";

import { cn } from "@/lib/utils"; // from shadcn/ui project setup
import { FC } from "react";

interface FormatedAmountProps {
  amount: number;
  currency?: string; // Default: 'ETB'
  locale?: string; // Default: 'en-ET'
  className?: string; // Optional Tailwind classes
  showSymbol?: boolean; // Whether to show the currency symbol
  prefix?: string; // Optional text before amount
  suffix?: string; // Optional text after amount
}

const FormatedAmount: FC<FormatedAmountProps> = ({
  amount,
  currency = "ETB",
  locale = "en-ET",
  className,
  showSymbol = true,
  prefix = "",
  suffix = "",
}) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    currencyDisplay: showSymbol ? "symbol" : "code",
    minimumFractionDigits: 2,
  }).format(amount);

  return (
    <span className={cn("text-base font-medium text-foreground", className)}>
      {prefix}
      {formatted}
      <span className="text-muted-foreground">{suffix}</span>
    </span>
  );
};

export default FormatedAmount;
