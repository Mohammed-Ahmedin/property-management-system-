import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, ViewStyle } from "react-native";

interface InlineLoaderProps {
  size?: "small" | "medium" | "large";
  color?: string;
  style?: ViewStyle;
}

export function InlineLoader({ size = "medium", style }: InlineLoaderProps) {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    spinAnimation.start();

    return () => {
      spinAnimation.stop();
    };
  }, [spinAnim]);

  const rotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const loaderSize = sizeMap[size];
  const borderWidth = size === "small" ? 2 : size === "medium" ? 3 : 4;

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: loaderSize,
            height: loaderSize,
            borderRadius: loaderSize / 2,
            borderWidth,
            borderColor: `#3B82F6`,
            borderTopColor: "#3B82F6",
            transform: [{ rotate }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  spinner: {},
});
