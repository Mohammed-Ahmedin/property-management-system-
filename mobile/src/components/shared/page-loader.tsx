import { useState, useEffect } from "react";
import { useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export function PageLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const segments = useSegments();

  useEffect(() => {
    // trigger loader on segment change
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 300); // fake delay
    return () => clearTimeout(timeout);
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return <>{children}</>;
}
