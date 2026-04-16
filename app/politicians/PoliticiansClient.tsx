"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { Skeleton } from "@/components/ui/Skeleton";
const ROLES = ["All","PM","CM","Minister","MP","MLA","Party President","Governor","Other"];

type PoliticianSummary = {
  slug: string;
  name: string;
  photo?: string;
  role?: string;
  partyName?: string;
  constituency?: string;
};

export function PoliticiansClient() {
  const sp = useSearchParams();
  const [data,setData] = useState<PoliticianSummary[]>([]); const [total,setTotal] = useState(0);
  const [pages,setPages] = useState(1); const [loading,setLoading] = useState(true);
  const [q,setQ] = useState(sp.get("q")??""); const [role,setRole] = useState("All"); const [page,setPage] = useState(1);
  const fetchData = useCallback(()=>{
    setLoading(true);
    const p = new URLSearchParams({page:String(page),limit:"24"});
    if(q) p.set("q",q); if(role!=="All") p.set("role",role);
    fetch("/api/politicians?"+p).then(r=>r.json()).then(d=>{setData(d.politicians??[]);setTotal(d.total??0);setPages(d.pages??1);setLoading(false);}).catch(()=>setLoading(false));
  },[q,role,page]);
  useEffect(()=>{fetchData();},[fetchData]);
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-semibold text-orange-600 uppercase tracking-widest mb-1">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">Politicians</h1>
          <p className="text-sm text-gray-500 mt-1">{total.toLocaleString("en-IN")} records</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}} placeholder="Search by name..." className="w-full sm:w-72"/>
          <div className="flex gap-1.5 flex-wrap">
            {ROLES.map(r=><button key={r} onClick={()=>{setRole(r);setPage(1);}} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${role===r?"bg-orange-500 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{r}</button>)}
          </div>
        </div>
        {loading?<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">{Array.from({length:12}).map((_,i)=><Skeleton key={i} className="h-44"/>)}</div>
          :data.length===0?<div className="text-center py-20 text-gray-400">No politicians found.</div>
          :<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">{data.map((p)=><PoliticianCard key={p.slug} {...p}/>)}</div>}
        <Pagination page={page} pages={pages} onPageChange={setPage}/>
      </div>
    </div>
  );
}
