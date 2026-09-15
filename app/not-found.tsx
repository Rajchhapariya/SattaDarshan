import Link from "next/link";
import { Landmark, Users, Flag, MapPin, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-in fade-in duration-500 max-w-2xl mx-auto">
      {/* Civic Emblem Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 mb-6 shadow-sm">
        <Landmark className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        404 — Document or Record Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mt-2 mb-3">
        Legislative Record Unavailable
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mb-8">
        The requested constituency, representative profile, or administrative gazette could not be located in the current parliamentary database index.
      </p>

      {/* Suggested Quick Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8 text-left">
        <Link
          href="/parliament/lok-sabha"
          className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Landmark className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">18th Lok Sabha</p>
              <p className="text-xs text-muted-foreground">Chamber seating & MPs</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/politicians"
          className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Users className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Representatives</p>
              <p className="text-xs text-muted-foreground">National & state leaders</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/states"
          className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">States & UTs</p>
              <p className="text-xs text-muted-foreground">36 territorial jurisdictions</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/parties"
          className="p-4 rounded-xl border border-border/80 bg-card hover:border-primary/50 hover:bg-muted/30 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <Flag className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Political Parties</p>
              <p className="text-xs text-muted-foreground">Coalitions & seat shares</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Return to Home CTA */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
      >
        Return to Portal Home
      </Link>
    </div>
  );
}
