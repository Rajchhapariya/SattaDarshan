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

function isAllowedHost(hostname: string): boolean {
  return (
    ALLOWED_HOSTS.includes(hostname) ||
    hostname.endsWith(".wikimedia.org") ||
    hostname.endsWith(".wikipedia.org")
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

    if (!isAllowedHost(parsed.hostname)) {
      return new NextResponse("Host not permitted", { status: 403 });
    }

    // Fetch server-side where browser CORP (Cross-Origin-Resource-Policy) is not enforced
    const upstreamRes = await fetch(parsed.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 SattaDarshan/1.0",
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      next: { revalidate: 86400 }, // Cache on server for 24h
    });

    if (!upstreamRes.ok) {
      return new NextResponse("Failed to fetch upstream media", { status: upstreamRes.status });
    }

    const contentType = upstreamRes.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await upstreamRes.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Cross-Origin-Resource-Policy": "cross-origin",
      },
    });
  } catch (error) {
    console.error("Avatar proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
