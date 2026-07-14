"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchBar } from "@/components/ui/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { ShieldCheck, ArrowRightLeft, User, AlertTriangle, Wallet, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

type Politician = {
  slug: string;
  name: string;
  role?: string;
  partyName?: string;
  state?: string;
  constituency?: string;
  assets?: string;
  criminalCases?: number;
  education?: string;
};

export default function ComparePage() {
  const [all, setAll] = useState<Politician[]>([]);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/politicians?limit=500")
      .then((r) => r.json())
      .then((d) => {
        setAll(d.politicians || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const p1 = useMemo(() => all.find((p) => p.slug === left), [all, left]);
  const p2 = useMemo(() => all.find((p) => p.slug === right), [all, right]);

  const rows = [
    { label: "Designation", key: "role", icon: User },
    { label: "Political Party", key: "partyName", icon: ShieldCheck },
    { label: "State / Jurisdiction", key: "state", icon: ShieldCheck },
    { label: "Constituency", key: "constituency", icon: ShieldCheck },
    { label: "Education Level", key: "education", icon: GraduationCap },
    { label: "Declared Assets", key: "assets", icon: Wallet },
    { label: "Legal Records", key: "criminalCases", icon: AlertTriangle },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Compare Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-sm bg-primary/10 border border-primary/20 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            <ArrowRightLeft className="h-3 w-3" /> Binary Comparison
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Data <span className="text-muted-foreground font-light">Validator</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed font-medium">
            Side-by-binary validation of representative data points. 
            Cross-reference metrics across jurisdictions and affiliations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-muted/30 p-6 rounded-md border border-border">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Member Alpha</label>
          <select 
            value={left} 
            onChange={(e) => setLeft(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="">-- Select Representative --</option>
            {all.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Member Beta</label>
          <select 
            value={right} 
            onChange={(e) => setRight(e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm font-bold uppercase tracking-tight focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            <option value="">-- Select Representative --</option>
            {all.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-background border border-border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 border-b border-border">
              <TableHead className="w-1/4">Metric Descriptor</TableHead>
              <TableHead className="w-3/8 text-center border-l border-border/50">ALPHA DATA</TableHead>
              <TableHead className="w-3/8 text-center border-l border-border/50">BETA DATA</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.key} className="hover:bg-muted/10 border-b border-border/50">
                <TableCell className="bg-muted/5 py-4">
                  <div className="flex items-center gap-3">
                    <row.icon className="h-3.5 w-3.5 text-muted-foreground/40" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground">{row.label}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center py-4 border-l border-border/50">
                  {p1 ? (
                    <span className={cn(
                      "font-bold uppercase tracking-tight",
                      row.key === 'criminalCases' ? (Number(p1[row.key as keyof Politician]) > 0 ? "text-destructive font-mono" : "text-success font-mono") : "text-foreground",
                      row.key === 'assets' && "font-mono text-xs"
                    )}>
                      {p1[row.key as keyof Politician] ?? "N/A"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/20 italic text-xs">Awaiting Input...</span>
                  )}
                </TableCell>
                <TableCell className="text-center py-4 border-l border-border/50">
                  {p2 ? (
                    <span className={cn(
                      "font-bold uppercase tracking-tight",
                      row.key === 'criminalCases' ? (Number(p2[row.key as keyof Politician]) > 0 ? "text-destructive font-mono" : "text-success font-mono") : "text-foreground",
                      row.key === 'assets' && "font-mono text-xs"
                    )}>
                      {p2[row.key as keyof Politician] ?? "N/A"}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/20 italic text-xs">Awaiting Input...</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Comparison Signature */}
      <div className="flex items-center justify-center pt-8 pb-12 border-t border-border">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
          End of Comparison Protocol // Ledger SD-COMP-V1
        </p>
      </div>
    </div>
  );
}
