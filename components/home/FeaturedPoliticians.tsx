"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { Users, ChevronRight } from "lucide-react";

export function FeaturedPoliticians() {
  const [politicians, setPoliticians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/politicians?role=PM,Minister,Leader of Opposition,CM&limit=8")
      .then((r) => r.json())
      .then((d) => {
        setPoliticians(d.politicians ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <Users className="h-3 w-3" /> Key Leadership
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cabinet & Executive
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Prominent Representatives
          </h2>
          <p className="text-sm text-muted-foreground">
            Key constitutional authorities, Union Ministers, and State leaders shaping Indian policy
          </p>
        </div>

        <Link
          href="/politicians"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          View All Representatives ({politicians.length > 0 ? "800+" : ""}) <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {politicians.map((p) => (
            <PoliticianCard key={p.slug} {...p} />
          ))}
        </div>
      )}
    </section>
  );
}
