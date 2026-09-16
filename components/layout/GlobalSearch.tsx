"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Search, 
  User, 
  Flag, 
  MapPin, 
  Landmark,
  Loader2
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/Command";

type SearchResult = {
  type: "politician" | "party" | "state";
  label: string;
  sub: string;
  href: string;
  photo?: string;
  logo?: string;
};

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.items || []);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Mobile: compact icon-only button. sm+: full labelled search bar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="group relative flex h-10 w-10 sm:h-9 sm:w-56 lg:w-48 xl:w-64 flex-shrink-0 items-center justify-center sm:justify-between gap-2 rounded-xl border border-border bg-card sm:px-3 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground shadow-sm"
      >
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="hidden sm:block truncate text-xs sm:text-sm">Search leaders, parties, states...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex flex-shrink-0">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search by leader name, constituency, party, or state..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="font-sans">
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              "No matching records found."
            )}
          </CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading="Directory Results">
              {results.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => onSelect(item.href)}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg cursor-pointer"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0">
                    {item.photo ? (
                      <Image src={item.photo} alt={item.label} fill className="object-cover" />
                    ) : item.logo ? (
                      <Image src={item.logo} alt={item.label} width={24} height={24} className="object-contain" />
                    ) : item.type === "politician" ? (
                      <User className="h-4 w-4 text-primary" />
                    ) : item.type === "party" ? (
                      <Flag className="h-4 w-4 text-amber-500" />
                    ) : (
                      <MapPin className="h-4 w-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-foreground truncate">{item.label}</span>
                    <span className="text-xs text-muted-foreground truncate">{item.sub}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          
          <CommandGroup heading="Quick Navigation">
            <CommandItem onSelect={() => onSelect("/parliament/lok-sabha")} className="cursor-pointer">
              <Landmark className="mr-2 h-4 w-4 text-primary" />
              <span>18th Lok Sabha Directory</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/parliament/rajya-sabha")} className="cursor-pointer">
              <Landmark className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Rajya Sabha Registry</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/politicians")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4 text-blue-500" />
              <span>Browse All Representatives</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/parties")} className="cursor-pointer">
              <Flag className="mr-2 h-4 w-4 text-amber-500" />
              <span>Political Parties Index</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/states")} className="cursor-pointer">
              <MapPin className="mr-2 h-4 w-4 text-purple-500" />
              <span>States & Territories Hub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
