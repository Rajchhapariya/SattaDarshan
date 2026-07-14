"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ page, pages, onPageChange }: PaginationProps) {
  if (pages <= 1) return null;
  
  // Calculate page numbers to show
  const getPageNumbers = () => {
    const range = 2;
    const nums = [];
    for (let i = Math.max(1, page - range); i <= Math.min(pages, page + range); i++) {
      nums.push(i);
    }
    return nums;
  };

  const nums = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button 
        onClick={() => onPageChange(page - 1)} 
        disabled={page === 1} 
        className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {nums[0] > 1 && (
        <>
          <button 
            onClick={() => onPageChange(1)} 
            className="h-9 w-9 rounded-md text-sm font-bold font-mono transition-colors border border-border hover:bg-muted"
          >
            1
          </button>
          {nums[0] > 2 && <span className="text-muted-foreground px-1">...</span>}
        </>
      )}

      {nums.map(n => (
        <button 
          key={n} 
          onClick={() => onPageChange(n)} 
          className={cn(
            "h-9 w-9 rounded-md text-sm font-bold font-mono transition-all border",
            n === page 
              ? "bg-primary border-primary text-primary-foreground shadow-sm shadow-primary/20" 
              : "border-border text-foreground hover:bg-muted"
          )}
        >
          {n}
        </button>
      ))}

      {nums[nums.length - 1] < pages && (
        <>
          {nums[nums.length - 1] < pages - 1 && <span className="text-muted-foreground px-1">...</span>}
          <button 
            onClick={() => onPageChange(pages)} 
            className="h-9 w-9 rounded-md text-sm font-bold font-mono transition-colors border border-border hover:bg-muted"
          >
            {pages}
          </button>
        </>
      )}

      <button 
        onClick={() => onPageChange(page + 1)} 
        disabled={page === pages} 
        className="h-9 w-9 rounded-md border border-border flex items-center justify-center text-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
