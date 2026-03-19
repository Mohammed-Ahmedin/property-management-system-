import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { AppText } from "../ui/text";

interface PriceTagProps {
  amount: number | string;
  currency?: string;
  position?: "left" | "right"; // ETB position
  color?: string;
  fontSize?: number;
  fontWeight?: "400" | "500" | "600" | "700";
  style?: ViewStyle;
  prefixSpace?: boolean;
}

export const PriceTag: React.FC<PriceTagProps> = ({
  amount,
  currency = "ETB",
  position = "left",
  color = "#111827",
  fontSize = 18,
  fontWeight = "600",
  style,
  prefixSpace = true,
}) => {
  // Ensure amount is a number before formatting
  const numericAmount =
    typeof amount === "string" ? Number(amount.replace(/,/g, "")) : amount;

  const formattedAmount = !isNaN(Number(numericAmount))
    ? Number(numericAmount).toLocaleString("en-US", {
        minimumFractionDigits: 0,
      })
    : amount;

  return (
    <AppText
      style={[styles.text, { color, fontSize }, style as any]}
      weight={fontWeight === "700" ? "bold" : "medium"}
    >
      {position === "left"
        ? `${currency}${prefixSpace ? " " : ""}${formattedAmount}`
        : `${formattedAmount}${prefixSpace ? " " : ""}${currency}`}
    </AppText>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
  },
});
