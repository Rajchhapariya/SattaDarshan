import { Metadata } from "next";
import { CorrectionsClient } from "./CorrectionsClient";

export const metadata: Metadata = {
  title: "Report Data Inaccuracy or Suggest a Correction",
  description:
    "Submit factual updates, gazette corrections, or outdated representative details to SattaDarshan for editorial review against primary public records.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/corrections",
  },
  openGraph: {
    title: "Report Data Inaccuracy or Suggest a Correction — SattaDarshan",
    description:
      "Submit factual updates, gazette corrections, or outdated representative details to SattaDarshan for editorial review against primary public records.",
    url: "https://satta-darshan-7jgo.vercel.app/corrections",
  },
};

export default function CorrectionsPage() {
  return <CorrectionsClient />;
}
