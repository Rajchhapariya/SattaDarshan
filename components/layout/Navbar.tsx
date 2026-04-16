"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GlobalSearch } from "./GlobalSearch";

const LINKS = [
  { href: "/politicians", label: "Politicians" },
  { href: "/parties", label: "Parties" },
  { href: "/states", label: "States" },
  { href: "/map", label: "Map" },
  { href: "/compare", label: "Compare" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-indigo-700 flex items-center justify-center shadow-md">
            <span className="text-white font-black text-sm">SD</span>
          </div>
          <span className="font-extrabold text-gray-900 text-base tracking-tight">SattaDarshan</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                path.startsWith(l.href)
                  ? "bg-orange-50 text-orange-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/parliament/lok-sabha"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              path.includes("/parliament")
                ? "bg-orange-50 text-orange-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            Parliament
          </Link>
        </nav>

        <GlobalSearch />

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-xl transition-colors"
          aria-label="Toggle mobile menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1 shadow-lg">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/parliament/lok-sabha"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Parliament
          </Link>
        </div>
      )}
    </header>
  );
}
