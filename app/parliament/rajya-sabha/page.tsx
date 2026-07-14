import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { StateIcon } from "@/components/ui/StateIcon";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { 
  Ledger, 
  LedgerHeader, 
  LedgerContent, 
  LedgerFooter 
} from "@/components/ui/Ledger";
import Link from "next/link";
import { Info, Database } from "lucide-react";
import { getStatePath } from "@/lib/server/statePaths";

export const revalidate = 3600; // 1 hr cache

export default async function RajyaSabhaPage() {
  await connectDB();
  const rawMps = await Politician.find({ chamber: "Rajya Sabha" })
    .select("name slug state partyName photo")
    .sort({ state: 1, name: 1 })
    .lean();

  const mps = rawMps;

  return (
    <Ledger>
      <LedgerHeader
        title="Rajya Sabha Upper House"
        subtitle="Permanent institutional registry of the Rajya Sabha. Member distribution categorized by regional representation and presidential nomination."
        badge="Council of States"
        icon={<Database className="h-3 w-3" />}
        stats={[
          { label: "Total Capacity", value: 245 },
          { label: "Active Registry", value: mps.length }
        ]}
      />

      <LedgerContent>
        <div className="rounded-md border border-border overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted/50">
                <TableHead className="w-[300px]">Member of Parliament</TableHead>
                <TableHead>Representing State/UT</TableHead>
                <TableHead>Political Affiliation</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mps.map((mp: any) => (
                <TableRow key={mp.slug} className="group border-b border-border/50">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-10 w-10 border border-border rounded-sm grayscale group-hover:grayscale-0 transition-all">
                          <AvatarImage src={mp.photo} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground font-bold text-xs rounded-none">
                            {mp.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 h-3 w-3 bg-success border-2 border-background rounded-full" title="Verified active" />
                      </div>
                      <div className="flex flex-col">
                        <Link href={`/politicians/${mp.slug}`} className="font-bold text-foreground hover:text-indigo-600 transition-colors underline-offset-4 hover:underline decoration-indigo-500/30">
                          {mp.name}
                        </Link>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">ID: {mp.slug.substring(0, 8)}...</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <StateIcon stateName={mp.state} mode="simple" className="w-4 h-4 text-muted-foreground group-hover:text-indigo-500 transition-colors" />
                      <span className="text-xs font-bold text-foreground uppercase tracking-tight">{mp.state}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[9px] border-border group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all">
                      {mp.partyName || "Independent"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <Link href={`/politicians/${mp.slug}`} className="inline-flex items-center justify-center h-8 w-8 rounded border border-border bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-all">
                       <Info className="h-3.5 w-3.5" />
                     </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </LedgerContent>

      <LedgerFooter label="Source: Rajya Sabha Secretariat" />
    </Ledger>
  );
}

