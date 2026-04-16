"use client";
import { useEffect, useState } from "react";
export function StatsBar() {
  const [s,setS] = useState({totalPoliticians:0,totalParties:0,totalStates:0,totalMPs:0,totalMinisters:0,totalCMs:0,totalPMs:0});
  useEffect(()=>{fetch("/api/stats").then(r=>r.json()).then(setS).catch(()=>{});},[]);
  const items=[
    {label:"Politicians Tracked",val:s.totalPoliticians},
    {label:"Political Parties",val:s.totalParties},
    {label:"States & UTs",val:s.totalStates},
    {label:"MPs",val:s.totalMPs},
    {label:"Union Ministers",val:s.totalMinisters},
    {label:"Chief Ministers",val:s.totalCMs},
    {label:"Prime Ministers",val:s.totalPMs},
    {label:"Lok Sabha Seats",val:543},
  ];
  return (
    <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {items.map(({label,val})=>(
          <div key={label} className="text-center">
            <div className="text-2xl font-black text-gray-900 dark:text-gray-100">{val.toLocaleString("en-IN")}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
