
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const slug = (await params).slug;
  const p = await Politician.findOne({ slug }).lean() as any;
  if (!p) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (p.party) {
    const party = await Party.findOne({ slug: p.party }).lean() as any;
    if (party) p.partyName = party.name;
  }
  return NextResponse.json(p);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const body = await req.json();
  const update = { ...body };
  if (body.slug) update.slug = String(body.slug).trim();
  const slug = (await params).slug;
  const politician = await Politician.findOneAndUpdate({ slug }, update, { new: true }).lean();
  if (!politician) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(politician);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const slug = (await params).slug;
  await Politician.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
