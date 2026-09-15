"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
  className?: string;
  label?: string;
  variant?: "default" | "compact" | "outline";
}

export function ShareButton({
  title,
  text,
  url,
  className,
  label = "Share",
  variant = "default",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);

    const shareUrl =
      url || (typeof window !== "undefined" ? window.location.href : "");
    const shareData = {
      title,
      text: text || title,
      url: shareUrl,
    };

    // 1. Try Web Share API if available and supported
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        toast.success("Shared successfully!");
        setSharing(false);
        return;
      } catch (err: any) {
        // If user cancelled the native share sheet, do not trigger an error toast
        if (err?.name === "AbortError") {
          setSharing(false);
          return;
        }
        // Fall back to clipboard if Web Share failed for other reasons
      }
    }

    // 2. Clipboard Fallback
    if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.error("Failed to copy link. Please copy URL manually.");
      }
    } else {
      toast.error("Sharing is not supported on this browser.");
    }

    setSharing(false);
  };

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Share ${title}`}
        title={`Share ${title}`}
        className={cn(
          "inline-flex items-center justify-center p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors min-h-[44px] min-w-[44px]",
          className
        )}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-600" />
        ) : (
          <Share2 className="h-4 w-4 text-primary" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share ${title}`}
      className={cn(
        "inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted/60 transition-colors shadow-sm min-h-[44px]",
        className
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
      ) : (
        <Share2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      )}
      <span>{copied ? "Link Copied!" : label}</span>
    </button>
  );
}
