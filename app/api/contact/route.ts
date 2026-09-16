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
        message: "Your message has been submitted successfully." 
      }, NO_STORE);
    }

    // 3. Input validation & sanitization
    const rawSubject = String(body.subject || "").trim().slice(0, 150);
    if (!rawSubject || rawSubject.length < 2) {
      return NextResponse.json({ error: "Please provide an inquiry subject (minimum 2 characters)." }, { status: 400, ...NO_STORE });
    }

    const rawMessage = String(body.message || "").trim().slice(0, 3000);
    if (!rawMessage || rawMessage.length < 10) {
      return NextResponse.json({ error: "Please enter your message (minimum 10 characters)." }, { status: 400, ...NO_STORE });
    }

    const rawEmail = String(body.userEmail || body.contactEmail || "").trim().slice(0, 120);
    let userEmail: string | undefined = undefined;
    if (rawEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(rawEmail)) {
        return NextResponse.json({ error: "Invalid email address format." }, { status: 400, ...NO_STORE });
      }
      userEmail = rawEmail;
    }

    // 4. Forward to private Google Spreadsheet via Google Apps Script Web App (NO MongoDB write)
    await sendToGoogleAppsScript({
      action: "contact",
      submittedAt: new Date().toISOString(),
      subject: rawSubject,
      message: rawMessage,
      userEmail: userEmail || "",
      status: "Unread",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been submitted successfully.",
      },
      NO_STORE
    );
  } catch {
    // Return sanitized generic message; never leak implementation, hostnames, or error stack traces
    return NextResponse.json(
      { error: "Unable to process message at this time. Please try again later." },
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

