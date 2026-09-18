import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { escapeRegex } from "@/lib/utils";

const ALLOWED_SORTS = new Set([
  "name",
  "partyName",
  "state",
  "constituency",
  "role",
  "criminalCases",
  "createdAt",
]);

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    // Validate and clamp pagination
    const rawPage = parseInt(searchParams.get("page") ?? "1", 10);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;

    const rawLimit = parseInt(searchParams.get("limit") ?? "24", 10);
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 1000) : 24;

    const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 80);
    const role = (searchParams.get("role") ?? "").trim();
    const chamber = (searchParams.get("chamber") ?? "").trim();
    const party = (searchParams.get("party") ?? "").trim();
    const state = (searchParams.get("state") ?? "").trim();

    const filter: any = {};
    if (rawQ) {
      const words = rawQ.split(/\s+/).filter(Boolean);
      if (words.length === 1) {
        const safeQ = escapeRegex(words[0]);
        const regexObj = { $regex: safeQ, $options: "i" };
        filter.$or = [
          { name: regexObj },
          { slug: regexObj },
          { constituency: regexObj },
          { partyName: regexObj },
          { state: regexObj },
        ];
      } else {
        filter.$and = words.map((w) => {
          const regexObj = { $regex: escapeRegex(w), $options: "i" };
          return {
            $or: [
              { name: regexObj },
              { slug: regexObj },
              { constituency: regexObj },
              { partyName: regexObj },
              { state: regexObj },
            ],
          };
        });
      }
    }

    if (role && role !== "All") {
      const roles = role.split(",").map((item) => item.trim()).filter(Boolean);
      if (roles.includes("Minister")) {
        filter.$or = [
          { role: { $in: roles } },
          { ministerialRank: { $in: ["Prime Minister", "Cabinet Minister", "Minister of State (Independent Charge)", "Minister of State"] } }
        ];
      } else {
        filter.role = roles.length > 1 ? { $in: roles } : roles[0];
      }
    }
    if (chamber && chamber !== "All") filter.chamber = chamber;
    if (party && party !== "All") filter.party = party;
    if (state && state !== "All") filter.state = state;

    const reqSort = searchParams.get("sort") ?? "name";
    const sortField = ALLOWED_SORTS.has(reqSort) ? reqSort : "name";
    const sortOrder = searchParams.get("order") === "desc" ? -1 : 1;
    const sortObj: Record<string, 1 | -1> = { [sortField]: sortOrder };

    const total = await Politician.countDocuments(filter);
    const politicians = await Politician.find(filter)
      .select("slug name photo role currentOffice ministerialRank portfolios tenureStatus verificationStatus status party partyName state constituency chamber education assets criminalCases createdAt updatedAt")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const isFiltered = Boolean(rawQ || (role && role !== "All") || (chamber && chamber !== "All") || (party && party !== "All") || (state && state !== "All"));
    const cacheHeader = isFiltered
      ? "public, s-maxage=60, stale-while-revalidate=300"
      : "public, s-maxage=300, stale-while-revalidate=1800";

    return NextResponse.json(
      {
        politicians,
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
      { politicians: [], total: 0, page: 1, pages: 1, error: "Failed to retrieve records" },
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
