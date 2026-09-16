"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Minus, RotateCcw, MapPin, ChevronRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export type CivicStateData = {
  slug: string;
  name: string;
  capital?: string;
  region?: string;
  rulingParty?: string;
  rulingPartySlug?: string;
  cm?: string;
  cmSlug?: string;
  totalAssemblySeats?: number;
  totalLokSabhaSeats?: number;
};

export type CivicIndiaMapProps = {
  statesData?: CivicStateData[];
  selectedSlug?: string | null;
  onSelectState?: (state: CivicStateData) => void;
  className?: string;
  showControls?: boolean;
  showQuickChips?: boolean;
  showCard?: boolean;
  viewMetric?: "default" | "Lok Sabha" | "Vidhan Sabha";
  heightClass?: string;
  ariaLabel?: string;
};

const LOCAL_GEO_URL = "/data/india-states.geojson";

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

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// Compact jurisdictions that benefit from quick-selection chips on mobile/desktop
const COMPACT_TERRITORIES = [
  { name: "Delhi", slug: "delhi" },
  { name: "Goa", slug: "goa" },
  { name: "Puducherry", slug: "puducherry" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Sikkim", slug: "sikkim" },
  { name: "Andaman & Nicobar", slug: "andaman-nicobar" },
  { name: "Dadra & DNH", slug: "dadra-nagar-haveli" },
  { name: "Lakshadweep", slug: "lakshadweep" },
];

export function CivicIndiaMap({
  statesData,
  selectedSlug,
  onSelectState,
  className,
  showControls = true,
  showQuickChips = true,
  showCard = true,
  viewMetric = "default",
  heightClass = "h-[440px] sm:h-[500px] lg:h-[540px]",
  ariaLabel = "Interactive India Administrative Map",
}: CivicIndiaMapProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fetchedStates, setFetchedStates] = useState<CivicStateData[]>([]);
  const [hovered, setHovered] = useState<CivicStateData | null>(null);
  const [activeState, setActiveState] = useState<CivicStateData | null>(null);

  // Zoom & Pan state
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [82, 22],
    zoom: 1,
  });

  useEffect(() => {
    setMounted(true);
    if (!statesData || statesData.length === 0) {
      fetch("/api/states")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setFetchedStates(data);
        })
        .catch(() => {});
    }
  }, [statesData]);

  const allStates = statesData && statesData.length > 0 ? statesData : fetchedStates;

  // Map state info by slug and name
  const stateLookup = useMemo(() => {
    const map = new Map<string, CivicStateData>();
    allStates.forEach((s) => {
      map.set(s.slug, s);
      map.set(s.name.toLowerCase().trim(), s);
    });
    return map;
  }, [allStates]);

  // Sync selectedSlug with activeState
  useEffect(() => {
    if (selectedSlug) {
      const match = stateLookup.get(selectedSlug);
      if (match) setActiveState(match);
    }
  }, [selectedSlug, stateLookup]);

  const handleZoomIn = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.min(prev.zoom * 1.35, 4.5),
    }));
  };

  const handleZoomOut = () => {
    setPosition((prev) => ({
      ...prev,
      zoom: Math.max(prev.zoom / 1.35, 1),
    }));
  };

  const handleResetZoom = () => {
    setPosition({ coordinates: [82, 22], zoom: 1 });
  };

  const handleSelect = useCallback(
    (state: CivicStateData) => {
      setActiveState(state);
      if (onSelectState) {
        onSelectState(state);
      } else {
        router.push(`/states/${state.slug}`);
      }
    },
    [onSelectState, router]
  );

  const displayedState = hovered || activeState;

  if (!mounted) {
    return (
      <div className={cn("w-full bg-muted/20 rounded-3xl flex items-center justify-center border border-border/70", heightClass, className)}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs">Loading geographic jurisdictions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full rounded-3xl bg-card border border-border/80 shadow-sm overflow-hidden flex flex-col", className)}>
      {/* Map Interactive Canvas */}
      <div className={cn("relative w-full overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-card via-background to-muted/10", heightClass)}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [82, 22], scale: 950 }}
          className="w-full h-full max-w-3xl select-none"
          aria-label={ariaLabel}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            minZoom={1}
            maxZoom={4.5}
            onMoveEnd={(pos) => setPosition(pos)}
          >
            <Geographies geography={LOCAL_GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const rawName = String(geo.properties.ST_NM || geo.properties.NAME_1 || "").trim();
                  const cleanKey = rawName.toLowerCase();
                  const mappedSlug = STATE_GEO_MAP[cleanKey] || STATE_GEO_MAP[toSlug(rawName)] || toSlug(rawName);
                  const info = stateLookup.get(mappedSlug) || stateLookup.get(cleanKey);
                  const isSelected = (activeState && activeState.slug === mappedSlug) || (selectedSlug && selectedSlug === mappedSlug);

                  // Calculate metric color if requested
                  let fillColor = "hsl(var(--muted))";
                  if (isSelected) {
                    fillColor = "hsl(var(--primary))";
                  } else if (viewMetric === "Lok Sabha" && info?.totalLokSabhaSeats) {
                    // Graduated primary tint based on Lok Sabha seats (1 to 80)
                    const opacity = Math.min(Math.max(info.totalLokSabhaSeats / 80, 0.15), 0.7);
                    fillColor = `hsl(var(--primary) / ${opacity.toFixed(2)})`;
                  } else if (viewMetric === "Vidhan Sabha" && info?.totalAssemblySeats) {
                    // Graduated primary tint based on Assembly seats (30 to 403)
                    const opacity = Math.min(Math.max(info.totalAssemblySeats / 403, 0.15), 0.7);
                    fillColor = `hsl(var(--primary) / ${opacity.toFixed(2)})`;
                  } else if (info?.rulingParty) {
                    fillColor = "hsl(var(--primary) / 0.18)";
                  }

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (info) {
                          setHovered(info);
                        } else {
                          setHovered({
                            name: rawName,
                            slug: mappedSlug,
                          });
                        }
                      }}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        if (info) {
                          handleSelect(info);
                        } else {
                          handleSelect({ name: rawName, slug: mappedSlug });
                        }
                      }}
                      style={{
                        default: {
                          fill: fillColor,
                          stroke: "hsl(var(--border))",
                          strokeWidth: 0.8,
                          outline: "none",
                          transition: "fill 150ms ease, stroke 150ms ease",
                          cursor: "pointer",
                        },
                        hover: {
                          fill: isSelected ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.45)",
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 1.6,
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: {
                          fill: "hsl(var(--primary) / 0.7)",
                          stroke: "hsl(var(--primary))",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Map Floating Zoom Controls */}
        {showControls && (
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col gap-1.5 bg-card/90 backdrop-blur-md p-1.5 rounded-2xl border border-border/80 shadow-md z-10">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom in map"
              title="Zoom In"
              className="h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl bg-background border border-border/70 text-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom out map"
              title="Zoom Out"
              className="h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl bg-background border border-border/70 text-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              aria-label="Reset map view"
              title="Reset View"
              className="h-11 w-11 sm:h-9 sm:w-9 flex items-center justify-center rounded-xl bg-background border border-border/70 text-foreground hover:bg-primary/10 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Floating Details Preview Card (Desktop & Mobile) */}
        {showCard && displayedState && (
          <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:w-80 p-4 rounded-2xl bg-card/95 backdrop-blur-md border border-border/90 shadow-xl z-10 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-primary tracking-wider">
                  <MapPin className="h-3 w-3" /> Jurisdiction
                </div>
                <h4 className="font-bold text-base text-foreground truncate">{displayedState.name}</h4>
                {displayedState.capital && (
                  <p className="text-xs text-muted-foreground truncate">
                    Capital: <span className="font-medium text-foreground">{displayedState.capital}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-border/60 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Lok Sabha</span>
                <span className="font-bold text-foreground">{displayedState.totalLokSabhaSeats ?? 0} Seats</span>
              </div>
              <div className="border-l border-border/60 pl-2">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Assembly</span>
                <span className="font-bold text-foreground">{displayedState.totalAssemblySeats ?? 0} Seats</span>
              </div>
            </div>

            {displayedState.cm && (
              <p className="text-xs text-muted-foreground mt-2 truncate">
                Chief Minister: <span className="font-medium text-foreground">{displayedState.cm}</span>
              </p>
            )}

            {displayedState.rulingParty && (
              <p className="text-xs text-muted-foreground mt-1 truncate">
                Administration: <span className="font-semibold text-primary">{displayedState.rulingParty}</span>
              </p>
            )}

            <Link
              href={`/states/${displayedState.slug}`}
              className="mt-3 flex items-center justify-center gap-1.5 w-full min-h-[44px] py-2 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              <span>Explore State Directory</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Quick Select Chips for Small UTs & Compact States */}
      {showQuickChips && (
        <div className="p-3 sm:p-4 bg-muted/20 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Compact Jurisdictions & UTs:
            </span>
            <Link
              href="/states"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              All 36 Jurisdictions <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {COMPACT_TERRITORIES.map((item) => {
              const isActive = (activeState && activeState.slug === item.slug) || selectedSlug === item.slug;
              return (
                <button
                  key={item.slug}
                  onClick={() => {
                    const match = stateLookup.get(item.slug);
                    if (match) {
                      handleSelect(match);
                    } else {
                      handleSelect({ name: item.name, slug: item.slug });
                    }
                  }}
                  className={cn(
                    "min-h-[36px] sm:min-h-[32px] px-2.5 py-1 rounded-xl text-xs font-medium transition-all border",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border/80 hover:border-primary/50 hover:text-primary"
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
