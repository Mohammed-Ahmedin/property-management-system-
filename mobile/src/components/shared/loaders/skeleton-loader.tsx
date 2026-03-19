import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";

interface SkeletonLoaderProps {
  width?: any;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonLoaderProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View
      style={[
        styles.container,
        { width: width || "100%", height, borderRadius },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, { opacity, borderRadius }]} />
    </View>
  );
}

interface SkeletonCardProps {
  style?: ViewStyle;
}

export function SkeletonCard({ style }: SkeletonCardProps) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonLoader width="100%" height={200} borderRadius={12} />
      <View style={styles.cardContent}>
        <SkeletonLoader width="70%" height={24} borderRadius={6} />
        <SkeletonLoader
          width="90%"
          height={16}
          borderRadius={4}
          style={{ marginTop: 8 }}
        />
        <SkeletonLoader
          width="60%"
          height={16}
          borderRadius={4}
          style={{ marginTop: 6 }}
        />
        <View style={styles.cardFooter}>
          <SkeletonLoader width={80} height={20} borderRadius={4} />
          <SkeletonLoader width={100} height={32} borderRadius={8} />
        </View>
      </View>
    </View>
  );
}

interface SkeletonListProps {
  count?: number;
  style?: ViewStyle;
}

export function SkeletonList({ count = 3, style }: SkeletonListProps) {
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} style={{ marginBottom: 16 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E2E8F0",
    overflow: "hidden" as const,
  },
  shimmer: {
    flex: 1,
    backgroundColor: "#F1F5F9",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    overflow: "hidden" as const,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    padding: 16,
  },
  cardFooter: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 16,
  },
});
