import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Party from "@/models/Party";
import Politician from "@/models/Politician";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const cleanSlug = String(slug || "").trim().slice(0, 100);
    if (!cleanSlug) return NextResponse.json({ error: "Invalid party identifier" }, { status: 400 });

    const party = await Party.findOne({ slug: cleanSlug }).lean() as any;
    if (!party) return NextResponse.json({ error: "Party not found" }, { status: 404 });

    const leaders = await Politician.find({
      $or: [
        { party: cleanSlug },
        { party: party.abbr?.toLowerCase() },
        { partyName: party.name },
      ]
    })
      .select("name slug role photo constituency state party partyName")
      .limit(16)
      .lean();

    return NextResponse.json({ ...party, leaders });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH() {
  return NextResponse.json({ error: "Public mutation is disabled for security" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Public deletion is disabled for security" }, { status: 405 });
}