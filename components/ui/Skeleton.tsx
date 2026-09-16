import React from "react";
import { cn } from "@/lib/utils";

/**
 * Production-grade Skeleton primitives for SattaDarshan.
 * Strict LIGHT MODE ONLY as per project specification.
 */

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-slate-200/75 border border-slate-200/40", className)}
      {...props}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className,
  lastLineWidth = "75%",
}: {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-slate-200/75 animate-pulse"
          style={{
            width: i === lines - 1 && lines > 1 ? lastLineWidth : "100%",
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({
  size = "md",
  shape = "circle",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  shape?: "circle" | "rounded";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
    hero: "w-36 h-44 sm:w-44 sm:h-52 md:w-48 md:h-56",
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200/80 border border-slate-300/40 flex-shrink-0",
        sizeClasses[size],
        shapeClass,
        className
      )}
    />
  );
}

export function SkeletonButton({ className }: { className?: string }) {
  return (
    <div className={cn("h-10 w-28 rounded-xl bg-slate-200/75 animate-pulse", className)} />
  );
}
