"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
export function FeaturedPoliticians() {
  const [politicians,setPoliticians] = useState([]);
  useEffect(()=>{fetch("/api/politicians?role=PM,CM&limit=8").then(r=>r.json()).then(d=>setPoliticians(d.politicians??[])).catch(()=>{});},[]);
  return (
    <section className="py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div><p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-1">Featured</p><h2 className="text-2xl font-bold text-gray-900">Key Leaders</h2></div>
          <Link href="/politicians" className="text-sm text-orange-600 font-medium hover:text-orange-700">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {politicians.map((p:any)=><PoliticianCard key={p.slug} {...p}/>)}
        </div>
      </div>
    </section>
  );
}
