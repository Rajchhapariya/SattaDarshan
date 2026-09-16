"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";

type CivicPartyLogoProps = {
  src?: string | null;
  alt: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZE_CONFIG = {
  sm: { box: "h-7 w-7 rounded-lg", img: 18, icon: "h-3.5 w-3.5" },
  md: { box: "h-10 w-10 rounded-xl", img: 26, icon: "h-5 w-5" },
  lg: { box: "h-12 w-12 rounded-xl", img: 34, icon: "h-6 w-6" },
  xl: { box: "h-16 w-16 sm:h-20 sm:w-20 rounded-2xl", img: 48, icon: "h-8 w-8" },
};

export function CivicPartyLogo({
  src,
  alt,
  size = "md",
  className,
}: CivicPartyLogoProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;
  const isValidSrc = src && src.trim() !== "" && !hasError;

  return (
    <div
      className={cn(
        "relative flex-shrink-0 flex items-center justify-center bg-muted/40 border border-border/70 overflow-hidden select-none p-1",
        config.box,
        className
      )}
    >
      {isValidSrc ? (
        <Image
          src={src}
          alt={alt}
          width={config.img}
          height={config.img}
          className="object-contain max-h-full max-w-full transition-transform duration-200"
          onError={() => setHasError(true)}
        />
      ) : (
        <Flag className={cn(config.icon, "text-muted-foreground/50")} />
      )}
    </div>
  );
}
