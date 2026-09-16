import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

/**
 * On-Demand Cache Invalidation Endpoint
 *
 * Allows data ingestion scripts and administrators to trigger instant revalidation
 * of specific paths or cache tags when database records are updated.
 *
 * Usage:
 * POST /api/revalidate
 * Headers: { "x-revalidate-secret": process.env.REVALIDATE_SECRET }
 * Body: { path?: string, tag?: string }
 */
export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-revalidate-secret") || req.nextUrl.searchParams.get("secret");
    const configuredSecret = process.env.REVALIDATE_SECRET || "satta_revalidate_civic_key";

    if (!secret || secret !== configuredSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid revalidation token" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const targetPath = body.path || req.nextUrl.searchParams.get("path");
    const targetTag = body.tag || req.nextUrl.searchParams.get("tag");

    if (!targetPath && !targetTag) {
      return NextResponse.json(
        { error: "Missing path or tag parameter to revalidate" },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const revalidated: string[] = [];

    if (targetPath) {
      revalidatePath(targetPath);
      revalidated.push(`path:${targetPath}`);
    }

    if (targetTag) {
      revalidateTag(targetTag, { expire: 0 });
      revalidated.push(`tag:${targetTag}`);
    }

    return NextResponse.json(
      {
        success: true,
        revalidated,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to process revalidation" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
