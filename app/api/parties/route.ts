import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import { escapeRegex } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

    const rawLimit = parseInt(searchParams.get("limit") ?? "50", 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 250) : 50;

    const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 80);
    const tier = (searchParams.get("tier") ?? "").trim();
    const alliance = (searchParams.get("alliance") ?? "").trim();

    const filter: any = {};
    if (rawQ) {
      const words = rawQ.split(/\s+/).filter(Boolean);
      if (words.length <= 1) {
        const safeQ = escapeRegex(rawQ);
        const regexObj = { $regex: safeQ, $options: "i" };
        filter.$or = [
          { name: regexObj },
          { abbr: regexObj },
          { slug: regexObj },
          { alliance: regexObj },
        ];
      } else {
        filter.$and = words.map((w) => {
          const regexObj = { $regex: escapeRegex(w), $options: "i" };
          return {
            $or: [
              { name: regexObj },
              { abbr: regexObj },
              { slug: regexObj },
              { alliance: regexObj },
            ],
          };
        });
      }
    }
    if (tier && tier !== "All") filter.tier = tier;
    if (alliance && alliance !== "All") filter.alliance = alliance;

    const total = await Party.countDocuments(filter);
    const parties = await Party.find(filter)
      .select("slug name nameHindi abbr tier status founded ideology president hq logo alliance seatsLokSabha seatsRajyaSabha website createdAt updatedAt")
      .sort({ seatsLokSabha: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const isFiltered = Boolean(rawQ || (tier && tier !== "All") || (alliance && alliance !== "All"));
    const cacheHeader = isFiltered
      ? "public, s-maxage=120, stale-while-revalidate=600"
      : "public, s-maxage=3600, stale-while-revalidate=86400";

    return NextResponse.json(
      {
        parties,
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
      },
      {
        headers: {
          "Cache-Control": cacheHeader,
        },
      }
    );
  } catch {
    return NextResponse.json(
      { parties: [], total: 0, page: 1, pages: 1, error: "Failed to retrieve parties" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Public mutation is disabled for security" },
    { status: 405 }
  );
}
