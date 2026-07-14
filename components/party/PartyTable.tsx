import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Flag, ChevronRight } from "lucide-react"

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
    <div className="rounded-md border border-border overflow-hidden bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent odd:bg-muted/50 even:bg-muted/50">
            <TableHead className="w-[80px]">Logo</TableHead>
            <TableHead>Abbreviation</TableHead>
            <TableHead className="hidden md:table-cell">Full Name</TableHead>
            <TableHead>Classification</TableHead>
            <TableHead className="text-right">Lok Sabha Seats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.slug} className="group">
              <TableCell>
                <div className="h-10 w-10 rounded-sm border border-border bg-muted p-1 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all">
                  {p.logo ? (
                    <Image
                      src={p.logo}
                      alt={p.abbr || p.name}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <Flag className="h-5 w-5 text-muted-foreground/30" />
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-black text-sm tracking-tighter group-hover:text-primary transition-colors uppercase">
                  {p.abbr || p.name.substring(0, 4)}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs font-bold text-muted-foreground uppercase truncate block max-w-[200px]">
                  {p.name}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                  {p.tier}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-black text-sm">
                  {p.seatsLokSabha || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/parties/${p.slug}`}
                  className="inline-flex items-center justify-center h-8 w-8 rounded-sm border border-border hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
