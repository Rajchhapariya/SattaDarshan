import { Metadata } from "next";
import Link from "next/link";
import { Landmark, ExternalLink, ChevronRight, Info, Scale, ShieldCheck } from "lucide-react";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";

export const metadata: Metadata = {
  title: "Platform Disclaimer & Neutrality Statement",
  description:
    "Non-governmental status, independent civic research mission, non-partisan editorial neutrality, and data accuracy notice for SattaDarshan.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/disclaimer",
  },
  openGraph: {
    title: "Platform Disclaimer & Neutrality Statement — SattaDarshan",
    description:
      "Non-governmental status, independent civic research mission, non-partisan editorial neutrality, and data accuracy notice for SattaDarshan.",
    url: "https://satta-darshan-7jgo.vercel.app/disclaimer",
  },
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Landmark className="h-3.5 w-3.5" /> Civic Neutrality & Independence Notice
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Platform Disclaimer & Editorial Policy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan is an independent, non-partisan civic intelligence and open data platform. Please review the following core notices regarding our content, non-governmental standing, data accuracy, and editorial standards.
        </p>
      </div>

      {/* Data Accuracy Notice Callout */}
      <DataAccuracyNotice variant="detailed" recordType="general" />

      {/* Structured Notice Sections */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            1. Independent, Non-Governmental Standing
          </h2>
          <p>
            <strong>SattaDarshan is an independent, non-government website.</strong> This website is not affiliated with, operated by, maintained by, endorsed by, sponsored by, or officially connected to the Government of India, Parliament of India, Lok Sabha, Rajya Sabha, Election Commission of India, any State Government, Union Territory Administration, political party, or any constitutional or statutory authority.
          </p>
          <p>
            <strong>SattaDarshan does not replace official government websites.</strong> All parliamentary and legislative symbols, jurisdictional boundaries, and seal silhouettes displayed are strictly for civic education, identification, and public information purposes under fair dealing principles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            2. Strict Political Neutrality
          </h2>
          <p>
            SattaDarshan maintains strict political neutrality. SattaDarshan:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>Does not endorse, support, or oppose any political party</li>
            <li>Does not endorse or oppose candidates or elected officials</li>
            <li>Does not represent any political organization, campaign, or ideology</li>
            <li>Does not provide official governmental advice or legal counsel</li>
            <li>Does not issue government credentials or certificates</li>
            <li>Does not replace official government records</li>
          </ul>
          <p className="text-xs">
            The order of parties, representatives, or states across tables, registries, and geospatial maps is programmatic (alphabetical, seat count descending, or constituency numerical order) and conveys no endorsement or ranking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            3. Dynamic Nature of Political Information
          </h2>
          <p>
            We make every reasonable effort to maintain accurate and current information, but political and electoral records can change over time and occasional delays or inaccuracies may occur. While SattaDarshan regularly synchronizes with publicly available official sources, records may periodically reflect the latest recorded update rather than real-time parliamentary proceedings.
          </p>
          <p>
            Citizens, legal practitioners, and researchers are encouraged to cross-verify time-sensitive legal or electoral matters against authoritative primary sources.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            4. Informational and Research Purpose Only
          </h2>
          <p>
            The data presented on SattaDarshan is curated solely for educational, academic, journalistic, and democratic awareness purposes. It does not constitute legal advice, electoral advisory, financial counsel, or official government certifications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            5. Candidate Affidavits & Third-Party Disclosures
          </h2>
          <p>
            Biographical information, educational qualifications, asset valuations, and criminal case counts are compiled directly from candidate nomination affidavits filed with the Election Commission of India under Rule 4A of the Conduct of Elections Rules, 1961. These records reflect self-declared candidate submissions as legally provided at the time of nomination.
          </p>
        </section>

        {/* Directory of Authoritative Official Sources */}
        <section className="space-y-3 border-t border-border/60 pt-4">
          <h2 className="text-base font-bold text-foreground">Authoritative Official Sources Directory</h2>
          <p className="text-xs">
            For official, statutory, and legally certified information, please refer directly to the respective official portals:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
            <a
              href="https://sansad.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors font-semibold"
            >
              <span>Parliament of India (Sansad.in)</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a
              href="https://www.eci.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors font-semibold"
            >
              <span>Election Commission of India</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a
              href="https://loksabha.nic.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors font-semibold"
            >
              <span>Lok Sabha (Official Secretariat)</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a
              href="https://rajyasabha.nic.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors font-semibold"
            >
              <span>Rajya Sabha (Official Secretariat)</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
            <a
              href="https://www.india.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 rounded-xl border border-border/70 bg-muted/20 hover:bg-muted text-foreground transition-colors font-semibold sm:col-span-2"
            >
              <span>National Portal of India (State & UT Portals)</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </a>
          </div>
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <h2 className="text-base font-bold text-foreground">Discrepancy Reporting & Corrections</h2>
          <p>
            If you identify an inaccurate seat share, completed term, or misstated party affiliation, please report it through our reviewed reporting channel so we can verify and update the record.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              href="/corrections"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              Submit a Correction Notice <ChevronRight className="h-3.5 w-3.5" />
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
