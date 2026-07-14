"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Ledger, 
  LedgerHeader, 
  LedgerControls, 
  LedgerViewToggle, 
  LedgerContent, 
  LedgerFooter 
} from "@/components/ui/Ledger";
import { StateIcon } from "@/components/ui/StateIcon";
import { StateTable } from "@/components/state/StateTable";
import { Map as MapIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatesClient({ initialStates }: { initialStates: any[] }) {
  const [view, setView] = useState<'grid' | 'table'>('grid');
  
  return (
    <Ledger>
      <LedgerHeader
        title="States & UTs Registry"
        subtitle="Authorized index of sub-national administrative divisions. Data includes seat distribution for both Union and State legislatures."
        badge="Regional Jurisdictions"
        icon={<MapIcon className="h-3 w-3" />}
        stats={[{ label: "Total Entities", value: initialStates.length }]}
      />

      <LedgerControls>
        <div className="flex-1" />
        <LedgerViewToggle view={view} onViewChange={setView} />
      </LedgerControls>

      <LedgerContent>
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialStates.map((s: any) => (
              <Link 
                key={s.slug} 
                href={`/states/${s.slug}`} 
                className="group relative flex flex-col bg-background border border-border rounded-md p-6 transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="h-12 w-12 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary transition-colors">
                    <StateIcon stateName={s.name} statePath={s.statePath} className="w-12 h-12" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors mt-1" />
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="font-black text-lg text-foreground tracking-tight group-hover:text-primary transition-colors uppercase">
                    {s.name}
                  </h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {s.type || "State"} {'//'} {s.region || "Registry Entry"}
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Lok Sabha</p>
                    <p className="text-sm font-black font-mono text-foreground">
                      {s.totalLokSabhaSeats?.toString().padStart(2, '0') || "00"} <span className="text-[10px] font-medium text-muted-foreground">SEATS</span>
                    </p>
                  </div>
                  <div className="space-y-0.5 border-l border-border/50 pl-4">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Assembly</p>
                    <p className="text-sm font-black font-mono text-foreground">
                      {s.totalAssemblySeats?.toString().padStart(2, '0') || "00"} <span className="text-[10px] font-medium text-muted-foreground">SEATS</span>
                    </p>
                  </div>
                </div>
                
                {/* Visual protocol accent */}
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors" />
              </Link>
            ))}
          </div>
        ) : (
          <StateTable data={initialStates} />
        )}
      </LedgerContent>

      <LedgerFooter label="Ledger Status: Verified" />
    </Ledger>
  );
}
