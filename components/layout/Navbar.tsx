"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  Landmark, 
  Users, 
  Flag, 
  MapPin, 
  ArrowRightLeft, 
  Compass,
  ChevronRight,
  FileEdit
} from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/parliament/lok-sabha", label: "Parliament", icon: Landmark },
  { href: "/politicians", label: "Leaders & MPs", icon: Users },
  { href: "/parties", label: "Parties", icon: Flag },
  { href: "/states", label: "States & UTs", icon: MapPin },
  { href: "/compare", label: "Compare", icon: ArrowRightLeft },
  { href: "/map", label: "Map Explorer", icon: Compass },
];

export function Navbar() {
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Handle Escape key and body scroll lock when mobile drawer is open
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  // Close mobile menu whenever path changes
  React.useEffect(() => {
    setMobileOpen(false);
  }, [path]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90 flex-shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
              <Landmark className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-foreground text-base tracking-tight leading-none">
                Satta<span className="text-amber-500">Darshan</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5 hidden sm:inline-block">
                Independent Civic Platform
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {NAV_LINKS.map((item) => {
            const isActive = path === item.href || (item.href !== "/" && path.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Items: Search, Theme Toggle, Mobile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          <GlobalSearch />

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            className="lg:hidden h-10 w-10 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted transition-colors min-h-[44px] min-w-[44px]"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200"
        >
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = path === item.href || (item.href !== "/" && path.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-40" />
                </Link>
              );
            })}

            {/* Quick Correction Link on Mobile */}
            <Link
              href="/corrections"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium text-amber-600 hover:bg-muted transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-3">
                <FileEdit className="h-4 w-4" />
                <span>Suggest a Correction</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-40" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
