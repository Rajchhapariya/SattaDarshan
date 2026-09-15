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
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), 250) : 24;

    const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 80);
    const role = (searchParams.get("role") ?? "").trim();
    const chamber = (searchParams.get("chamber") ?? "").trim();
    const party = (searchParams.get("party") ?? "").trim();
    const state = (searchParams.get("state") ?? "").trim();

    const filter: any = {};
    if (rawQ) {
      const safeQ = escapeRegex(rawQ);
      const regexObj = { $regex: safeQ, $options: "i" };
      filter.$or = [
        { name: regexObj },
        { slug: regexObj },
        { constituency: regexObj },
        { partyName: regexObj },
      ];
    }

    if (role && role !== "All") {
      const roles = role.split(",").map((item) => item.trim()).filter(Boolean);
      filter.role = roles.length > 1 ? { $in: roles } : roles[0];
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
      .select("slug name photo role status party partyName state constituency chamber education assets criminalCases createdAt updatedAt")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      politicians,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
    });
  } catch {
    return NextResponse.json(
      { politicians: [], total: 0, page: 1, pages: 1, error: "Failed to retrieve records" },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Public mutation is disabled for security" },
    { status: 405 }
  );
}
