import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendToGoogleAppsScript } from "@/lib/googleSheets";

// In-memory rate limiting tracker: ipHash -> array of timestamps
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 5;

function checkRateLimit(ipHash: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ipHash) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (validTimestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    rateLimitMap.set(ipHash, validTimestamps);
    return false;
  }
  
  validTimestamps.push(now);
  rateLimitMap.set(ipHash, validTimestamps);
  return true;
}

const NO_STORE = { headers: { "Cache-Control": "no-store, max-age=0" } };

export async function POST(req: NextRequest) {
  try {
    // 1. Guard against oversized payloads (64KB max)
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 65536) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413, ...NO_STORE }
      );
    }

    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                  req.headers.get("x-real-ip") || 
                  "127.0.0.1";
    
    // Hash the IP with salt to protect user privacy
    const ipHash = crypto
      .createHash("sha256")
      .update(rawIp + "satta_darshan_civic_salt")
      .digest("hex");

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions from this connection. Please try again in 15 minutes." },
        { status: 429, ...NO_STORE }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON format." },
        { status: 400, ...NO_STORE }
      );
    }

    // 2. Anti-spam honeypot verification
    // If the hidden 'website_trap' field is filled, bot detected. Silently succeed without storing.
    if (body.website_trap && String(body.website_trap).trim().length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Your correction has been submitted successfully. Thank you for helping improve the accuracy of Satta Darshan." 
      }, NO_STORE);
    }

    // 3. Input validation & sanitization
    const recordType = String(body.recordType || "").trim();
    if (!["politician", "party", "state", "general"].includes(recordType)) {
      return NextResponse.json({ error: "Invalid record category." }, { status: 400, ...NO_STORE });
    }

    const recordIdentifier = String(body.recordIdentifier || "").trim().slice(0, 150);
    if (!recordIdentifier || recordIdentifier.length < 2) {
      return NextResponse.json({ error: "Record identifier (name or slug) is required." }, { status: 400, ...NO_STORE });
    }

    const issueType = String(body.issueType || "").trim();
    if (!["outdated_info", "factual_error", "broken_link_image", "party_affiliation", "other"].includes(issueType)) {
      return NextResponse.json({ error: "Invalid issue classification." }, { status: 400, ...NO_STORE });
    }

    const description = String(body.description || "").trim().slice(0, 2000);
    if (!description || description.length < 10) {
      return NextResponse.json({ error: "Please provide a detailed description of the error (minimum 10 characters)." }, { status: 400, ...NO_STORE });
    }

    const suggestedCorrection = String(body.suggestedCorrection || "").trim().slice(0, 2000);
    if (!suggestedCorrection || suggestedCorrection.length < 5) {
      return NextResponse.json({ error: "Please provide the suggested factual correction (minimum 5 characters)." }, { status: 400, ...NO_STORE });
    }

    const rawSourceUrl = String(body.sourceUrl || "").trim().slice(0, 500);
    let sourceUrl: string | undefined = undefined;
    if (rawSourceUrl) {
      try {
        const parsed = new URL(rawSourceUrl);
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
          sourceUrl = parsed.toString();
        } else {
          return NextResponse.json({ error: "Source URL must use http or https protocol." }, { status: 400, ...NO_STORE });
        }
      } catch {
        return NextResponse.json({ error: "Invalid source URL format." }, { status: 400, ...NO_STORE });
      }
    }

    const rawEmail = String(body.contactEmail || "").trim().slice(0, 120);
    let contactEmail: string | undefined = undefined;
    if (rawEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawEmail)) {
        return NextResponse.json({ error: "Invalid contact email address format." }, { status: 400, ...NO_STORE });
      }
      contactEmail = rawEmail;
    }

    // 4. Forward to private Google Spreadsheet via Google Apps Script Web App (NO MongoDB write)
    await sendToGoogleAppsScript({
      action: "correction",
      submittedAt: new Date().toISOString(),
      correctionType: issueType,
      entityType: recordType,
      entitySlug: recordIdentifier,
      description,
      proposedCorrection: suggestedCorrection,
      sourceUrl: sourceUrl || "",
      userEmail: contactEmail || "",
      status: "Pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your correction has been submitted successfully. Thank you for helping improve the accuracy of Satta Darshan.",
      },
      NO_STORE
    );
  } catch {
    // Return sanitized generic message; never leak implementation, hostnames, or error stack traces
    return NextResponse.json(
      { error: "Unable to process correction at this time. Please try again later." },
      { status: 500, ...NO_STORE }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, ...NO_STORE }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, ...NO_STORE }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, ...NO_STORE }
  );
}

