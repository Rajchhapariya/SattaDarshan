import Link from "next/link";
import { StateIcon } from "@/components/ui/StateIcon";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ShieldCheck, MapPin, Building2 } from "lucide-react";
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
        "group flex flex-col bg-background border border-border rounded-md transition-all hover:border-primary/50 hover:shadow-sm overflow-hidden",
        className
      )}
    >      
      <div className="relative aspect-[4/5] w-full bg-muted overflow-hidden">
        <Avatar className="h-full w-full rounded-none grayscale group-hover:grayscale-0 transition-all duration-700">
          <AvatarImage src={photo} alt={name} className="object-cover h-full w-full" />
          <AvatarFallback className="text-4xl font-black text-muted-foreground/30 rounded-none bg-muted flex items-center justify-center">
            {name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className="bg-primary text-white border-none shadow-none text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
            {role || "Politician"}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-background/90 backdrop-blur-sm p-1 rounded-sm border border-border shadow-sm">
            <ShieldCheck className="h-3 w-3 text-success" />
          </div>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-black text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors tracking-tight uppercase">
            {name}
          </h3>
          <p className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
            ID: {slug.substring(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="mt-auto space-y-2 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Affiliation</span>
            <span className="text-[9px] font-black text-foreground uppercase tracking-tight">{partyName || "Independent"}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <StateIcon stateName={state || ""} statePath={statePath} className="h-2.5 w-2.5 opacity-50 group-hover:text-primary group-hover:opacity-100 transition-all" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">Jurisdiction</span>
            </div>
            <span className="text-[9px] font-black text-foreground uppercase tracking-tight truncate max-w-[80px]">{state}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

