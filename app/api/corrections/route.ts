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

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                  req.headers.get("x-real-ip") || 
                  "127.0.0.1";
    
    // Hash the IP with salt to protect privacy
    const ipHash = crypto
      .createHash("sha256")
      .update(rawIp + "satta_darshan_civic_salt")
      .digest("hex");

    const NO_STORE = { headers: { "Cache-Control": "no-store, max-age=0" } };

    if (!checkRateLimit(ipHash)) {
      return NextResponse.json(
        { error: "Too many submissions from this connection. Please try again in 15 minutes." },
        { status: 429, ...NO_STORE }
      );
    }

    const body = await req.json();

    // 1. Anti-spam honeypot verification
    // If the hidden 'website_trap' field is filled, bot detected. Silently succeed without storing.
    if (body.website_trap && String(body.website_trap).trim().length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Your correction has been submitted successfully. Thank you for helping improve the accuracy of Satta Darshan." 
      }, NO_STORE);
    }

    // 2. Input validation
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

    // 3. Forward to private Google Spreadsheet via Google Apps Script Web App (NO MongoDB)
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
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while saving the correction report." },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
