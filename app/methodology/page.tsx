import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Database, ShieldCheck, CheckCircle2, ChevronRight, Landmark } from "lucide-react";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";

export const metadata: Metadata = {
  title: "Data Sources & Editorial Methodology",
  description: "Documentation of statutory data sources, normalization rules, verification workflows, and provenance protocols utilized by SattaDarshan.",
};

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Methodology</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <BookOpen className="h-3.5 w-3.5" /> Research Standards & Provenance
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Data Sources & Editorial Methodology
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan adheres to transparent, structured data collection standards to provide accurate democratic records. This document details our primary statutory sources, ingestion pipelines, normalization procedures, and verification protocols.
        </p>
      </div>

      {/* Data Accuracy Notice */}
      <DataAccuracyNotice variant="detailed" recordType="general" />

      {/* Main Content Sections */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-8 text-sm text-muted-foreground leading-relaxed">
        {/* Source Hierarchy */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            1. Authoritative Source Hierarchy
          </h2>
          <p>
            SattaDarshan compiles data exclusively from publicly available official government archives, parliamentary directories, and statutory gazettes. Our data collection strictly observes the following hierarchy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Parliamentary Secretariats</span>
              <p className="text-xs">
                Member rosters, parliamentary house allocations, committee assignments, and official bulletins directly from <a href="https://sansad.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">Sansad.in</a>, the Lok Sabha Secretariat (<a href="https://loksabha.nic.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">loksabha.nic.in</a>), and the Rajya Sabha Secretariat (<a href="https://rajyasabha.nic.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">rajyasabha.nic.in</a>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Election Commission of India (ECI)</span>
              <p className="text-xs">
                General election outcomes, gazette notifications of elected candidates, political party recognition tiers (National, State, RUPP), and candidate nomination affidavits filed under Form 26 of the Conduct of Elections Rules, 1961 (<a href="https://www.eci.gov.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">eci.gov.in</a>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <span className="font-bold text-foreground text-xs uppercase tracking-wider block">State Government & Legislative Assemblies</span>
              <p className="text-xs">
                Chief Minister notifications, state council of ministers gazettes, assembly compositions, and official state government departmental portals accessible via the National Portal of India (<a href="https://www.india.gov.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">india.gov.in</a>).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 space-y-2">
              <span className="font-bold text-foreground text-xs uppercase tracking-wider block">Open Civic Archives</span>
              <p className="text-xs">
                Public domain portrait photographs under Creative Commons licenses from Wikimedia Commons and official legislative archival repositories.
              </p>
            </div>
          </div>
        </section>

        {/* Normalization & Data Pipeline */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            2. Normalization & Data Processing
          </h2>
          <p>
            Raw legislative records frequently contain varying spelling, honorific prefixes, and differing abbreviations across languages. SattaDarshan processes raw records through a strict normalization pipeline:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs">
            <li>
              <strong>Name Standardization:</strong> Salutations and honorific prefixes (&ldquo;Shri&rdquo;, &ldquo;Smt.&rdquo;, &ldquo;Dr.&rdquo;, &ldquo;Prof.&rdquo;) are parsed separately from legal names to ensure accurate alphabetical indexing and prevent duplicate listings.
            </li>
            <li>
              <strong>Constituency Mapping:</strong> Lok Sabha constituencies are cross-referenced with Delimitation Commission orders to ensure standardized spelling and matching against state jurisdictions.
            </li>
            <li>
              <strong>Affidavit Valuation:</strong> Financial assets and legal disclosures are recorded exactly as sworn by candidates in statutory Form 26 nomination filings, without speculative revaluations.
            </li>
            <li>
              <strong>Alliance Classifications:</strong> National parliamentary coalitions (NDA, INDIA, Regional/Others) reflect formal seating agreements registered with the parliamentary secretariats.
            </li>
          </ul>
        </section>

        {/* Handling Conflicting or Evolving Information */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            3. Treatment of Disputed or Contested Data
          </h2>
          <p>
            In instances of party factional disputes, splits, or contested symbol allocations, SattaDarshan adheres strictly to the official orders and symbol notifications issued by the Election Commission of India and rulings of the respective Legislative Presiding Officers (Speaker of Lok Sabha or Chairman of Rajya Sabha).
          </p>
          <p>
            Unverified allegations, social media speculation, and non-gazetted claims are excluded from public representative profiles.
          </p>
        </section>

        {/* Editorial Review & User Corrections */}
        <section className="space-y-3 border-t border-border/60 pt-4">
          <h2 className="text-base font-bold text-foreground">Editorial Review & Correction Protocols</h2>
          <p>
            Citizens, researchers, and parliamentary staff who discover an outdated portfolio, tenure change, or typographical discrepancy are invited to submit documentation via our reviewed corrections desk.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/corrections"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Report an Inaccuracy or Suggest Correction <ChevronRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/disclaimer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Read Platform Disclaimer <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
