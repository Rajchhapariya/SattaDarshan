"use client";
import { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { useRouter } from "next/navigation";

const INDIA_GEO_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function IndiaMap() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);
  
  if (!mounted) return <div className="animate-pulse w-full h-[400px] bg-muted rounded-md flex items-center justify-center"><p className="text-muted-foreground font-mono text-[10px] font-bold uppercase tracking-widest">Initialising Vector Terrain...</p></div>;

  return (
    <div className="w-full h-full min-h-[400px] cursor-crosshair bg-background relative overflow-hidden group">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
        <div className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] bg-background/80 backdrop-blur-sm px-1.5 py-0.5 border border-border">Coord_System: Mercator</div>
        <div className="text-[8px] font-mono font-bold text-primary uppercase tracking-[0.2em] bg-background/80 backdrop-blur-sm px-1.5 py-0.5 border border-primary/20 flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" /> Live_Telemetry
        </div>
      </div>
      
      <div className="relative z-10 w-full h-full p-4 lg:p-8">
        <ComposableMap projection="geoMercator" projectionConfig={{ center: [82, 22], scale: 1000 }} style={{ width: "100%", height: "100%" }}>
          <Geographies geography={INDIA_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    const stateName = geo.properties.ST_NM || geo.properties.NAME_1;
                    if (stateName) {
                      let slug = toSlug(stateName);
                      // Handle map-to-database slug mismatches
                      if (slug === "jammu-and-kashmir") slug = "jammu-kashmir";
                      
                      router.push(`/states/${slug}`);
                    }
                  }}
                  style={{
                    default: { 
                      fill: "transparent", 
                      stroke: "hsl(var(--border))", 
                      strokeWidth: 0.75, 
                      outline: "none", 
                      transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)" 
                    },
                    hover: { 
                      fill: "hsl(var(--primary) / 0.1)", 
                      stroke: "hsl(var(--primary))", 
                      strokeWidth: 1.5, 
                      outline: "none", 
                      cursor: "pointer" 
                    },
                    pressed: { 
                      fill: "hsl(var(--primary) / 0.3)", 
                      stroke: "hsl(var(--primary))", 
                      outline: "none" 
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
      
      <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-[8px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-background/80 backdrop-blur-sm px-2 py-1 border border-border">
          Target: State_Node_Scan
        </div>
      </div>
    </div>
  );
}

