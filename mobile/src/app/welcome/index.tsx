import React from "react";
import { View, StyleSheet, Image } from "react-native";
import TopContainerCover from "@/src/assets/images/start-image-3.jpg";
import { useTheme } from "@/src/providers/theme.provider";
import { useRouter } from "expo-router";
import { AppText } from "@/src/components/ui/text";
import { Button } from "@/src/components/ui/button";

export default function WelcomeScreen() {
  const {
    theme: { colors },
  } = useTheme();
  const router = useRouter();

  const handleGetStart = () => {
    router.replace("/(tabs)" as any);
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <Image
          source={TopContainerCover}
          style={styles.topImage}
          resizeMode="cover"
        />
      </View>

      {/* Bottom Container */}
      <View style={styles.bottomContainer}>
        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <AppText
            weight="bold"
            style={[styles.text, { color: colors.text, textAlign: "center", fontSize: 25 }]}
          >
            Find Your Hotel, Property instantly here
          </AppText>
        </View>
        <Button
          style={{ borderRadius: 9999, width: "100%", paddingTop: 16, paddingBottom: 16 }}
          onPress={handleGetStart}
        >
          Get Started
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  topContainer: {
    height: 500,
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  topImage: { width: "100%", height: "100%" },
  bottomContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  text: { fontSize: 20, fontWeight: "500", marginBottom: 16 },
});
