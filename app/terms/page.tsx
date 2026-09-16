import { Metadata } from "next";
import Link from "next/link";
import { Scale, CheckCircle, AlertTriangle, FileCheck, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use & Civic Access Guidelines",
  description:
    "Terms and conditions governing access, permissible research use, fair utilization, and service guidelines for SattaDarshan.",
  alternates: {
    canonical: "https://satta-darshan-7jgo.vercel.app/terms",
  },
  openGraph: {
    title: "Terms of Use & Civic Access Guidelines — SattaDarshan",
    description:
      "Terms and conditions governing access, permissible research use, fair utilization, and service guidelines for SattaDarshan.",
    url: "https://satta-darshan-7jgo.vercel.app/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Terms of Use</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Scale className="h-3.5 w-3.5" /> Civic Terms of Access
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Terms of Use
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Welcome to SattaDarshan. By browsing or utilizing the structured legislative registries, geospatial maps, and public data on this platform, you agree to the terms outlined below.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            1. Permitted Civic & Academic Use
          </h2>
          <p>
            SattaDarshan grants visitors a revocable, non-exclusive license to access, view, search, and reference the public political and parliamentary data for educational, academic, journalistic, non-profit civic awareness, and personal research purposes.
          </p>
          <p>
            Attribution to SattaDarshan when citing compiled comparative tables or visualizations in publications, articles, or research papers is appreciated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            2. Acceptable Conduct & Prohibited Activities
          </h2>
          <p>
            To maintain service availability and data integrity for all citizens, you agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>
              Deploy automated high-frequency scrapers, spiders, or bot swarms that degrade server performance or cause denial-of-service (DoS) conditions.
            </li>
            <li>
              Attempt to probe, scan, or breach system security, bypass HTTP security headers, or inject malicious payloads into API endpoints.
            </li>
            <li>
              Submit fraudulent, abusive, or automated spam reports through the editorial correction channel.
            </li>
            <li>
              Misrepresent data extracted from this portal as official government certifications or legally binding statutory certificates.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            3. Intellectual Property & Public Records
          </h2>
          <p>
            Parliamentary proceeding records, candidate affidavits, election statistics, and jurisdictional maps are public domain records originating from the respective statutory authorities (Parliament of India, Election Commission of India, Delimitation Commission).
          </p>
          <p>
            The software interface design, custom styling, aggregated database schema, and layout code of SattaDarshan are protected under applicable copyright and intellectual property standards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            4. Limitation of Liability
          </h2>
          <p>
            SattaDarshan is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied. While reasonable efforts are made to ensure data accuracy through official gazettes, SattaDarshan expressly disclaims liability for any loss, dispute, or electoral reliance arising from unintentional clerical errors or delayed gazette synchronization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Scale className="h-4 w-4 text-primary" />
            5. Acknowledgment of Independent Non-Government Status
          </h2>
          <p>
            By using SattaDarshan, you expressly acknowledge that SattaDarshan is an independent, non-government civic platform and is not affiliated with, operated by, endorsed by, or connected to any government body, legislature, or election authority. SattaDarshan does not issue certified records or replace official government sources.
          </p>
        </section>

        <section className="space-y-2 border-t border-border/60 pt-4">
          <h2 className="text-base font-bold text-foreground">Questions or Legal Inquiries</h2>
          <p>
            For questions regarding these terms, rights clearances, or academic research collaborations, please reach out through our <Link href="/contact" className="text-primary hover:underline font-semibold">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
