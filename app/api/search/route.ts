import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ items: [] });

  const regex = { $regex: q, $options: "i" };
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
}
