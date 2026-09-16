import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import Politician from "@/models/Politician";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { AllianceBadge } from "@/components/common/AllianceBadge";
import { CivicPartyLogo } from "@/components/party/CivicPartyLogo";
import { 
  Flag, 
  Building2, 
  Calendar, 
  Users, 
  Globe, 
  ShieldCheck, 
  Landmark, 
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";
import { ShareButton } from "@/components/common/ShareButton";

type PartyPageProps = {
  params: Promise<{ slug: string }>;
};

async function getParty(slug: string) {
  try {
    await connectDB();
    const party = await Party.findOne({ slug }).lean() as any;
    if (!party) return null;

    // Search for MPs belonging to this party by slug or abbreviation
    const leaders = await Politician.find({
      $or: [
        { party: slug },
        { party: party.abbr?.toLowerCase() },
        { partyName: party.name },
        { partyName: party.abbr }
      ]
    }).sort({ role: 1, name: 1 }).limit(24).lean();

    return { ...party, leaders };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PartyPageProps) {
  const { slug } = await params;
  const p = await getParty(slug);
  return {
    title: p ? `${p.name} (${p.abbr || ""}) — Party Profile & Seat Distribution` : "Party Not Found",
    description: p ? `Party profile, seat distribution, and public legislative records for ${p.name}. Compiled from public election records.` : "",
  };
}

export default async function PartyPage({ params }: PartyPageProps) {
  const { slug } = await params;
  const p = await getParty(slug);
  if (!p) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/parties" className="hover:text-foreground transition-colors">Political Parties</Link>
        <span>/</span>
        <span className="text-foreground font-semibold truncate">{p.abbr || p.name}</span>
      </nav>

      {/* Hero Party Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <CivicPartyLogo
            src={p.logo}
            alt={p.abbr || p.name}
            size="xl"
            className="border-2 border-border/70 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <AllianceBadge alliance={p.alliance} size="sm" />
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                {p.tier || "State"} Recognized
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-1.5">
              {p.name}
            </h1>
            {p.abbr && (
              <p className="text-sm font-semibold text-primary mt-0.5">
                Acronym: {p.abbr}
              </p>
            )}
          </div>
        </div>

        {/* Seat Counters & Share */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Lok Sabha</span>
            <span className="text-2xl font-bold text-foreground">{p.seatsLokSabha || 0}</span>
            <span className="text-[10px] text-muted-foreground">Seats</span>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Rajya Sabha</span>
            <span className="text-2xl font-bold text-foreground">{p.seatsRajyaSabha || 0}</span>
            <span className="text-[10px] text-muted-foreground">Seats</span>
          </div>
          <ShareButton
            title={`${p.name} (${p.abbr || ""}) — Party Profile`}
            label="Share Party"
            className="self-center"
          />
        </div>
      </div>

      {/* Party Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Leadership</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-base font-bold text-foreground">
            {p.president || "Executive Committee"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Party President / General Secretary</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Founded</span>
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="text-base font-bold text-foreground">
            {p.founded ? `Year ${p.founded}` : "Established Formation"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Formation record</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Headquarters</span>
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <div className="text-base font-bold text-foreground truncate">
            {p.hq || "New Delhi, India"}
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">Central Secretariat</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Party Web</span>
            <Globe className="h-4 w-4 text-primary" />
          </div>
          {p.website ? (
            <a
              href={p.website}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1 truncate"
            >
              Visit Portal <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <span className="text-sm font-bold text-foreground">ECI Registered</span>
          )}
          <p className="text-[11px] text-muted-foreground mt-0.5">Public domain</p>
        </div>
      </div>

      {/* Ideology & Description */}
      {(p.ideology || p.description) && (
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
          <h3 className="text-lg font-bold text-foreground">Ideology & Political Stance</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {p.description || `The ${p.name} is a prominent political party in India aligned with ${p.ideology || "democratic governance and socio-economic development"}. It actively participates in legislative proceedings at both the Union Parliament and state legislative assemblies.`}
          </p>
          {p.ideology && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-muted-foreground">Political Ideologies:</span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-foreground">
                {p.ideology}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Affiliated Representatives Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Affiliated Lawmakers & Leaders
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Key MPs and elected representatives representing {p.abbr || p.name}
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
            {p.leaders?.length || 0} Members Listed
          </span>
        </div>

        {(!p.leaders || p.leaders.length === 0) ? (
          <div className="p-12 text-center rounded-2xl bg-card border border-border/80">
            <Users className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No representative records currently mapped directly for this party.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {p.leaders.map((leader: any) => (
              <PoliticianCard
                key={leader.slug}
                slug={leader.slug}
                name={leader.name}
                photo={leader.photo}
                role={leader.role || "MP"}
                partyName={p.abbr || p.name}
                constituency={leader.constituency}
                state={leader.state}
              />
            ))}
          </div>
        )}
      </div>

      {/* Data Accuracy & Source Provenance Notice */}
      <DataAccuracyNotice
        variant="detailed"
        recordSlug={p.slug}
        recordType="party"
        source={p.source || "Election Commission of India (ECI)"}
        sourceUrl={p.sourceUrl || "https://www.eci.gov.in/"}
        lastVerifiedAt={p.lastVerifiedAt}
      />
    </div>
  );
}
