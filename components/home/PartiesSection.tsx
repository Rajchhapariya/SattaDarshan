"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CommandCenterSection } from "@/components/ui/CommandCenter";

export function PartiesSection() {
  const [parties,setParties] = useState([]);
  useEffect(()=>{fetch("/api/parties?tier=National&limit=8").then(r=>r.json()).then(d=>setParties(d.parties??[])).catch(()=>{});},[]);
  
  return (
    <CommandCenterSection 
      title="Political Formations" 
      subtitle="National Organizations"
      action={{ label: "Access Index", href: "/parties" }}
      className="pb-24"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {parties.map((p:any)=>(
          <Link 
            key={p.slug} 
            href={`/parties/${p.slug}`} 
            className="bg-background border border-border p-5 group flex items-center gap-4 hover:border-primary/50 transition-all"
          >
            {p.logo && (
              <div className="w-10 h-10 rounded border border-border p-1 bg-muted/30 grayscale group-hover:grayscale-0 transition-all flex items-center justify-center">
                <Image 
                  src={p.logo} 
                  alt={p.abbr || p.name} 
                  width={32} 
                  height={32} 
                  className="object-contain"
                />
              </div>
            )}
            <div>
              <div className="font-black text-sm text-foreground group-hover:text-primary transition-colors tracking-tight uppercase">
                {p.abbr || p.name.substring(0, 4)}
              </div>
              {p.seatsLokSabha !== undefined && (
                <div className="text-[10px] font-mono font-bold text-primary mt-0.5 uppercase tracking-widest">
                  {p.seatsLokSabha} LS_SEATS
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </CommandCenterSection>
  );
}

