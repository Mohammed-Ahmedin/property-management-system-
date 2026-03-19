import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { LoginScreen } from "./login-screen";
import { SignupScreen } from "./signup-screen";
import { useSearchParams } from "expo-router/build/hooks";
import { authClient } from "@/src/lib/auth-client";
import { Redirect } from "expo-router";
import { FullPageLoader } from "@/src/components/shared/loaders";
import { ForgotPasswordScreen } from "./forgot-password";
import { OtpVerificationScreen } from "./otp-screen";
import { ResetPasswordScreen } from "./reset-password";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "forgot" | "login" | "signup" | "reset-password" | "otp"
  >("login");
  const [resetOtp, setResetOtp] = useState("");
  const [resetEmail, setResetEmail] = useState("");

  console.log({ resetEmail });
  console.log({ resetOtp });
  const searchParams = useSearchParams();
  const callBackUrl = searchParams.get("callBackUrl");

  const { data: userSession, isPending } = authClient.useSession();

  if (isPending) {
    return <FullPageLoader />;
  }

  if (userSession?.user) {
    return <Redirect href={"/profile"} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0} // adjust if needed
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1 }}>
          {currentScreen === "login" && (
            <LoginScreen
              setCurrentScreen={setCurrentScreen}
              onNavigateToSignup={() => setCurrentScreen("signup")}
              callBackUrl={callBackUrl}
            />
          )}
          {currentScreen === "signup" && (
            <SignupScreen
              onNavigateToLogin={() => setCurrentScreen("login")}
              callBackUrl={callBackUrl}
            />
          )}
          {currentScreen === "forgot" && (
            <ForgotPasswordScreen
              setCurrentScreen={setCurrentScreen}
              setResetEmail={setResetEmail}
            />
          )}

          {currentScreen === "otp" && (
            <OtpVerificationScreen
              setCurrentScreen={setCurrentScreen}
              setResetOtp={setResetOtp}
              resetEmail={resetEmail}
            />
          )}
          {currentScreen === "reset-password" && (
            <ResetPasswordScreen
              setCurrentScreen={setCurrentScreen}
              resetOtp={resetOtp}
              resetEmail={resetEmail}
              setResetEmail={setResetEmail}
              setResetOtp={setResetOtp}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
