// components/NoBookingScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { CalendarDays } from "lucide-react-native";
import { AppText } from "@/src/components/ui/text";

export default function NoBookingScreen() {
  return (
    <View style={styles.emptyState}>
      <CalendarDays size={50} color="#D1D5DB" />

      <AppText style={styles.emptyStateTitle} weight="medium">
        No Bookings Found
      </AppText>
      <AppText style={styles.emptyStateText}>
        There is no any booking data
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "50%",
  },
  emptyStateTitle: {
    fontSize: 20,
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: "#0891b2",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#fff",
  },
});
