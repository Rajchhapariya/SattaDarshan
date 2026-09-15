import { Suspense } from "react";
import { Metadata } from "next";
import { CorrectionsClient } from "./CorrectionsClient";

export const metadata: Metadata = {
  title: "Report Data Inaccuracy or Suggest a Correction",
  description:
    "Submit factual updates, gazette corrections, or outdated representative details to SattaDarshan for editorial review against primary public records.",
};

export default function CorrectionsPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-12 text-center text-sm text-muted-foreground">Loading form...</div>}>
      <CorrectionsClient />
    </Suspense>
  );
}
