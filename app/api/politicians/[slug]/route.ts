import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const cleanSlug = String(slug || "").trim().slice(0, 100);
    if (!cleanSlug) return NextResponse.json({ error: "Invalid record identifier" }, { status: 400 });

    const p = await Politician.findOne({ slug: cleanSlug }).lean() as any;
    if (!p) return NextResponse.json({ error: "Record not found" }, { status: 404 });

    if (p.party) {
      const party = await Party.findOne({ slug: p.party }).select("name abbr logo alliance").lean() as any;
      if (party) {
        p.partyName = party.name;
        p.partyLogo = party.logo;
        p.partyAbbr = party.abbr;
      }
    }
    return NextResponse.json(p);
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
