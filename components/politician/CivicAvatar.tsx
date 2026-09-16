"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Landmark, User } from "lucide-react";
import { cn, getCivicImageUrl } from "@/lib/utils";

type CivicAvatarProps = {
  src?: string | null;
  alt: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "card" | "hero" | "table";
  shape?: "circle" | "rounded-xl" | "rounded-2xl" | "fill";
  className?: string;
  priority?: boolean;
};

const SIZE_CLASSES = {
  xs: "h-5 w-5",
  sm: "h-7 w-7",
  table: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20 sm:h-24 sm:w-24",
  xl: "h-28 w-28 sm:h-32 sm:w-32",
  card: "w-full aspect-[4/4.5]",
  hero: "h-48 w-48 sm:h-56 sm:w-56",
  fill: "w-full h-full",
};

const SHAPE_CLASSES = {
  circle: "rounded-full overflow-hidden",
  "rounded-xl": "rounded-xl overflow-hidden",
  "rounded-2xl": "rounded-2xl overflow-hidden",
  fill: "overflow-hidden",
};

export function CivicAvatar({
  src,
  alt,
  size = "md",
  shape = "circle",
  className,
  priority = false,
}: CivicAvatarProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error when src changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const resolvedSrc = getCivicImageUrl(src);
  const isValidSrc = resolvedSrc && !hasError;

  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center bg-muted/50 select-none",
        SIZE_CLASSES[size],
        SHAPE_CLASSES[shape],
        className
      )}
    >
      {isValidSrc ? (
        <Image
          src={resolvedSrc}
          alt={alt}
          fill
          priority={priority}
          sizes={
            size === "hero"
              ? "(max-width: 640px) 192px, 224px"
              : size === "card"
              ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              : "128px"
          }
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        /* Dignified Civic Silhouette Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-muted/80 via-muted to-muted/40 text-muted-foreground/60 p-2">
          {size === "xs" || size === "sm" ? (
            <User className="h-3.5 w-3.5 text-muted-foreground/50" />
          ) : size === "table" ? (
            <User className="h-4 w-4 text-muted-foreground/50" />
          ) : size === "hero" || size === "xl" || size === "card" ? (
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <div className="p-3 rounded-full bg-background/60 border border-border/60 text-primary/70 shadow-sm">
                <Landmark className="h-7 w-7 sm:h-9 sm:w-9" />
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-2 line-clamp-1">
                {alt}
              </span>
            </div>
          ) : (
            <Landmark className="h-5 w-5 text-muted-foreground/50" />
          )}
        </div>
      )}
    </div>
  );
}
