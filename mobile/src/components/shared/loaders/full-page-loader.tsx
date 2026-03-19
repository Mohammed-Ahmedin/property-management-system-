import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Text } from "react-native";
import { Home } from "lucide-react-native";
import { AppText } from "../../ui/text";

interface FullPageLoaderProps {
  message?: string;
}

export function FullPageLoader({ message }: FullPageLoaderProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, [pulseAnim, rotateAnim, fadeAnim]);

  const scale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.1],
  });

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.loaderContainer}>
        <Animated.View
          style={[
            styles.outerCircle,
            {
              transform: [{ scale }, { rotate }],
              opacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.middleCircle,
            {
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.15],
                  }),
                },
              ],
              opacity: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.2, 0.05],
              }),
            },
          ]}
        />
        <View style={styles.iconContainer}>
          <Home size={40} color={""} strokeWidth={2.5} />
        </View>
      </View>
      {message && (
        <Animated.View style={{ opacity: fadeAnim }}>
          <AppText style={styles.message}>{message}</AppText>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#FFFFFF",
  },
  loaderContainer: {
    width: 120,
    height: 120,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  outerCircle: {
    position: "absolute" as const,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#3B82F6",
  },
  middleCircle: {
    position: "absolute" as const,
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#3B82F6",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: "center" as const,
    alignItems: "center" as const,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  message: {
    marginTop: 24,
    fontSize: 16,
    color: "#64748B",
    fontWeight: "500" as const,
  },
});


