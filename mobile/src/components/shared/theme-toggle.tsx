// src/components/ui/ThemeToggle.tsx
import { useTheme } from "@/src/providers/theme.provider";
import React from "react";
import { Button } from "../ui/button";

export const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  return (
    <Button
      onPress={toggleTheme}
      variant="outline"
      style={{ borderRadius: 9999 }}
    >
      Toggle Theme
    </Button>
  );
};
