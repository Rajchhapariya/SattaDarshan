import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Flag, ChevronRight } from "lucide-react";

type PartySummary = {
  slug: string;
  name: string;
  abbr?: string;
  tier?: string;
  status?: string;
  logo?: string;
  seatsLokSabha?: number;
};

export function PartyTable({ data }: { data: PartySummary[] }) {
  return (
    <div className="rounded-2xl border border-border/80 overflow-x-auto bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[80px]">Symbol</TableHead>
            <TableHead>Abbreviation</TableHead>
            <TableHead className="hidden md:table-cell">Party Name</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead className="text-right">Lok Sabha Seats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.slug} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <div className="h-10 w-10 rounded-xl border border-border/60 bg-muted/30 p-1 flex items-center justify-center">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.abbr || p.name}
                      width={32}
                      height={32}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <Flag className="h-4 w-4 text-muted-foreground/40" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-bold text-sm text-foreground hover:text-primary transition-colors">
                  {p.abbr || p.name.substring(0, 4)}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs font-medium text-muted-foreground truncate block max-w-[240px]">
                  {p.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-[11px] font-semibold">
                  {p.tier || "State"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-sm text-foreground">
                  {p.seatsLokSabha || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/parties/${p.slug}`}
                  aria-label={`View party profile of ${p.name}`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted hover:text-primary transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
