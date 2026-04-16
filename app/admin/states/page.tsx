"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminStatesPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/states").then((r) => r.json()).then(setRows).catch(() => setRows([]));
  }, []);

  const deleteState = async (slug: string) => {
    if (!confirm("Delete state " + slug + "?")) return;
    await fetch(`/api/states/${slug}`, { method: "DELETE" });
    setRows((prev) => prev.filter((item) => item.slug !== slug));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">State Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage state and UT profiles with CM and seat details.</p>
        </div>
        <Link href="/admin/states/new" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">+ Add State</Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map((s) => (
          <div key={s.slug} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.nameHindi}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/states/${s.slug}`} className="text-xs text-indigo-600 hover:underline">Edit</Link>
                <button onClick={() => deleteState(s.slug)} className="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
            <p className="text-xs text-gray-500">Ruling Party: {s.rulingParty || "N/A"}</p>
            <p className="text-xs text-gray-500">CM: {s.cm || "N/A"}</p>
            <p className="text-xs text-gray-500">Seats: {s.totalAssemblySeats ?? 0} assembly / {s.totalLokSabhaSeats ?? 0} LS</p>
          </div>
        ))}
      </div>
    </div>
  );
}
