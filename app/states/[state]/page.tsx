import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import State from "@/models/State";
import Politician from "@/models/Politician";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { StateIcon } from "@/components/ui/StateIcon";
import { getStatePath } from "@/lib/server/statePaths";
import { 
  MapPin, 
  Landmark, 
  Users, 
  ChevronRight, 
  UserCheck
} from "lucide-react";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";
import { ShareButton } from "@/components/common/ShareButton";
import { escapeRegex } from "@/lib/utils";

type StateDetails = {
  slug: string;
  name: string;
  capital?: string;
  region?: string;
  rulingParty?: string;
  rulingPartySlug?: string;
  cm?: string;
  cmSlug?: string;
  totalAssemblySeats?: number;
  totalLokSabhaSeats?: number;
};

type StatePageProps = {
  params: Promise<{ state: string }>;
};

import { getStateBySlug, getStatePoliticians } from "@/lib/server/queries";

export const revalidate = 86400;

export async function generateMetadata({ params }: StatePageProps): Promise<Metadata> {
  const { state } = await params;
  const s = await getStateBySlug(state);
  if (!s) return { title: "State Not Found" };

  const cmPart = s.cm ? ` • CM: ${s.cm}` : "";
  const title = `${s.name}${cmPart} — Political & Legislative Profile`;
  const description = `Governance details, Chief Minister, Assembly seats (${s.totalAssemblySeats || 0}), and Lok Sabha seats (${s.totalLokSabhaSeats || 0}) for ${s.name}. Verified public records.`;
  const ogImageUrl = `/api/og/state/${s.slug}`;

  return { 
    title,
    description,
    alternates: {
      canonical: `https://satta-darshan-7jgo.vercel.app/states/${s.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://satta-darshan-7jgo.vercel.app/states/${s.slug}`,
      siteName: "SattaDarshan",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${s.name} — State Jurisdiction`,
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

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params;
  const s = await getStateBySlug(state);
  if (!s) notFound();

  const politicians = await getStatePoliticians(s.name);
  const statePath = s.name ? getStatePath(s.name) : undefined;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/states" className="hover:text-foreground transition-colors">States & UTs</Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{s.name}</span>
      </nav>

      {/* Non-Government Transparency Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs text-muted-foreground flex items-center justify-between gap-3">
        <p className="leading-relaxed">
          <strong className="font-semibold text-foreground">Independent Civic Overview:</strong> Compiled from public state government portals and legislative registries. SattaDarshan is an independent, non-government platform and is not affiliated with or endorsed by the Government of {s.name}.
        </p>
      </div>

      {/* State Hero Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-muted/30 border border-border/60 p-3 flex items-center justify-center flex-shrink-0">
            <StateIcon stateName={s.name} statePath={statePath} className="w-full h-full text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                <MapPin className="h-3 w-3" /> {s.region || "State"} Territory
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1">
              {s.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Capital: <span className="font-semibold text-foreground">{s.capital || "N/A"}</span>
            </p>
          </div>
        </div>

        {/* Executive Stats Cards */}
        <div className="grid grid-cols-2 sm:flex items-center gap-3">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Ruling Party</span>
            <span className="text-lg font-bold text-primary">{s.rulingParty || "Council"}</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Chief Minister</span>
            {s.cmSlug ? (
              <Link href={`/politicians/${s.cmSlug}`} className="text-sm font-bold text-primary hover:underline truncate max-w-[140px] block mx-auto" title={s.cm}>
                {s.cm}
              </Link>
            ) : (
              <span className="text-sm font-bold text-foreground truncate max-w-[140px] block mx-auto">{s.cm || "Governor"}</span>
            )}
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Lok Sabha</span>
            <span className="text-lg font-bold text-foreground">{s.totalLokSabhaSeats || 0}</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[90px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Assembly</span>
            <span className="text-lg font-bold text-foreground">{s.totalAssemblySeats || 0}</span>
          </div>
          <ShareButton
            title={`${s.name} — Political & Legislative Profile`}
            label="Share State"
            className="self-center"
          />
        </div>
      </div>

      {/* State Parliamentary Representatives Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Parliamentary Representatives
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Members of Parliament representing {s.name} in the Lok Sabha and Rajya Sabha
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
            {politicians.length} Representatives
          </span>
        </div>

        {politicians.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border/80">
            <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No representative records currently mapped for this jurisdiction.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {politicians.map((p: any) => (
              <PoliticianCard
                key={p.slug}
                slug={p.slug}
                name={p.name}
                photo={p.photo}
                role={p.role || "MP"}
                partyName={p.partyName}
                constituency={p.constituency}
                state={s.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Data Accuracy & State Source Provenance Notice */}
      <DataAccuracyNotice
        variant="detailed"
        recordSlug={s.slug}
        recordType="state"
        source={`Official Government of ${s.name} / Legislative Assembly`}
        sourceUrl="https://www.india.gov.in/"
      />
    </div>
  );
}
