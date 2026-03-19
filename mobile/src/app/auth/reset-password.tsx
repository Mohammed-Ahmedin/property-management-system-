import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppText } from "@/src/components/ui/text";
import { Input } from "@/src/components/ui/input";
import Toast from "react-native-toast-message";
import { authClient } from "@/src/lib/auth-client";

/* --- Validation schema --- */
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

export function ResetPasswordScreen({
  setCurrentScreen,
  resetOtp,
  resetEmail,
  setResetEmail,
  setResetOtp,
}: {
  setCurrentScreen: any;
  resetOtp: any;
  resetEmail: any;
  setResetEmail: any;
  setResetOtp: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    const { error: checkError } =
      await authClient.emailOtp.checkVerificationOtp({
        email: resetEmail, // required
        type: "forget-password", // required
        otp: resetOtp, // required
      });

    if (checkError) {
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: "Please try again later.",
      });
      return;
    }

    const resetResponse = await authClient.emailOtp.resetPassword({
      email: resetEmail, // required
      otp: resetOtp,
      password: data.password,
    });

    setIsLoading(false);

    if (resetResponse.error) {
      Toast.show({
        type: "error",
        text1: "Reset Failed",
        text2: "Please try again later.",
      });
    } else {
      Toast.show({
        type: "success",
        text1: "Password Reset Successful!",
        text2: "You can now log in with your new password.",
      });
      setResetEmail("");
      setResetEmail("");
      setCurrentScreen("login"); // 👈 go back to login
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AppText style={styles.title}>Reset Password</AppText>
          <AppText style={styles.subtitle}>
            Enter your new password below to complete the reset process.
          </AppText>

          <View style={styles.form}>
            {/* New Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="New password"
                    secureTextEntry
                    style={[styles.input, errors.password && styles.inputError]}
                  />
                  {errors.password && (
                    <AppText style={styles.errorAppText}>
                      {errors.password.message}
                    </AppText>
                  )}
                </>
              )}
            />

            {/* Confirm Password */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Confirm password"
                    secureTextEntry
                    style={[
                      styles.input,
                      errors.confirmPassword && styles.inputError,
                    ]}
                  />
                  {errors.confirmPassword && (
                    <AppText style={styles.errorAppText}>
                      {errors.confirmPassword.message}
                    </AppText>
                  )}
                </>
              )}
            />

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.submitButton,
                isLoading && styles.submitButtonDisabled,
              ]}
              disabled={isLoading}
              activeOpacity={0.85}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText style={styles.submitButtonAppText}>
                  Reset Password
                </AppText>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentScreen("login")}
              style={{ marginTop: 24 }}
              activeOpacity={0.7}
            >
              <AppText style={styles.linkButton}>Back to Login</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* --- Styles --- */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  content: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 32,
    textAlign: "center",
  },
  form: {
    width: "100%",
    gap: 20,
  },
  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
  },
  inputError: {
    borderColor: "#ff3b30",
    backgroundColor: "#fff5f5",
  },
  errorAppText: {
    fontSize: 13,
    color: "#ff3b30",
    marginTop: 6,
    paddingLeft: 4,
  },
  submitButton: {
    backgroundColor: "#007aff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonAppText: {
    color: "#ffffff",
    fontSize: 17,
  },
  linkButton: {
    fontSize: 15,
    color: "#007aff",
    textAlign: "center",
  },
});
