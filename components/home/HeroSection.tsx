"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

type SearchItem = { label: string; sub: string; href: string };

export function HeroSection() {
  const router = useRouter();
  const [q,setQ] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const [open, setOpen] = useState(false);
  const fuse = useMemo(() => new Fuse(items, { keys: ["label", "sub"], threshold: 0.35 }), [items]);

  useEffect(() => {
    if (!q.trim()) {
      setOpen(false);
      return;
    }
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d.items || []);
        setOpen(true);
      })
      .catch(() => setItems([]));
  }, [q]);

  const suggestions = q.trim() ? fuse.search(q).map((r) => r.item).slice(0, 6) : [];

  return (
    <section className="bg-gradient-to-br from-orange-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-950 dark:to-indigo-950/30 py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-sm font-medium text-orange-600 mb-2" style={{fontFamily:'Noto Sans Devanagari,sans-serif'}}>सत्ता दर्शन</p>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">India&apos;s Political<br/><span className="text-orange-500">Transparency</span> Platform</h1>
        <p className="text-gray-500 mt-4 text-lg">Track politicians, parties & elections across all 36 states & UTs.</p>
        <div className="mt-8 flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&q.trim()&&router.push("/politicians?q="+encodeURIComponent(q))}
              placeholder="Search politicians, parties, states..." className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 bg-white shadow-sm"/>
            {open && suggestions.length > 0 && (
              <div className="absolute z-20 left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1 text-left">
                {suggestions.map((s) => (
                  <Link key={s.href} href={s.href} className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                    <p className="text-sm text-gray-800 dark:text-gray-100">{s.label}</p>
                    <p className="text-xs text-gray-400">{s.sub}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <button onClick={()=>q.trim()&&router.push("/politicians?q="+encodeURIComponent(q))} className="h-12 px-6 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm">Search</button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["Narendra Modi","Rahul Gandhi","Mamata Banerjee","Arvind Kejriwal","Yogi Adityanath"].map(n=>(
            <Link key={n} href={"/politicians?q="+encodeURIComponent(n)} className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-all shadow-sm">{n}</Link>
          ))}
        </div>
      </div>
    </section>
  );
}
