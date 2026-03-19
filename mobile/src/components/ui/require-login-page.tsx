// components/RequireLoginPage.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/src/providers/theme.provider";
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useRouter } from "expo-router";
import { Home, Lock, Text } from "lucide-react-native";
import { AppText } from "./text";
import { Button } from "./button";

type Props = {
  redirectTo?: string; // page to redirect after login
  title?: string;
  description?: string;
  buttonText?: string;
};

export default function RequireLoginPage({
  redirectTo = "/login",
  title = "You Need to Login",
  description = "You must be logged in to access this page. Please login to continue.",
  buttonText = "Go to Login",
}: Props) {
  const { theme } = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.emptyState}>
      <Home size={64} color="#D1D5DB" />
      <AppText style={styles.emptyStateTitle} weight="medium">
        No Bookings Found
      </AppText>
      <AppText style={styles.emptyStateText}>
        Try adjusting your filters to see more results
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
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
    color: "#fff",
  },
});
