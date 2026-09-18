"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { StateIcon } from "@/components/ui/StateIcon";
import { StateTable } from "@/components/state/StateTable";
import { CivicSearchInput } from "@/components/ui/CivicSearchInput";
import { MapPin, ChevronRight, LayoutGrid, List, Landmark } from "lucide-react";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";
import { cn } from "@/lib/utils";

export function StatesClient({ initialStates }: { initialStates: any[] }) {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [search, setSearch] = useState("");

  const filteredStates = useMemo(() => {
    if (!search.trim()) return initialStates;
    const tokens = search.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return initialStates.filter((s: any) => {
      const text = `${s.name} ${s.capital || ""} ${s.cm || ""} ${s.rulingParty || ""} ${s.slug}`.toLowerCase();
      return tokens.every((t) => text.includes(t));
    });
  }, [initialStates, search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <MapPin className="h-3.5 w-3.5" /> Federal Jurisdictions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            States & Union Territories
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Administrative, executive, and legislative profile across all 28 States and 8 Union Territories of India.
          </p>
        </div>

        <div className="px-5 py-3.5 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[120px]">
          <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Jurisdictions</span>
          <span className="text-2xl font-bold text-foreground">36</span>
        </div>
      </div>

      {/* Filter & View Switcher */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex-1 sm:max-w-md">
          <CivicSearchInput
            value={search}
            onChange={setSearch}
            placeholder="Filter by state name, Chief Minister, or ruling party..."
            debounceMs={150}
          />
        </div>

        <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 self-end sm:self-auto">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold transition-all",
              view === "grid" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Grid View"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("table")}
            className={cn(
              "p-1.5 rounded-lg text-xs font-semibold transition-all",
              view === "table" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Table View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid or Table Listing */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredStates.map((s: any) => (
            <Link
              key={s.slug}
              href={`/states/${s.slug}`}
              className="group rounded-2xl bg-card border border-border/80 p-5 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <StateIcon stateName={s.name} statePath={s.statePath} className="w-8 h-8" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                </div>

                <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                  {s.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Capital: <span className="font-medium text-foreground">{s.capital || "N/A"}</span>
                </p>
                {s.cm && (
                  <p className="text-xs text-muted-foreground mt-1">
                    CM: <span className="font-medium text-foreground">{s.cm}</span>
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Lok Sabha</span>
                  <span className="font-bold text-foreground">{s.totalLokSabhaSeats || 0} Seats</span>
                </div>
                <div className="border-l border-border/50 pl-2">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Assembly</span>
                  <span className="font-bold text-foreground">{s.totalAssemblySeats || 0} Seats</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <StateTable data={filteredStates} />
      )}

      {/* Data Accuracy Notice */}
      <DataAccuracyNotice variant="compact" recordType="state" />
    </div>
  );
}
