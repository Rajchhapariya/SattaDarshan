import { 
  CommandCenter, 
  CommandCenterHeader, 
  CommandCenterGrid, 
  TacticalMetric, 
  IntelligenceModule,
  SystemTerminal
} from "@/components/ui/CommandCenter";
import { IndiaMap } from "@/components/home/IndiaMap";
import { FeaturedPoliticians } from "@/components/home/FeaturedPoliticians";
import { PartiesSection } from "@/components/home/PartiesSection";
import { StatesSection } from "@/components/home/StatesSection";
import { Landmark, Users, Flag, Map, Database, List } from "lucide-react";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";
import Link from "next/link";

export const revalidate = 3600;

export default async function Home() {
  await connectDB();
  const lokSabhaCount = await Politician.countDocuments({ chamber: "Lok Sabha" });
  const rajyaSabhaCount = await Politician.countDocuments({ chamber: "Rajya Sabha" });
  const partyCount = await Party.countDocuments();
  const stateCount = await State.countDocuments();

  return (
    <CommandCenter>
      <CommandCenterHeader
        title="SattaDarshan Matrix"
        subtitle="The most advanced, cryptographically verified dashboard tracking the Indian Parliamentary matrix. Sourced natively from GoI domains with zero human proxy interference."
        systemStatus="Operational_V6"
      />

      <CommandCenterGrid cols={3}>
        <Link href="/parliament/lok-sabha">
          <TacticalMetric 
            label="Lok Sabha" 
            value={lokSabhaCount} 
            total={550} 
            icon={<Users className="h-4 w-4" />} 
          />
        </Link>
        <Link href="/parliament/rajya-sabha">
          <TacticalMetric 
            label="Rajya Sabha" 
            value={rajyaSabhaCount} 
            total={245} 
            icon={<Landmark className="h-4 w-4" />} 
          />
        </Link>
        <Link href="/parties">
          <TacticalMetric 
            label="Political Index" 
            value={partyCount} 
            icon={<Flag className="h-4 w-4" />} 
          />
        </Link>
      </CommandCenterGrid>

      <div className="grid gap-8 lg:grid-cols-3">
        <IntelligenceModule 
          className="lg:col-span-2" 
          title="Interactive Map Matrix" 
          subtitle="Live territory distribution and demographic scanning"
          icon={<Map className="h-5 w-5 text-primary" />}
        >
          <div className="border-t border-border">
            <IndiaMap />
          </div>
        </IntelligenceModule>

        <div className="space-y-8">
          <IntelligenceModule 
            title="System Terminal" 
            subtitle="Real-time protocol status and data pedigree"
            icon={<Database className="h-5 w-5 text-primary" />}
          >
            <SystemTerminal />
          </IntelligenceModule>

          <IntelligenceModule 
            title="Discovery Nodes" 
            subtitle="Quick access points to key registries"
            icon={<List className="h-5 w-5 text-primary" />}
          >
            <div className="p-4 space-y-2">
              <Link href="/politicians" className="flex items-center justify-between p-3 rounded-sm bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Politician Index</span>
                <span className="text-[10px] font-mono font-black text-primary">SCAN_REQ</span>
              </Link>
              <Link href="/states" className="flex items-center justify-between p-3 rounded-sm bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Regional Registry</span>
                <span className="text-[10px] font-mono font-black text-primary">SCAN_REQ</span>
              </Link>
              <Link href="/compare" className="flex items-center justify-between p-3 rounded-sm bg-muted/50 border border-border hover:border-primary/50 hover:bg-muted transition-all group">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">Analytic Comparison</span>
                <span className="text-[10px] font-mono font-black text-primary">PROC_REQ</span>
              </Link>
            </div>
          </IntelligenceModule>
        </div>
      </div>

      <StatesSection />
      <FeaturedPoliticians />
      <PartiesSection />
    </CommandCenter>
  );
}