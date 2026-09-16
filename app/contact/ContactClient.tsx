"use client";

import React, { useState, useRef } from "react";
import { 
  Mail, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Info, 
  ShieldCheck 
} from "lucide-react";
import { CivicSelect } from "@/components/ui/CivicSelect";
import { cn } from "@/lib/utils";

const INQUIRY_SUBJECT_OPTIONS = [
  { value: "editorial_inquiry", label: "Editorial & Research Inquiry" },
  { value: "data_methodology", label: "Data Methodology & Sources Question" },
  { value: "copyright_attribution", label: "Copyright, Photo, or Attribution Notice" },
  { value: "public_record_feedback", label: "General Civic Data Feedback" },
  { value: "other", label: "Other Inquiry" },
];

export function ContactClient() {
  const [subjectCategory, setSubjectCategory] = useState("editorial_inquiry");
  const [customSubject, setCustomSubject] = useState("");
  const [message, setMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const feedbackRef = useRef<HTMLDivElement>(null);

  const handleResetForm = () => {
    setMessage("");
    setCustomSubject("");
    setUserEmail("");
    setError(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const resolvedSubject = customSubject.trim() 
      ? customSubject.trim()
      : INQUIRY_SUBJECT_OPTIONS.find((o) => o.value === subjectCategory)?.label || "General Inquiry";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: resolvedSubject,
          message: message.trim(),
          userEmail: userEmail.trim() || undefined,
          website_trap: honeypot, // Honeypot field
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      setSuccessMessage(data.message || "Your message has been submitted successfully.");
      // Reset form fields
      setMessage("");
      setCustomSubject("");
      setUserEmail("");

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
    <div className="space-y-6">
      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
        {/* Honeypot field (hidden from users) */}
          <div style={{ display: "none" }} aria-hidden="true">
            <label htmlFor="contact_website_trap">Leave this field blank</label>
            <input
              type="text"
              id="contact_website_trap"
              name="website_trap"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Send an Editorial or Civic Inquiry
            </h2>
            <p className="text-xs text-muted-foreground">
              All messages are securely logged to our review queue and reviewed by editorial maintainers.
            </p>
          </div>

          {/* Subject Category Selector */}
          <div className="space-y-1.5">
            <label htmlFor="subjectCategory" className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Inquiry Topic <span className="text-red-500">*</span>
            </label>
            <CivicSelect
              id="subjectCategory"
              value={subjectCategory}
              onChange={setSubjectCategory}
              options={INQUIRY_SUBJECT_OPTIONS}
              ariaLabel="Inquiry Topic"
              className="w-full"
            />
          </div>

          {/* Optional Custom Subject Specification */}
          <div className="space-y-1.5">
            <label htmlFor="customSubject" className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Specific Subject / Headline <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input
              id="customSubject"
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g. Research inquiry regarding 18th Lok Sabha election datasets"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
              maxLength={150}
            />
          </div>

          {/* Message Textarea */}
          <div className="space-y-1.5">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground block">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please provide complete details regarding your inquiry, research request, or feedback..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
              minLength={10}
              maxLength={3000}
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Minimum 10 characters</span>
              <span>{message.length} / 3000</span>
            </div>
          </div>

          {/* User Email (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="userEmail" className="text-xs font-bold uppercase tracking-wider text-foreground block">
                Your Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <span className="text-[11px] text-muted-foreground">Only if you wish to receive a reply</span>
            </div>
            <input
              id="userEmail"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[44px]"
              maxLength={120}
            />
          </div>

          {/* Submit Action & Immediate Inline Feedback */}
          <div className="pt-4 border-t border-border/60 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 order-2 sm:order-1">
                <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Your email is kept confidential and stored strictly in our private review system.</span>
              </p>
              <button
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
                    <span>Sending Message...</span>
                  </>
                ) : successMessage ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Sent Successfully</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </>
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
                  <span>✓ Message submitted successfully</span>
                </div>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  Thank you — your inquiry has been received and logged to our editorial review system.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    Send another message
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
                  <span>⚠ We couldn&apos;t send your message</span>
                </div>
                <p className="text-xs text-red-700 leading-relaxed">
                  {error}
                </p>
                <p className="text-xs text-red-600/90">
                  Please verify your message or connection, then tap Send Message to try again.
                </p>
              </div>
            )}
          </div>
        </form>
    </div>
  );
}
