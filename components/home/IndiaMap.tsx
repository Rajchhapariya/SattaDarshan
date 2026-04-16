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
  
  if (!mounted) return <div className="animate-pulse w-full h-[400px] bg-slate-100 rounded-lg flex items-center justify-center"><p className="text-slate-400 font-medium">Loading vector terrain...</p></div>;

  return (
    <div className="w-full h-full min-h-[400px] cursor-crosshair">
      <ComposableMap projection="geoMercator" projectionConfig={{ center: [80, 22], scale: 1000 }} style={{ width: "100%", height: "100%" }}>
        <Geographies geography={INDIA_GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  const stateName = geo.properties.ST_NM || geo.properties.NAME_1;
                  if (stateName) {
                    router.push(`/states/${toSlug(stateName)}`);
                  }
                }}
                style={{
                  default: { fill: "#f1f5f9", stroke: "#cbd5e1", strokeWidth: 0.5, outline: "none", transition: "all 250ms" },
                  hover: { fill: "#6366f1", stroke: "#ffffff", strokeWidth: 1, outline: "none", cursor: "pointer" },
                  pressed: { fill: "#4f46e5", stroke: "#ffffff", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
