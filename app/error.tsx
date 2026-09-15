"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Landmark, ArrowRight } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] w-full px-4 py-12">
      <div className="max-w-md w-full bg-card border border-border/80 rounded-2xl p-8 shadow-sm text-center animate-in fade-in duration-300">
        <div className="mx-auto w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-5 text-rose-600 dark:text-rose-400 shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          System Notice
        </span>

        <h2 className="text-2xl font-bold tracking-tight text-foreground mt-1 mb-2">
          Service Temporarily Unavailable
        </h2>
        
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          The server encountered an unexpected issue while retrieving parliamentary or demographic records. Please retry your query or return to the main directory.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => reset()}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-sm hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="w-4 h-4" /> Retry Query
          </button>
          
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-card font-semibold text-xs sm:text-sm text-foreground hover:bg-muted transition-colors shadow-sm"
          >
            <Landmark className="w-4 h-4 text-primary" /> Return to Portal Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-6 text-[10px] font-mono text-muted-foreground/60 tracking-tight">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
