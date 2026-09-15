"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { cn } from "@/lib/utils";

export function CorrectionsClient() {
  const searchParams = useSearchParams();
  const initialRecord = searchParams.get("record") || "";
  const initialType = searchParams.get("type") || "politician";

  const [recordType, setRecordType] = useState(
    ["politician", "party", "state", "general"].includes(initialType) ? initialType : "politician"
  );
  const [recordIdentifier, setRecordIdentifier] = useState(initialRecord);
  const [issueType, setIssueType] = useState("outdated_info");
  const [description, setDescription] = useState("");
  const [suggestedCorrection, setSuggestedCorrection] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialRecord && !recordIdentifier) {
      setRecordIdentifier(initialRecord);
    }
  }, [initialRecord, recordIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        data.message || "Your report has been logged and routed to our editorial verification pipeline."
      );
      // Reset sensitive form fields
      setDescription("");
      setSuggestedCorrection("");
      setSourceUrl("");
      setContactEmail("");
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
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

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Submission Confirmed
          </div>
          <p className="text-xs leading-relaxed">{successMessage}</p>
          <div className="pt-2">
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-semibold underline hover:opacity-80"
            >
              Submit another correction
            </button>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-300 flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Submission Incomplete</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Form Container */}
      {!successMessage && (
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
              <label htmlFor="recordType" className="text-xs font-bold uppercase tracking-wider text-foreground">
                Record Category <span className="text-red-500">*</span>
              </label>
              <select
                id="recordType"
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
                required
              >
                <option value="politician">Representative / Leader</option>
                <option value="party">Political Party</option>
                <option value="state">State or Union Territory</option>
                <option value="general">General Parliamentary Data</option>
              </select>
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
            <label htmlFor="issueType" className="text-xs font-bold uppercase tracking-wider text-foreground">
              Nature of Issue <span className="text-red-500">*</span>
            </label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
              required
            >
              <option value="outdated_info">Outdated Information (term completed, newly elected, new office)</option>
              <option value="factual_error">Factual Error in Record (wrong constituency, incorrect seat count)</option>
              <option value="party_affiliation">Party Affiliation Change (defection, expulsion, alliance shift)</option>
              <option value="broken_link_image">Broken Photo, Citation, or Reference URL</option>
              <option value="other">Other Editorial Inaccuracy</option>
            </select>
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

          {/* Submit Action */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              By submitting, you confirm this information is provided in good faith for civic accuracy.
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting Report..." : "Submit Correction Report"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
