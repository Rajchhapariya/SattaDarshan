"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Link from "next/link";
import { MapPin, ChevronRight, Landmark } from "lucide-react";
import { CivicIndiaMap, CivicStateData } from "@/components/maps/CivicIndiaMap";
import { cn } from "@/lib/utils";

export default function IndiaMapPage() {
  const [states, setStates] = useState<CivicStateData[]>([]);
  const [selected, setSelected] = useState<CivicStateData | null>(null);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"Lok Sabha" | "Vidhan Sabha">("Lok Sabha");

  useEffect(() => {
    setMounted(true);
    fetch("/api/states")
      .then((r) => r.json())
      .then((list: CivicStateData[]) => {
        if (Array.isArray(list)) {
          setStates(list);
          if (list.length > 0) {
            const up = list.find((s) => s.slug === "uttar-pradesh") || list[0];
            setSelected(up);
          }
        }
      })
      .catch(() => setStates([]));
  }, []);

  const chartData = selected
    ? [
        { name: "Assembly", seats: selected.totalAssemblySeats || 0 },
        { name: "Lok Sabha", seats: selected.totalLokSabhaSeats || 0 },
      ]
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 w-fit mb-2">
            <MapPin className="h-3.5 w-3.5" /> Geospatial Governance Explorer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            India Political Territory Map
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive federal territory boundaries, ruling administrations, and legislative seat allocations.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1 self-start sm:self-auto">
          <button
            onClick={() => setView("Lok Sabha")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
              view === "Lok Sabha" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lok Sabha View
          </button>
          <button
            onClick={() => setView("Vidhan Sabha")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all min-h-[36px]",
              view === "Vidhan Sabha" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Assembly View
          </button>
        </div>
      </div>

      {/* Map & State Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Interactive Vector Map Canvas */}
        <div className="lg:col-span-2">
          <CivicIndiaMap
            statesData={states}
            selectedSlug={selected?.slug}
            onSelectState={(s) => setSelected(s)}
            viewMetric={view}
            showControls={true}
            showQuickChips={true}
            showCard={false}
            heightClass="h-[460px] sm:h-[520px] lg:h-[580px]"
            ariaLabel="Interactive territory map for India"
          />
        </div>

        {/* Selected State Details Sidebar */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-sm p-6 flex flex-col justify-between space-y-6">
          {selected ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Selected Jurisdiction
                </span>
                <h2 className="text-2xl font-bold text-foreground mt-0.5">{selected.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Capital: <span className="font-medium text-foreground">{selected.capital || "Administrative Center"}</span>
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Ruling Party / Alliance</span>
                  <span className="font-bold text-base text-primary">
                    {selected.rulingParty || "Democratic Council"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Chief Minister / Governance</span>
                  <span className="font-bold text-base text-foreground">
                    {selected.cm || "Governor's Administration"}
                  </span>
                </div>
              </div>

              {/* Bar Chart Representation */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">
                  Legislative Seat Distribution
                </span>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "12px",
                        }}
                      />
                      <Bar dataKey="seats" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Link
                href={`/states/${selected.slug}`}
                className="flex items-center justify-center gap-1.5 w-full min-h-[44px] py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <span>View State Directory</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center p-6 text-muted-foreground text-sm">
              Click any state on the map or use the quick chips above to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

