"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Landmark } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.error(error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
          <div className="mx-auto w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-5 text-rose-600 shadow-sm">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Portal Application Error
          </h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            An unexpected error occurred at the root level of the application. Please reload or return to the main dashboard.
          </p>
          <div className="flex flex-col gap-2.5">
            <button
              onClick={() => reset()}
              className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reload Portal
            </button>
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl border border-border bg-card font-semibold text-sm hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4 text-primary" /> Home Page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
