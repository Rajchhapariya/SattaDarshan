"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Flag, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { AllianceBadge } from "@/components/common/AllianceBadge";
import { PartyTable } from "@/components/party/PartyTable";
import { cn } from "@/lib/utils";

const ALLIANCES = ["All", "NDA", "INDIA", "Others"];
const TIERS = ["All", "National", "State", "RUPP"];

type PartySummary = {
  slug: string;
  name: string;
  abbr?: string;
  tier?: string;
  status?: string;
  logo?: string;
  alliance?: string;
  seatsLokSabha?: number;
  seatsRajyaSabha?: number;
};

export function PartiesClient() {
  const [data, setData] = useState<PartySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("All");
  const [alliance, setAlliance] = useState("All");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "table">("grid");

  const fetchData = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({
      page: String(page),
      limit: view === "grid" ? "24" : "50",
    });
    if (q) p.set("q", q);
    if (tier !== "All") p.set("tier", tier);
    if (alliance !== "All") p.set("alliance", alliance);

    fetch("/api/parties?" + p)
      .then((r) => r.json())
      .then((d) => {
        setData(d.parties ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, tier, alliance, page, view]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
            <Flag className="h-3.5 w-3.5" /> Political Formations Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Political Parties of India
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Registry of active recognized parties, state parties, and national alliances with official seat allocations.
          </p>
        </div>

        <div className="px-5 py-3.5 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[120px]">
          <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Total Parties</span>
          <span className="text-2xl font-bold text-foreground">
            {total > 0 ? total : "90+"}
          </span>
        </div>
      </div>

      {/* Alliance Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ALLIANCES.map((a) => (
          <button
            key={a}
            onClick={() => {
              setAlliance(a);
              setPage(1);
            }}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border",
              alliance === a
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border-border/80"
            )}
          >
            {a === "All" ? "All Alliances" : `${a} Alliance`}
          </button>
        ))}
      </div>

      {/* Search, Tier Filter & View Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search party by name or acronym (e.g. BJP, INC, AAP)..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <select
            value={tier}
            onChange={(e) => {
              setTier(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Party Tier"
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="All">All Tiers</option>
            <option value="National">National Parties</option>
            <option value="State">State Recognized</option>
            <option value="RUPP">RUPP</option>
          </select>

          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all",
                view === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all",
                view === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table Listing */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border/80 space-y-3">
          <Flag className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">No Parties Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No political party matched your search or tier filter.
          </p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {data.map((p) => (
            <Link
              key={p.slug}
              href={`/parties/${p.slug}`}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative h-12 w-12 rounded-xl border border-border/60 bg-muted/30 p-1.5 flex-shrink-0 flex items-center justify-center">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.abbr || p.name}
                      width={38}
                      height={38}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <Flag className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {p.abbr || p.name}
                    </span>
                    <AllianceBadge alliance={p.alliance} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-[190px]">
                    {p.name}
                  </p>
                  <span className="inline-block text-[10px] uppercase font-semibold text-muted-foreground/80 mt-1">
                    {p.tier || "State"} Formation
                  </span>
                </div>
              </div>

              {p.seatsLokSabha !== undefined && (
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-extrabold text-foreground">
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
      ) : (
        <PartyTable data={data} />
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            Page {page} of {pages} ({total} Total)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              className="px-3 py-1.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
