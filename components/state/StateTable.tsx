import * as React from "react"
import Link from "next/link"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table"
import { StateIcon } from "@/components/ui/StateIcon"
import { ChevronRight } from "lucide-react"

export function StateTable({ data }: { data: any[] }) {
  return (
    <div className="rounded-md border border-border overflow-hidden bg-background">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent odd:bg-muted/50 even:bg-muted/50">
            <TableHead className="w-[80px]">Icon</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Lok Sabha Seats</TableHead>
            <TableHead className="text-right">Assembly Seats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s) => (
            <TableRow key={s.slug} className="group">
              <TableCell>
                <div className="h-10 w-10 flex items-center justify-center text-muted-foreground/20 group-hover:text-primary transition-colors">
                  <StateIcon stateName={s.name} statePath={s.statePath} className="w-8 h-8" />
                </div>
              </TableCell>
              <TableCell>
                <span className="font-black text-sm tracking-tight group-hover:text-primary transition-colors uppercase">
                  {s.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {s.type || "State"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-black text-sm">
                  {s.totalLokSabhaSeats || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-mono font-black text-sm">
                  {s.totalAssemblySeats || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/states/${s.slug}`}
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
