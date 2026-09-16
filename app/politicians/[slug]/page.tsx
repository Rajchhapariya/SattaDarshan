import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import { Badge } from "@/components/ui/Badge";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { StateIcon } from "@/components/ui/StateIcon";
import { getStatePath } from "@/lib/server/statePaths";
import { cn } from "@/lib/utils";
import {
  User, 
  MapPin, 
  Landmark, 
  GraduationCap,
  Wallet, 
  AlertTriangle, 
  CheckCircle, 
  Twitter,
  Facebook, 
  Instagram, 
  Globe, 
  Calendar,
  ChevronRight
} from "lucide-react";
import { ShareButton } from "@/components/common/ShareButton";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";

type PoliticianPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPolitician(slug: string) {
  await connectDB();
  const p = await Politician.findOne({ slug }).lean() as any;
  if (!p) return null;

  if (p.party) {
    const party = await Party.findOne({ slug: p.party }).lean() as any;
    if (party) {
      p.partyName = party.name;
      p.partyLogo = party.logo;
      p.partyAbbr = party.abbr;
    }
  }
  return p;
}

export async function generateMetadata({ params }: PoliticianPageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if (!p) return { title: "Representative Not Found" };

  const officeTitle = p.currentOffice || p.ministerialRank || p.role || "Representative";
  const title = `${p.name} (${officeTitle}) — Public Profile & Records`;
  const location = p.constituency ? `${p.constituency}, ${p.state}` : p.state || "India";
  const description = `Verified public records and legislative profile for ${p.name}, ${officeTitle} (${p.partyName || "Independent"}), representing ${location}.`;
  const ogImageUrl = `/api/og/politician/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://satta-darshan-7jgo.vercel.app/politicians/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://satta-darshan-7jgo.vercel.app/politicians/${slug}`,
      siteName: "SattaDarshan",
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${p.name} — Civic Profile`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function PoliticianPage({ params }: PoliticianPageProps) {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if (!p) notFound();

  const statePath = p.state ? getStatePath(p.state) : undefined;
  const hasZeroCriminalCases = p.criminalCases === 0 || p.criminalCases === undefined;

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/politicians" className="hover:text-foreground transition-colors">Representatives</Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{p.name}</span>
      </nav>

      {/* Hero Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-start">
        {/* Full-Color Portrait */}
        <div className="relative flex-shrink-0">
          <CivicAvatar
            src={p.photo}
            alt={p.name}
            size="hero"
            shape="rounded-2xl"
            priority
            className="border border-border/80 shadow-md"
          />
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm",
              p.ministerialRank && p.tenureStatus !== "former"
                ? "bg-amber-500 text-white"
                : "bg-primary text-primary-foreground"
            )}>
              {p.ministerialRank || p.role || "Leader"}
            </span>
          </div>
        </div>

        {/* Member Title & Meta */}
        <div className="space-y-4 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {p.tenureStatus === "former" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 border border-amber-500/20">
                  Former Office Holder
                </span>
              )}
              {p.verificationStatus === "verified" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
                  Source verified
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                Compiled from public records
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {p.name}
                </h1>
                <p className="text-base font-semibold text-primary mt-1">
                  {p.partyName || "Independent"}
                  {p.chamber && ` • ${p.chamber}`}
                </p>
                {p.currentOffice && (
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-500 mt-1">
                    {p.currentOffice}
                  </p>
                )}
              </div>
              <ShareButton
                title={`${p.name} — Political Profile & Legislative Records`}
                label="Share Profile"
                className="self-start sm:self-auto"
              />
            </div>
          </div>

          {/* Key Tag Badges */}
          <div className="flex flex-wrap gap-2 text-xs">
            {p.state && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 text-foreground border border-border/60 font-medium">
                <StateIcon stateName={p.state} statePath={statePath} className="h-3.5 w-3.5 opacity-70" />
                {p.state}
              </span>
            )}
            {p.constituency && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 text-foreground border border-border/60 font-medium">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                Constituency: {p.constituency}
              </span>
            )}
            {p.gender && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted/60 text-foreground border border-border/60 font-medium">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                {p.gender}
              </span>
            )}
          </div>

          {/* Social Links */}
          {p.socialLinks && (
            <div className="flex items-center gap-2 pt-2">
              {p.socialLinks.twitter && (
                <a
                  href={p.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="Twitter / X"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {p.socialLinks.facebook && (
                <a
                  href={p.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {p.socialLinks.website && (
                <a
                  href={p.socialLinks.website}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  title="Website"
                >
                  <Globe className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 Essential Legislative Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Declared Assets */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Declared Assets</span>
            <Wallet className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-foreground">
            {p.assets || "Declared in Affidavit"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Self-declared ECI asset affidavit</p>
        </div>

        {/* Legal & Criminal Records */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Criminal Cases</span>
            {hasZeroCriminalCases ? (
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            )}
          </div>
          <div className={cn("text-xl font-bold", hasZeroCriminalCases ? "text-emerald-600" : "text-amber-600")}>
            {hasZeroCriminalCases ? "0 Cases" : `${p.criminalCases} Cases Declared`}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">ECI election compliance status</p>
        </div>

        {/* Education Qualification */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Education</span>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-base font-bold text-foreground line-clamp-1">
            {p.education || "Graduate"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Highest completed level</p>
        </div>

        {/* Chamber & Term */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">House Chamber</span>
            <Landmark className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-base font-bold text-foreground">
            {p.chamber || "Parliament"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">Active legislative seat</p>
        </div>
      </div>

      {/* Portfolios & Executive Responsibilities */}
      {p.portfolios && p.portfolios.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-amber-600" />
            <h3 className="text-lg font-bold text-foreground">Ministerial Portfolios & Responsibilities</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {p.portfolios.map((portfolio: string, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/60 flex items-start gap-3">
                <span className="h-6 w-6 rounded-lg bg-amber-500/15 text-amber-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{portfolio}</h4>
                  <span className="text-[11px] text-muted-foreground">Union Council of Ministers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Structured Public Offices & Tenure History */}
      {p.offices && p.offices.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold text-foreground">Public Offices & Tenure History</h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">Verified Historical Record</span>
          </div>
          <div className="space-y-3 divide-y divide-border/40">
            {p.offices.map((office: any, idx: number) => (
              <div key={idx} className={cn("pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2")}>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-foreground">{office.title}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      office.status === "serving" 
                        ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/20" 
                        : "bg-amber-500/15 text-amber-700 border border-amber-500/20"
                    )}>
                      {office.status === "serving" ? "Serving" : "Former Tenure"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {office.jurisdiction || "Republic of India"}
                    {office.startDate && ` • ${office.startDate} to ${office.endDate || "Present"}`}
                  </p>
                </div>
                {office.source && (
                  <span className="text-[11px] text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50 self-start sm:self-auto">
                    Source: {office.source}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Biography Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground">Biography & Public Profile</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {p.bio || `${p.name} is an active public representative in India, serving in the ${p.chamber || "Parliament"} representing ${p.constituency ? `the constituency of ${p.constituency} in ${p.state}` : p.state || "the nation"}. As a key member of ${p.partyName || "their political party"}, they participate in legislative debates, regional constituency development, and national policy initiatives.`}
        </p>
      </div>

      {/* Data Accuracy & Record-Specific Provenance Notice */}
      <DataAccuracyNotice
        variant="detailed"
        recordSlug={p.slug}
        recordType="politician"
        source={
          p.source ||
          (p.chamber === "Lok Sabha"
            ? "Parliament of India / Sansad.in"
            : p.chamber === "Rajya Sabha"
            ? "Parliament of India / Sansad.in"
            : p.role?.toLowerCase().includes("chief minister") && p.state
            ? `Official Government of ${p.state} / State Gazette`
            : "Public Parliamentary Records")
        }
        sourceUrl={
          p.sourceUrl ||
          (p.role?.toLowerCase().includes("chief minister")
            ? "https://www.india.gov.in/"
            : "https://sansad.in/")
        }
        lastVerifiedAt={p.lastVerifiedAt}
      />

      {/* Direct Quick Nav to State & Party */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {p.party && (
          <Link
            href={`/parties/${p.party}`}
            className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Affiliated Party</span>
              <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mt-0.5">
                {p.partyName}
              </h4>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}

        {p.state && (
          <Link
            href={`/states/${p.state ? p.state.toLowerCase().replace(/\s+/g, '-') : ''}`}
            className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-primary/50 hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Representing State</span>
              <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mt-0.5">
                {p.state}
              </h4>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        )}
      </div>
    </div>
  );
}
