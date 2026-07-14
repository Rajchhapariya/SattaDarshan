"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { PoliticianTable } from "@/components/politician/PoliticianTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { 
  Ledger, 
  LedgerHeader, 
  LedgerControls, 
  LedgerFilterGroup, 
  LedgerViewToggle, 
  LedgerSort,
  LedgerContent, 
  LedgerFooter 
} from "@/components/ui/Ledger";
import { UserCheck, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = ["All", "President", "PM", "CM", "Minister", "MP", "MLA", "Governor", "Other"];
const SORT_OPTIONS = [
  { label: "Name (A-Z)", value: "name:asc" },
  { label: "Name (Z-A)", value: "name:desc" },
  { label: "Party", value: "partyName:asc" },
  { label: "State", value: "state:asc" },
];

type PoliticianSummary = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
  state?: string;
};

export function PoliticiansClient() {
  const sp = useSearchParams();
  const [data, setData] = useState<PoliticianSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [role, setRole] = useState("All");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const [sort, setSort] = useState("name:asc");

  const fetchData = useCallback(() => {
    setLoading(true);
    const [sortField, sortOrder] = sort.split(':');
    const p = new URLSearchParams({ 
      page: String(page), 
      limit: view === 'grid' ? "24" : "50",
      sort: sortField,
      order: sortOrder
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
    <Ledger>
      <LedgerHeader
        title="Politicians Index"
        subtitle="Search and verify official profiles of current and former representatives. All records are validated against ECI and Parliamentary data domains."
        badge="Representative Directory"
        icon={<UserCheck className="h-3 w-3" />}
        stats={[{ label: "Total Records", value: total }]}
      />

      <LedgerControls>
        <LedgerFilterGroup label="Filters">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => {
                setRole(r);
                setPage(1);
              }}
              className={cn(
                "px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all border",
                role === r
                  ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
              )}
            >
              {r}
            </button>
          ))}
        </LedgerFilterGroup>
        
        <div className="flex flex-wrap w-full lg:w-auto gap-4 items-center">
          <LedgerSort 
            options={SORT_OPTIONS} 
            value={sort} 
            onChange={(v) => {
              setSort(v);
              setPage(1);
            }} 
          />
          <SearchBar 
            value={q} 
            onChange={(v) => {
              setQ(v);
              setPage(1);
            }} 
            placeholder="Filter by name, state, party..." 
            className="flex-1 lg:w-80" 
          />
          <LedgerViewToggle view={view} onViewChange={setView} />
        </div>
      </LedgerControls>

      <LedgerContent>
        {loading ? (
          view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[4/5] w-full rounded-md" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-3/4 rounded-sm" />
                     <Skeleton className="h-3 w-1/2 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-md" />
              ))}
            </div>
          )
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-md">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground/50">
              <Filter className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-foreground uppercase tracking-tight">No data matching filters</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">Adjust your parameters or reset search query to continue discovery.</p>
            <button onClick={()=>{setQ(""); setRole("All");}} className="mt-6 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">Reset Workspace</button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {data.map((p) => (
              <PoliticianCard key={p.slug} {...p} />
            ))}
          </div>
        ) : (
          <PoliticianTable data={data} />
        )}
      </LedgerContent>

      <LedgerFooter page={page} total={total} label="End of Ledger">
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </LedgerFooter>
    </Ledger>
  );
}

