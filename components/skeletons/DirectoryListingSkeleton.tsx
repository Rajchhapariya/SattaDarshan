import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function DirectoryListingSkeleton({
  title = "Civic Directory",
  cardType = "grid",
  count = 12,
}: {
  title?: string;
  cardType?: "grid" | "party" | "state";
  count?: number;
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-5 w-36 rounded-full" />
          <Skeleton className="h-9 w-64 sm:w-80" />
          <Skeleton className="h-4 w-72 sm:w-96 max-w-full" />
        </div>
        <div className="px-5 py-3.5 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[120px] space-y-1">
          <Skeleton className="h-3 w-16 mx-auto" />
          <Skeleton className="h-7 w-12 mx-auto" />
        </div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-xl flex-shrink-0" />
        ))}
      </div>

      {/* Search and Controls Bar Skeleton */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <Skeleton className="h-10 w-full sm:max-w-md rounded-xl" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-44 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>

      {/* Card Listing Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-72 rounded-2xl bg-card border border-border/80 p-5 flex flex-col items-center justify-between shadow-xs">
            <Skeleton className="h-28 w-28 rounded-2xl" />
            <div className="space-y-2 w-full text-center">
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
            <Skeleton className="h-6 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
