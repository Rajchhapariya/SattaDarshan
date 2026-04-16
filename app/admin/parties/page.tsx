"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminPartiesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/parties?limit=200")
      .then((r) => r.json())
      .then((d) => setRows(d.parties || []))
      .catch(() => setRows([]));
  }, []);

  const deleteParty = async (slug: string) => {
    if (!confirm("Delete party " + slug + "?")) return;
    await fetch(`/api/parties/${slug}`, { method: "DELETE" });
    setRows((prev) => prev.filter((item) => item.slug !== slug));
  };

  const filtered = rows.filter((r) => [r.name, r.abbr, r.tier, r.president].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Party Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create, update and review party profiles.</p>
        </div>
        <Link href="/admin/parties/new" className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">+ Add Party</Link>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search parties..." className="w-full sm:w-72 h-10 px-3 rounded-xl border border-gray-200 text-sm" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Tier</th>
              <th className="px-4 py-3 text-left">President</th>
              <th className="px-4 py-3 text-left">Lok Sabha</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.slug} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.tier || "N/A"}</td>
                <td className="px-4 py-3">{p.president || "N/A"}</td>
                <td className="px-4 py-3">{p.seatsLokSabha ?? 0}</td>
                <td className="px-4 py-3 flex gap-3">
                  <Link href={`/admin/parties/${p.slug}`} className="text-xs text-indigo-600 hover:underline">Edit</Link>
                  <button onClick={() => deleteParty(p.slug)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
