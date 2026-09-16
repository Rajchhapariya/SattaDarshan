import { Landmark } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[55vh] w-full px-4 animate-in fade-in duration-300">
      <div className="flex flex-col items-center gap-3 p-8 rounded-3xl bg-card border border-border/70 shadow-xs max-w-sm text-center">
        <div className="relative flex items-center justify-center h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600">
          <Landmark className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground">Retrieving Civic Records...</p>
          <p className="text-xs text-muted-foreground mt-0.5">Accessing parliamentary database index</p>
        </div>
      </div>
    </div>
  );
}
