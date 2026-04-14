import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "./global.css";

import { Toaster } from "sonner";
import TanstackQueryProvider from "../providers/tanstack-query.provider";
import { ThemeProvider } from "../providers/theme.provider";
import { KeepAlive } from "../components/keep-alive";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kuru Rent Admin",
  description: "Kuru Rent — Guesthouse · Apartment · Villa",
  icons: {
    icon: "https://res.cloudinary.com/dmhsqmdbc/image/upload/v1776093694/bete_uploads/nvducfh9nbyixyatxrp9.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TanstackQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
            <KeepAlive />
          </ThemeProvider>
        </TanstackQueryProvider>
        <Toaster />
      </body>
    </html>
  );
}

