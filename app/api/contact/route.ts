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
        message: "Your message has been submitted successfully." 
      }, NO_STORE);
    }

    // 2. Input validation
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

    // 3. Forward to private Google Spreadsheet via Google Apps Script Web App (NO MongoDB)
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
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "An unexpected error occurred while processing your message." },
      { status: 500, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
