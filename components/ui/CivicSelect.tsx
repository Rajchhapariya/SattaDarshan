"use client";

import * as React from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
  badge?: string;
};

export type CivicSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
  id?: string;
  name?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export function CivicSelect({
  value,
  onChange,
  options,
  placeholder = "Select an option...",
  searchPlaceholder = "Search...",
  className,
  id,
  name,
  ariaLabel,
  disabled = false,
}: CivicSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState(0);
  const [openUpward, setOpenUpward] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Enable inline search only when list has more than 8 options
  const showSearch = options.length > 8;

  const filteredOptions = React.useMemo(() => {
    if (!showSearch || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(q));
  }, [options, searchQuery, showSearch]);

  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Check available viewport space to prevent clipping
  const checkPosition = React.useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 280px below and more space above, open upward
      setOpenUpward(spaceBelow < 280 && spaceAbove > spaceBelow);
    }
  }, []);

  const handleToggle = () => {
    if (disabled) return;
    checkPosition();
    setOpen((prev) => {
      const next = !prev;
      if (next && showSearch) {
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      return next;
    });
  };

  const handleSelect = React.useCallback(
    (val: string) => {
      onChange(val);
      setOpen(false);
      setSearchQuery("");
      triggerRef.current?.focus();
    },
    [onChange]
  );

  // Close when clicking or tapping outside
  React.useEffect(() => {
    const handleOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          filteredOptions.length > 0 ? (prev + 1) % filteredOptions.length : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          filteredOptions.length > 0
            ? (prev - 1 + filteredOptions.length) % filteredOptions.length
            : 0
        );
        break;
      case "Home":
        e.preventDefault();
        setHighlightedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightedIndex(Math.max(0, filteredOptions.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex].value);
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

  // Scroll active option into view
  React.useEffect(() => {
    if (open && listRef.current) {
      const activeEl = listRef.current.querySelector(
        `[data-index="${highlightedIndex}"]`
      ) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, open]);

  const activeOptionId =
    open && filteredOptions[highlightedIndex]
      ? `civic-select-option-${filteredOptions[highlightedIndex].value}`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={cn("relative inline-block w-full sm:w-auto", className)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={triggerRef}
        id={id}
        name={name}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? "civic-select-listbox" : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={activeOptionId}
        aria-label={ariaLabel || (selectedOption ? selectedOption.label : placeholder)}
        onClick={handleToggle}
        className={cn(
          "flex w-full sm:w-auto items-center justify-between gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2.5 text-left text-sm font-medium text-foreground shadow-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/25 transition-colors min-h-[44px]",
          open && "ring-2 ring-primary/25 border-primary/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className={cn("truncate text-xs sm:text-sm", !selectedOption && "text-muted-foreground")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
            open && "rotate-180 text-primary"
          )}
        />
      </button>

      {open && (
        <div
          id="civic-select-listbox"
          role="listbox"
          aria-label={ariaLabel || placeholder}
          className={cn(
            "absolute z-50 w-full min-w-[220px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-1.5 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150",
            openUpward ? "bottom-full mb-1.5" : "top-full mt-1.5",
            "left-0"
          )}
        >
          {/* Search Header for Long Lists */}
          {showSearch && (
            <div className="flex items-center gap-2 border-b border-border/70 px-2.5 pb-2 pt-1">
              <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[24px] min-w-[24px] flex items-center justify-center"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}

          {/* Options List */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto pt-1 space-y-0.5 overscroll-contain"
          >
            {filteredOptions.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted-foreground">No options found</p>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = opt.value === value;
                const isHighlighted = index === highlightedIndex;
                return (
                  <button
                    key={opt.value}
                    id={`civic-select-option-${opt.value}`}
                    data-index={index}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-xs sm:text-sm transition-colors min-h-[44px]",
                      isHighlighted
                        ? "bg-primary/10 text-primary font-medium"
                        : isSelected
                        ? "bg-muted font-semibold text-foreground"
                        : "text-foreground hover:bg-muted/60"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    )}
                    {opt.badge && !isSelected && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-muted text-muted-foreground flex-shrink-0">
                        {opt.badge}
                      </span>
                    )}
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
