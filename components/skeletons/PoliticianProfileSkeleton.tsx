import React from "react";
import { Skeleton, SkeletonAvatar } from "@/components/ui/Skeleton";

export function PoliticianProfileSkeleton() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Breadcrumbs Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-12" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-24" />
        <span className="text-slate-300">/</span>
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Hero Profile Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Full-Color Portrait Placeholder */}
        <SkeletonAvatar size="hero" shape="rounded" />

        {/* Member Title & Meta Skeleton */}
        <div className="space-y-4 flex-1 w-full">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-9 w-64 sm:w-80 max-w-full" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-28 rounded-xl self-start sm:self-auto" />
            </div>
          </div>

          {/* Key Tag Badges Skeleton */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Skeleton className="h-7 w-28 rounded-xl" />
            <Skeleton className="h-7 w-36 rounded-xl" />
            <Skeleton className="h-7 w-20 rounded-xl" />
          </div>

          {/* Social Links Skeleton */}
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
            <Skeleton className="h-8 w-8 rounded-xl" />
          </div>
        </div>
      </div>

      {/* 4 Essential Legislative Metrics Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        ))}
      </div>

      {/* Portfolios Section Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-md" />
          <Skeleton className="h-6 w-56" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border/60 flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-lg flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Biography Section Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <Skeleton className="h-6 w-44" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
}
