import type { Metadata } from "next";
import { PartiesClient } from "./PartiesClient";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import { JsonLd, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Political Parties of India — National & Regional Directory",
  description:
    "Explore recognized national and regional political parties in India, their symbols, leadership, parliamentary representation, and state alliances.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/parties",
  },
  openGraph: {
    title: "Political Parties of India — SattaDarshan",
    description:
      "Explore recognized national and regional political parties in India, their symbols, leadership, parliamentary representation, and state alliances.",
    url: "https://satta-darshan-7jgo.vercel.app/parties",
  },
};

export const revalidate = 3600;

export default async function PartiesPage() {
  await connectDB();
  const [rawParties, total] = await Promise.all([
    Party.find({})
      .select("slug name abbr tier status logo alliance seatsLokSabha seatsRajyaSabha")
      .sort({ seatsLokSabha: -1, name: 1 })
      .limit(24)
      .lean(),
    Party.countDocuments({}),
  ]);

  const initialData = JSON.parse(JSON.stringify(rawParties));
  const pages = Math.ceil(total / 24) || 1;

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Political Parties", url: "/parties" },
        ])}
      />
      <PartiesClient initialData={initialData} initialTotal={total} initialPages={pages} />
    </>
  );
}
