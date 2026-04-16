import { PoliticiansClient } from "./PoliticiansClient";
import { Suspense } from "react";
export const metadata = { title: "Politicians — India" };

export default function PoliticiansPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50" />}>
      <PoliticiansClient />
    </Suspense>
  );
}
