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
  metadataBase: new URL("https://satta-darshan-7jgo.vercel.app"),
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
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app",
  },
  openGraph: {
    title: "SattaDarshan — Independent Political & Legislative Platform",
    description:
      "Transparent, structured civic intelligence tracking the 18th Lok Sabha, Rajya Sabha, Chief Ministers, Portfolios, and 36 States & UTs.",
    url: "https://satta-darshan-7jgo.vercel.app",
    siteName: "SattaDarshan (Independent)",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SattaDarshan — Independent Political & Legislative Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SattaDarshan — Independent Political & Legislative Platform",
    description:
      "Transparent, structured civic intelligence tracking the 18th Lok Sabha, Rajya Sabha, Chief Ministers, Portfolios, and 36 States & UTs.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", sizes: "64x64", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} ${mono.variable} font-sans min-h-screen flex flex-col antialiased bg-background text-foreground`}>
        {/* Accessible Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2.5 focus:bg-amber-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:font-semibold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-transform"
        >
          Skip to main content
        </a>
        <Providers>
          <DisclaimerModal />
          <Navbar />
          <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
