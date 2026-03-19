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
import { useRouter } from "expo-router";
import { AppText } from "@/src/components/ui/text";
import { Input } from "@/src/components/ui/input";
import Toast from "react-native-toast-message";
import { authClient } from "@/src/lib/auth-client";
import useAuthStore from "@/src/store/auth.store";
import { useAuth } from "@/src/providers/auth.provider";

const signupSchema = yup.object().shape({
  name: yup.string().min(2, "Min 2 characters").required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid phone number"
    ),
});

/* --- Signup Screen --- */
export function SignupScreen({ onNavigateToLogin, callBackUrl }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const router = useRouter();

  const onSubmit = async (data: any) => {
    const response = await (authClient as any).signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      role: "GUEST",
      phone: data.phone,
    });

    if (response.data?.token) {
      Toast.show({
        type: "success",
        text1: "Account created successully!",
        text1Style: { fontFamily: "Inter-Regular" },
        text2Style: { fontFamily: "Inter-Regular" },
      });

      login(response?.data?.token);
      router.push(callBackUrl ? callBackUrl : "/profile");
      return;
    }

    Toast.show({
      type: "error",
      text1: "Something went wrong",
      text1Style: { fontFamily: "Inter-Regular" },
      text2Style: { fontFamily: "Inter-Regular" },
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
          <AppText style={styles.backButtonText}>← Back</AppText>
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
            Create Account
          </AppText>
          <AppText style={styles.subtitle}>Sign up to get started</AppText>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Full Name"
                      autoCapitalize="words"
                      style={[
                        styles.input,
                        errors.name ? styles.inputError : null,
                      ]}
                      placeholderTextColor="#8b8b8b"
                    />
                    {errors.name && (
                      <AppText style={styles.errorText}>
                        {errors.name.message}
                      </AppText>
                    )}
                  </>
                )}
              />
            </View>

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
                      <AppText style={styles.errorText}>
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
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <>
                    <Input
                      value={value}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      placeholder="Phone number"
                      keyboardType="phone-pad"
                      autoCapitalize="none"
                      style={[
                        styles.input,
                        errors.phone ? styles.inputError : null,
                      ]}
                      placeholderTextColor="#8b8b8b"
                    />
                    {errors.phone && (
                      <AppText style={styles.errorText}>
                        {errors.phone.message}
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
                          { paddingRight: 70 },
                          errors.password ? styles.inputError : null,
                        ]}
                        placeholderTextColor="#8b8b8b"
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((s) => !s)}
                        style={styles.eyeButton}
                        activeOpacity={0.7}
                      >
                        <AppText style={styles.eyeButtonText}>
                          {showPassword ? "Hide" : "Show"}
                        </AppText>
                      </TouchableOpacity>
                    </View>
                    {errors.password && (
                      <AppText style={styles.errorText}>
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
                <AppText style={styles.submitButtonText}>Sign Up</AppText>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <AppText style={styles.footerText}>
              Already have an account?{" "}
            </AppText>
            <TouchableOpacity onPress={onNavigateToLogin} activeOpacity={0.7}>
              <AppText style={styles.linkButton}>Login</AppText>
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
  backButtonText: {
    fontSize: 16,
    color: "#007aff",
    fontWeight: "500",
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
    color: "#000000",
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
  eyeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007aff",
  },
  errorText: {
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
  submitButtonText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "600",
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    color: "#666666",
  },
  linkButton: {
    fontSize: 15,
    color: "#007aff",
    fontWeight: "600",
    marginLeft: 6,
  },
});
