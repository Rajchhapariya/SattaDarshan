"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRightLeft, 
  User, 
  Wallet, 
  GraduationCap, 
  AlertTriangle, 
  CheckCircle, 
  Landmark, 
  MapPin, 
  Flag,
  ExternalLink
} from "lucide-react";
import { Combobox, ComboboxItem } from "@/components/ui/Combobox";
import { AllianceBadge } from "@/components/common/AllianceBadge";
import { CivicAvatar } from "@/components/politician/CivicAvatar";
import { ShareButton } from "@/components/common/ShareButton";
import { ComparePageSkeleton } from "@/components/skeletons/ComparePageSkeleton";
import { cn } from "@/lib/utils";

type Politician = {
  slug: string;
  name: string;
  role?: string;
  currentOffice?: string;
  ministerialRank?: string;
  portfolios?: string[];
  partyName?: string;
  party?: string;
  state?: string;
  constituency?: string;
  chamber?: string;
  assets?: string;
  criminalCases?: number;
  education?: string;
  photo?: string;
  tenureStatus?: string;
  verificationStatus?: string;
};

export default function ComparePage() {
  const [all, setAll] = useState<Politician[]>([]);
  const [left, setLeft] = useState("narendra-modi");
  const [right, setRight] = useState("rahul-gandhi");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/politicians?limit=1000&sort=name")
      .then((r) => r.json())
      .then((d) => {
        const list: Politician[] = d.politicians || [];
        setAll(list);
        // If query parameters exist in URL, set them
        const sp = new URLSearchParams(window.location.search);
        const qLeft = sp.get("left");
        const qRight = sp.get("right");
        if (qLeft && list.some((p) => p.slug === qLeft)) setLeft(qLeft);
        if (qRight && list.some((p) => p.slug === qRight)) setRight(qRight);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Synchronize URL parameters with current selection
  useEffect(() => {
    if (!loading && left && right) {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("left") !== left || sp.get("right") !== right) {
        sp.set("left", left);
        sp.set("right", right);
        window.history.replaceState(null, "", `${window.location.pathname}?${sp.toString()}`);
      }
    }
  }, [left, right, loading]);

  const handleSwap = () => {
    setLeft(right);
    setRight(left);
  };

  const comboboxItems: ComboboxItem[] = useMemo(() => {
    return all.map((p) => {
      const officeOrRole = p.currentOffice || p.ministerialRank || p.role || "Representative";
      const location = p.constituency ? `${p.constituency}, ${p.state}` : (p.state || "India");
      return {
        value: p.slug,
        label: p.name,
        sub: `${officeOrRole} • ${p.partyName || "Independent"} (${location})`,
        photo: p.photo,
        badge: p.partyName,
        keywords: [
          p.constituency || "",
          p.state || "",
          p.role || "",
          p.currentOffice || "",
          p.chamber || "",
          ...(p.portfolios || []),
        ].filter(Boolean),
      };
    });
  }, [all]);

  const p1 = useMemo(() => all.find((p) => p.slug === left), [all, left]);
  const p2 = useMemo(() => all.find((p) => p.slug === right), [all, right]);

  const metrics = [
    { label: "Role & Office", icon: Landmark, get: (p?: Politician) => p?.currentOffice || p?.role || "Representative" },
    { label: "House Chamber", icon: Landmark, get: (p?: Politician) => p?.chamber || (p?.role === "CM" ? "State Legislative Assembly" : "Parliament") },
    { label: "Party Affiliation", icon: Flag, get: (p?: Politician) => p?.partyName || "Independent" },
    { label: "State / UT", icon: MapPin, get: (p?: Politician) => p?.state || "N/A" },
    { label: "Constituency", icon: MapPin, get: (p?: Politician) => p?.constituency || "N/A" },
    { label: "Education Level", icon: GraduationCap, get: (p?: Politician) => p?.education || "Not Declared / Available" },
    { label: "Declared Assets", icon: Wallet, get: (p?: Politician) => p?.assets || "Not Declared / Available" },
    { 
      label: "Criminal Cases", 
      icon: AlertTriangle, 
      render: (p?: Politician) => {
        if (p?.criminalCases === undefined || p?.criminalCases === null) {
          return <span className="text-muted-foreground italic text-xs">Affidavit Not Linked</span>;
        }
        const cases = p.criminalCases;
        return (
          <span className={cn("inline-flex items-center gap-1 font-semibold text-xs", cases === 0 ? "text-emerald-600" : "text-amber-600")}>
            {cases === 0 ? <CheckCircle className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
            {cases === 0 ? "0 Cases Declared" : `${cases} Active Cases`}
          </span>
        );
      }
    },
    {
      label: "Tenure & Verification",
      icon: CheckCircle,
      render: (p?: Politician) => (
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className={cn("px-2 py-0.5 rounded text-[11px] font-semibold", p?.tenureStatus === "former" ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700")}>
            {p?.tenureStatus === "former" ? "Former Office Holder" : "Active / Serving"}
          </span>
          {p?.verificationStatus === "official" && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/40">
              Official Gazette
            </span>
          )}
        </div>
      )
    },
  ];

  if (loading && all.length === 0) {
    return <ComparePageSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <ArrowRightLeft className="h-3.5 w-3.5" /> Direct Side-by-Side Comparison
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Compare Representatives
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
            Side-by-side analysis of public records, declared wealth, criminal affidavits, and constituency mandates.
          </p>
        </div>

        <ShareButton
          title={`Compare: ${p1?.name || "Representative"} vs ${p2?.name || "Representative"}`}
          label="Share Comparison"
          url={typeof window !== "undefined" ? `${window.location.origin}/compare?left=${left}&right=${right}` : undefined}
          className="self-start md:self-auto"
        />
      </div>

      {/* Selectors Grid with Swap */}
      <div className="relative p-4 sm:p-6 rounded-2xl bg-muted/20 border border-border/80">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              First Representative
            </label>
            <Combobox
              items={comboboxItems}
              value={left}
              onChange={setLeft}
              placeholder="Select first leader..."
              searchPlaceholder="Search by name, party, state, constituency..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Second Representative
            </label>
            <Combobox
              items={comboboxItems}
              value={right}
              onChange={setRight}
              placeholder="Select second leader..."
              searchPlaceholder="Search by name, party, state, constituency..."
            />
          </div>
        </div>

        {/* Swap Representatives Button */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleSwap}
            aria-label="Swap Representatives"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-background hover:bg-muted text-muted-foreground hover:text-foreground border border-border shadow-xs transition-colors"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-primary" />
            <span>Swap Representatives</span>
          </button>
        </div>
      </div>

      {/* Comparison Cards Header */}
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {/* Left Politician Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col items-center text-center">
          <div className="mb-3">
            <CivicAvatar src={p1?.photo} alt={p1?.name || "Leader 1"} size="xl" shape="circle" className="border-2 border-border shadow-md" />
          </div>
          <h3 className="font-bold text-base sm:text-xl text-foreground line-clamp-1">{p1?.name || "Representative 1"}</h3>
          <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">{p1?.partyName || "Independent"}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5">{p1?.state}</span>
          {p1 && (
            <Link
              href={`/politicians/${p1.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Full Profile <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>

        {/* Right Politician Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col items-center text-center">
          <div className="mb-3">
            <CivicAvatar src={p2?.photo} alt={p2?.name || "Leader 2"} size="xl" shape="circle" className="border-2 border-border shadow-md" />
          </div>
          <h3 className="font-bold text-base sm:text-xl text-foreground line-clamp-1">{p2?.name || "Representative 2"}</h3>
          <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">{p2?.partyName || "Independent"}</p>
          <span className="text-[11px] text-muted-foreground mt-0.5">{p2?.state}</span>
          {p2 && (
            <Link
              href={`/politicians/${p2.slug}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Full Profile <ExternalLink className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Metric Rows */}
      <div className="rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden divide-y divide-border/60">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="p-4 sm:p-5 hover:bg-muted/10 transition-colors">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span>{metric.label}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="text-xs sm:text-sm font-semibold text-foreground px-2">
                  {metric.render ? metric.render(p1) : (metric.get ? metric.get(p1) : "—")}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-foreground px-2 border-l border-border/60">
                  {metric.render ? metric.render(p2) : (metric.get ? metric.get(p2) : "—")}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
