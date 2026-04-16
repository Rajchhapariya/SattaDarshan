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
    Politician.find({ name: regex }).select("name slug role").limit(8).lean(),
    Party.find({ name: regex }).select("name slug").limit(6).lean(),
    State.find({ name: regex }).select("name slug").limit(6).lean(),
  ]);

  const items = [
    ...politicians.map((p: any) => ({ type: "politician", label: p.name, sub: p.role || "Politician", href: `/politicians/${p.slug}` })),
    ...parties.map((p: any) => ({ type: "party", label: p.name, sub: "Party", href: `/parties/${p.slug}` })),
    ...states.map((s: any) => ({ type: "state", label: s.name, sub: "State", href: `/states/${s.slug}` })),
  ];
  return NextResponse.json({ items: items.slice(0, 12) });
}
