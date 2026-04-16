
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import Politician from "@/models/Politician";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const slug = (await params).slug;
  const party = await Party.findOne({ slug }).lean() as any;
  if (!party) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const leaders = await Politician.find({ party: slug }).limit(12).lean();
  return NextResponse.json({ ...party, leaders });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const body = await req.json();
  const update = { ...body };
  if (body.logo) update.logo = String(body.logo).trim();
  const slug = (await params).slug;
  const party = await Party.findOneAndUpdate({ slug }, update, { new: true }).lean();
  if (!party) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(party);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB();
  const slug = (await params).slug;
  await Party.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
