import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";
import Link from "next/link";
import { 
  Landmark, 
  Users, 
  Flag, 
  MapPin, 
  ArrowRight, 
  ShieldCheck,
  Search,
  Compass
} from "lucide-react";
import { StatsCard } from "@/components/common/StatsCard";
import { ThreeParliamentChamber } from "@/components/parliament/ThreeParliamentChamber";
import { IndiaMap } from "@/components/home/IndiaMap";
import { FeaturedPoliticians } from "@/components/home/FeaturedPoliticians";
import { PartiesSection } from "@/components/home/PartiesSection";
import { StatesSection } from "@/components/home/StatesSection";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";

export const revalidate = 3600;

export default async function Home() {
  await connectDB();
  const [lokSabhaCount, rajyaSabhaCount, partyCount, stateCount] = await Promise.all([
    Politician.countDocuments({ chamber: "Lok Sabha" }),
    Politician.countDocuments({ chamber: "Rajya Sabha" }),
    Party.countDocuments(),
    State.countDocuments(),
  ]);

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-4 text-center max-w-4xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/25 shadow-sm">
          <Landmark className="h-3.5 w-3.5" /> Independent Civic & Legislative Platform
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Indian Parliamentary & <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            Civic Information
          </span> Platform
        </h1>

        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Public legislative and electoral records for the 18th Lok Sabha, Rajya Sabha, Chief Ministers, and national political parties—featuring 3D chamber visualization and geospatial territory mapping.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/parliament/lok-sabha"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:opacity-90 transition-all hover:scale-[1.02]"
          >
            Explore 18th Lok Sabha <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/politicians"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm shadow-sm hover:bg-muted transition-all"
          >
            <Users className="h-4 w-4 text-muted-foreground" /> Browse Representatives
          </Link>
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm shadow-sm hover:bg-muted transition-all"
          >
            Compare Leaders
          </Link>
        </div>
      </section>

      {/* Top Level Metric Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/parliament/lok-sabha">
          <StatsCard
            title="Lok Sabha (18th House)"
            value={lokSabhaCount}
            subtitle="543 Max Constitutional Seats"
            icon={<Users className="h-5 w-5" />}
          />
        </Link>
        <Link href="/parliament/rajya-sabha">
          <StatsCard
            title="Rajya Sabha (Upper House)"
            value={rajyaSabhaCount}
            subtitle="245 Total House Strength"
            icon={<Landmark className="h-5 w-5" />}
          />
        </Link>
        <Link href="/parties">
          <StatsCard
            title="Recognized Parties"
            value={partyCount}
            subtitle="National & State Formations"
            icon={<Flag className="h-5 w-5" />}
          />
        </Link>
        <Link href="/states">
          <StatsCard
            title="States & Union Territories"
            value={stateCount}
            subtitle="28 States + 8 UTs"
            icon={<MapPin className="h-5 w-5" />}
          />
        </Link>
      </section>

      {/* Flagship Showpiece: Three.js 3D Parliament Chamber */}
      <section className="space-y-4">
        <ThreeParliamentChamber chamber="Lok Sabha" />
      </section>

      {/* Interactive India Geospatial Map */}
      <section className="space-y-4">
        <IndiaMap />
      </section>

      {/* Prominent Leadership Spotlight */}
      <FeaturedPoliticians />

      {/* Political Formations & Coalitions */}
      <PartiesSection />

      {/* Major Legislative Jurisdictions */}
      <StatesSection />

      {/* Site-wide Data Accuracy Notice */}
      <DataAccuracyNotice variant="compact" />
    </div>
  );
}