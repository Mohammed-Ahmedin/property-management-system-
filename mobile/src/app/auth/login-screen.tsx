import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { authClient } from "@/src/lib/auth-client";
import useAuthStore from "@/src/store/auth.store";

/* --- Validation schemas (yup) --- */
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

/* --- Login Screen --- */
export function LoginScreen({ onNavigateToSignup, callBackUrl, setCurrentScreen }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    // simulate network request
    await authClient.signIn
      .email({
        email: data.email,
        password: data.password,
      })
      .then((response) => {
        if (response.error) {
          Toast.show({
            type: "error",
            text1: response.error.message || "Something went wrong",
            text1Style: { fontFamily: "Inter-Regular" },
            text2Style: { fontFamily: "Inter-Regular" },
          });
          return;
        }

        Toast.show({
          type: "success",
          text1: "Login successful!",
          text2: "Welcome back 👋",
          text1Style: { fontFamily: "Inter-Regular" },
          text2Style: { fontFamily: "Inter-Regular" },
        });
        login(response.data.token);
        router.push(callBackUrl ? callBackUrl : "/profile");
      });
  };

  const handleBack = () => {
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={handleBack}
        >
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
            Welcome Back
          </AppText>
          <AppText style={styles.subtitle}>Sign in to continue</AppText>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[
                        styles.input,
                        errors.email ? styles.inputError : null,
                      ]}
                      placeholderTextColor="#8b8b8b"
                    />
                    {errors.email && (
                      <AppText style={styles.errorAppText}>
                        {errors.email.message}
                      </AppText>
                    )}
                  </>
                )}
              />
            </View>

            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <View style={styles.passwordContainer}>
                      <Input
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        style={[
                          styles.input,
                          { paddingRight: 70 }, // make room for eye button
                          errors.password ? styles.inputError : null,
                        ]}
                        placeholderTextColor="#8b8b8b"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((s) => !s)}
                        style={styles.eyeButton}
                        activeOpacity={0.7}
                      >
                        <AppText style={styles.eyeButtonAppText}>
                          {showPassword ? "Hide" : "Show"}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <AppText style={styles.errorAppText}>
                        {errors.password.message}
                      </AppText>
                    )}
                  </>
                )}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              style={[
                styles.submitButton,
                isSubmitting ? styles.submitButtonDisabled : null,
              ]}
              disabled={isSubmitting}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <AppText style={styles.submitButtonAppText}>Login</AppText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <AppText style={styles.footerAppText}>
              Forgot your password?{" "}
            </AppText>

            <TouchableOpacity onPress={() => setCurrentScreen('forgot')} activeOpacity={0.7}>
              <AppText style={styles.linkButton}>Reset now</AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <AppText style={styles.footerAppText}>
              Don t have an account?{" "}
            </AppText>
            <TouchableOpacity onPress={onNavigateToSignup} activeOpacity={0.7}>
              <AppText style={styles.linkButton}>Sign Up</AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* --- Styles (kept similar to your web styles) --- */
const styles = StyleSheet.create({
  flex: { flex: 1 },
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    backgroundColor: "transparent",
    paddingVertical: 8,
  },
  backButtonAppText: {
    fontSize: 16,
    color: "#007aff",
  },
  content: {
    flexGrow: 1,
    paddingVertical: 32,
    paddingHorizontal: 24,
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
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
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  inputGroup: {
    marginBottom: 0,
  },
  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000000",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 12,
    fontFamily: "Inter_400Regular",
  },
  inputError: {
    borderColor: "#ff3b30",
    backgroundColor: "#fff5f5",
  },
  passwordContainer: {
    position: "relative",
    justifyContent: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 10,
    padding: 8,
  },
  eyeButtonAppText: {
    fontSize: 14,
    color: "#007aff",
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
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerAppText: {
    fontSize: 15,
    color: "#666666",
  },
  linkButton: {
    fontSize: 15,
    color: "#007aff",
    marginLeft: 6,
  },
});
