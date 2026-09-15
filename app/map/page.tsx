"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import Link from "next/link";
import { MapPin, Landmark, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StateInfo = {
  slug: string;
  name: string;
  rulingParty?: string;
  cm?: string;
  capital?: string;
  totalAssemblySeats?: number;
  totalLokSabhaSeats?: number;
};

const INDIA_GEO_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

export default function IndiaMapPage() {
  const [states, setStates] = useState<StateInfo[]>([]);
  const [selected, setSelected] = useState<StateInfo | null>(null);
  const [hovered, setHovered] = useState<StateInfo | null>(null);
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<"Lok Sabha" | "Vidhan Sabha">("Lok Sabha");

  useEffect(() => {
    setMounted(true);
    fetch("/api/states")
      .then((r) => r.json())
      .then((d) => {
        const list = d || [];
        setStates(list);
        if (list.length > 0) {
          const up = list.find((s: any) => s.slug === "uttar-pradesh") || list[0];
          setSelected(up);
        }
      })
      .catch(() => setStates([]));
  }, []);

  const stateMap = useMemo(() => {
    const map = new Map<string, StateInfo>();
    const aliases: Record<string, string> = {
      "uttaranchal": "uttarakhand",
      "orissa": "odisha",
      "telengana": "telangana",
      "nct of delhi": "delhi",
      "andaman and nicobar": "andaman-and-nicobar-islands",
      "dadra and nagar haveli": "dadra-and-nagar-haveli"
    };

    states.forEach((s) => {
      map.set(s.name.toLowerCase(), s);
      const alias = Object.keys(aliases).find((k) => aliases[k] === s.name.toLowerCase());
      if (alias) map.set(alias, s);
    });
    return Object.assign(map, { fallbackAliases: aliases });
  }, [states]);

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
            Interactive state boundaries, ruling administration, and legislative seat shares.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-1 self-start sm:self-auto">
          <button
            onClick={() => setView("Lok Sabha")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              view === "Lok Sabha" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Lok Sabha View
          </button>
          <button
            onClick={() => setView("Vidhan Sabha")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
              view === "Vidhan Sabha" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Assembly View
          </button>
        </div>
      </div>

      {/* Map & State Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Vector Map Canvas */}
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border/80 shadow-sm p-4 sm:p-6 min-h-[440px] flex items-center justify-center">
          {mounted ? (
            <ComposableMap projection="geoMercator" projectionConfig={{ center: [82, 22], scale: 1000 }} className="w-full h-full max-w-2xl">
              <Geographies geography={INDIA_GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    let rawName = String((geo.properties as any)?.NAME_1 || "").toLowerCase();
                    if ((stateMap as any).fallbackAliases[rawName]) {
                      rawName = (stateMap as any).fallbackAliases[rawName];
                    }
                    const info = stateMap.get(rawName);
                    const isSelected = selected && selected.name.toLowerCase() === rawName;

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onMouseEnter={() => info && setHovered(info)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => info && setSelected(info)}
                        style={{
                          default: {
                            fill: isSelected
                              ? "hsl(var(--primary))"
                              : info?.rulingParty
                              ? "hsl(var(--primary) / 0.25)"
                              : "hsl(var(--muted))",
                            stroke: "hsl(var(--border))",
                            strokeWidth: 0.8,
                            outline: "none",
                            cursor: "pointer",
                            transition: "all 200ms ease",
                          },
                          hover: {
                            fill: "hsl(var(--primary) / 0.6)",
                            stroke: "hsl(var(--foreground))",
                            strokeWidth: 1.5,
                            outline: "none",
                            cursor: "pointer",
                          },
                          pressed: {
                            fill: "hsl(var(--primary))",
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          ) : (
            <div className="h-full w-full rounded-2xl bg-muted/40 animate-pulse" />
          )}
        </div>

        {/* Selected State Details Sidebar */}
        <div className="rounded-3xl bg-card border border-border/80 shadow-sm p-6 flex flex-col justify-between space-y-6">
          {selected ? (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Selected Territory</span>
                <h2 className="text-2xl font-bold text-foreground mt-0.5">{selected.name}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Capital: {selected.capital || "Administrative Center"}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Ruling Party / Alliance</span>
                  <span className="font-bold text-base text-primary">{selected.rulingParty || "Democratic Council"}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60">
                  <span className="text-xs text-muted-foreground block">Chief Minister</span>
                  <span className="font-bold text-base text-foreground">{selected.cm || "Governor's Administration"}</span>
                </div>
              </div>

              {/* Bar Chart Representation */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Seats Distribution</span>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "12px" }} />
                      <Bar dataKey="seats" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <Link
                href={`/states/${selected.slug}`}
                className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                View State MPs & Leaders <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-6 text-muted-foreground">
              Click any state on the map to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
