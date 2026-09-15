import { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ShieldAlert, FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Disclaimer & Neutrality Statement",
  description: "Official non-governmental status, independent civic research mission, non-partisan editorial neutrality, and terms of data use for SattaDarshan.",
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Disclaimer</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
          <ShieldAlert className="h-3.5 w-3.5" /> Civic Neutrality & Independence Notice
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Platform Disclaimer & Editorial Policy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan is an independent, non-partisan civic intelligence and open data aggregation platform. Please review the following core statutory notices regarding our content, non-governmental standing, and editorial standards.
        </p>
      </div>

      {/* Structured Notice Sections */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            1. Non-Governmental Standing
          </h2>
          <p>
            SattaDarshan is an independent civic research and democratic information portal. SattaDarshan is <strong>not an official government website</strong>, is not affiliated with, authorized by, sponsored by, or operating on behalf of the Government of India, any State Government, Union Territory administration, or statutory election authority.
          </p>
          <p>
            All parliamentary and legislative symbols, jurisdictional boundaries, and seal silhouettes displayed are strictly for civic education, identification, and public information purposes under fair dealing principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            2. Strict Non-Partisan Political Neutrality
          </h2>
          <p>
            SattaDarshan maintains complete editorial neutrality. The platform does not endorse, support, oppose, finance, or represent any political party, alliance, elected official, legislative candidate, ideology, or political movement.
          </p>
          <p>
            The order of parties, representatives, or states across tables, registries, and geospatial maps is strictly programmatic (alphabetical, seat count descending, or constituency numerical order) and conveys no endorsement or ranking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            3. Dynamic Nature of Political Information
          </h2>
          <p>
            Political status, elected offices, party affiliations, cabinet portfolios, and committee memberships change over time due to elections, cabinet reshuffles, defections, or legal determinations. While SattaDarshan synchronizes with official gazettes and bulletins, information may periodically reflect the latest recorded update rather than real-time parliamentary proceedings.
          </p>
          <p>
            SattaDarshan does not warrant that all records are instantaneously current. Citizens, legal practitioners, and journalists are urged to cross-verify time-sensitive legal or electoral matters against authoritative primary sources.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            4. Informational and Research Purpose Only
          </h2>
          <p>
            The data presented on SattaDarshan is curated solely for educational, academic, journalistic, and democratic awareness purposes. It does not constitute legal advice, electoral advisory, financial counsel, or official government certifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            5. Candidate Affidavits & Third-Party Disclosures
          </h2>
          <p>
            Biographical information, educational qualifications, asset valuations, and criminal case numbers are compiled directly from candidate nomination affidavits filed with the Election Commission of India under Rule 4A of the Conduct of Elections Rules, 1961. These records reflect self-declared candidate submissions as legally provided at the time of nomination.
          </p>
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <h2 className="text-base font-bold text-foreground">Discrepancy Reporting & Corrections</h2>
          <p>
            If you identify an inaccurate seat share, completed term, or misstated party affiliation, you are encouraged to submit a verified correction with supporting official gazette references through our reviewed reporting channel.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/corrections"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Submit an Editorial Correction <ChevronRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              Read Data Methodology <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
