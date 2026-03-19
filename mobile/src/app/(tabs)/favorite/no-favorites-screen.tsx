import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Heart, LogIn, Sparkles } from "lucide-react-native";
import { AppText } from "@/src/components/ui/text";
import { useRouter } from "expo-router";

const PRIMARY_COLOR = "#3B82F6";

export const NoFavoritesScreen: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Heart size={64} color={PRIMARY_COLOR} strokeWidth={1.5} />
      </View>
      <AppText style={styles.title} weight="bold">
        No Favorites Yet{" "}
      </AppText>
      <Text style={styles.description}>
        Start exploring and save your favorite properties here
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/explore")}
        activeOpacity={0.8}
        testID="login-button"
      >
        <Sparkles size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Explore Properties</Text>
      </TouchableOpacity>
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
    backgroundColor: `${PRIMARY_COLOR}15`,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
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
    marginBottom: 32,
    fontFamily: "Inter_400Regular",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
    fontFamily: "Inter_600SemiBold",
  },
});
