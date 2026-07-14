"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ChevronRight, 
  LayoutDashboard,
  ShieldCheck
} from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/politicians", label: "Politicians" },
  { href: "/parties", label: "Political Index" },
  { href: "/states", label: "Regional Jurisdictions" },
  { href: "/map", label: "Geospatial Matrix" },
  { href: "/compare", label: "Data Comparison" },
];

export function Navbar() {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-primary bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-foreground text-sm tracking-tight hidden sm:inline-block">
            Satta<span className="text-primary">Darshan</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors hover:text-foreground",
                path.startsWith(l.href)
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/parliament/lok-sabha"
            className={cn(
              "px-3 py-1.5 text-xs font-semibold tracking-wide uppercase transition-colors hover:text-foreground",
              path.includes("/parliament")
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            Parliament
          </Link>
        </nav>

        <div className="flex flex-1 items-center justify-end gap-3">
          <GlobalSearch />
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-md border border-border hover:bg-accent transition-colors"
            aria-label="Toggle navigation matrix"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Ledger Navigation */}
      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
          <div className="px-4 py-4 space-y-1">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                {l.label}
                <ChevronRight className="h-4 w-4 opacity-50" />
              </Link>
            ))}
            <Link
              href="/parliament/lok-sabha"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Parliament Ledger
              <ChevronRight className="h-4 w-4 opacity-50" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
