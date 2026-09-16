import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function ParliamentChamberSkeleton({ chamber = "Lok Sabha" }: { chamber?: string }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* 3D Chamber Container Skeleton */}
      <div className="relative w-full rounded-3xl bg-card border border-border/80 overflow-hidden shadow-sm">
        {/* Top Control Header Skeleton */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-48 sm:w-64" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-8 w-20 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Semicircular Amphitheater Seating Silhouette */}
        <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] bg-gradient-to-b from-slate-100/50 via-slate-50/30 to-background flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Concentric Seating Tier Arcs (Simulating Parliament chamber) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[300px] sm:w-[460px] md:w-[580px] h-[300px] sm:h-[460px] md:h-[580px] rounded-full border border-dashed border-slate-300/60 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[220px] sm:w-[350px] md:w-[440px] h-[220px] sm:h-[350px] md:h-[440px] rounded-full border border-dashed border-slate-300/70 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[140px] sm:w-[230px] md:w-[290px] h-[140px] sm:h-[230px] md:h-[290px] rounded-full border border-dashed border-slate-300/80 pointer-events-none" />

          {/* Speaker Dais Placeholder */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3 bg-card/80 backdrop-blur-xs p-6 rounded-2xl border border-border/80 shadow-xs max-w-sm">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Loading {chamber} Chamber...
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Mapping {chamber === "Lok Sabha" ? "543" : "245"} constitutional seats
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <Skeleton className="h-10 w-full sm:max-w-md rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Directory Cards Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-64 rounded-2xl bg-muted/30 border border-border/60 p-4 flex flex-col items-center space-y-3">
            <Skeleton className="h-24 w-24 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
