// src/theme/typography.ts
export const typography = {
  h1: { fontSize: 32, fontWeight: "700", lineHeight: 40 },
  h2: { fontSize: 24, fontWeight: "700", lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: "600", lineHeight: 28 },

  body: { fontSize: 16, fontWeight: "400", lineHeight: 24 },
  small: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400", lineHeight: 16 },
} as const;
