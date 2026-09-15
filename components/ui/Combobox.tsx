"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { cn } from "@/lib/utils";

export type ComboboxItem = {
  value: string;
  label: string;
  sub?: string;
  photo?: string;
  badge?: string;
};

type ComboboxProps = {
  items: ComboboxItem[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
};

export function Combobox({
  items,
  value,
  onChange,
  placeholder = "Select an item...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items.slice(0, 100);
    const q = query.toLowerCase();
    return items
      .filter((item) => item.label.toLowerCase().includes(q) || (item.sub && item.sub.toLowerCase().includes(q)))
      .slice(0, 50);
  }, [items, query]);

  // Click outside listener to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm font-medium text-foreground shadow-sm hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
      >
        {selectedItem ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <CivicAvatar src={selectedItem.photo} alt={selectedItem.label} size="xs" shape="circle" className="border border-border flex-shrink-0" />
            <span className="truncate font-semibold">{selectedItem.label}</span>
            {selectedItem.badge && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground truncate">
                {selectedItem.badge}
              </span>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-popover p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="flex items-center gap-2 border-b border-border/60 px-2.5 pb-2 pt-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="max-h-60 overflow-y-auto pt-1 space-y-0.5">
            {filteredItems.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">{emptyText}</p>
            ) : (
              filteredItems.map((item) => {
                const isSelected = item.value === value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      onChange(item.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CivicAvatar src={item.photo} alt={item.label} size="xs" shape="circle" className="border border-border flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-xs sm:text-sm">{item.label}</p>
                        {item.sub && (
                          <p className="truncate text-[11px] text-muted-foreground">{item.sub}</p>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
