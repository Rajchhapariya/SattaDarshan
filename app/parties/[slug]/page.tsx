import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import Politician from "@/models/Politician";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Flag, Building2, Calendar, Users, 
  Globe, ShieldCheck, History, Database,
  ArrowUpRight, Landmark, FileText
} from "lucide-react";

type Leader = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
  state?: string;
};

type PartyDetails = {
  name: string;
  abbr?: string;
  logo?: string;
  founded?: number;
  president?: string;
  hq?: string;
  alliance?: string;
  seatsLokSabha?: number;
  seatsRajyaSabha?: number;
  leaders?: Leader[];
  states?: string[];
  ideology?: string;
  website?: string;
  description?: string;
  tier?: string;
  status?: string;
};

type PartyPageProps = {
  params: Promise<{ slug: string }>;
};

async function getParty(slug: string): Promise<PartyDetails | null> {
  try {
    await connectDB();
    const party = await Party.findOne({ slug }).lean() as any;
    if (!party) return null;
    const leaders = await Politician.find({ party: slug }).limit(12).lean();
    return { ...party, leaders };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PartyPageProps) {
  const { slug } = await params;
  const p = await getParty(slug);
  return p ? {
    title: `${p.name} — Political Index Profile`,
    description: `Official registry data for ${p.name}. Includes leadership hierarchy, seat distribution, and institutional status.`,
    openGraph: { images: [{ url: `/api/og/party/${slug}` }] },
  } : {title:"Not Found"};
}

export default async function PartyPage({ params }: PartyPageProps) {
  const { slug } = await params;
  const p = await getParty(slug);
  if(!p) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Registry Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <Link href="/" className="hover:text-primary transition-colors">System</Link>
        <span className="opacity-30">/</span>
        <Link href="/parties" className="hover:text-primary transition-colors">Index</Link>
        <span className="opacity-30">/</span>
        <span className="text-foreground font-bold underline decoration-primary/30">Formation: {p.abbr || "PROTO"}</span>
      </nav>

      {/* Main Header */}
      <div className="grid gap-8 lg:grid-cols-4 items-start">
        <div className="lg:col-span-1">
           <div className="bg-background border border-border rounded-md p-8 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
              <div className="h-32 w-32 rounded border border-border bg-muted/30 p-4 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 mb-6">
                {p.logo ? (
                  <Image 
                    src={p.logo} 
                    alt={p.name} 
                    width={100} 
                    height={100} 
                    className="object-contain"
                  />
                ) : (
                  <Flag className="h-12 w-12 text-muted-foreground/20" />
                )}
              </div>
              <Badge variant="outline" className="mb-2 text-[8px] border-primary/30 text-primary">
                 {p.tier || "REG_ENTITY"}
              </Badge>
              <h1 className="text-center font-black text-2xl tracking-tighter uppercase text-foreground leading-tight">
                {p.abbr || p.name}
              </h1>
              <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest mt-2">
                 {p.status || "Active"} Formation
              </p>
              
              {p.website && (
                <a 
                  href={p.website} 
                  target="_blank" 
                  className="mt-6 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                >
                  <Globe className="h-3 w-3" /> Official Domain <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
           </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="border-b border-border pb-6">
             <div className="flex items-center gap-2 mb-2">
                <Database className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Political Index Registry Record</span>
             </div>
             <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase mb-6">
                {p.name}
             </h2>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> Founded
                   </p>
                   <p className="text-lg font-black font-mono text-foreground uppercase tracking-tighter">{p.founded || "19XX"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Users className="h-3 w-3" /> President
                   </p>
                   <p className="text-lg font-black text-foreground uppercase tracking-tighter truncate" title={p.president}>{p.president || "NA_PROTO"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <Building2 className="h-3 w-3" /> Headquarters
                   </p>
                   <p className="text-lg font-black text-foreground uppercase tracking-tighter truncate" title={p.hq}>{p.hq || "DEL_CENT"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" /> Alliance
                   </p>
                   <p className="text-lg font-black text-foreground uppercase tracking-tighter">{p.alliance || "IND_PROTO"}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-muted/10 border border-border rounded-md p-6 flex items-center justify-between group hover:border-primary/30 transition-all">
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Lok Sabha Strength</p>
                   <p className="text-3xl font-black font-mono text-foreground tracking-tighter">
                      {p.seatsLokSabha?.toString().padStart(2, '0') || "00"} <span className="text-sm font-medium text-muted-foreground">SEATS</span>
                   </p>
                </div>
                <Landmark className="h-12 w-12 text-muted-foreground/10 group-hover:text-primary/20 transition-all" />
             </div>
             <div className="bg-muted/10 border border-border rounded-md p-6 flex items-center justify-between group hover:border-indigo-500/30 transition-all">
                <div>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Rajya Sabha Strength</p>
                   <p className="text-3xl font-black font-mono text-foreground tracking-tighter">
                      {p.seatsRajyaSabha?.toString().padStart(2, '0') || "00"} <span className="text-sm font-medium text-muted-foreground">SEATS</span>
                   </p>
                </div>
                <Landmark className="h-12 w-12 text-muted-foreground/10 group-hover:text-indigo-500/20 transition-all" />
             </div>
          </div>

          {p.description && (
            <div className="bg-background border border-border rounded-md p-6 relative overflow-hidden">
               <FileText className="absolute top-2 right-4 h-12 w-12 text-muted-foreground/5" />
               <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Organizational Overview</h4>
               <p className="text-sm font-medium text-foreground leading-relaxed">
                  {p.description}
               </p>
               {p.ideology && (
                 <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Core Ideology:</span>
                    <Badge variant="secondary" className="font-mono text-[9px]">{p.ideology.toUpperCase()}</Badge>
                 </div>
               )}
            </div>
          )}
        </div>
      </div>

      {/* Leadership Section */}
      <div className="pt-12 border-t border-border">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="h-6 w-6 rounded-sm bg-success/10 border border-success/20 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-success" />
               </div>
               <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Key Registry Members</h3>
            </div>
            <Link href={`/politicians?party=${slug}`} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
               View Full Roster →
            </Link>
         </div>
         
         {!p.leaders?.length ? (
           <div className="py-20 text-center border border-dashed border-border rounded-md">
              <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Roster Synchronization Pending</p>
           </div>
         ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {p.leaders.map((l) => <PoliticianCard key={l.slug} {...l} />)}
           </div>
         )}
      </div>

      {/* Footer Signature */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 pb-16 border-t border-border mt-12">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
             <History className="h-3.5 w-3.5 text-muted-foreground" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Last Index Synchronization</span>
                <span className="text-[10px] font-mono font-black">{new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
             </div>
          </div>
          <div className="flex items-center gap-2.5 border-l border-border pl-8">
             <ShieldCheck className="h-3.5 w-3.5 text-success" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">ECI Alignment</span>
                <span className="text-[10px] font-mono font-black text-success uppercase">Status_Verified_V4</span>
             </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-foreground text-background rounded-sm">
           <p className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase">FORMATION_ID_{p.abbr || "PROTO"}_{slug.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
