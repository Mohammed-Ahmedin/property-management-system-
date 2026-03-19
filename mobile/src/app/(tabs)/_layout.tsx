import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { useTheme } from "@/src/providers/theme.provider";
import { Home, Search, CalendarDays, Heart, User } from "lucide-react-native";
import {
  useFonts,
  Inter_500Medium,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

function InnerTabs() {
  const {
    theme: { colors },
  } = useTheme();

  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    Inter_500Medium,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) return null;
  // ✅ Dynamic padding: max 10px only if inset is too large
  const bottomPadding = insets.bottom > 20 ? 10 : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 12,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          height: 55 + insets.bottom, // add safe area dynamically
          paddingBottom: bottomPadding, // push content above nav bar
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={22} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <Search color={color} size={22} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => (
            <CalendarDays
              color={color}
              size={22}
              strokeWidth={focused ? 2.5 : 1.5}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <Heart color={color} size={22} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <User color={color} size={22} strokeWidth={focused ? 2.5 : 1.5} />
          ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  useEffect(() => {
    if (Platform.OS === "android") {
      // Push content above navigation bar
      NavigationBar.setBehaviorAsync("padding" as any);
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <InnerTabs />
    </SafeAreaProvider>
  );
}
