import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";

const ALLIANCE_COLORS: Record<string, string> = {
  "NDA": "#F59E0B",     // Saffron / Warm Amber
  "INDIA": "#2563EB",   // Democratic Blue
  "Others": "#10B981",  // Emerald / Slate Teal
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
  const chamber = searchParams.get("chamber") === "Rajya Sabha" ? "Rajya Sabha" : "Lok Sabha";

  const politicians = await Politician.find({ chamber })
    .select("name slug party partyName photo constituency state role")
    .sort({ state: 1, name: 1 })
    .lean();

  const parties = await Party.find().select("slug alliance seatsLokSabha seatsRajyaSabha").lean();
  const allianceMap: Record<string, string> = {};
  for (const p of parties) {
    if (p.slug && p.alliance) allianceMap[p.slug] = p.alliance;
  }

  // Count by alliance and party
  let ndaCount = 0;
  let indiaCount = 0;
  let othersCount = 0;

  const partyCounts: Record<string, { count: number; name: string; alliance: string }> = {};

  const rawSeats = politicians.map((p: any) => {
    let alliance = allianceMap[p.party] || "Others";
    // Check partyName heuristics if slug didn't match
    if (alliance === "Others") {
      const pn = (p.partyName || "").toUpperCase();
      if (["BJP", "TDP", "JD(U)", "JDU", "SHIV SENA", "SHS", "LJP", "JDS"].includes(pn)) alliance = "NDA";
      else if (["INC", "CONGRESS", "SP", "TMC", "DMK", "AAP", "JMM", "CPI(M)", "RJD"].includes(pn)) alliance = "INDIA";
    }

    if (alliance === "NDA") ndaCount++;
    else if (alliance === "INDIA") indiaCount++;
    else othersCount++;

    const pName = p.partyName || "Independent";
    if (!partyCounts[pName]) {
      partyCounts[pName] = { count: 0, name: pName, alliance };
    }
    partyCounts[pName].count++;

    return {
      name: p.name,
      slug: p.slug,
      partyName: p.partyName || "Independent",
      partySlug: p.party,
      alliance,
      color: ALLIANCE_COLORS[alliance] || "#64748B",
      photo: p.photo || "",
      constituency: p.constituency || "State Representative",
      state: p.state || "India",
    };
  });

  // Deterministic grouping: Alliance (NDA -> Others -> INDIA) -> Party -> Politician
  const allianceOrder: Record<string, number> = { NDA: 0, Others: 1, INDIA: 2 };
  rawSeats.sort((a, b) => {
    const aOrder = allianceOrder[a.alliance] ?? 1;
    const bOrder = allianceOrder[b.alliance] ?? 1;
    if (aOrder !== bOrder) return aOrder - bOrder;
    const partyDiff = a.partyName.localeCompare(b.partyName);
    if (partyDiff !== 0) return partyDiff;
    return a.name.localeCompare(b.name);
  });

  const seats = rawSeats.map((s, idx) => ({
    ...s,
    seatNumber: idx + 1,
  }));

  return NextResponse.json({
    chamber,
    totalSeats: chamber === "Lok Sabha" ? 543 : 245,
    activeSeats: seats.length,
    majorityThreshold: chamber === "Lok Sabha" ? 272 : 123,
    alliances: {
      NDA: { count: ndaCount, color: ALLIANCE_COLORS["NDA"] },
      INDIA: { count: indiaCount, color: ALLIANCE_COLORS["INDIA"] },
      Others: { count: othersCount, color: ALLIANCE_COLORS["Others"] },
    },
    partyBreakdown: Object.values(partyCounts).sort((a, b) => b.count - a.count),
    seats
  });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve parliament seats data", seats: [] },
      { status: 500 }
    );
  }
}
