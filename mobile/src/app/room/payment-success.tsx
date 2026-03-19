import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AppText } from "@/src/components/ui/text";

export default function PaymentSuccess({ onClose }: { onClose: () => void }) {
  return (
    <View style={styles.container}>
      <AppText style={styles.title} weight="bold">
        Payment Successful 🎉
      </AppText>

      <AppText style={styles.subtitle} weight="medium">
        Your payment was completed successfully.{"\n"}
        You can close this screen now.
      </AppText>

      <TouchableOpacity onPress={onClose} style={styles.button}>
        <AppText style={styles.buttonText}>Close</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    height: "70%",
  },
  title: {
    fontSize: 24,
    color: "#16a34a",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#4B5563", // gray-600
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#16a34a",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    elevation: 2, // small shadow
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    textAlign: "center",
  },
});
