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
  type: "politician" | "party" | "state" | "chamber";
  label: string;
  sub: string;
  href: string;
  photo?: string;
  logo?: string;
};

const TYPE_BADGE_CONFIG: Record<
  SearchResult["type"],
  { label: string; badgeClass: string; icon: React.ElementType; iconClass: string }
> = {
  politician: {
    label: "Leader",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
    icon: User,
    iconClass: "text-blue-600",
  },
  party: {
    label: "Party",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Flag,
    iconClass: "text-amber-600",
  },
  state: {
    label: "State",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: MapPin,
    iconClass: "text-emerald-600",
  },
  chamber: {
    label: "Chamber",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Landmark,
    iconClass: "text-purple-600",
  },
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
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(data.items || []);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          // Request was aborted due to new input, ignore
          return;
        }
        console.error("Search fetch failed:", error);
        setResults([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const onSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {/* Mobile: compact icon-only button (min 44px). sm+: full labelled search bar */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open search"
        className="group relative flex h-11 w-11 sm:h-9 sm:w-56 lg:w-48 xl:w-64 flex-shrink-0 items-center justify-center sm:justify-between gap-2 rounded-xl border border-border bg-card sm:px-3 text-sm text-muted-foreground transition-all hover:bg-muted hover:text-foreground shadow-sm"
      >
        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="hidden sm:block truncate text-xs sm:text-sm">Search leaders, parties, states...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex flex-shrink-0">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} shouldFilter={false}>
        <CommandInput 
          placeholder="Search by leader name, constituency, party, or state..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="font-sans">
          <CommandEmpty>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary mb-2" />
                <span className="text-xs">Searching civic directory...</span>
              </div>
            ) : query.trim() ? (
              <div className="py-6 text-center text-muted-foreground text-sm">
                No matching civic records found for &quot;<span className="font-semibold text-foreground">{query}</span>&quot;.
              </div>
            ) : null}
          </CommandEmpty>
          
          {results.length > 0 && (
            <CommandGroup heading={`Directory Results (${results.length})`}>
              {results.map((item) => {
                const config = TYPE_BADGE_CONFIG[item.type] || TYPE_BADGE_CONFIG.politician;
                const FallbackIcon = config.icon;

                return (
                  <CommandItem
                    key={item.href}
                    value={item.href}
                    onSelect={() => onSelect(item.href)}
                    className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg cursor-pointer min-h-[44px] hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border border-border flex items-center justify-center flex-shrink-0">
                        {item.photo ? (
                          <Image src={item.photo} alt={item.label} fill className="object-cover" />
                        ) : item.logo ? (
                          <Image src={item.logo} alt={item.label} width={24} height={24} className="object-contain" />
                        ) : (
                          <FallbackIcon className={`h-4 w-4 ${config.iconClass}`} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-sm text-foreground truncate">{item.label}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.sub}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border flex-shrink-0 ${config.badgeClass}`}>
                      {config.label}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {results.length > 0 && <CommandSeparator />}
          
          <CommandGroup heading={results.length > 0 ? "Quick Links" : "Civic Directory Hubs"}>
            <CommandItem value="/parliament/lok-sabha" onSelect={() => onSelect("/parliament/lok-sabha")} className="cursor-pointer min-h-[44px]">
              <Landmark className="mr-2 h-4 w-4 text-primary shrink-0" />
              <span className="text-sm">18th Lok Sabha Directory</span>
            </CommandItem>
            <CommandItem value="/parliament/rajya-sabha" onSelect={() => onSelect("/parliament/rajya-sabha")} className="cursor-pointer min-h-[44px]">
              <Landmark className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-sm">Rajya Sabha Registry</span>
            </CommandItem>
            <CommandItem value="/politicians" onSelect={() => onSelect("/politicians")} className="cursor-pointer min-h-[44px]">
              <User className="mr-2 h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-sm">Browse All Representatives</span>
            </CommandItem>
            <CommandItem value="/parties" onSelect={() => onSelect("/parties")} className="cursor-pointer min-h-[44px]">
              <Flag className="mr-2 h-4 w-4 text-amber-600 shrink-0" />
              <span className="text-sm">Political Parties Index</span>
            </CommandItem>
            <CommandItem value="/states" onSelect={() => onSelect("/states")} className="cursor-pointer min-h-[44px]">
              <MapPin className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-sm">States & Territories Hub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
