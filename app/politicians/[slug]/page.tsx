import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import { Badge } from "@/components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { StateIcon } from "@/components/ui/StateIcon";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ProfileActions } from "@/components/politician/ProfileActions";
import { 
  Dossier, 
  DossierHeader, 
  DossierSection, 
  DossierGrid, 
  DossierCard, 
  DossierField, 
  DossierFooter 
} from "@/components/ui/Dossier";
import Link from "next/link";
import { getStatePath } from "@/lib/server/statePaths";
import { cn } from "@/lib/utils";
import {
  User, MapPin, Building2, GraduationCap,
  Wallet, AlertTriangle, ShieldCheck, Twitter,
  Facebook, Instagram, Globe, Database, History,
  FileText, Landmark, Fingerprint
} from "lucide-react";

type PoliticianPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPolitician(slug: string) {
  await connectDB();
  const p = await Politician.findOne({ slug }).lean() as any;
  if (!p) return null;

  if (p.party) {
    const party = await Party.findOne({ slug: p.party }).lean() as any;
    if (party) p.partyName = party.name;
  }
  return p;
}

export async function generateMetadata({ params }: PoliticianPageProps) {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if (!p) return { title: "Dossier Not Found" };

  return {
    title: `${p.name} — Intelligence Dossier`,
    description: `Official intelligence profile for ${p.name}. Data points include legislative history, assets, and verified legal records.`,
    openGraph: {
      images: [{ url: `/api/og/politician/${slug}` }],
    },
  };
}

export default async function PoliticianPage({ params }: PoliticianPageProps) {
  const { slug } = await params;
  const p = await getPolitician(slug);
  if (!p) notFound();

  const statePath = p.state ? getStatePath(p.state) : undefined;

  return (
    <Dossier>
      {/* Dossier Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <Link href="/" className="hover:text-primary transition-colors">System</Link>
        <span className="opacity-30">/</span>
        <Link href="/politicians" className="hover:text-primary transition-colors">Ledger</Link>
        <span className="opacity-30">/</span>
        <span className="text-foreground font-bold underline decoration-primary/30">Dossier: {p.slug.substring(0, 8)}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-4 items-start">
        <div className="lg:col-span-1 space-y-6">
          <div className="relative aspect-[3/4] rounded-md overflow-hidden border border-border bg-muted group">
            <Avatar className="w-full h-full rounded-none grayscale group-hover:grayscale-0 transition-all duration-700">
              <AvatarImage src={p.photo} alt={p.name} className="object-cover" />
              <AvatarFallback className="text-6xl font-black text-muted-foreground/20 rounded-none bg-muted flex items-center justify-center">
                {p.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute top-4 left-4">
               <Badge className="bg-primary text-white border-none shadow-lg px-2 py-0.5">
                 OFFICIAL RECORD
               </Badge>
            </div>
          </div>
          <ProfileActions slug={p.slug} name={p.name} />
          
          <DossierSection title="Identities" icon={<Database className="h-4 w-4" />} description="Biometric & Civic Metadata">
            <div className="space-y-1">
              <DossierField label="Date of Birth" value={p.dob} mono />
              <DossierField label="Gender" value={p.gender} />
              <DossierField label="Education" value={p.education} />
            </div>
          </DossierSection>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <DossierHeader 
            title={p.name}
            subtitle={`${p.role} // ${p.partyName}`}
            id={p.slug.split('-').pop()?.toUpperCase()}
            status={p.status || "Active"}
            badge="Verified Representative Dossier"
          />

          <DossierGrid cols={2}>
            <DossierCard 
              label="Assigned Constituency"
              value={p.constituency || "NA_PROTO"}
              icon={<MapPin className="h-5 w-5 text-primary" />}
            />
            <DossierCard 
              label="State Jurisdiction"
              value={p.state}
              subValue="Sub-National Division"
              icon={<StateIcon stateName={p.state} statePath={statePath} className="h-5 w-5 text-indigo-500" />}
            />
          </DossierGrid>

          {p.bio && (
            <DossierSection icon={<FileText className="h-4 w-4" />} description="Official Profile Overview">
              <div className="relative p-6 bg-background border-l-4 border-primary rounded-r-md">
                <p className="text-sm font-medium text-foreground leading-relaxed italic">
                  &quot;{p.bio}&quot;
                </p>
                <p className="mt-4 text-[9px] font-mono text-muted-foreground uppercase tracking-widest">— Official Statement</p>
              </div>
            </DossierSection>
          )}

          <DossierGrid cols={2}>
            <DossierCard 
              label="Financial Affidavit"
              value={p.assets || "NOT_DECLARED"}
              subValue="Self-Declared Net Evaluation"
              icon={<Wallet className="h-5 w-5 text-success" />}
              trend="positive"
            />
            <DossierCard 
              label="Legal Audit"
              value={p.criminalCases ?? 0}
              subValue="Flagged Criminal Cases"
              icon={<AlertTriangle className={cn("h-5 w-5", p.criminalCases > 0 ? "text-destructive" : "text-success")} />}
              trend={p.criminalCases > 0 ? "negative" : "positive"}
            />
          </DossierGrid>

          <DossierSection title="Legislative Service History" icon={<Landmark className="h-4 w-4" />} description="Chamber Tenure & Records">
            <div className="bg-muted/10 border border-border p-6 rounded-md">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Chamber</p>
                  <p className="text-xl font-black text-foreground uppercase tracking-tight underline decoration-primary/20 decoration-2">{p.chamber || "NA_PROTO"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Service Tenure</p>
                  <p className="text-xl font-black font-mono text-foreground tracking-tighter">
                    {p.termStart || "UNKN"} <span className="text-muted-foreground font-light mx-1">/</span> {p.termEnd || "PRES"}
                  </p>
                </div>
              </div>
            </div>
          </DossierSection>

          {/* Social Identifiers */}
          {(p.socialLinks?.twitter || p.socialLinks?.facebook || p.socialLinks?.instagram || p.socialLinks?.website) && (
            <DossierSection title="Digital Presence" icon={<Globe className="h-4 w-4" />} description="Verified Communication Channels">
              <div className="flex flex-wrap gap-3">
                {p.socialLinks?.twitter && (
                  <a href={p.socialLinks.twitter} target="_blank" className="h-10 w-10 flex items-center justify-center bg-muted border border-border rounded-sm hover:bg-primary hover:text-white transition-all group">
                    <Twitter className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                  </a>
                )}
                {p.socialLinks?.facebook && (
                  <a href={p.socialLinks.facebook} target="_blank" className="h-10 w-10 flex items-center justify-center bg-muted border border-border rounded-sm hover:bg-primary hover:text-white transition-all group">
                    <Facebook className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                  </a>
                )}
                {p.socialLinks?.instagram && (
                  <a href={p.socialLinks.instagram} target="_blank" className="h-10 w-10 flex items-center justify-center bg-muted border border-border rounded-sm hover:bg-primary hover:text-white transition-all group">
                    <Instagram className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                  </a>
                )}
                {p.socialLinks?.website && (
                  <a href={p.socialLinks.website} target="_blank" className="h-10 w-10 flex items-center justify-center bg-muted border border-border rounded-sm hover:bg-primary hover:text-white transition-all group">
                    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-white" />
                  </a>
                )}
              </div>
            </DossierSection>
          )}
        </div>
      </div>

      <DossierFooter slug={p.slug} />
    </Dossier>
  );
}

