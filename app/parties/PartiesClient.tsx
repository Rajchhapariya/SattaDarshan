"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { SearchBar } from "@/components/ui/SearchBar";
import { Pagination } from "@/components/ui/Pagination";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
const TIERS = ["All","National","State","RUPP"];

type PartySummary = {
  slug: string;
  name: string;
  abbr?: string;
  tier?: string;
  status?: string;
  logo?: string;
  seatsLokSabha?: number;
};

export function PartiesClient() {
  const [data,setData] = useState<PartySummary[]>([]); const [total,setTotal] = useState(0);
  const [pages,setPages] = useState(1); const [page,setPage] = useState(1);
  const [q,setQ] = useState(""); const [tier,setTier] = useState("All"); const [loading,setLoading] = useState(true);
  const [mounted,setMounted] = useState(false);
  const fetchData = useCallback(()=>{
    setLoading(true);
    const p = new URLSearchParams({page:String(page),limit:"50"});
    if(q) p.set("q",q); if(tier!=="All") p.set("tier",tier);
    fetch("/api/parties?"+p).then(r=>r.json()).then(d=>{setData(d.parties??[]);setTotal(d.total??0);setPages(d.pages??1);setLoading(false);}).catch(()=>setLoading(false));
  },[q,tier,page]);
  useEffect(()=>{fetchData();},[fetchData]);
  useEffect(()=>{setMounted(true);},[]);
  const tierStats = [
    { name: "National", value: data.filter((x) => x.tier === "National").length },
    { name: "State", value: data.filter((x) => x.tier === "State").length },
    { name: "RUPP", value: data.filter((x) => x.tier === "RUPP").length },
  ];
  const COLORS = ["#4f46e5", "#10b981", "#f97316"];
  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mb-1">Browse</p>
          <h1 className="text-3xl font-bold text-gray-900">Political Parties</h1>
          <p className="text-sm text-gray-500 mt-1">{total.toLocaleString("en-IN")} parties</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          <SearchBar value={q} onChange={v=>{setQ(v);setPage(1);}} placeholder="Search parties..." className="w-full sm:w-72"/>
          <div className="flex gap-1.5">{TIERS.map(t=><button key={t} onClick={()=>{setTier(t);setPage(1);}} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${tier===t?"bg-indigo-600 text-white":"bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{t}</button>)}</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <p className="text-sm font-semibold mb-2">Party Tier Distribution</p>
          <div className="h-52">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tierStats} dataKey="value" nameKey="name" outerRadius={75}>
                    {tierStats.map((entry, index) => <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full bg-gray-50 rounded-xl" />
            )}
          </div>
        </div>
        {loading?<p className="text-center py-20 text-gray-400">Loading...</p>
          :data.length===0?<p className="text-center py-20 text-gray-400">No parties found.</p>
          :<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data.map((p)=>(
              <Link key={p.slug} href={"/parties/"+p.slug} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 group">
                <div className="flex items-center gap-3 mb-3">
                  {p.logo&&<img src={p.logo} alt={p.abbr||p.name} className="w-8 h-8 object-contain"/>} 
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{p.abbr||p.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{p.name}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${p.tier==="National"?"bg-indigo-50 text-indigo-700":p.tier==="State"?"bg-green-50 text-green-700":p.tier==="RUPP"?"bg-gray-100 text-gray-600":""}`}>{p.tier}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${p.status==="Active"?"bg-green-50 text-green-700":"bg-red-50 text-red-600"}`}>{p.status}</span>
                </div>
                {p.seatsLokSabha!==undefined&&<p className="text-xs text-orange-600 font-semibold mt-2">{p.seatsLokSabha} Lok Sabha seats</p>}
              </Link>
            ))}
          </div>}
        <Pagination page={page} pages={pages} onPageChange={setPage}/>
      </div>
    </div>
  );
}
