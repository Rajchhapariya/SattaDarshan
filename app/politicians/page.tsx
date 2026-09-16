import { Suspense } from "react";
import type { Metadata } from "next";
import { PoliticiansClient } from "./PoliticiansClient";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { JsonLd, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

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

export const revalidate = 3600;

export default async function PoliticiansPage() {
  await connectDB();
  const [rawPoliticians, total] = await Promise.all([
    Politician.find({})
      .select("slug name photo role currentOffice ministerialRank portfolios partyName constituency state tenureStatus verificationStatus")
      .sort({ name: 1 })
      .limit(24)
      .lean(),
    Politician.countDocuments({}),
  ]);

  const initialData = JSON.parse(JSON.stringify(rawPoliticians));
  const pages = Math.ceil(total / 24) || 1;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Representatives", url: "/politicians" },
        ])}
      />
      <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
        <PoliticiansClient initialData={initialData} initialTotal={total} initialPages={pages} />
      </Suspense>
    </>
  );
}
