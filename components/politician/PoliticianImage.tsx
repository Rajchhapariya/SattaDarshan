"use client"

import Image from "next/image"
import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/Avatar"
import { cn } from "@/lib/utils"

type PoliticianImageProps = {
  src?: string;
  alt: string;
  className?: string;
  fallbackText: string;
}

export function PoliticianImage({ src, alt, className, fallbackText }: PoliticianImageProps) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <Avatar className={cn("h-full w-full", className)}>
        <AvatarFallback>{fallbackText}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className={cn("relative overflow-hidden rounded-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  )
}
