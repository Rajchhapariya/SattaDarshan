import { notFound } from "next/navigation";
import Link from "next/link";
import connectDB from "@/lib/db";
import State from "@/models/State";
import Politician from "@/models/Politician";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { StateMap } from "@/components/state/StateMap";
import { StateIcon } from "@/components/ui/StateIcon";
import { getStatePath } from "@/lib/server/statePaths";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  Map as MapIcon, Landmark, Users, 
  ShieldCheck, History, Database,
  ArrowUpRight, Building2, MapPin
} from "lucide-react";

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

function slugToStateRegex(slug: string) {
  const escaped = slug.split("-").map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("\\s*");
  return new RegExp(`^${escaped}$`, "i");
}

async function getState(slug: string): Promise<StateDetails | null> {
  try {
    await connectDB();
    return (await State.findOne({ slug }).lean()) as StateDetails | null;
  } catch {
    return null;
  }
}

async function getStatePoliticians(stateSlug: string) {
  await connectDB();
  const regex = slugToStateRegex(stateSlug);
  return await Politician.find({ state: regex }).limit(100).lean();
}

export async function generateMetadata({ params }: StatePageProps) {
  const { state } = await params;
  const s = await getState(state);
  return { title: s ? `${s.name} — Regional Jurisdiction Dossier` : "Not Found" };
}

export default async function StatePage({ params }: StatePageProps) {
  const { state } = await params;
  const s = await getState(state);
  if (!s) notFound();
  const politicians = await getStatePoliticians(state);
  const statePath = s.name ? getStatePath(s.name) : undefined;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Registry Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
        <Link href="/" className="hover:text-primary transition-colors">System</Link>
        <span className="opacity-30">/</span>
        <Link href="/states" className="hover:text-primary transition-colors">Jurisdictions</Link>
        <span className="opacity-30">/</span>
        <span className="text-foreground font-bold underline decoration-primary/30">Registry: {s.name.toUpperCase()}</span>
      </nav>

      {/* Main Header */}
      <div className="grid gap-8 lg:grid-cols-4 items-start">
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-background border border-border rounded-md p-8 flex flex-col items-center justify-center relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
               <div className="h-32 w-32 flex items-center justify-center text-muted-foreground/10 group-hover:text-indigo-500 transition-colors duration-500 mb-6">
                  <StateIcon stateName={s.name} statePath={statePath} className="w-full h-full" />
               </div>
               <h1 className="text-center font-black text-2xl tracking-tighter uppercase text-foreground leading-tight">
                 {s.name}
               </h1>
               <p className="text-[10px] text-center font-bold text-muted-foreground uppercase tracking-widest mt-2">
                  {s.region || "Registry Entry"} Territory
               </p>
               <div className="mt-8 w-full border-t border-border pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Capital</span>
                     <span className="text-xs font-black uppercase">{s.capital || "NA_PROTO"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-[10px] font-bold text-muted-foreground uppercase">Admin ID</span>
                     <span className="text-[10px] font-mono font-black">{s.slug.toUpperCase()}</span>
                  </div>
               </div>
            </div>
            
            <Card className="bg-muted/10 border-border">
               <CardHeader className="pb-4 border-b border-border/50">
                  <CardTitle className="text-[10px] font-black tracking-widest flex items-center gap-2">
                     <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                     Territorial Executive
                  </CardTitle>
               </CardHeader>
               <CardContent className="pt-4 space-y-4">
                  <div>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Chief Minister</p>
                     <p className="text-sm font-black text-foreground uppercase">{s.cm || "Executive Transition"}</p>
                  </div>
                  <div>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter mb-1">Ruling Formation</p>
                     {s.rulingParty ? (
                        <Link href={`/parties/${s.rulingPartySlug}`} className="text-sm font-black text-primary uppercase hover:underline flex items-center gap-1">
                           {s.rulingParty} <ArrowUpRight className="h-3 w-3" />
                        </Link>
                     ) : (
                        <p className="text-sm font-black text-muted-foreground uppercase">Unknown</p>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card className="p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
                  <div className="relative z-10">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Legislative Assembly Capacity</p>
                     <p className="text-4xl font-black font-mono text-foreground tracking-tighter">
                        {s.totalAssemblySeats?.toString().padStart(3, '0') || "000"} <span className="text-sm font-medium text-muted-foreground">SEATS</span>
                     </p>
                  </div>
                  <Landmark className="absolute -bottom-4 -right-4 h-24 w-24 text-muted-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </Card>
               <Card className="p-6 relative overflow-hidden group hover:border-indigo-500/30 transition-all">
                  <div className="relative z-10">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Lok Sabha Representation</p>
                     <p className="text-4xl font-black font-mono text-foreground tracking-tighter">
                        {s.totalLokSabhaSeats?.toString().padStart(2, '0') || "00"} <span className="text-sm font-medium text-muted-foreground">SEATS</span>
                     </p>
                  </div>
                  <Users className="absolute -bottom-4 -right-4 h-24 w-24 text-muted-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </Card>
            </div>

            <Card className="overflow-hidden border-border bg-background">
               <div className="p-1 bg-muted/20 border-b border-border">
                  <div className="p-6 bg-background rounded-sm border border-border shadow-inner min-h-[400px]">
                     <StateMap stateName={s.name} slug={state} />
                  </div>
               </div>
               <div className="px-6 py-4 bg-muted/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                     <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest italic">Geospatial Projection Alpha-V1</span>
                  </div>
                  <Badge variant="outline" className="text-[8px]">PROJECTION_ACTIVE</Badge>
               </div>
            </Card>
         </div>
      </div>

      {/* Roster Section */}
      <div className="pt-12 border-t border-border">
         <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="h-6 w-6 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Users className="h-3.5 w-3.5 text-primary" />
               </div>
               <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Regional Representative Roster</h3>
            </div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
               Showing {politicians.length} Verified Records
            </div>
         </div>
         
         {!politicians.length ? (
           <div className="py-20 text-center border border-dashed border-border rounded-md text-muted-foreground font-mono text-xs uppercase tracking-widest">
              No representative data synchronized for this jurisdiction.
           </div>
         ) : (
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {politicians.map((p: any) => <PoliticianCard key={p.slug} {...p} />)}
           </div>
         )}
      </div>

      {/* Footer Signature */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 pb-16 border-t border-border mt-12">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2.5">
             <History className="h-3.5 w-3.5 text-muted-foreground" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Administrative Sync</span>
                <span className="text-[10px] font-mono font-black">{new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC</span>
             </div>
          </div>
          <div className="flex items-center gap-2.5 border-l border-border pl-8">
             <ShieldCheck className="h-3.5 w-3.5 text-success" />
             <div className="flex flex-col">
                <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Data Pedigree</span>
                <span className="text-[10px] font-mono font-black text-success uppercase">Validated_REG_V4</span>
             </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-foreground text-background rounded-sm">
           <p className="text-[9px] font-mono font-bold tracking-[0.4em] uppercase">REGION_ID_{s.slug.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}
