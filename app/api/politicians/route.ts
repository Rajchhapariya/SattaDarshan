import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "24");
  const q = searchParams.get("q") ?? "";
  const role = searchParams.get("role") ?? "";
  const chamber = searchParams.get("chamber") ?? "";
  const party = searchParams.get("party") ?? "";
  const state = searchParams.get("state") ?? "";

  const filter: any = {};
  if (q) filter.$or = [
    { name: { $regex: q, $options: "i" } },
    { nameHindi: { $regex: q, $options: "i" } },
    { constituency: { $regex: q, $options: "i" } },
  ];
  if (role && role !== "All") {
    const roles = role.split(",").map((item) => item.trim()).filter(Boolean);
    filter.role = roles.length > 1 ? { $in: roles } : roles[0];
  }
  if (chamber && chamber !== "All") filter.chamber = chamber;
  if (party && party !== "All") filter.party = party;
  if (state && state !== "All") filter.state = state;

  const total = await Politician.countDocuments(filter);
  const politicians = await Politician.find(filter)
    .skip((page - 1) * limit).limit(limit).lean();

  return NextResponse.json({ politicians, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const name = String(body.name || "").trim();
  const slug = slugify(String(body.slug || name || `politician-${Date.now()}`));
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const politician = await Politician.create({
    slug,
    name,
    nameHindi: body.nameHindi,
    photo: body.photo,
    dob: body.dob,
    gender: body.gender,
    role: body.role,
    status: body.status || "Active",
    party: body.party,
    partyName: body.partyName,
    partyHindi: body.partyHindi,
    state: body.state,
    constituency: body.constituency,
    constituencyHindi: body.constituencyHindi,
    chamber: body.chamber,
    termStart: body.termStart,
    termEnd: body.termEnd,
    education: body.education,
    assets: body.assets,
    criminalCases: body.criminalCases ?? 0,
    bio: body.bio,
    bioHindi: body.bioHindi,
    socialLinks: body.socialLinks,
    tags: body.tags || [],
  });

  return NextResponse.json(politician);
}
