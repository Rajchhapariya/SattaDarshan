import React from "react";
import { cn } from "@/lib/utils";

type AllianceBadgeProps = {
  alliance?: string;
  className?: string;
  size?: "sm" | "md";
};

export function AllianceBadge({ alliance = "Others", className, size = "sm" }: AllianceBadgeProps) {
  const norm = (alliance || "").toUpperCase();

  let colorClasses = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20";
  let dotColor = "bg-emerald-500";
  let label = alliance || "Regional / Independent";

  if (norm.includes("NDA")) {
    colorClasses = "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
    dotColor = "bg-amber-500";
    label = "NDA";
  } else if (norm.includes("INDIA")) {
    colorClasses = "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    dotColor = "bg-blue-600";
    label = "INDIA";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-semibold rounded-full border",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        colorClasses,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
      {label}
    </span>
  );
}
