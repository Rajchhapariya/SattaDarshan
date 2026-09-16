import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Representatives & Political Leaders",
  description:
    "Side-by-side comparative analysis of Members of Parliament, ministers, assets, criminal records, education, and parliamentary terms.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/compare",
  },
  openGraph: {
    title: "Compare Representatives & Political Leaders — SattaDarshan",
    description:
      "Side-by-side comparative analysis of Members of Parliament, ministers, assets, criminal records, education, and parliamentary terms.",
    url: "https://satta-darshan-7jgo.vercel.app/compare",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
