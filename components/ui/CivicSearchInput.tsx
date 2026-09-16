"use client";

import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type CivicSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  isLoading?: boolean;
  loading?: boolean;
  onClear?: () => void;
  className?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  autoFocus?: boolean;
  disabled?: boolean;
};

export function CivicSearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  isLoading = false,
  loading = false,
  onClear,
  className,
  ariaLabel = "Search",
  id,
  name,
  autoFocus = false,
  disabled = false,
}: CivicSearchInputProps) {
  const showLoading = isLoading || loading;
  const [localValue, setLocalValue] = React.useState(value);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Synchronize localValue when external value changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced notification to parent onChange
  React.useEffect(() => {
    if (debounceMs <= 0) {
      if (localValue !== value) {
        onChange(localValue);
      }
      return;
    }

    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleClear();
    }
  };

  return (
    <div className={cn("relative flex items-center w-full", className)}>
      {/* Search / Loading Icon */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center text-muted-foreground">
        {showLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden="true" />
        ) : (
          <Search className="h-4 w-4" aria-hidden="true" />
        )}
      </div>

      {/* Input Field */}
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoFocus={autoFocus}
        disabled={disabled}
        className={cn(
          "w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "transition-all min-h-[44px] shadow-xs"
        )}
      />

      {/* Clear Button */}
      {localValue.length > 0 && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search input"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
