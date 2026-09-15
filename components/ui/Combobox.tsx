"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
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
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [openUpward, setOpenUpward] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  const filteredItems = React.useMemo(() => {
    if (!query.trim()) return items.slice(0, 100);
    const q = query.toLowerCase();
    return items
      .filter((item) => item.label.toLowerCase().includes(q) || (item.sub && item.sub.toLowerCase().includes(q)))
      .slice(0, 50);
  }, [items, query]);

  // Reset highlighted index when filtered items change
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredItems]);

  // Calculate if dropdown should flip upward to prevent clipping
  const checkPosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 280px below and more space above, open upward
      setOpenUpward(spaceBelow < 280 && spaceAbove > spaceBelow);
    }
  }, []);

  const handleOpen = () => {
    checkPosition();
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        // Focus search input on open
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return next;
    });
  };

  const handleSelect = React.useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setQuery("");
      triggerRef.current?.focus();
    },
    [onChange]
  );

  // Click & touch outside listener to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0
        );
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(Math.max(0, filteredItems.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view automatically
  React.useEffect(() => {
    if (open && listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, open]);

  const activeOptionId =
    open && filteredItems[highlightedIndex]
      ? `combobox-option-${filteredItems[highlightedIndex].value}`
      : undefined;

  return (
    <div ref={dropdownRef} className={cn("relative w-full", className)} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? "combobox-options-list" : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={activeOptionId}
        aria-label={selectedItem ? `Selected: ${selectedItem.label}` : placeholder}
        onClick={handleOpen}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm font-medium text-foreground shadow-sm hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors min-h-[44px]"
      >
        {selectedItem ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <CivicAvatar
              src={selectedItem.photo}
              alt={selectedItem.label}
              size="xs"
              shape="circle"
              className="border border-border flex-shrink-0"
            />
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
        <div
          id="combobox-options-list"
          role="listbox"
          aria-label={placeholder}
          className={cn(
            "absolute z-50 w-full left-0 max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-1.5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-150",
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5"
          )}
        >
          {/* Search Header */}
          <div className="flex items-center gap-2 border-b border-border/60 px-2.5 pb-2 pt-1">
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  searchInputRef.current?.focus();
                }}
                aria-label="Clear search input"
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div ref={listRef} className="max-h-64 overflow-y-auto pt-1 space-y-0.5 overscroll-contain">
            {filteredItems.length === 0 ? (
              <p className="py-5 text-center text-xs text-muted-foreground">{emptyText}</p>
            ) : (
              filteredItems.map((item, index) => {
                const isSelected = item.value === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <button
                    key={item.value}
                    id={`combobox-option-${item.value}`}
                    data-index={index}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors min-h-[44px]",
                      isHighlighted
                        ? "bg-primary/10 text-primary font-medium"
                        : isSelected
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <CivicAvatar
                        src={item.photo}
                        alt={item.label}
                        size="xs"
                        shape="circle"
                        className="border border-border flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-xs sm:text-sm">{item.label}</p>
                        {item.sub && <p className="truncate text-[11px] text-muted-foreground">{item.sub}</p>}
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
