"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Landmark, 
  Users, 
  MapPin, 
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { ThreeParliamentChamber } from "@/components/parliament/ThreeParliamentChamber";
import { PoliticianCard } from "@/components/politician/PoliticianCard";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { DataAccuracyNotice } from "@/components/common/DataAccuracyNotice";
import { cn } from "@/lib/utils";

type MP = {
  name: string;
  slug: string;
  state: string;
  partyName?: string;
  photo?: string;
  constituency?: string;
};

type LokSabhaClientProps = {
  mps: MP[];
  states: string[];
  parties: string[];
};

export function LokSabhaClient({ mps, states, parties }: LokSabhaClientProps) {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedParty, setSelectedParty] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [show3D, setShow3D] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  // Filter MPs based on search and selected state/party
  const filteredMps = useMemo(() => {
    return mps.filter((mp) => {
      const matchesSearch = 
        !search.trim() ||
        mp.name.toLowerCase().includes(search.toLowerCase()) ||
        (mp.constituency && mp.constituency.toLowerCase().includes(search.toLowerCase()));

      const matchesState = selectedState === "All" || mp.state === selectedState;
      const matchesParty = selectedParty === "All" || mp.partyName === selectedParty;

      return matchesSearch && matchesState && matchesParty;
    });
  }, [mps, search, selectedState, selectedParty]);

  const totalPages = Math.ceil(filteredMps.length / pageSize) || 1;
  const paginatedMps = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMps.slice(start, start + pageSize);
  }, [filteredMps, page, pageSize]);

  const handleStateChange = (val: string) => {
    setSelectedState(val);
    setPage(1);
  };

  const handlePartyChange = (val: string) => {
    setSelectedParty(val);
    setPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Non-Government Transparency Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-muted/30 border border-border/70 text-xs text-muted-foreground">
        <p className="leading-relaxed">
          <strong className="font-semibold text-foreground">Independent Legislative Visualization:</strong> Compiled from publicly available information (Source: Parliament of India / Sansad.in: <a href="https://sansad.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">sansad.in</a> and Lok Sabha Secretariat: <a href="https://loksabha.nic.in/" target="_blank" rel="noreferrer" className="text-primary hover:underline font-semibold">loksabha.nic.in</a>). SattaDarshan is an independent, non-government platform and is not affiliated with or authorized by the Parliament of India.
        </p>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            <Landmark className="h-3.5 w-3.5" /> Lower House of India&apos;s Parliament
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            18th Lok Sabha Directory
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Elected representatives from 543 parliamentary constituencies across all States and Union Territories.
          </p>
        </div>

        {/* Quick Summary Pill Stats */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="px-4 py-3 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[100px]">
            <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Capacity</span>
            <span className="text-xl font-bold text-foreground">543</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-primary/10 border border-primary/20 text-center min-w-[100px]">
            <span className="block text-[11px] font-semibold uppercase text-primary">Active</span>
            <span className="text-xl font-bold text-primary">{mps.length}</span>
          </div>
          <div className="px-4 py-3 rounded-2xl bg-muted/30 border border-border/60 text-center min-w-[100px]">
            <span className="block text-[11px] font-semibold uppercase text-muted-foreground">Majority</span>
            <span className="text-xl font-bold text-foreground">272</span>
          </div>
        </div>
      </div>

      {/* 3D Visualizer Toggle Accordion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShow3D(!show3D)}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            <Landmark className="h-4 w-4" />
            {show3D ? "Hide 3D Seating Chamber" : "Show 3D Seating Chamber"}
          </button>
          <span className="text-xs text-muted-foreground">Interactive Seating Plan</span>
        </div>

        {show3D && (
          <div className="animate-in fade-in zoom-in-98 duration-300">
            <ThreeParliamentChamber chamber="Lok Sabha" />
          </div>
        )}
      </div>

      {/* Search & Filter Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search MP name or constituency..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
        </div>

        {/* Filter Dropdowns & View Switcher */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            aria-label="Filter by State"
            className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <option value="All">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Party Filter */}
          <select
            value={selectedParty}
            onChange={(e) => handlePartyChange(e.target.value)}
            aria-label="Filter by Party"
            className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs sm:text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px] cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <option value="All">All Parties ({parties.length})</option>
            {parties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* View Toggle (Grid / Table) */}
          <div className="flex items-center rounded-xl border border-border bg-muted/40 p-1 ml-auto lg:ml-0">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Grid View (Mobile Friendly)"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={cn(
                "p-1.5 rounded-lg text-xs font-semibold transition-all",
                viewMode === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Counter */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>Showing {filteredMps.length} of {mps.length} Members</span>
        {(selectedState !== "All" || selectedParty !== "All" || search) && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedState("All");
              setSelectedParty("All");
              setPage(1);
            }}
            className="text-primary font-semibold hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Content Rendering: Grid Mode or Table Mode */}
      {filteredMps.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-card border border-border/80 space-y-3">
          <Users className="h-10 w-10 text-muted-foreground/40 mx-auto" />
          <h3 className="font-bold text-base text-foreground">No Members Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            No Lok Sabha members matched your current filter criteria. Try clearing search terms or selecting another state.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedMps.map((mp) => (
            <PoliticianCard
              key={mp.slug}
              slug={mp.slug}
              name={mp.name}
              photo={mp.photo}
              role="MP (Lok Sabha)"
              partyName={mp.partyName}
              constituency={mp.constituency}
              state={mp.state}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/80 overflow-x-auto bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[280px]">Member of Parliament</TableHead>
                <TableHead>Constituency</TableHead>
                <TableHead>State / UT</TableHead>
                <TableHead>Party Affiliation</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMps.map((mp) => (
                <TableRow key={mp.slug} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <CivicAvatar src={mp.photo} alt={mp.name} size="table" shape="circle" className="border border-border flex-shrink-0" />
                      <Link
                        href={`/politicians/${mp.slug}`}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {mp.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-semibold text-foreground">{mp.constituency || "N/A"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{mp.state}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-medium">
                      {mp.partyName || "Independent"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/politicians/${mp.slug}`}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border hover:bg-muted hover:text-primary transition-colors"
                      title="View Profile"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border/60">
          <span className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="Go to previous page"
              className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1 min-h-[44px]"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="Go to next page"
              className="px-3.5 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold disabled:opacity-40 hover:bg-muted transition-colors flex items-center gap-1 min-h-[44px]"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Data Accuracy Notice */}
      <DataAccuracyNotice
        variant="compact"
        recordType="chamber"
        source="Parliament of India / Sansad.in"
        sourceUrl="https://sansad.in/"
      />
    </div>
  );
}
