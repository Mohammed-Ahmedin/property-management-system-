import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { BookingStatus, PaymentStatus } from "./type";

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus;
  type: "booking" | "payment";
}

const PRIMARY_COLOR = "#3B82F6";

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const getStatusColor = () => {
    if (type === "booking") {
      switch (status as BookingStatus) {
        case BookingStatus.CONFIRMED:
          return "#10B981";
        case BookingStatus.PENDING:
          return "#F59E0B";
        case BookingStatus.CANCELLED:
          return "#EF4444";
        case BookingStatus.COMPLETED:
          return "#6B7280";
        default:
          return PRIMARY_COLOR;
      }
    } else {
      switch (status as PaymentStatus) {
        case PaymentStatus.PAID:
          return "#10B981";
        case PaymentStatus.PENDING:
          return "#F59E0B";
        case PaymentStatus.FAILED:
          return "#EF4444";
        case PaymentStatus.REFUNDED:
          return "#6B7280";
        default:
          return PRIMARY_COLOR;
      }
    }
  };

  const getStatusText = () => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const color = getStatusColor();

  return (
    <View style={[styles.badge, { backgroundColor: `${color}15` }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{getStatusText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "600" as const,
    fontFamily: "Inter_600SemiBold",
  },
});
