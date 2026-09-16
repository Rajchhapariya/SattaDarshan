import type { Metadata } from "next";
import { PartiesClient } from "./PartiesClient";

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
export default function PartiesPage() { return <PartiesClient/>; }
