import { NextRequest, NextResponse } from "next/server";

// Allowlisted hostnames for media proxy to prevent SSRF
const ALLOWED_HOSTS = [
  "sansad.in",
  "loksabhaph.nic.in",
  "upload.wikimedia.org",
  "commons.wikimedia.org",
  "thumb.wikimedia.org",
  "res.cloudinary.com",
];

// Permitted safe raster image MIME types (SVG excluded to prevent script execution/XSS smuggling)
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

function isAllowedHost(hostname: string): boolean {
  const lower = hostname.toLowerCase();
  return (
    ALLOWED_HOSTS.includes(lower) ||
    lower.endsWith(".wikimedia.org") ||
    lower.endsWith(".wikipedia.org")
  );
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get("url");

    if (!targetUrl) {
      return new NextResponse("Missing url parameter", { status: 400 });
    }

    let parsed: URL;
    try {
      parsed = new URL(targetUrl);
    } catch {
      return new NextResponse("Invalid URL", { status: 400 });
    }

    // Require strict HTTPS protocol
    if (parsed.protocol !== "https:") {
      return new NextResponse("HTTPS protocol required", { status: 400 });
    }

    if (!isAllowedHost(parsed.hostname)) {
      return new NextResponse("Host not permitted", { status: 403 });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    // Fetch server-side where browser CORP (Cross-Origin-Resource-Policy) is not enforced
    const upstreamRes = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SattaDarshan/1.0",
        Accept: "image/avif,image/webp,image/apng,image/*;q=0.8",
      },
      signal: controller.signal,
      next: { revalidate: 86400 }, // Cache on server for 24h
    });

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      return new NextResponse("Failed to fetch upstream media", { status: upstreamRes.status });
    }

    const rawContentType = (upstreamRes.headers.get("content-type") || "").toLowerCase().split(";")[0].trim();
    if (!ALLOWED_MIME_TYPES.has(rawContentType)) {
      return new NextResponse("Unsupported media format", { status: 415 });
    }

    const imageBuffer = await upstreamRes.arrayBuffer();

    // Guard against oversized media (10MB max)
    if (imageBuffer.byteLength > 10 * 1024 * 1024) {
      return new NextResponse("Media payload too large", { status: 413 });
    }

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": rawContentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Cross-Origin-Resource-Policy": "cross-origin",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
      },
    });
  } catch {
    return new NextResponse("Unable to retrieve requested media", { status: 500 });
  }
}

