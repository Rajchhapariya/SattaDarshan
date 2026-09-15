import Link from "next/link";
import { Landmark, ExternalLink, ShieldCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t border-border/80 bg-card mt-20 text-muted-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand & Mission Statement */}
        <div className="col-span-1 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Landmark className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-foreground text-base tracking-tight">
              Satta<span className="text-amber-500">Darshan</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An open civic intelligence platform delivering transparent, structured insights into India’s Parliamentary chambers, political parties, and regional jurisdictions.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="h-4 w-4" /> Official Data Aggregation
          </div>
        </div>

        {/* Directory Links */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Directory</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/politicians" className="hover:text-primary transition-colors">Representatives & Leaders</Link></li>
            <li><Link href="/parties" className="hover:text-primary transition-colors">Political Parties Index</Link></li>
            <li><Link href="/states" className="hover:text-primary transition-colors">States & Union Territories</Link></li>
            <li><Link href="/compare" className="hover:text-primary transition-colors">Politician Comparison Tool</Link></li>
          </ul>
        </div>

        {/* Parliament Modules */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Parliament</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/parliament/lok-sabha" className="hover:text-primary transition-colors">18th Lok Sabha (Lower House)</Link></li>
            <li><Link href="/parliament/rajya-sabha" className="hover:text-primary transition-colors">Rajya Sabha (Upper House)</Link></li>
            <li><Link href="/map" className="hover:text-primary transition-colors">Interactive Geospatial Map</Link></li>
          </ul>
        </div>

        {/* Data Sources & Transparency */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Data Sources</h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Public records synchronized with official gazettes and portals:
          </p>
          <ul className="space-y-1.5 text-xs font-medium">
            <li>
              <a href="https://sansad.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                Parliament of India (Sansad.in) <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://eci.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                Election Commission of India (ECI) <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="border-t border-border/60 py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-muted-foreground">
            © {currentYear} SattaDarshan. Built for civic transparency and democratic education.
          </p>
          <p className="text-muted-foreground">
            Independent platform for Indian legislative research and democratic transparency.
          </p>
        </div>
      </div>
    </footer>
  );
}
