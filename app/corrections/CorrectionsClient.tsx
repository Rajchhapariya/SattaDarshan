"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  FileEdit, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  Loader2, 
  ExternalLink,
  ChevronRight,
  Info
} from "lucide-react";
import { CivicSelect } from "@/components/ui/CivicSelect";
import { cn } from "@/lib/utils";

const RECORD_TYPE_OPTIONS = [
  { value: "politician", label: "Representative / Leader" },
  { value: "party", label: "Political Party" },
  { value: "state", label: "State or Union Territory" },
  { value: "general", label: "General Parliamentary Data" },
];

const ISSUE_TYPE_OPTIONS = [
  { value: "outdated_info", label: "Outdated Information (term completed, newly elected, new office)" },
  { value: "factual_error", label: "Factual Error in Record (wrong constituency, incorrect seat count)" },
  { value: "party_affiliation", label: "Party Affiliation Change (defection, expulsion, alliance shift)" },
  { value: "broken_link_image", label: "Broken Photo, Citation, or Reference URL" },
  { value: "other", label: "Other Editorial Inaccuracy" },
];

export function CorrectionsClient() {
  const [recordType, setRecordType] = useState("politician");
  const [recordIdentifier, setRecordIdentifier] = useState("");
  const [issueType, setIssueType] = useState("outdated_info");
  const [description, setDescription] = useState("");
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const feedbackRef = useRef<HTMLDivElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Read URL query parameters post-mount without causing Next.js SSR Suspense bail-out
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const initialRecord = params.get("record");
      const initialType = params.get("type");

      if (initialRecord) {
        setRecordIdentifier(initialRecord);
      }
      if (initialType && ["politician", "party", "state", "general"].includes(initialType)) {
        setRecordType(initialType);
      }
    }
  }, []);

  const handleResetForm = () => {
    setDescription("");
    setSuggestedCorrection("");
    setSourceUrl("");
    setContactEmail("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordType,
          recordIdentifier,
          issueType,
          description,
          suggestedCorrection,
          sourceUrl: sourceUrl.trim() || undefined,
          contactEmail: contactEmail.trim() || undefined,
          website_trap: honeypot, // Honeypot field
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit report.");
      }

      setSuccessMessage(
        data.message || "Your correction report has been received and logged to our editorial verification pipeline."
      );
      // Clear content fields while preserving category selection
      setDescription("");
      setSuggestedCorrection("");
      setSourceUrl("");
      setContactEmail("");

      // Smooth micro-scroll to keep inline feedback squarely in mobile viewport if needed
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
      setTimeout(() => {
        feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Report Correction</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 border border-amber-500/20">
          <FileEdit className="h-3.5 w-3.5" /> Civic Data Verification Channel
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Suggest a Correction or Update
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Public records reflect constitutional gazettes, Election Commission affidavits, and parliamentary registries. If you notice an outdated tenure, changed party affiliation, incorrect constituency, or broken citation, please notify our editorial review desk below.
        </p>
      </div>

      {/* Editorial Process Notice */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <span className="font-semibold text-foreground">Editorial Integrity Protocol: </span>
          Submissions do not automatically modify published records. Every report is reviewed by editorial maintainers and cross-checked against primary sources (Sansad.in, ECI, or state assembly gazettes) prior to updating the database.
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
        {/* Honeypot field (hidden from legitimate users) */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website_trap">Leave this field blank</label>
          <input
            type="text"
            id="website_trap"
            name="website_trap"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Record Category */}
          <div className="space-y-1.5">
            <label htmlFor="recordType" className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Record Category <span className="text-red-500">*</span>
            </label>
            <CivicSelect
              id="recordType"
              value={recordType}
              onChange={setRecordType}
              options={RECORD_TYPE_OPTIONS}
              ariaLabel="Record Category"
              className="w-full"
            />
          </div>

          {/* Record Name or Identifier */}
          <div className="space-y-1.5">
            <label htmlFor="recordIdentifier" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Record Identifier / Name <span className="text-red-500">*</span>
            </label>
            <input
              id="recordIdentifier"
              type="text"
              value={recordIdentifier}
              onChange={(e) => setRecordIdentifier(e.target.value)}
              placeholder="e.g. Narendra Modi or /politicians/narendra-modi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
              required
            />
          </div>
        </div>

        {/* Issue Classification */}
        <div className="space-y-1.5">
          <label htmlFor="issueType" className="text-xs font-bold uppercase tracking-wider text-foreground block">
            Nature of Issue <span className="text-red-500">*</span>
          </label>
          <CivicSelect
            id="issueType"
            value={issueType}
            onChange={setIssueType}
            options={ISSUE_TYPE_OPTIONS}
            ariaLabel="Nature of Issue"
            className="w-full"
          />
        </div>

        {/* What Appears Incorrect */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-foreground">
            What appears incorrect? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the inaccurate or outdated detail as currently displayed on SattaDarshan..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Suggested Correction */}
        <div className="space-y-1.5">
          <label htmlFor="suggestedCorrection" className="text-xs font-bold uppercase tracking-wider text-foreground">
            Suggested Correction <span className="text-red-500">*</span>
          </label>
          <textarea
            id="suggestedCorrection"
            rows={3}
            value={suggestedCorrection}
            onChange={(e) => setSuggestedCorrection(e.target.value)}
            placeholder="State the verified accurate facts according to official parliamentary or electoral records..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Primary Source URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="sourceUrl" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Authoritative Source URL
            </label>
            <span className="text-[11px] text-muted-foreground">ECI, Sansad.in, or Official Gazette preferred</span>
          </div>
          <input
            id="sourceUrl"
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            placeholder="https://sansad.in/ls/members or https://eci.gov.in/..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
          />
        </div>

        {/* Optional Contact Email */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="contactEmail" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Contact Email <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <span className="text-[11px] text-muted-foreground">Only if you wish to receive verification feedback</span>
          </div>
          <input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
          />
        </div>

        {/* Submit Action & Immediate Inline Feedback */}
        <div className="pt-4 border-t border-border/60 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground order-2 sm:order-1">
              By submitting, you confirm this information is provided in good faith for civic accuracy.
            </p>
            <button
              ref={submitButtonRef}
              type="submit"
              disabled={loading}
              className={cn(
                "order-1 sm:order-2 w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] shadow-sm",
                successMessage
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-primary text-primary-foreground hover:opacity-90",
                loading && "opacity-60 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Report...</span>
                </>
              ) : successMessage ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Submitted Successfully</span>
                </>
              ) : (
                <span>Submit Correction Report</span>
              )}
            </button>
          </div>

          {/* Immediate Inline Success State */}
          {successMessage && (
            <div
              ref={feedbackRef}
              tabIndex={-1}
              role="status"
              aria-live="polite"
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-900 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
            >
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>✓ Correction report submitted successfully</span>
              </div>
              <p className="text-xs text-emerald-800/90 leading-relaxed">
                Thank you — your correction has been received and routed to our editorial verification pipeline.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                >
                  Submit another correction
                </button>
              </div>
            </div>
          )}

          {/* Immediate Inline Error State */}
          {error && (
            <div
              ref={feedbackRef}
              tabIndex={-1}
              role="alert"
              aria-live="assertive"
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-900 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 outline-none"
            >
              <div className="flex items-center gap-2 font-bold text-sm text-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span>⚠ We couldn&apos;t submit your correction report</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">
                {error}
              </p>
              <p className="text-xs text-red-600/90">
                Please verify the details above or check your connection, then tap Submit to try again.
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
