import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { LokSabhaClient } from "./LokSabhaClient";
import { JsonLd, generateParliamentSchema, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "18th Lok Sabha — Members Directory & Chamber",
  description:
    "Explore the comprehensive directory of the 18th Lok Sabha of India with seating visualization, constituency mappings, and party affiliations.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/parliament/lok-sabha",
  },
  openGraph: {
    title: "18th Lok Sabha — Members of Parliament & Chamber",
    description:
      "Explore the comprehensive directory of the 18th Lok Sabha of India with seating visualization, constituency mappings, and party affiliations.",
    url: "https://satta-darshan-7jgo.vercel.app/parliament/lok-sabha",
    siteName: "SattaDarshan",
    type: "website",
    images: [
      {
        url: "/api/og/parliament/lok-sabha",
        width: 1200,
        height: 630,
        alt: "18th Lok Sabha — Parliamentary Chamber",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "18th Lok Sabha — Members of Parliament & Chamber",
    description:
      "Explore the comprehensive directory of the 18th Lok Sabha of India with seating visualization, constituency mappings, and party affiliations.",
    images: ["/api/og/parliament/lok-sabha"],
  },
};

export const revalidate = 3600;

export default async function LokSabhaPage() {
  await connectDB();
  const rawMps = await Politician.find({ chamber: "Lok Sabha" })
    .select("name slug state partyName photo constituency")
    .sort({ state: 1, name: 1 })
    .lean();

  const mps = JSON.parse(JSON.stringify(rawMps));

  // Extract unique states and parties for filters
  const statesSet = new Set<string>();
  const partiesSet = new Set<string>();

  mps.forEach((mp: any) => {
    if (mp.state) statesSet.add(mp.state);
    if (mp.partyName) partiesSet.add(mp.partyName);
  });

  const states = Array.from(statesSet).sort();
  const parties = Array.from(partiesSet).sort();

  return (
    <>
      <JsonLd
        data={[
          generateParliamentSchema("Lok Sabha", "https://satta-darshan-7jgo.vercel.app/parliament/lok-sabha"),
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "18th Lok Sabha", url: "/parliament/lok-sabha" },
          ]),
        ]}
      />
      <LokSabhaClient mps={mps} states={states} parties={parties} />
    </>
  );
}
