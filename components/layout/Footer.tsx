import Link from "next/link";
import { ShieldCheck, Database, Server, Cpu } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border bg-background mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded border border-primary bg-primary/10">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-bold text-foreground text-sm tracking-tight">SattaDarshan</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            A high-precision, cryptographically verified intelligence ledger tracking the Indian parliamentary matrix. 
            Native source alignment with Government of India domains.
          </p>
        </div>

        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-widest mb-4">Core Directory</h4>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground">
            <li><Link href="/politicians" className="hover:text-primary transition-colors uppercase">Politicians</Link></li>
            <li><Link href="/parties" className="hover:text-primary transition-colors uppercase">Political Index</Link></li>
            <li><Link href="/states" className="hover:text-primary transition-colors uppercase">Regional Jurisdictions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-widest mb-4">Parliament Ledger</h4>
          <ul className="space-y-2 text-xs font-medium text-muted-foreground">
            <li><Link href="/parliament/lok-sabha" className="hover:text-primary transition-colors uppercase">Lok Sabha</Link></li>
            <li><Link href="/parliament/rajya-sabha" className="hover:text-primary transition-colors uppercase">Rajya Sabha</Link></li>
            <li><Link href="/map" className="hover:text-primary transition-colors uppercase">Geospatial Matrix</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-widest mb-4">System Status</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
              <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span>API: Synchronized</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
              <Database className="h-3 w-3" />
              <span>Ledger: Verified</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
              <Cpu className="h-3 w-3" />
              <span>Core: Operational</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border py-6 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
            © {currentYear} SattaDarshan // India // All Rights Reserved
          </p>
          <div className="flex gap-4">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Protocol: v4.0.3-ledger</span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">Hash: 0x8F2A...E9</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
