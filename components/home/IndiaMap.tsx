"use client";

import Link from "next/link";
import { MapPin, ChevronRight } from "lucide-react";
import { CivicIndiaMap } from "@/components/maps/CivicIndiaMap";

export function IndiaMap() {
  return (
    <div className="relative w-full rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden">
      {/* Map Header */}
      <div className="p-4 sm:p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <MapPin className="h-3 w-3" /> Territorial Governance
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              36 States & UTs
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1">
            Interactive State & Jurisdiction Map
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Hover or tap any state to inspect regional administration, leadership, and parliamentary seats
          </p>
        </div>

        <Link
          href="/states"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          View All States <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Shared Map Component */}
      <CivicIndiaMap
        showControls={true}
        showQuickChips={true}
        showCard={true}
        heightClass="h-[440px] sm:h-[500px] lg:h-[540px]"
        className="border-0 shadow-none rounded-none rounded-b-3xl"
      />
    </div>
  );
}

