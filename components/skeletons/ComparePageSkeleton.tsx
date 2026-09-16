import React from "react";
import { Skeleton, SkeletonAvatar } from "@/components/ui/Skeleton";

export function ComparePageSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Header Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48 rounded-full" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Selectors Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/80">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      {/* Side-by-Side Politician Profile Cards Skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col items-center text-center space-y-3">
            <SkeletonAvatar size="xl" shape="circle" />
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        ))}
      </div>

      {/* Metric Comparison Rows Skeleton */}
      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden divide-y divide-border/60 shadow-sm">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="p-4 grid grid-cols-3 items-center gap-4">
            <div className="flex justify-center">
              <Skeleton className="h-4 w-28" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
