import React from "react";
import Link from "next/link";
import { Info, ExternalLink, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

export type DataAccuracyNoticeProps = {
  variant?: "compact" | "detailed";
  recordSlug?: string;
  recordType?: "politician" | "party" | "state" | "chamber" | "general";
  source?: string;
  sourceUrl?: string;
  lastVerifiedAt?: Date | string;
  className?: string;
};

export function DataAccuracyNotice({
  variant = "compact",
  recordSlug,
  recordType = "general",
  source,
  sourceUrl,
  lastVerifiedAt,
  className,
}: DataAccuracyNoticeProps) {
  const correctionUrl = recordSlug
    ? `/corrections?record=${encodeURIComponent(recordSlug)}&type=${encodeURIComponent(recordType)}`
    : `/corrections?type=${encodeURIComponent(recordType)}`;

  if (variant === "compact") {
    return (
      <aside
        aria-label="Data Accuracy Notice"
        className={cn(
          "w-full p-4 sm:p-5 rounded-2xl border border-border/80 bg-muted/20 text-xs text-muted-foreground shadow-sm",
          className
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 max-w-3xl">
            <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-foreground">Data Accuracy Notice:</strong> We make every reasonable effort to maintain accurate and current information, but political and electoral records can change over time and occasional delays or inaccuracies may occur. We apologize for any discrepancies and encourage users to report corrections. For authoritative information, consult the relevant official source.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
            <Link
              href={correctionUrl}
              className="inline-flex items-center gap-1 font-semibold text-primary hover:underline whitespace-nowrap"
            >
              <Flag className="h-3 w-3" />
              <span>Report a correction</span>
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  // Detailed Notice Card (for record detail pages and transparency pages)
  const formattedDate = lastVerifiedAt
    ? new Date(lastVerifiedAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <section
      aria-label="Data Accuracy & Source Provenance"
      className={cn(
        "p-6 sm:p-7 rounded-3xl border border-border/80 bg-muted/20 shadow-sm space-y-4 text-xs sm:text-sm text-muted-foreground",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2 text-foreground font-bold text-sm sm:text-base">
          <Info className="h-4 w-4 text-primary" />
          <h2>Data Accuracy & Provenance Notice</h2>
        </div>
        {formattedDate && (
          <span className="text-[11px] text-muted-foreground">
            Record verification metadata: {formattedDate}
          </span>
        )}
      </div>

      <div className="space-y-3 leading-relaxed">
        <p>
          We strive to keep the information on SattaDarshan accurate and up to date. However, political, electoral, legislative, and public information can change over time, and some information may occasionally be outdated, incomplete, delayed, or incorrect.
        </p>
        <p>
          We apologize for any inaccuracies or outdated information you may encounter.
        </p>
        <p>
          If you notice an error, outdated information, or a missing update, please report it through our correction system so we can review and update the information.
        </p>
        <p>
          For the most authoritative and current information, please refer directly to the relevant official government or institutional source linked on this website.
        </p>
      </div>

      <div className="pt-2 border-t border-border/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {source && (
          <div className="flex items-center gap-1.5 text-foreground font-medium">
            <span className="text-muted-foreground">Record Source:</span>
            {sourceUrl ? (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>{source}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span>{source}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3">
          <Link
            href={correctionUrl}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 font-semibold transition-colors"
          >
            <Flag className="h-3.5 w-3.5" />
            <span>Report a correction</span>
          </Link>
          <Link
            href="/methodology"
            className="text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Review Methodology
          </Link>
        </div>
      </div>
    </section>
  );
}
