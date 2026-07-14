"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { CommandCenterSection } from "@/components/ui/CommandCenter";

export function FeaturedPoliticians() {
  const [politicians,setPoliticians] = useState([]);
  useEffect(()=>{fetch("/api/politicians?role=PM,CM&limit=8").then(r=>r.json()).then(d=>setPoliticians(d.politicians??[])).catch(()=>{});},[]);
  
  return (
    <CommandCenterSection 
      title="High Profile Entities" 
      subtitle="Key Leadership"
      action={{ label: "Full Index", href: "/politicians" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {politicians.map((p:any)=><PoliticianCard key={p.slug} {...p}/>)}
      </div>
    </CommandCenterSection>
  );
}

