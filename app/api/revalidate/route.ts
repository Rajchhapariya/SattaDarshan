import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import crypto from "crypto";

/**
 * On-Demand Cache Invalidation Endpoint
 *
 * Allows verified data ingestion workflows and authorized administrative processes
 * to trigger instant revalidation of specific paths or cache tags when records change.
 *
 * Security:
 * - Requires server-configured REVALIDATE_SECRET environment variable
 * - Requires token in 'x-revalidate-secret' header (query parameters prohibited to prevent log leaks)
 * - Timing-safe token comparison to prevent side-channel analysis
 * - Request payload size bounding (16KB)
 * - Sanitized generic error responses (zero implementation/stack leakage)
 */

function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

const NO_STORE_HEADERS = { "Cache-Control": "no-store, max-age=0" };

export async function POST(req: NextRequest) {
  try {
    // 1. Guard against oversized payloads (16KB max)
    const contentLength = parseInt(req.headers.get("content-length") || "0", 10);
    if (contentLength > 16384) {
      return NextResponse.json(
        { error: "Payload too large." },
        { status: 413, headers: NO_STORE_HEADERS }
      );
    }

    // 2. Require secret in header only. Reject query parameter tokens to prevent URL/log exposure.
    const secret = req.headers.get("x-revalidate-secret")?.trim() || "";
    const configuredSecret = process.env.REVALIDATE_SECRET?.trim();

    // Constant-time comparison; return 401 if missing, unconfigured, or invalid
    if (!secret || !configuredSecret || !timingSafeCompare(secret, configuredSecret)) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid revalidation token." },
        { status: 401, headers: NO_STORE_HEADERS }
      );
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const rawPath = typeof body.path === "string" ? body.path.trim().slice(0, 256) : "";
    const rawTag = typeof body.tag === "string" ? body.tag.trim().slice(0, 128) : "";

    if (!rawPath && !rawTag) {
      return NextResponse.json(
        { error: "Missing path or tag parameter to revalidate." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const revalidated: string[] = [];

    if (rawPath) {
      revalidatePath(rawPath);
      revalidated.push(`path:${rawPath}`);
    }

    if (rawTag) {
      revalidateTag(rawTag, { expire: 0 });
      revalidated.push(`tag:${rawTag}`);
    }

    return NextResponse.json(
      {
        success: true,
        revalidated,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: NO_STORE_HEADERS,
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to process revalidation." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: "Method Not Allowed" },
    { status: 405, headers: NO_STORE_HEADERS }
  );
}

