import connectDB from "@/lib/db";
import State from "@/models/State";
import { getStatePath } from "@/lib/server/statePaths";
import { StatesClient } from "./StatesClient";
import { JsonLd, generateBreadcrumbSchema } from "@/components/seo/JsonLd";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "States & Union Territories of India — Civic & Electoral Data",
  description:
    "Explore governance, Chief Ministers, ruling parties, Lok Sabha seats, and Vidhan Sabha assemblies across all 28 Indian States and 8 Union Territories.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/states",
  },
  openGraph: {
    title: "States & Union Territories of India — SattaDarshan",
    description:
      "Explore governance, Chief Ministers, ruling parties, Lok Sabha seats, and Vidhan Sabha assemblies across all 28 Indian States and 8 Union Territories.",
    url: "https://satta-darshan-7jgo.vercel.app/states",
  },
};

export const revalidate = 86400;

async function getStates() {
  try {
    await connectDB();
    const rawStates = await State.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(rawStates.map((s: any) => ({
      ...s,
      statePath: s.name ? getStatePath(s.name) : undefined,
    }))));
  } catch { return []; }
}

export default async function StatesPage() {
  const states = await getStates();
  
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "States & UTs", url: "/states" },
        ])}
      />
      <StatesClient initialStates={states} />
    </>
  );
}

