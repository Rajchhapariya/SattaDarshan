import { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, ShieldAlert, FileText, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Editorial Inquiries",
  description: "Official contact directory, feedback channels, copyright notice procedures, and editorial inquiry channels for SattaDarshan.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Contact</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
          <Mail className="h-3.5 w-3.5" /> Civic Communications & Editorial Desk
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Contact & Grievance Redressal
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan welcomes feedback, inquiries, and verified correction notices from citizens, researchers, parliamentary staff, and media organizations.
        </p>
      </div>

      {/* Inquiry Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Editorial Corrections Desk */}
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-base text-foreground">Data Inaccuracies & Updates</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you have noticed an outdated office holder, incorrect constituency, or broken link, our dedicated correction intake pipeline routes your submission directly to human reviewers.
            </p>
          </div>

          <div className="pt-3">
            <Link
              href="/corrections"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity min-h-[44px]"
            >
              Submit a Data Correction <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Rights, Copyright & Takedown Notices */}
        <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <h2 className="font-bold text-base text-foreground">Copyright & Attribution Notices</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Portraits and public emblems are curated under public domain and Creative Commons licenses. Rights holders may request prompt attribution adjustment or asset replacement.
            </p>
          </div>

          <div className="pt-3">
            <Link
              href="/corrections?type=general"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-border bg-muted/40 text-foreground text-xs font-semibold hover:bg-muted transition-colors min-h-[44px]"
            >
              Submit Copyright / Asset Notice <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Editorial Methodology & Standards Reference */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-foreground">Editorial Transparency Guidelines</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan operates as an independent, non-partisan civic data platform. Inquiries regarding statutory research methodologies, open data formats, or academic integrations are reviewed in order of receipt.
        </p>
        <div className="flex flex-wrap gap-4 pt-1">
          <Link href="/methodology" className="text-xs font-semibold text-primary hover:underline">
            Review Data Sources & Methodology →
          </Link>
          <Link href="/disclaimer" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
            Review Platform Disclaimer →
          </Link>
          <Link href="/privacy" className="text-xs font-semibold text-muted-foreground hover:text-foreground">
            Review Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}
