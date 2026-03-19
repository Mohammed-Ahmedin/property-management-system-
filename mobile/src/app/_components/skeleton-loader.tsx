// src/components/ListingCardSkeleton.tsx
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/src/providers/theme.provider";
import React, { useEffect, useRef } from "react";

export const ListingCardSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Animated.View
        style={[
          styles.image,
          { opacity: pulseAnim, backgroundColor: theme.colors.border },
        ]}
      />
      <View style={styles.info}>
        <Animated.View
          style={[
            styles.skeletonTextLarge,
            { opacity: pulseAnim, backgroundColor: theme.colors.border },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonTextMedium,
            { opacity: pulseAnim, backgroundColor: theme.colors.border },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonTextSmall,
            { opacity: pulseAnim, backgroundColor: theme.colors.border },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonTextSmall,
            { opacity: pulseAnim, backgroundColor: theme.colors.border },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  skeletonTextLarge: {
    width: "70%",
    height: 18,
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonTextMedium: {
    width: "50%",
    height: 14,
    borderRadius: 6,
    marginBottom: 6,
  },
  skeletonTextSmall: {
    width: "30%",
    height: 12,
    borderRadius: 6,
    marginBottom: 4,
  },
});
