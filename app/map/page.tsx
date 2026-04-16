"use client";

import { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

type StateInfo = {
  slug: string;
  name: string;
  rulingParty?: string;
  cm?: string;
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
      .then((d) => setStates(d || []))
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
      // Let's set alias maps too
      const alias = Object.keys(aliases).find(k => aliases[k] === s.name.toLowerCase());
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
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">India Political Map</h1>
            <p className="text-sm text-gray-500 mt-1">Interactive state view with ruling party and CM insights.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setView("Lok Sabha")} className={`px-3 py-1.5 rounded-lg text-sm ${view === "Lok Sabha" ? "bg-orange-500 text-white" : "bg-white border border-gray-200"}`}>Lok Sabha</button>
            <button onClick={() => setView("Vidhan Sabha")} className={`px-3 py-1.5 rounded-lg text-sm ${view === "Vidhan Sabha" ? "bg-orange-500 text-white" : "bg-white border border-gray-200"}`}>Vidhan Sabha</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 min-h-[420px]">
            {mounted ? (
              <ComposableMap projection="geoMercator" projectionConfig={{ center: [82, 22], scale: 1000 }}>
                <Geographies geography={INDIA_GEO_URL}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      let rawName = String((geo.properties as any)?.NAME_1 || "").toLowerCase();
                      if ((stateMap as any).fallbackAliases[rawName]) {
                        rawName = (stateMap as any).fallbackAliases[rawName];
                      }
                      const info = stateMap.get(rawName);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          onMouseEnter={() => info && setHovered(info)}
                          onMouseLeave={() => setHovered(null)}
                          onClick={() => info && setSelected(info)}
                          style={{
                            default: { fill: info?.rulingParty ? "#fb923c" : "#d1d5db", stroke: "#fff", strokeWidth: 0.6, outline: "none" },
                            hover: { fill: "#4f46e5", stroke: "#fff", outline: "none" },
                            pressed: { fill: "#1d4ed8", stroke: "#fff", outline: "none" },
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ComposableMap>
            ) : (
              <div className="h-full w-full rounded-2xl bg-gray-100 animate-pulse" />
            )}
          </div>

          <aside className="bg-white rounded-2xl border border-gray-100 p-5">
            {hovered ? (
              <div className="space-y-3 mb-4 p-3 rounded-2xl bg-orange-50 text-orange-900">
                <div className="text-xs uppercase tracking-wide font-semibold">Hover preview</div>
                <div className="text-lg font-semibold">{hovered.name}</div>
                <div className="text-sm text-gray-600">{hovered.rulingParty || "No ruling party data"}</div>
                <div className="text-sm text-gray-600">CM: {hovered.cm || "N/A"}</div>
              </div>
            ) : null}
            {!selected ? (
              <p className="text-sm text-gray-400">Click a state to view party distribution and CM profile.</p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-sm"><span className="text-gray-400">Ruling Party:</span> {selected.rulingParty || "N/A"}</p>
                <p className="text-sm"><span className="text-gray-400">Chief Minister:</span> {selected.cm || "N/A"}</p>
                <div className="h-56">
                  {mounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="seats" fill="#f97316" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full w-full bg-gray-50 rounded-2xl" />
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
