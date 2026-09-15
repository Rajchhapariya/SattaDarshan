"use client";

import Link from "next/link";
import { Landmark, ExternalLink, ShieldAlert, FileCheck } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const handleOpenDisclaimer = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("reopen-disclaimer-modal"));
    }
  };
  
  return (
    <footer className="w-full border-t border-border/80 bg-card mt-20 text-muted-foreground">
      {/* Prominent Non-Government Notice Ribbon */}
      <div className="border-b border-border/60 bg-muted/40 py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-center sm:text-left">
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <ShieldAlert className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <span>SattaDarshan is an independent, non-government website and is not affiliated with or endorsed by any government institution or political organization.</span>
          </div>
          <button
            type="button"
            onClick={handleOpenDisclaimer}
            className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
          >
            Review Platform Notice →
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
        {/* Brand & Mission Statement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm">
              <Landmark className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-foreground text-base tracking-tight">
              Satta<span className="text-amber-500">Darshan</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An open civic information platform presenting structured, publicly available data on Indian parliamentary chambers, political parties, and regional jurisdictions.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> Independent Research Platform
          </div>
        </div>

        {/* Directory Links */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Directory</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li><Link href="/politicians" className="hover:text-primary transition-colors">Representatives & Leaders</Link></li>
            <li><Link href="/parties" className="hover:text-primary transition-colors">Political Parties Index</Link></li>
            <li><Link href="/states" className="hover:text-primary transition-colors">States & Union Territories</Link></li>
            <li><Link href="/parliament/lok-sabha" className="hover:text-primary transition-colors">18th Lok Sabha</Link></li>
            <li><Link href="/parliament/rajya-sabha" className="hover:text-primary transition-colors">Rajya Sabha</Link></li>
            <li><Link href="/compare" className="hover:text-primary transition-colors">Comparison Tool</Link></li>
            <li><Link href="/map" className="hover:text-primary transition-colors">Interactive Map</Link></li>
          </ul>
        </div>

        {/* Official Primary Sources */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Official Primary Sources</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <a href="https://sansad.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-primary transition-colors">
                <span>Parliament of India (Sansad.in)</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://loksabha.nic.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-primary transition-colors">
                <span>Lok Sabha (Official)</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://rajyasabha.nic.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-primary transition-colors">
                <span>Rajya Sabha (Official)</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://www.eci.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-primary transition-colors">
                <span>Election Commission of India</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
            <li>
              <a href="https://www.india.gov.in" target="_blank" rel="noreferrer" className="flex items-center justify-between hover:text-primary transition-colors">
                <span>National Portal of India</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        {/* Transparency & Legal Pages */}
        <div>
          <h4 className="text-foreground text-xs font-bold uppercase tracking-wider mb-3">Transparency & Legal</h4>
          <ul className="space-y-2 text-xs font-medium">
            <li>
              <button 
                type="button" 
                onClick={handleOpenDisclaimer} 
                className="hover:text-primary transition-colors text-left font-semibold text-foreground"
              >
                Important Notice (Disclaimer)
              </button>
            </li>
            <li><Link href="/disclaimer" className="hover:text-primary transition-colors">Full Platform Disclaimer</Link></li>
            <li><Link href="/methodology" className="hover:text-primary transition-colors">Sources & Methodology</Link></li>
            <li><Link href="/corrections" className="hover:text-primary transition-colors font-semibold text-primary">Report an Inaccuracy</Link></li>
            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Use</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact & Inquiries</Link></li>
          </ul>
        </div>
      </div>
      
      {/* Bottom Copyright Bar */}
      <div className="border-t border-border/60 py-6 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-muted-foreground">
            © {currentYear} SattaDarshan. Public informational and civic research directory.
          </p>
          <p className="text-muted-foreground text-center md:text-right max-w-xl">
            SattaDarshan is an independent, non-government website and is not affiliated with or endorsed by any government institution or political organization.
          </p>
        </div>
      </div>
    </footer>
  );
}
