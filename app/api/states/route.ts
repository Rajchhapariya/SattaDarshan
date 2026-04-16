import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import State from "@/models/State";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const filter: any = {};
  if (q) filter.$or = [
    { name: { $regex: q, $options: "i" } },
    { slug: { $regex: q, $options: "i" } },
  ];
  const states = await State.find(filter).sort({ name: 1 }).lean();
  return NextResponse.json(states);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const state = await State.create({
    slug: slugify(String(body.slug || name)),
    name,
    capital: body.capital,
    region: body.region,
    rulingParty: body.rulingParty,
    rulingPartySlug: body.rulingPartySlug,
    cm: body.cm,
    cmSlug: body.cmSlug,
    totalAssemblySeats: body.totalAssemblySeats,
    totalLokSabhaSeats: body.totalLokSabhaSeats,
  });
  return NextResponse.json(state);
}
