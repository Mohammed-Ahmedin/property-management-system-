// src/components/Button.tsx
import { useTheme } from "@/src/providers/theme.provider";
import React, { ReactNode } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

interface AppButtonProps {
  children: ReactNode;
  onPress?: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  fontFamily?: string; // <- new prop to change font
  fontSize?: number; // optional font size override
}

export const Button: React.FC<AppButtonProps> = ({
  children,
  onPress,
  variant = "default",
  style,
  textStyle,
  disabled = false,
  fontFamily,
  fontSize,
}) => {
  const { theme } = useTheme();

  // Determine colors based on variant
  const getColors = () => {
    switch (variant) {
      case "destructive":
        return {
          background: disabled ? theme.colors.muted : theme.colors.destructive,
          color: disabled ? theme.colors.onMuted : theme.colors.onPrimary,
          border: "transparent",
        };
      case "outline":
        return {
          background: "transparent",
          color: theme.colors.primary,
          border: theme.colors.primary,
        };
      case "secondary":
        return {
          background: disabled ? theme.colors.muted : theme.colors.secondary,
          color: disabled ? theme.colors.onMuted : theme.colors.onSecondary,
          border: "transparent",
        };
      case "ghost":
        return {
          background: "transparent",
          color: theme.colors.text,
          border: "transparent",
        };
      case "link":
        return {
          background: "transparent",
          color: theme.colors.primary,
          border: "transparent",
        };
      case "default":
      default:
        return {
          background: disabled ? theme.colors.muted : theme.colors.primary,
          color: disabled ? theme.colors.onMuted : theme.colors.onPrimary,
          border: "transparent",
        };
    }
  };

  const { background, color, border } = getColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: background,
          borderRadius: theme.colors.radius,
          borderColor: border,
          borderWidth: border !== "transparent" ? 1 : 0,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { color, fontFamily: fontFamily || "Inter_500Medium", fontSize: fontSize || 16 },
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontWeight: "500",
  },
});
