import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "SattaDarshan — India Parliamentary & Political Intelligence Portal", template: "%s | SattaDarshan" },
  description: "Comprehensive, open civic intelligence tracking the Indian Parliament (18th Lok Sabha & Rajya Sabha), political parties, Chief Ministers, and state jurisdictions with interactive 3D visualizations.",
  keywords: ["India Politics", "Lok Sabha", "Rajya Sabha", "Indian Parliament", "Chief Ministers", "MLAs", "Political Intelligence", "Indian Elections"],
  openGraph: {
    title: "SattaDarshan — Indian Legislative & Political Intelligence",
    description: "Comprehensive, open civic intelligence tracking the Indian Parliament, political parties, Chief Ministers, and states.",
    url: "https://sattadarshan.vercel.app",
    siteName: "SattaDarshan",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SattaDarshan — Indian Legislative & Political Intelligence",
    description: "Comprehensive, open civic intelligence tracking the Indian Parliament, political parties, Chief Ministers, and states.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen flex flex-col antialiased bg-background`}>
        <Providers>
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
