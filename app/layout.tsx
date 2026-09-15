import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerModal } from "@/components/common/DisclaimerModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SattaDarshan — Independent Political & Legislative Information Platform",
    template: "%s | SattaDarshan (Independent Platform)",
  },
  description:
    "SattaDarshan is an independent, non-government platform for exploring publicly available political and legislative information, tracking the 18th Lok Sabha, Rajya Sabha, political parties, and state jurisdictions.",
  keywords: [
    "India Politics",
    "Lok Sabha",
    "Rajya Sabha",
    "Indian Parliament",
    "Chief Ministers",
    "MLAs",
    "Political Information",
    "Indian Elections",
    "Non-Government Portal",
  ],
  openGraph: {
    title: "SattaDarshan — Independent Political & Legislative Platform",
    description:
      "SattaDarshan is an independent, non-government platform for exploring publicly available political and legislative information.",
    url: "https://sattadarshan.vercel.app",
    siteName: "SattaDarshan (Independent)",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SattaDarshan — Independent Political & Legislative Platform",
    description:
      "SattaDarshan is an independent, non-government platform for exploring publicly available political and legislative information.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="bg-background">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen flex flex-col antialiased bg-background`}>
        <Providers>
          <DisclaimerModal />
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
