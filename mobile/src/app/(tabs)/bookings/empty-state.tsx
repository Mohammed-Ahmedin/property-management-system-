import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CalendarX } from "lucide-react-native";

export const EmptyState: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <CalendarX size={64} color="#D1D5DB" strokeWidth={1.5} />
      </View>
      <Text style={styles.title}>No bookings yet</Text>
      <Text style={styles.description}>
        Your booking history will appear here once you make your first
        reservation.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 12,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontFamily: "Inter_400Regular",
  },
});
