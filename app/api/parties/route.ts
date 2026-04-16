
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const q = searchParams.get("q") ?? "";
  const tier = searchParams.get("tier") ?? "";

  const filter: any = {};
  if (q) filter.$or = [
    { name: { $regex: q, $options: "i" } },
    { abbr: { $regex: q, $options: "i" } },
  ];
  if (tier && tier !== "All") filter.tier = tier;

  const total = await Party.countDocuments(filter);
  const parties = await Party.find(filter)
    .skip((page - 1) * limit).limit(limit).lean();

  return NextResponse.json({ parties, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const party = await Party.create({
    slug: slugify(String(body.slug || name)),
    name,
    nameHindi: body.nameHindi,
    abbr: body.abbr,
    tier: body.tier,
    status: body.status || "Active",
    founded: body.founded,
    ideology: body.ideology,
    president: body.president,
    hq: body.hq,
    states: body.states || [],
    logo: body.logo,
    alliance: body.alliance,
    seatsLokSabha: body.seatsLokSabha,
    seatsRajyaSabha: body.seatsRajyaSabha,
    website: body.website,
    description: body.description,
  });
  return NextResponse.json(party);
}
