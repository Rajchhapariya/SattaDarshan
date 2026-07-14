"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function SearchBar({ value, onChange, placeholder = "Search...", className = "" }: SearchBarProps) {
  return (
    <div className={cn("relative flex items-center group", className)} role="search">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none transition-colors group-focus-within:text-primary" />
      <input 
        value={value} 
        onChange={e=>onChange(e.target.value)} 
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn(
          "w-full h-10 pl-9 pr-9 rounded-md border border-border bg-background text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground font-medium",
        )}
      />
      {value && (
        <button 
          onClick={() => onChange("")} 
          aria-label="Clear search" 
          className="absolute right-2.5 h-6 w-6 flex items-center justify-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
