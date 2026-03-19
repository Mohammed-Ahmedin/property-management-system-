// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "../providers/theme.provider";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";
import TanstackQueryProvider from "../providers/tanstack.provider";
import { AuthProvider } from "../providers/auth.provider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { UserProvider } from "./(tabs)/profile/user-context";

function Root() {
  const { theme } = useTheme();

  // Load fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <TanstackQueryProvider>
          <UserProvider>
            <AuthProvider>
              <Root />
            </AuthProvider>
          </UserProvider>
        </TanstackQueryProvider>
        <Toast />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
