import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare Politicians & Representatives Side-by-Side — SattaDarshan",
  description:
    "Compare public representatives side-by-side on parliamentary attendance, verified assets, education, criminal disclosures, and committee roles.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/compare",
  },
  openGraph: {
    title: "Compare Politicians Side-by-Side — SattaDarshan",
    description:
      "Compare public representatives side-by-side on parliamentary attendance, verified assets, education, criminal disclosures, and committee roles.",
    url: "https://satta-darshan-7jgo.vercel.app/compare",
  },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
