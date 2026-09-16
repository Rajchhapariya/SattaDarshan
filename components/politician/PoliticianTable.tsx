import Link from "next/link";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { User, ChevronRight } from "lucide-react";

type PoliticianSummary = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  currentOffice?: string;
  ministerialRank?: string;
  portfolios?: string[];
  partyName?: string;
  constituency?: string;
  state?: string;
};

export function PoliticianTable({ data }: { data: PoliticianSummary[] }) {
  return (
    <div className="rounded-2xl border border-border/80 overflow-x-auto bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[70px]">Photo</TableHead>
            <TableHead>Representative</TableHead>
            <TableHead>Office / Role</TableHead>
            <TableHead>Party</TableHead>
            <TableHead className="hidden md:table-cell">Constituency & State</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((p) => (
            <TableRow key={p.slug} className="hover:bg-muted/20 transition-colors">
              <TableCell>
                <CivicAvatar src={p.photo} alt={p.name} size="table" shape="circle" className="border border-border flex-shrink-0" />
              </TableCell>
              <TableCell>
                <Link
                  href={`/politicians/${p.slug}`}
                  className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                >
                  {p.name}
                </Link>
              </TableCell>
              <TableCell>
                <div className="flex flex-col items-start gap-1">
                  <Badge variant="outline" className="text-[11px] font-semibold">
                    {p.ministerialRank || p.role || "Leader"}
                  </Badge>
                  {p.portfolios && p.portfolios.length > 0 && (
                    <span className="text-[10px] text-amber-700 font-medium line-clamp-1 max-w-[220px]" title={p.portfolios[0]}>
                      {p.portfolios[0]}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className="font-semibold text-xs text-primary">{p.partyName || "Independent"}</span>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-xs text-muted-foreground">
                  {p.constituency ? `${p.constituency}, ` : ""}{p.state || "India"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Link 
                  href={`/politicians/${p.slug}`}
                  aria-label={`View profile of ${p.name}`}
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
