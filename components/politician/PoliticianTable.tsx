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
import { User, ChevronRight, ExternalLink } from "lucide-react"

type PoliticianSummary = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
  state?: string;
};

export function PoliticianTable({ data }: { data: PoliticianSummary[] }) {
  return (
    <div className="rounded-md border border-border overflow-hidden bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent odd:bg-muted/50 even:bg-muted/50">
            <TableHead className="w-[80px]">Profile</TableHead>
            <TableHead>Representative</TableHead>
            <TableHead>Primary Role</TableHead>
            <TableHead>Affiliation</TableHead>
            <TableHead className="hidden md:table-cell">Jurisdiction</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.slug} className="group">
              <TableCell>
                <div className="h-10 w-10 rounded-sm border border-border bg-muted overflow-hidden relative grayscale group-hover:grayscale-0 transition-all">
                  {p.photo ? (
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      <User className="h-5 w-5 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    ID: {p.slug.split('-').pop()?.toUpperCase()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-muted/30">
                  {p.role || "Member"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-xs">{p.partyName || "Independent"}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{p.constituency || "N/A"}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase">{p.state}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/politicians/${p.slug}`}
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
