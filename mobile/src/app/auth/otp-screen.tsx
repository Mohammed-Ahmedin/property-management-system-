import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { AppText } from "@/src/components/ui/text";
import { OtpInput } from "react-native-otp-entry";
import Toast from "react-native-toast-message";
import { authClient } from "@/src/lib/auth-client";

export function OtpVerificationScreen({
  setCurrentScreen,
  setResetOtp,
  resetEmail,
}: {
  setCurrentScreen: any;
  setResetOtp: any;
  resetEmail: any;
}) {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setResetOtp(otp);
    if (otp.length !== 6) {
      Toast.show({ type: "error", text1: "Enter 6-digit OTP" });
      return;
    }

    setIsVerifying(true);
    const { data: response, error } =
      await authClient.emailOtp.checkVerificationOtp({
        email: resetEmail, // required
        type: "forget-password", // required
        otp: otp, // required
      });

    console.log("check response---------", { response });
    setIsVerifying(false);
    if (response?.success) {
      Toast.show({ type: "success", text1: "OTP Verified!" });
      setCurrentScreen("reset-password"); // 👈 move to next step
    } else {
      Toast.show({ type: "error", text1: "Invalid or expired OTP" });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <AppText style={styles.title}>Verify OTP</AppText>
        <AppText style={styles.subtitle}>
          Enter the 6-digit code sent to your email
        </AppText>

        <OtpInput
          numberOfDigits={6}
          focusColor="#007aff"
          onTextChange={(text) => setOtp(text)}
          theme={{
            pinCodeContainerStyle: styles.otpBox,
            pinCodeTextStyle: styles.otpText,
          }}
        />

        <TouchableOpacity
          onPress={handleVerify}
          style={[styles.button, isVerifying && styles.disabled]}
          disabled={isVerifying}
          activeOpacity={0.85}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText style={styles.buttonText}>Verify</AppText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCurrentScreen("forgot");
          }}
        >
          <AppText style={styles.resend}>Back</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: { width: "90%", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "600", marginBottom: 10 },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 40,
    textAlign: "center",
  },
  otpBox: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f8f8f8",
  },
  otpText: { fontSize: 20, color: "#000" },
  button: {
    backgroundColor: "#007aff",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: { color: "#fff", fontSize: 17 },
  resend: { color: "#007aff", fontSize: 15, marginTop: 20 },
  disabled: { opacity: 0.7 },
});
