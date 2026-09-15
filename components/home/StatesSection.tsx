import Link from "next/link";
import { MapPin, ChevronRight, Landmark } from "lucide-react";

const POPULAR_STATES = [
  { name: "Uttar Pradesh", slug: "uttar-pradesh", seats: 80, cm: "Yogi Adityanath", party: "BJP" },
  { name: "Maharashtra", slug: "maharashtra", seats: 48, cm: "Devendra Fadnavis", party: "BJP" },
  { name: "West Bengal", slug: "west-bengal", seats: 42, cm: "Mamata Banerjee", party: "TMC" },
  { name: "Bihar", slug: "bihar", seats: 40, cm: "Nitish Kumar", party: "JDU" },
  { name: "Tamil Nadu", slug: "tamil-nadu", seats: 39, cm: "M. K. Stalin", party: "DMK" },
  { name: "Karnataka", slug: "karnataka", seats: 28, cm: "Siddaramaiah", party: "INC" },
  { name: "Gujarat", slug: "gujarat", seats: 26, cm: "Bhupendrabhai Patel", party: "BJP" },
  { name: "Rajasthan", slug: "rajasthan", seats: 25, cm: "Bhajan Lal Sharma", party: "BJP" },
];

export function StatesSection() {
  return (
    <section className="space-y-6 pt-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
              <MapPin className="h-3 w-3" /> Federal Structure
            </span>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              States & Territories
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1">
            Major Legislative Jurisdictions
          </h2>
          <p className="text-sm text-muted-foreground">
            Parliamentary representation and chief executive administration by State
          </p>
        </div>

        <Link
          href="/states"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline self-start sm:self-auto"
        >
          View All 36 States & UTs <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {POPULAR_STATES.map((s) => (
          <Link
            key={s.slug}
            href={`/states/${s.slug}`}
            className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {s.name}
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {s.seats} LS
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                CM: <span className="font-medium text-foreground">{s.cm}</span>
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ruling Party:</span>
              <span className="font-semibold text-foreground">{s.party}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
