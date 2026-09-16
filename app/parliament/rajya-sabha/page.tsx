import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { RajyaSabhaClient } from "./RajyaSabhaClient";
import { JsonLd, generateParliamentSchema, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rajya Sabha — Council of States Directory & Chamber",
  description:
    "Directory of the Rajya Sabha (Upper House) of India's Parliament with seating visualization, party representations, and state distributions.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/parliament/rajya-sabha",
  },
  openGraph: {
    title: "Rajya Sabha — Council of States | Indian Parliament",
    description:
      "Directory of the Rajya Sabha (Upper House) of India's Parliament with seating visualization, party representations, and state distributions.",
    url: "https://satta-darshan-7jgo.vercel.app/parliament/rajya-sabha",
    siteName: "SattaDarshan",
    type: "website",
    images: [
      {
        url: "/api/og/parliament/rajya-sabha",
        width: 1200,
        height: 630,
        alt: "Rajya Sabha — Council of States",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rajya Sabha — Council of States | Indian Parliament",
    description:
      "Directory of the Rajya Sabha (Upper House) of India's Parliament with seating visualization, party representations, and state distributions.",
    images: ["/api/og/parliament/rajya-sabha"],
  },
};

export const revalidate = 3600;

export default async function RajyaSabhaPage() {
  await connectDB();
  const rawMps = await Politician.find({ chamber: "Rajya Sabha" })
    .select("name slug state partyName photo")
    .sort({ state: 1, name: 1 })
    .lean();

  const mps = JSON.parse(JSON.stringify(rawMps));

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
          generateParliamentSchema("Rajya Sabha", "https://satta-darshan-7jgo.vercel.app/parliament/rajya-sabha"),
          generateBreadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Rajya Sabha", url: "/parliament/rajya-sabha" },
          ]),
        ]}
      />
      <RajyaSabhaClient mps={mps} states={states} parties={parties} />
    </>
  );
}
