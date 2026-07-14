"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { PartyTable } from "@/components/party/PartyTable";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { 
  Ledger, 
  LedgerHeader, 
  LedgerControls, 
  LedgerFilterGroup, 
  LedgerViewToggle, 
  LedgerContent, 
  LedgerFooter 
} from "@/components/ui/Ledger";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Flag, PieChart as ChartIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = ["All", "National", "State", "RUPP"];

type PartySummary = {
  slug: string;
  name: string;
  abbr?: string;
  tier?: string;
  status?: string;
  logo?: string;
  seatsLokSabha?: number;
};

export function PartiesClient() {
  const [data, setData] = useState<PartySummary[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("All");
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<'grid' | 'table'>('grid');

  const fetchData = useCallback(() => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: view === 'grid' ? "30" : "50" });
    if (q) p.set("q", q);
    if (tier !== "All") p.set("tier", tier);
    fetch("/api/parties?" + p)
      .then((r) => r.json())
      .then((d) => {
        setData(d.parties ?? []);
        setTotal(d.total ?? 0);
        setPages(d.pages ?? 1);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [q, tier, page, view]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tierStats = [
    { name: "National", value: data.filter((x) => x.tier === "National").length },
    { name: "State", value: data.filter((x) => x.tier === "State").length },
    { name: "RUPP", value: data.filter((x) => x.tier === "RUPP").length },
  ];
  
  const COLORS = ["#FF9933", "#10b981", "#64748b"];

  return (
    <Ledger>
      <LedgerHeader
        title="Parties Directory"
        subtitle="Registry of active and recognized political formations in India. Tier distribution maintained per official ECI notification status."
        badge="Political Index"
        icon={<Flag className="h-3 w-3" />}
        stats={[{ label: "Total Formations", value: total }]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Statistics Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-muted/30 border border-border rounded-md p-6">
            <div className="flex items-center gap-2 mb-6">
               <ChartIcon className="h-4 w-4 text-primary" />
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-foreground">Tier Distribution</h3>
            </div>
            <div className="h-48 w-full flex items-center justify-center">
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={tierStats} 
                      dataKey="value" 
                      nameKey="name" 
                      innerRadius={50} 
                      outerRadius={70} 
                      paddingAngle={4}
                      stroke="none"
                    >
                      {tierStats.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0F172A', 
                        border: 'none', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#fff'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-32 w-32 rounded-full border-8 border-muted animate-pulse" />
              )}
            </div>
            <div className="space-y-2 mt-4">
               {tierStats.map((t, i) => (
                 <div key={t.name} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                     <span className="text-xs font-bold text-muted-foreground uppercase">{t.name}</span>
                   </div>
                   <span className="text-xs font-mono font-black">{t.value}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-md p-6">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Protocol Note</h3>
             <p className="text-[11px] text-muted-foreground leading-relaxed">
               Recognized parties are subject to periodic performance reviews by the Election Commission of India. 
               Status is updated per latest verification cycle.
             </p>
          </div>
        </div>

        {/* List Panel */}
        <div className="lg:col-span-3 space-y-6">
          <LedgerControls>
            <LedgerFilterGroup label="Classification">
              {TIERS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTier(t);
                    setPage(1);
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all border",
                    tier === t
                      ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20"
                      : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </LedgerFilterGroup>
            
            <div className="flex w-full md:w-auto gap-4 items-center">
              <SearchBar 
                value={q} 
                onChange={(v) => {
                  setQ(v);
                  setPage(1);
                }} 
                placeholder="Search index..." 
                className="flex-1 md:w-64" 
              />
              <LedgerViewToggle view={view} onViewChange={setView} />
            </div>
          </LedgerControls>

          <LedgerContent>
            {loading ? (
              <div className={cn(
                "grid gap-4",
                view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
              )}>
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className={cn("rounded-md", view === 'grid' ? "h-32 w-full" : "h-16 w-full")} />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-border rounded-md">
                <h3 className="font-bold text-foreground uppercase tracking-tight">Registry Empty</h3>
                <p className="text-xs text-muted-foreground mt-1">No formations matching current filter criteria.</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((p) => (
                  <Link 
                    key={p.slug} 
                    href={`/parties/${p.slug}`} 
                    className="group flex flex-col bg-background border border-border rounded-md p-5 transition-all hover:border-primary/50 hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded border border-border bg-muted/30 p-2 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                          {p.logo ? (
                            <Image 
                              src={p.logo} 
                              alt={p.abbr || p.name} 
                              width={40} 
                              height={40} 
                              className="object-contain"
                            />
                          ) : (
                            <Flag className="h-6 w-6 text-muted-foreground/30" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-black text-lg text-foreground tracking-tighter group-hover:text-primary transition-colors">
                            {p.abbr || p.name.substring(0, 4)}
                          </h3>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase truncate max-w-[120px]">
                            {p.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                      <Badge variant="secondary" className="text-[8px]">
                        {p.tier}
                      </Badge>
                      {p.seatsLokSabha !== undefined && (
                        <div className="flex flex-col items-end">
                           <span className="text-[10px] font-black font-mono text-primary">{p.seatsLokSabha} SEATS</span>
                           <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">LOK SABHA</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <PartyTable data={data} />
            )}
          </LedgerContent>

          <LedgerFooter page={page} total={total} label="End of Index">
            <Pagination page={page} pages={pages} onPageChange={setPage} />
          </LedgerFooter>
        </div>
      </div>
    </Ledger>
  );
}

