import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "5min IA — Apprendre l'IA au quotidien",
  description:
    "Une leçon de 5 minutes par jour pour apprendre à utiliser Claude et ChatGPT au travail comme à la maison.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "5min IA",
  },
  icons: {
    icon: [{ url: "/icon-512.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#213a39",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-sand-50 font-sans text-brand-950 antialiased">
        {children}
      </body>
    </html>
  );
}
