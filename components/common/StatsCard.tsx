import React from "react";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  className?: string;
};

export function StatsCard({ title, value, subtitle, icon, trend, className }: StatsCardProps) {
  return (
    <div className={cn("p-5 rounded-2xl bg-card border border-border/80 shadow-sm transition-all hover:shadow-md hover:border-primary/40", className)}>
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        {icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold tracking-tight text-foreground">
        {typeof value === "number" ? value.toLocaleString("en-IN") : value}
      </div>
      {(subtitle || trend) && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          {subtitle && <span>{subtitle}</span>}
          {trend && <span className="font-semibold text-emerald-600 dark:text-emerald-400">{trend}</span>}
        </div>
      )}
    </div>
  );
}
