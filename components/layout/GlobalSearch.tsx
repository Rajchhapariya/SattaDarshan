"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  User, 
  Flag, 
  Map as MapIcon, 
  Command as CommandIcon,
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
        setOpen((open) => !open);
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

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const onSelect = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground sm:w-64"
      >
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline-block">Search intelligence ledger...</span>
          <span className="sm:hidden">Search...</span>
        </div>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Type name, state, or party..." 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="font-sans">
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          
          {results.length > 0 && (
            <>
              <CommandGroup heading="Intelligence Ledger">
                {results.map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => onSelect(item.href)}
                    className="flex items-center gap-3 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-border bg-background">
                      {item.type === "politician" && <User className="h-4 w-4 text-primary" />}
                      {item.type === "party" && <Flag className="h-4 w-4 text-success" />}
                      {item.type === "state" && <MapIcon className="h-4 w-4 text-indigo-500" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">{item.label}</span>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">{item.sub}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          
          <CommandGroup heading="System Navigation">
            <CommandItem onSelect={() => onSelect("/politicians")}>
              <User className="mr-2 h-4 w-4" />
              <span>Browse Politicians</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/parties")}>
              <Flag className="mr-2 h-4 w-4" />
              <span>Political Index</span>
            </CommandItem>
            <CommandItem onSelect={() => onSelect("/parliament/lok-sabha")}>
              <CommandIcon className="mr-2 h-4 w-4" />
              <span>Lok Sabha Ledger</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
