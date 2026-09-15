import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";
import { escapeRegex } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawQ = (searchParams.get("q") || "").trim();
    if (!rawQ) return NextResponse.json({ items: [] });

    // Clamp search query length to 80 chars to prevent ReDoS / CPU abuse
    const q = rawQ.slice(0, 80);
    const safeRegex = escapeRegex(q);
    const regex = { $regex: safeRegex, $options: "i" };
  const [politicians, parties, states] = await Promise.all([
    Politician.find({
      $or: [{ name: regex }, { constituency: regex }, { state: regex }]
    }).select("name slug role partyName state constituency photo").limit(8).lean(),
    Party.find({
      $or: [{ name: regex }, { abbr: regex }]
    }).select("name abbr slug logo alliance").limit(6).lean(),
    State.find({ name: regex }).select("name slug capital rulingParty").limit(6).lean(),
  ]);

  const items = [
    ...politicians.map((p: any) => ({
      type: "politician",
      label: p.name,
      sub: `${p.role || "Leader"} • ${p.partyName || "Independent"} (${p.constituency || p.state || ""})`.trim(),
      href: `/politicians/${p.slug}`,
      photo: p.photo
    })),
    ...parties.map((p: any) => ({
      type: "party",
      label: `${p.name} ${p.abbr ? `(${p.abbr})` : ""}`,
      sub: `${p.alliance || "National/State"} Party`,
      href: `/parties/${p.slug}`,
      logo: p.logo
    })),
    ...states.map((s: any) => ({
      type: "state",
      label: s.name,
      sub: `State/UT • Capital: ${s.capital || "N/A"}`,
      href: `/states/${s.slug}`
    })),
  ];
  return NextResponse.json({ items: items.slice(0, 15) });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
