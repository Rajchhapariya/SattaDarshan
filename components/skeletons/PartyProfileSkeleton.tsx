import React from "react";
import { Skeleton, SkeletonAvatar } from "@/components/ui/Skeleton";

export function PartyProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-28" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Hero Party Header Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <SkeletonAvatar size="lg" shape="rounded" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 sm:h-9 w-60 sm:w-80" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>

        {/* Parliamentary Representation Cards Skeleton */}
        <div className="grid grid-cols-2 sm:flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[100px] space-y-1.5">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-6 w-10 mx-auto" />
          </div>
          <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 text-center min-w-[100px] space-y-1.5">
            <Skeleton className="h-3 w-16 mx-auto" />
            <Skeleton className="h-6 w-10 mx-auto" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl self-center" />
        </div>
      </div>

      {/* Party Details & Office Bearers Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <Skeleton className="h-5 w-44" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Key Representatives Section Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
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
    </div>
  );
}
