import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, EyeOff, Server, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy & Data Protection Practices",
  description: "Transparent documentation of privacy controls, minimal data collection, cookie usage, and security practices on SattaDarshan.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-semibold">Privacy Policy</span>
      </nav>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
          <Shield className="h-3.5 w-3.5" /> Civic Privacy & Minimal Data Policy
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SattaDarshan operates as an open civic information repository. We believe public democratic data should be freely accessible without tracking citizens. This policy accurately documents what minimal technical data is handled when you browse the portal.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <EyeOff className="h-4 w-4 text-emerald-600" />
            1. Zero Behavioral Tracking & No Commercial Pixels
          </h2>
          <p>
            SattaDarshan does not employ third-party advertising trackers, cross-site profiling cookies, or behavioral marketing beacons. We do not sell, rent, monetize, or trade visitor information with commercial brokers or ad exchanges.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-600" />
            2. Local Browser Storage & Cookie Usage
          </h2>
          <p>
            SattaDarshan uses browser local storage exclusively for essential user interface preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>
              <strong>Theme Preference:</strong> We store your selected visual appearance (Light Mode or Dark Mode) locally on your device via <code>theme</code> in local storage so that your preference persists between visits.
            </li>
            <li>
              <strong>No Session or Tracking Cookies:</strong> The public portal does not issue tracking cookies or persistent device fingerprinting tokens.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-600" />
            3. Information Collected via the Correction Form
          </h2>
          <p>
            When you voluntarily submit an error report or factual update via our <Link href="/corrections" className="text-primary hover:underline">Correction Form</Link>, the following information is processed:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2 text-xs">
            <li>
              <strong>Report Details:</strong> The record category, record identifier, nature of the issue, factual description, and supporting primary source URL.
            </li>
            <li>
              <strong>Optional Contact Email:</strong> You may optionally provide an email address if you wish to receive verification feedback. Providing an email is entirely voluntary and is used solely for editorial follow-up regarding that specific submission.
            </li>
            <li>
              <strong>Cryptographic IP Hash for Abuse Prevention:</strong> To protect our servers against automated spam and denial-of-service floods, incoming submission IP addresses are passed through a one-way cryptographic SHA-256 hash function. The raw IP address is not stored in plain text.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" />
            4. Statutory Rights & Data Inquiries
          </h2>
          <p>
            Because SattaDarshan displays public records of elected representatives and candidates filed pursuant to statutory election laws (Conduct of Elections Rules, 1961), public biographical and legislative records are presented in accordance with statutory open governance principles.
          </p>
          <p>
            For privacy inquiries or technical data requests regarding user-submitted correction logs, please contact our editorial desk via our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
