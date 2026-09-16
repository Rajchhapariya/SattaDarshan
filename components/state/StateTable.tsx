import * as React from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table";
import { StateIcon } from "@/components/ui/StateIcon";
import { ChevronRight } from "lucide-react";

export function StateTable({ data }: { data: any[] }) {
  return (
    <div className="rounded-2xl border border-border/80 overflow-x-auto bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[80px]">Emblem</TableHead>
            <TableHead>Jurisdiction</TableHead>
            <TableHead>Capital</TableHead>
            <TableHead>Chief Minister</TableHead>
            <TableHead className="text-right">Lok Sabha Seats</TableHead>
            <TableHead className="text-right">Assembly Seats</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((s) => (
            <TableRow key={s.slug} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <div className="h-10 w-10 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <StateIcon stateName={s.name} statePath={s.statePath} className="w-8 h-8" />
                </div>
              </TableCell>
              <TableCell>
                <Link
                  href={`/states/${s.slug}`}
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                >
                  {s.name}
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-xs text-muted-foreground font-medium">
                  {s.capital || "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs font-semibold text-foreground">
                  {s.cm || "Governor"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-sm text-foreground">
                  {s.totalLokSabhaSeats || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold text-sm text-foreground">
                  {s.totalAssemblySeats || 0}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/states/${s.slug}`}
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
