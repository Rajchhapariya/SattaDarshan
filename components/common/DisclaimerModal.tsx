"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Landmark, ExternalLink, Check, Info } from "lucide-react";

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const understandBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Sensible browser session policy: show once per session
    try {
      const acknowledged = sessionStorage.getItem("sattadarshan_disclaimer_ack");
      if (!acknowledged) {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }

    // Listen for custom event to reopen disclaimer from footer or navigation
    const handleReopen = () => setIsOpen(true);
    window.addEventListener("reopen-disclaimer-modal", handleReopen);
    return () => window.removeEventListener("reopen-disclaimer-modal", handleReopen);
  }, []);

  // Trap focus and manage body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        understandBtnRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleAcknowledge();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleAcknowledge = () => {
    try {
      sessionStorage.setItem("sattadarshan_disclaimer_ack", "true");
    } catch {}
    setIsOpen(false);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      aria-describedby="disclaimer-description"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div 
        className="relative w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
      >
        {/* Header Ribbon - Professional, civic & transparent (not alarming) */}
        <div className="p-6 sm:p-7 border-b border-border/70 bg-muted/40 flex items-start gap-4">
          <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Landmark className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
              Independent Civic Platform Notice
            </span>
            <h2 id="disclaimer-title" className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Notice: Independent, Non-Government Website
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div 
          id="disclaimer-description" 
          className="p-6 sm:p-7 overflow-y-auto space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed divide-y divide-border/40"
        >
          <div className="space-y-3 pb-4">
            <p className="font-semibold text-foreground text-sm sm:text-base">
              SattaDarshan is an independent, non-government website.
            </p>
            <p>
              This website is <strong>not affiliated with, operated by, maintained by, endorsed by, sponsored by, or officially connected to government institutions or political organizations</strong>, including the Government of India, Parliament of India, Lok Sabha, Rajya Sabha, Election Commission of India, any State Government, Union Territory Administration, or political party.
            </p>
          </div>

          <div className="space-y-3 pt-4 pb-4">
            <p>
              SattaDarshan is an independent information platform that organizes and presents publicly available political, electoral, and legislative information for educational and research purposes.
            </p>
            <p>
              <strong>SattaDarshan does not replace official government websites.</strong> Information presented on this website should not be interpreted as an official government record, government communication, legal advice, or an official statement of any public authority.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <p className="font-medium text-foreground">
              For authoritative, current, and official information, please refer directly to the relevant official government or institutional sources:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
              <a 
                href="https://sansad.in/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted text-foreground transition-colors font-semibold"
              >
                <span>Parliament of India (Sansad.in)</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <a 
                href="https://www.eci.gov.in/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted text-foreground transition-colors font-semibold"
              >
                <span>Election Commission of India</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <a 
                href="https://loksabha.nic.in/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted text-foreground transition-colors font-semibold"
              >
                <span>Lok Sabha (Official Portal)</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
              <a 
                href="https://rajyasabha.nic.in/" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-muted/30 hover:bg-muted text-foreground transition-colors font-semibold"
              >
                <span>Rajya Sabha (Official Portal)</span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 sm:p-6 border-t border-border/70 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href="/disclaimer"
            onClick={handleAcknowledge}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors underline order-2 sm:order-1"
          >
            Read Complete Platform Disclaimer →
          </Link>
          <button
            ref={understandBtnRef}
            onClick={handleAcknowledge}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <Check className="h-4 w-4" />
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
