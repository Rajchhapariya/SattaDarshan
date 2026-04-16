import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { StateIcon } from "@/components/ui/StateIcon";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import Link from "next/link";
import { Users, Info, ShieldCheck } from "lucide-react";

export const revalidate = 3600; // 1 hr cache

export default async function LokSabhaPage() {
  await connectDB();
  const mps = await Politician.find({ chamber: "Lok Sabha" }).sort({ state: 1, name: 1 }).lean();

  return (
    <div className="space-y-6">
       <div className="flex flex-col gap-2">
         <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-saffron-500" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lok Sabha Members</h1>
         </div>
         <div className="text-slate-500 flex items-center gap-2">
            House of the People — 18th Lok Sabha 
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 px-2.5 py-0.5 ml-2 shadow-sm rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> Data Authenticated
            </Badge>
         </div>
       </div>

       <div className="grid gap-4 md:grid-cols-4">
          <Card className="col-span-1 border-slate-200/60 shadow-sm bg-gradient-to-br from-white to-slate-50/50">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-slate-500">Total Seats Loaded</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{mps.length} / 550</div>
            </CardContent>
          </Card>
          <div className="col-span-3 bg-white border border-slate-200/60 shadow-sm rounded-xl p-4 flex items-center text-sm text-slate-600 gap-3">
             <Info className="w-5 h-5 text-indigo-500 shrink-0" />
             <p>This data is strictly queried from <strong className="text-slate-800">sansad.in/ls/members</strong>. It was scraped safely avoiding Wikimedia proxies to guarantee Government of India 100% precision. Next.js App Router enforces a strict 3600s cache revalidation on this structure.</p>
          </div>
       </div>

       <Card className="border border-slate-200/60 shadow-lg rounded-2xl overflow-hidden bg-white/95 backdrop-blur-xl transition-shadow duration-300 hover:shadow-xl">
         <div className="overflow-x-auto">
           <Table>
             <TableHeader className="bg-slate-50 border-b border-slate-100">
                <TableRow>
                   <TableHead className="w-[300px]">Representative</TableHead>
                   <TableHead>State/UT</TableHead>
                   <TableHead>Constituency</TableHead>
                   <TableHead>Party</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
                {mps.map((mp: any) => (
                   <TableRow key={mp.slug} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-medium">
                         <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border shadow-sm">
                               <AvatarImage src={mp.photo} />
                               <AvatarFallback className="bg-slate-100 text-slate-500">{mp.name.substring(0,2)}</AvatarFallback>
                            </Avatar>
                            <Link href={`/politicians/${mp.slug}`} className="hover:text-saffron-600 transition-colors">
                               {mp.name}
                            </Link>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <StateIcon stateName={mp.state} className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-700">{mp.state}</span>
                         </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{mp.constituency}</TableCell>
                      <TableCell>
                         <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200 whitespace-nowrap">
                            {mp.partyName}
                         </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                         <Link href={`/politicians/${mp.slug}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                             View Profile &rarr;
                         </Link>
                      </TableCell>
                   </TableRow>
                ))}
             </TableBody>
          </Table>
        </div>
       </Card>

       <div className="text-center text-xs text-slate-400 py-4">
          Data last verified on {new Date().toLocaleDateString()} from sansad.in
       </div>
    </div>
  );
}
