"use client";

import React, { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Message Received
          </div>
          <p className="text-xs leading-relaxed">{successMessage}</p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSuccessMessage(null)}
              className="text-xs font-semibold underline hover:opacity-80"
            >
              Send another message
            </button>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-800 flex items-start gap-2.5">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs space-y-1">
            <p className="font-bold">Submission Incomplete</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {!successMessage && (
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

          {/* Submit Button & Privacy Note */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600 flex-shrink-0" />
              <span>Your email is kept confidential and stored strictly in our private review system.</span>
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending Message...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
