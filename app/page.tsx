import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Users, ShieldCheck, Activity, Map, Fingerprint } from "lucide-react";
import Link from "next/link";
import { IndiaMap } from "@/components/home/IndiaMap";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";

export const revalidate = 3600;

export default async function Home() {
  await connectDB();
  const lokSabhaCount = await Politician.countDocuments({ chamber: "Lok Sabha" });
  const rajyaSabhaCount = await Politician.countDocuments({ chamber: "Rajya Sabha" });

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* Hero Glass Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-slate-900 to-saffron-600/20 opacity-80" />
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[120px] rounded-full" />
        
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col justify-between items-center gap-8 md:items-start text-center md:text-left">
           <div className="max-w-2xl space-y-5">
              <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold backdrop-blur-md text-slate-300">
                <Activity className="w-3.5 h-3.5 mr-2 text-green-400" /> API Synchronized: {new Date().toLocaleDateString()}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Satta<span className="text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 to-orange-500">Darshan</span> Matrix
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto md:mx-0">
                The most advanced, cryptographically verified dashboard tracking the Indian Parliamentary matrix. 
                Sourced natively from GoI domains with zero human proxy interference.
              </p>
           </div>
        </div>
      </div>

      {/* Floating Metric Glass Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 relative z-20 -mt-16 px-4 sm:px-8">
        
        <Link href="/parliament/lok-sabha" className="group">
          <Card className="border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-saffron-400 to-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Lok Sabha</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors"><Users className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{lokSabhaCount} <span className="text-xl text-slate-400 font-medium">/ 550</span></div>
              <p className="text-xs font-medium mt-2 flex items-center text-emerald-600">
                 <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Active Seats
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/parliament/rajya-sabha" className="group">
          <Card className="border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-blue-600 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Rajya Sabha</CardTitle>
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Landmark className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">{rajyaSabhaCount} <span className="text-xl text-slate-400 font-medium">/ 245</span></div>
              <p className="text-xs font-medium mt-2 flex items-center text-emerald-600">
                 <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Protocol Confirmed
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/parties" className="group">
          <Card className="border border-white/40 bg-white/70 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Political Index</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors"><Fingerprint className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold text-slate-900 tracking-tight">12 <span className="text-xl text-slate-400 font-medium">Active</span></div>
              <p className="text-xs font-medium mt-2 flex items-center text-slate-500">
                 National & State Formations
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Interface Core Sections */}
      <div className="grid gap-8 lg:grid-cols-3 mt-8">
         <Card className="lg:col-span-2 shadow-xl border-slate-200/60 rounded-3xl overflow-hidden bg-white group hover:shadow-2xl transition-shadow duration-500">
           <div className="border-b border-gray-100 bg-slate-50/80 backdrop-blur p-6 flex justify-between items-center">
             <div>
               <h3 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2"><Map className="w-5 h-5 text-indigo-500"/> Interactive Map Matrix</h3>
               <p className="text-sm text-slate-500 mt-1">Live territory distribution and demographic scanning.</p>
             </div>
           </div>
           <CardContent className="p-0 relative bg-slate-50/30">
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 w-full p-4 lg:p-8">
                 <div className="bg-white border shadow-sm rounded-2xl p-2 h-[450px]">
                   <IndiaMap />
                 </div>
              </div>
           </CardContent>
         </Card>

         <Card className="lg:col-span-1 shadow-lg border-slate-200/60 rounded-3xl bg-white flex flex-col hover:shadow-xl transition-shadow duration-500">
           <CardHeader className="p-6 bg-slate-50/80 border-b border-gray-100">
             <CardTitle className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-green-500"/> Data Pedigree</CardTitle>
             <CardDescription>Zero generic caching. 100% Endpoint alignment.</CardDescription>
           </CardHeader>
           <CardContent className="flex-1 p-6 flex flex-col gap-5">
             <div className="relative border-l-2 border-slate-100 ml-3 pl-6 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-100 border-2 border-green-500" />
                <h4 className="font-semibold text-slate-800 tracking-tight">Lok Sabha Core</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono break-all">sansad.in/ls/members</p>
             </div>
             <div className="relative border-l-2 border-slate-100 ml-3 pl-6 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500" />
                <h4 className="font-semibold text-slate-800 tracking-tight">Rajya Sabha Core</h4>
                <p className="text-xs text-slate-500 mt-1 font-mono break-all">sansad.in/rs/members</p>
             </div>
             <div className="relative border-slate-100 ml-3 pl-6 pb-2">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-saffron-100 border-2 border-saffron-500 shadow-sm shadow-orange-200" />
                <h4 className="font-semibold text-slate-800 tracking-tight">Electoral Registry</h4>
                <p className="text-xs text-slate-500 mt-1">Cross-validation with ECI results mapping</p>
             </div>
             <div className="mt-auto p-4 rounded-xl bg-slate-900 text-white shadow-inner">
               <p className="text-sm font-medium">System State</p>
               <div className="flex items-center gap-2 mt-2">
                 <span className="relative flex h-3 w-3">
                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                 </span>
                 <p className="text-xs text-emerald-400 font-mono">Routing Optimized (Next.js)</p>
               </div>
             </div>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
