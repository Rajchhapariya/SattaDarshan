"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { 
  Menu, 
  X, 
  Landmark, 
  Users, 
  Flag, 
  MapPin, 
  ArrowRightLeft, 
  Sun, 
  Moon, 
  Compass,
  ChevronRight
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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-blur]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-sm">
            <Landmark className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-foreground text-base tracking-tight leading-none">
              Satta<span className="text-amber-500">Darshan</span>
            </span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5 hidden sm:inline-block">
              India Legislative Portal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const isActive = path === item.href || (item.href !== "/" && path.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3.5 py-2 rounded-lg text-sm font-semibold transition-all",
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

          {/* Theme Toggle Button */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle color theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-xl border border-border bg-card hover:bg-muted transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
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
                    "flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
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

            <div className="pt-3 mt-2 border-t border-border/60 flex items-center justify-between px-3 text-xs text-muted-foreground">
              <span>Theme: {theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-xs font-semibold text-primary"
              >
                Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
