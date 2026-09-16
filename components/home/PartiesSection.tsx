"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flag, ArrowRight, ShieldCheck } from "lucide-react";
import { AllianceBadge } from "@/components/common/AllianceBadge";
import { CivicPartyLogo } from "@/components/party/CivicPartyLogo";

export function PartiesSection() {
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parties?limit=12")
      .then((r) => r.json())
      .then((d) => {
        setParties(d.parties ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 border border-blue-500/20">
              <Flag className="h-3 w-3" /> Coalitions & Formations
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recognized Political Entities
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Political Parties Directory
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore national formations, regional parties, seat allocations, and alliance alignments
          </p>
        </div>

        <Link
          href="/parties"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          View All 90+ Parties <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map((p) => (
            <Link
              key={p.slug}
              href={`/parties/${p.slug}`}
              className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <CivicPartyLogo
                  src={p.logo}
                  alt={p.abbr || p.name}
                  size="lg"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                      {p.abbr || p.name}
                    </span>
                    <AllianceBadge alliance={p.alliance} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-[180px]">
                    {p.name}
                  </p>
                </div>
              </div>

              {p.seatsLokSabha !== undefined && (
                <div className="text-right flex-shrink-0">
                  <span className="text-lg font-bold text-foreground">
                    {p.seatsLokSabha}
                  </span>
                  <span className="block text-[10px] uppercase font-semibold text-muted-foreground">
                    LS Seats
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
