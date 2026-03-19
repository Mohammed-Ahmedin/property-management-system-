import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AppText } from "@/src/components/ui/text";
import { Input } from "@/src/components/ui/input";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { authClient } from "@/src/lib/auth-client";

/* --- Validation schema --- */
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

export function ForgotPasswordScreen({
  setCurrentScreen,
  setResetEmail,
}: {
  setCurrentScreen: any;
  setResetEmail: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await authClient.emailOtp.sendVerificationOtp({
        email: data.email,
        type: "forget-password",
      });

      if (response.data?.success) {
        Toast.show({
          type: "success",
          text1: "OTP Sent!",
          text2: `Check your inbox at ${data.email}`,
        });
        setResetEmail(data.email);
        setCurrentScreen("otp"); // 👈 Move to OTP screen
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to send OTP",
          text2: "Please try again later.",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to send OTP",
        text2: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <AppText style={styles.backButtonAppText}>← Back</AppText>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <AppText style={styles.title} weight="medium">
            Forgot Password
          </AppText>
          <AppText style={styles.subtitle}>
            Enter your email to receive an OTP for password reset.
          </AppText>

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Input
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={[
                      styles.input,
                      errors.email ? styles.inputError : null,
                    ]}
                  />
                  {errors.email && (
                    <AppText style={styles.errorAppText}>
                      {errors.email.message}
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
                <AppText style={styles.submitButtonAppText}>Send OTP</AppText>
              )}
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
  screen: { flex: 1, backgroundColor: "#fff" },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButtonAppText: { fontSize: 16, color: "#007aff" },
  content: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: { fontSize: 28, marginBottom: 8, textAlign: "center" },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 32,
    textAlign: "center",
  },
  form: { width: "100%", gap: 20 },
  input: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    borderColor: "#e8e8e8",
    borderWidth: 1,
  },
  inputError: { borderColor: "#ff3b30", backgroundColor: "#fff5f5" },
  errorAppText: { fontSize: 13, color: "#ff3b30", marginTop: 6 },
  submitButton: {
    backgroundColor: "#007aff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonDisabled: { opacity: 0.7 },
  submitButtonAppText: { color: "#fff", fontSize: 17 },
});
