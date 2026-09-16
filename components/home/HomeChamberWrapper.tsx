"use client";

import dynamic from "next/dynamic";
import { Landmark } from "lucide-react";

const ThreeParliamentChamber = dynamic(
  () => import("@/components/parliament/ThreeParliamentChamber").then((mod) => mod.ThreeParliamentChamber),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl bg-card border border-border/80 flex flex-col items-center justify-center p-8 text-center animate-pulse shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-3 text-amber-600">
          <Landmark className="h-6 w-6 animate-pulse" />
        </div>
        <p className="text-sm font-bold text-foreground">18th Lok Sabha Chamber Visualization</p>
        <p className="text-xs text-muted-foreground mt-1">Loading interactive 543-seat parliamentary floor plan...</p>
      </div>
    ),
  }
);

export function HomeChamberWrapper() {
  return <ThreeParliamentChamber chamber="Lok Sabha" />;
}
