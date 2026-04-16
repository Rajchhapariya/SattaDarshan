"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";

type Politician = {
  slug: string;
  name: string;
  role?: string;
  partyName?: string;
  state?: string;
  constituency?: string;
  assets?: string;
  criminalCases?: number;
  education?: string;
};

export default function ComparePage() {
  const [all, setAll] = useState<Politician[]>([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/politicians?limit=1000")
      .then((r) => r.json())
      .then((d) => setAll(d.politicians || []))
      .catch(() => setAll([]));
  }, []);

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return all.slice(0, 40);
    return all.filter((p) => [p.name, p.partyName, p.state].join(" ").toLowerCase().includes(key)).slice(0, 40);
  }, [all, q]);

  const leftData = all.find((p) => p.slug === left);
  const rightData = all.find((p) => p.slug === right);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold">Compare Politicians</h1>
        <p className="text-sm text-gray-500 mt-1">Side-by-side comparison of assets, cases, role, and party.</p>
        <div className="mt-6">
          <SearchBar value={q} onChange={setQ} placeholder="Search politicians for quick selection..." className="max-w-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[{ label: "Left", value: left, setValue: setLeft }, { label: "Right", value: right, setValue: setRight }].map((slot) => (
            <div key={slot.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 block">{slot.label}</label>
              <select value={slot.value} onChange={(e) => slot.setValue(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-transparent px-3 py-2 text-sm">
                <option value="">Select politician</option>
                {filtered.map((p) => (
                  <option key={p.slug} value={p.slug}>
                    {p.name} — {p.partyName || "Independent"}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {[leftData, rightData].map((p, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 min-h-[320px]">
              {!p ? (
                <p className="text-sm text-gray-400">Select a politician to compare.</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  <div className="flex justify-between"><span className="text-gray-400">Role</span><span>{p.role || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Party</span><span>{p.partyName || "Independent"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">State</span><span>{p.state || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Constituency</span><span>{p.constituency || "N/A"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Criminal Cases</span><span className={p.criminalCases && p.criminalCases > 0 ? "text-red-600" : "text-green-600"}>{p.criminalCases ?? 0}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Assets</span><span>{p.assets || "Not disclosed"}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Education</span><span>{p.education || "N/A"}</span></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
