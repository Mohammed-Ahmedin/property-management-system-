import { lightColors, darkColors } from "./colors";

// --- Typography tokens ---
export const typography = {
  displayLarge: { fontSize: 57, fontWeight: "400" },
  displayMedium: { fontSize: 45, fontWeight: "400" },
  displaySmall: { fontSize: 36, fontWeight: "400" },

  headlineLarge: { fontSize: 32, fontWeight: "400" },
  headlineMedium: { fontSize: 28, fontWeight: "400" },
  headlineSmall: { fontSize: 24, fontWeight: "400" },

  titleLarge: { fontSize: 22, fontWeight: "500" },
  titleMedium: { fontSize: 16, fontWeight: "500" },
  titleSmall: { fontSize: 14, fontWeight: "500" },

  bodyLarge: { fontSize: 16, fontWeight: "400" },
  bodyMedium: { fontSize: 14, fontWeight: "400" },
  bodySmall: { fontSize: 12, fontWeight: "400" },

  labelLarge: { fontSize: 14, fontWeight: "500" },
  labelMedium: { fontSize: 12, fontWeight: "500" },
  labelSmall: { fontSize: 11, fontWeight: "500" },
};

// --- Shadows ---
export const shadows = {
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heavy: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
};

// --- Theme type ---
export interface Theme {
  colors: typeof lightColors;
  typography: typeof typography;
  shadows: typeof shadows;
}

// --- Light & Dark themes ---
export const lightTheme: Theme = {
  colors: lightColors,
  typography,
  shadows,
};

export const darkTheme: Theme = {
  colors: darkColors,
  typography,
  shadows,
};
