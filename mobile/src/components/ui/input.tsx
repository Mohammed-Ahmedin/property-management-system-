// src/components/Input.tsx
import React from "react";
import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "@/src/providers/theme.provider";

type FontWeight = "regular" | "medium" | "bold";

interface InputProps extends TextInputProps {
  borderRadius?: number;
  padding?: number;
  weight?: FontWeight;
}

export const Input: React.FC<InputProps> = ({
  style,
  borderRadius = 12,
  padding = 14,
  weight = "regular",
  ...props
}) => {
  const { theme } = useTheme();
  const fontFamily =
    weight === "bold"
      ? "Inter-Bold"
      : weight === "medium"
        ? "Inter-Medium"
        : "Inter-Regular";
  return (
    <TextInput
      placeholderTextColor={theme.colors.text + "99"} // subtle placeholder
      style={[
        styles.input,
        {
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          borderRadius,
          padding,
          fontFamily,
        },
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
  },
});
