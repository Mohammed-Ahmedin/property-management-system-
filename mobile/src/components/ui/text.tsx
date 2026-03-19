// src/components/AppText.tsx
import { useTheme } from "@/src/providers/theme.provider";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { typography } from "@/src/theme";

type FontWeight = "regular" | "medium" | "bold";

interface AppTextProps extends TextProps {
  variant?: keyof typeof typography;
  weight?: FontWeight;
  color?: string;
}

export const AppText: React.FC<AppTextProps> = ({
  style,
  children,
  variant = "bodyMedium",
  weight = "regular",
  color,
  ...props
}) => {
  const { theme } = useTheme();

  // Map weight to Inter font family
  const fontFamily =
    weight === "bold"
      ? "Inter_700Bold"
      : weight === "medium"
      ? "Inter_500Medium"
      : "Inter_400Regular";

  // Get typography variant safely
  const textVariant: TextStyle = typography[variant] as TextStyle;

  return (
    <Text
      {...props}
      style={[
        { fontFamily, color: color || theme.colors.text },
        textVariant,
        style,
      ]}
    >
      {children}
    </Text>
  );
};
