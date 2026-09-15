import Link from "next/link";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { StateIcon } from "@/components/ui/StateIcon";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PoliticianCardProps = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
  state?: string;
  statePath?: string;
  className?: string;
};

export function PoliticianCard({ 
  slug, 
  name, 
  photo, 
  role, 
  partyName, 
  constituency, 
  state, 
  statePath,
  className
}: PoliticianCardProps) {
  return (
    <Link 
      href={`/politicians/${slug}`} 
      className={cn(
        "group flex flex-col rounded-2xl bg-card border border-border/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5 overflow-hidden",
        className
      )}
    >      
      {/* Portrait Image Container - Natural Color, No Grayscale */}
      <div className="relative aspect-[4/4.5] w-full bg-muted/60 overflow-hidden">
        <CivicAvatar src={photo} alt={name} size="card" shape="fill" />

        {/* Role Tag */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-background/90 text-foreground backdrop-blur-md shadow-sm border border-border/50">
            {role || "Representative"}
          </span>
        </div>

        {/* Verified Status */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span className="inline-flex items-center p-1 rounded-full bg-background/90 backdrop-blur-md text-emerald-600 shadow-sm border border-border/50">
            <CheckCircle className="h-3 w-3" />
          </span>
        </div>
      </div>
      
      {/* Member Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground line-clamp-1 mt-0.5">
            {constituency ? `${constituency}, ${state}` : state || "India"}
          </p>
        </div>

        <div className="pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="font-semibold text-primary truncate max-w-[120px]">
            {partyName || "Independent"}
          </span>
          {state && (
            <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <StateIcon stateName={state} statePath={statePath} className="h-3 w-3 opacity-70" />
              <span className="truncate max-w-[80px]">{state}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
