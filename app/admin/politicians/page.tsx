"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type AdminPolitician = {
  slug: string;
  name: string;
  role?: string;
  partyName?: string;
  state?: string;
};

export default function AdminPoliticians() {
  const [data,setData] = useState<AdminPolitician[]>([]); const [loading,setLoading] = useState(true);
  useEffect(()=>{ fetch("/api/politicians?limit=100").then(r=>r.json()).then(d=>setData((d.politicians??[]) as AdminPolitician[])).finally(()=>setLoading(false)); },[]);
  async function del(slug: string) {
    if(!confirm("Delete "+slug+"?")) return;
    await fetch("/api/politicians/"+slug,{method:"DELETE"});
    setData(d=>d.filter((p)=>p.slug!==slug));
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Politicians</h1>
        <Link href="/admin/politicians/new" className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">+ Add New</Link>
      </div>
      {loading?<p className="text-gray-400">Loading...</p>
        :<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Name","Role","Party","State",""].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.map((p)=>(
                <tr key={p.slug} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500">{p.role}</td>
                  <td className="px-4 py-3 text-gray-500">{p.partyName}</td>
                  <td className="px-4 py-3 text-gray-500">{p.state}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link href={"/admin/politicians/"+p.slug} className="text-xs text-indigo-600 hover:underline">Edit</Link>
                    <button onClick={()=>del(p.slug)} className="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
    </div>
  );
}
