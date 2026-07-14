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
  title: { default: "SattaDarshan — Sovereign political intelligence ledger", template: "%s | SattaDarshan" },
  description: "High-precision, verified legislative data tracking the Indian parliamentary matrix. Explore comprehensive records for Lok Sabha, Rajya Sabha, MLAs, and Chief Ministers.",
  keywords: ["India Politics", "Lok Sabha", "Rajya Sabha", "Indian Parliament", "Chief Ministers", "MLAs", "Political Intelligence"],
  openGraph: {
    title: "SattaDarshan",
    description: "High-precision, verified legislative data tracking the Indian parliamentary matrix.",
    url: "https://sattadarshan.vercel.app",
    siteName: "SattaDarshan",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SattaDarshan",
    description: "High-precision, verified legislative data tracking the Indian parliamentary matrix.",
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
