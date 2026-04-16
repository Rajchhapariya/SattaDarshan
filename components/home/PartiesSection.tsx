"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export function PartiesSection() {
  const [parties,setParties] = useState([]);
  useEffect(()=>{fetch("/api/parties?tier=National&limit=8").then(r=>r.json()).then(d=>setParties(d.parties??[])).catch(()=>{});},[]);
  return (
    <section className="py-14 px-4 bg-gray-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Parties</p><h2 className="text-2xl font-bold text-gray-900">National Parties</h2></div>
          <Link href="/parties" className="text-sm text-indigo-600 font-medium">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {parties.map((p:any)=>(
            <Link key={p.slug} href={"/parties/"+p.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 group flex items-center gap-4">
              {p.logo&&<img src={p.logo} alt={p.abbr||p.name} className="w-10 h-10 object-contain"/>}
              <div>
                <div className="font-bold text-gray-900 group-hover:text-indigo-700">{p.abbr||p.name}</div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.name}</div>
                {p.seatsLokSabha!==undefined&&<div className="text-xs text-orange-600 font-semibold mt-2">{p.seatsLokSabha} LS seats</div>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
