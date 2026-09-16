import React from "react";
import { Skeleton, SkeletonAvatar } from "@/components/ui/Skeleton";

export function StateProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* State Hero Header Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="h-8 sm:h-9 w-48 sm:w-64" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>

        {/* Executive Stats Cards Skeleton */}
        <div className="grid grid-cols-2 sm:flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[110px] space-y-1.5">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-6 w-14 mx-auto" />
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[110px] space-y-1.5">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-5 w-24 mx-auto" />
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[90px] space-y-1.5">
            <Skeleton className="h-3 w-14 mx-auto" />
            <Skeleton className="h-6 w-8 mx-auto" />
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[90px] space-y-1.5">
            <Skeleton className="h-3 w-14 mx-auto" />
            <Skeleton className="h-6 w-8 mx-auto" />
          </div>
        </div>
      </div>

      {/* Representatives Section Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <Skeleton className="h-6 w-56 mb-1" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-muted/30 border border-border/60 p-4 flex flex-col items-center space-y-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
