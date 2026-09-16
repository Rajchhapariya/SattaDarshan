import { Suspense } from "react";
import type { Metadata } from "next";
import { PoliticiansClient } from "./PoliticiansClient";

export const metadata: Metadata = {
  title: "Elected Representatives & Political Leaders — India",
  description:
    "Comprehensive verified directory of Members of Parliament, Union Ministers, Chief Ministers, and key political figures across India.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/politicians",
  },
  openGraph: {
    title: "Elected Representatives & Political Leaders — SattaDarshan",
    description:
      "Comprehensive verified directory of Members of Parliament, Union Ministers, Chief Ministers, and key political figures across India.",
    url: "https://satta-darshan-7jgo.vercel.app/politicians",
  },
};

export default function PoliticiansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
      <PoliticiansClient />
    </Suspense>
  );
}
