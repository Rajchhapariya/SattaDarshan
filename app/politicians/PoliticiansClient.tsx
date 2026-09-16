"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Users, LayoutGrid, List, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { PoliticianTable } from "@/components/politician/PoliticianTable";
import { CivicSearchInput } from "@/components/ui/CivicSearchInput";
import { CivicSelect } from "@/components/ui/CivicSelect";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";
import { cn } from "@/lib/utils";

const ROLES = [
  { label: "All", value: "All" },
  { label: "Prime Minister", value: "PM" },
  { label: "Chief Ministers", value: "CM" },
  { label: "Cabinet Ministers", value: "Minister" },
  { label: "Lok Sabha MPs", value: "MP" },
  { label: "Rajya Sabha MPs", value: "MP" },
  { label: "MLAs", value: "MLA" },
];

const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
  { label: "Party (A-Z)", value: "partyName:asc" },
  { label: "State (A-Z)", value: "state:asc" },
];

type PoliticianSummary = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  currentOffice?: string;
  ministerialRank?: string;
  portfolios?: string[];
  partyName?: string;
  constituency?: string;
  state?: string;
  tenureStatus?: "serving" | "former" | "historical";
  verificationStatus?: string;
};

export function PoliticiansClient() {
  const sp = useSearchParams();
  const [data, setData] = useState<PoliticianSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [role, setRole] = useState(sp.get("role") ?? "All");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"grid" | "table">("grid");
  const [sort, setSort] = useState("name:asc");

  const fetchData = useCallback(() => {
    setLoading(true);
    const [sortField, sortOrder] = sort.split(":");
    const p = new URLSearchParams({
      page: String(page),
      limit: view === "grid" ? "24" : "50",
      sort: sortField,
      order: sortOrder,
    });
    if (q) p.set("q", q);
    if (role !== "All") p.set("role", role);

    fetch("/api/politicians?" + p)
      .then((r) => r.json())
      .then((d) => {
        setData(d.politicians ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, role, page, view, sort]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Users className="h-3.5 w-3.5" /> Constitutional Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Representatives & Leaders
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Public directory of Indian lawmakers, Ministers, Chief Ministers, and Parliamentarians compiled from official legislative records.
          </p>
        </div>

        <div className="px-5 py-3.5 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[120px]">
          <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Total Profiles</span>
          <span className="text-2xl font-bold text-foreground">
            {total > 0 ? total.toLocaleString("en-IN") : "840+"}
          </span>
        </div>
      </div>

      {/* Role Filter Tabs (Horizontally scrollable on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ROLES.map((r) => (
          <button
            key={r.value + r.label}
            onClick={() => {
              setRole(r.value);
              setPage(1);
            }}
            className={cn(
              "px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border",
              role === r.value
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground border-border/80"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Search, Sort, View Controls */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <div className="flex-1 max-w-md">
          <CivicSearchInput
            value={q}
            onChange={(val) => {
              setQ(val);
              setPage(1);
            }}
            placeholder="Search by leader name, constituency, or party..."
            loading={loading}
            debounceMs={300}
          />
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <CivicSelect
            value={sort}
            onChange={(val) => {
              setSort(val);
              setPage(1);
            }}
            options={SORT_OPTIONS}
            ariaLabel="Sort representatives"
            className="w-48"
          />

          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "p-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] min-w-[40px] flex items-center justify-center",
                view === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View"
              aria-label="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("table")}
              className={cn(
                "p-2 rounded-lg text-xs font-semibold transition-all min-h-[40px] min-w-[40px] flex items-center justify-center",
                view === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
              aria-label="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table Listing */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border/80 space-y-3">
          <Users className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">No Representatives Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search keywords or switching role filters.
          </p>
          {(q || role !== "All" || sort !== "name:asc") && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setRole("All");
                  setSort("name:asc");
                  setPage(1);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {data.map((p) => (
            <PoliticianCard key={p.slug} {...p} />
          ))}
        </div>
      ) : (
        <PoliticianTable data={data} />
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            Page {page} of {pages} ({total} Total)
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="Go to previous page"
              className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1 min-h-[44px]"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, pages))}
              disabled={page === pages}
              aria-label="Go to next page"
              className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1 min-h-[44px]"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Data Accuracy Notice */}
      <DataAccuracyNotice variant="compact" recordType="politician" />
    </div>
  );
}
