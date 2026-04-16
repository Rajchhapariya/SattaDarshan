"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { label: string; sub: string; href: string };

export function GlobalSearch() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!q.trim()) {
      setItems([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setItems(d.items || []))
        .catch(() => setItems([]));
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="relative hidden xl:block">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search..."
        className="h-9 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 text-sm"
      />
      {items.length > 0 ? (
        <div className="absolute z-40 top-11 left-0 right-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1">
          {items.map((it) => (
            <Link key={it.href} href={it.href} onClick={() => setQ("")} className="block px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <p className="text-sm">{it.label}</p>
              <p className="text-xs text-gray-400">{it.sub}</p>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
