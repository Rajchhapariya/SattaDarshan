"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const INDIA_GEO_URL = "https://raw.githubusercontent.com/geohacker/india/master/state/india_telengana.geojson";

// Standardize aliases for reliable State Map highlighting
const aliases: Record<string, string> = {
  "uttaranchal": "uttarakhand",
  "orissa": "odisha",
  "telengana": "telangana",
  "nct of delhi": "delhi",
  "andaman and nicobar": "andaman-and-nicobar-islands",
  "dadra and nagar haveli": "dadra-and-nagar-haveli"
};

export function StateMap({ stateName, slug }: { stateName: string, slug: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const highlightedRawNames = useMemo(() => {
    // We want to find which GeoJSON NAME_1 maps to our State slug
    let targets = [stateName.toLowerCase(), slug.toLowerCase()];
    // If our slug is an alias target (e.g. odisha), we must highlight the source (orissa)
    const reverseAlias = Object.keys(aliases).find(k => aliases[k] === slug);
    if (reverseAlias) targets.push(reverseAlias);
    return targets;
  }, [stateName, slug]);

  if (!mounted) return <div className="w-full aspect-[4/3] max-h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-2xl" />;

  return (
    <div className="w-full bg-orange-50 dark:bg-gray-900 border border-orange-100 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-sm">
        <ComposableMap projection="geoMercator" projectionConfig={{ center: [82, 22], scale: 800 }}>
          <Geographies geography={INDIA_GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const rawName = String((geo.properties as any)?.NAME_1 || "").toLowerCase();
                const isTarget = highlightedRawNames.includes(rawName);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { 
                        fill: isTarget ? "#f97316" : "#e5e7eb", // orange-500 vs gray-200
                        stroke: "#ffffff", 
                        strokeWidth: 0.5, 
                        outline: "none" 
                      },
                      hover: { 
                        fill: isTarget ? "#ea580c" : "#e5e7eb",
                        stroke: "#ffffff", 
                        outline: "none" 
                      },
                      pressed: { 
                        fill: isTarget ? "#c2410c" : "#e5e7eb",
                        stroke: "#ffffff", 
                        outline: "none" 
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-950/90 backdrop-blur text-xs font-semibold px-3 py-1.5 rounded-full text-orange-700 dark:text-orange-400 shadow-sm">
        {stateName} Highlighted
      </div>
    </div>
  );
}
