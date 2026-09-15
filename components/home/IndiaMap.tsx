"use client";

import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, ChevronRight, Users, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

const INDIA_GEO_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

type HoveredState = {
  name: string;
  slug: string;
  rulingParty?: string;
  cm?: string;
};

const STATE_GEO_MAP: Record<string, string> = {
  "andaman and nicobar": "andaman-nicobar",
  "andaman and nicobar islands": "andaman-nicobar",
  "andaman & nicobar": "andaman-nicobar",
  "dadra and nagar haveli": "dadra-nagar-haveli",
  "daman and diu": "dadra-nagar-haveli",
  "dadra and nagar haveli and daman and diu": "dadra-nagar-haveli",
  "jammu and kashmir": "jammu-kashmir",
  "jammu & kashmir": "jammu-kashmir",
  "nct of delhi": "delhi",
  "delhi": "delhi",
  "telengana": "telangana",
  "orissa": "odisha",
  "uttaranchal": "uttarakhand",
  "pondicherry": "puducherry",
};

export function IndiaMap() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<HoveredState | null>(null);
  const [stateInfoMap, setStateInfoMap] = useState<Record<string, any>>({});
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    fetch("/api/states")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, any> = {};
        (data || []).forEach((s: any) => {
          map[s.slug] = s;
          map[s.name.toLowerCase()] = s;
        });
        setStateInfoMap(map);
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[450px] bg-muted/30 rounded-2xl flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden">
      {/* Map Header */}
      <div className="p-4 sm:p-6 border-b border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <MapPin className="h-3 w-3" /> Territorial Governance
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              36 States & UTs
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-1">
            Interactive State & Jurisdiction Map
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Hover or tap any state to inspect regional administration, leadership, and parliamentary seats
          </p>
        </div>

        <Link
          href="/states"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          View All States <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-card to-background">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82, 22], scale: 950 }}
          className="w-full h-full max-w-3xl"
        >
          <Geographies geography={INDIA_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rawName = geo.properties.ST_NM || geo.properties.NAME_1 || "";
                const cleanKey = rawName.toLowerCase().trim();
                const mappedSlug = STATE_GEO_MAP[cleanKey] || STATE_GEO_MAP[toSlug(rawName)];
                const info = stateInfoMap[mappedSlug || ""] || stateInfoMap[toSlug(rawName)] || stateInfoMap[cleanKey];
                const finalSlug = info?.slug || mappedSlug || toSlug(rawName);

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => {
                      setHovered({
                        name: info?.name || rawName,
                        slug: finalSlug,
                        rulingParty: info?.rulingParty,
                        cm: info?.cm,
                      });
                    }}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => {
                      router.push(`/states/${finalSlug}`);
                    }}
                    style={{
                      default: {
                        fill: "hsl(var(--muted))",
                        stroke: "hsl(var(--border))",
                        strokeWidth: 0.8,
                        outline: "none",
                        transition: "all 200ms ease",
                        cursor: "pointer",
                      },
                      hover: {
                        fill: "hsl(var(--primary) / 0.35)",
                        stroke: "hsl(var(--primary))",
                        strokeWidth: 1.6,
                        outline: "none",
                        cursor: "pointer",
                      },
                      pressed: {
                        fill: "hsl(var(--primary) / 0.6)",
                        stroke: "hsl(var(--primary))",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {/* Hover / Touch State Preview Card */}
        {hovered && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-foreground">{hovered.name}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ruling Party: <span className="font-semibold text-primary">{hovered.rulingParty || "Democratic Council"}</span>
                </p>
                {hovered.cm && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chief Minister: <span className="font-medium text-foreground">{hovered.cm}</span>
                  </p>
                )}
              </div>
            </div>
            <Link
              href={`/states/${hovered.slug}`}
              className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              Explore State Details <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Quick Tap Fallback Chips */}
      <div className="p-3 sm:p-4 bg-muted/20 border-t border-border/60">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Popular Jurisdictions:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {[
            { name: "Uttar Pradesh", slug: "uttar-pradesh" },
            { name: "Maharashtra", slug: "maharashtra" },
            { name: "West Bengal", slug: "west-bengal" },
            { name: "Bihar", slug: "bihar" },
            { name: "Tamil Nadu", slug: "tamil-nadu" },
            { name: "Karnataka", slug: "karnataka" },
            { name: "Gujarat", slug: "gujarat" },
            { name: "Delhi", slug: "delhi" },
          ].map((s) => (
            <Link
              key={s.slug}
              href={`/states/${s.slug}`}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border/70 hover:border-primary/50 hover:text-primary transition-colors"
            >
              {s.name}
            </Link>
          ))}
          <Link
            href="/states"
            className="px-2.5 py-1 rounded-lg text-xs font-semibold text-primary hover:underline"
          >
            View All 36 States
          </Link>
        </div>
      </div>
    </div>
  );
}
