import Link from "next/link";
import { CommandCenterSection } from "@/components/ui/CommandCenter";

const FEATURED = [
  { name: "Uttar Pradesh", slug: "uttar-pradesh", seats: 403 },
  { name: "Maharashtra", slug: "maharashtra", seats: 288 },
  { name: "West Bengal", slug: "west-bengal", seats: 294 },
  { name: "Bihar", slug: "bihar", seats: 243 },
  { name: "Tamil Nadu", slug: "tamil-nadu", seats: 234 },
  { name: "Karnataka", slug: "karnataka", seats: 224 }
];

export function StatesSection() {
  return (
    <CommandCenterSection 
      title="Regional Jurisdictions" 
      subtitle="Operational States"
      action={{ label: "Access Registry", href: "/states" }}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {FEATURED.map((s) => (
          <Link 
            key={s.slug} 
            href={`/states/${s.slug}`} 
            className="bg-background border border-border p-5 group hover:border-primary/50 transition-all relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="font-black text-sm text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">
                {s.name}
              </div>
              <div className="text-[10px] font-mono font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                {s.seats} Seats_Det
              </div>
            </div>
            <div className="absolute top-0 left-0 w-0.5 h-full bg-primary/10 group-hover:bg-primary transition-all" />
          </Link>
        ))}
      </div>
    </CommandCenterSection>
  );
}

