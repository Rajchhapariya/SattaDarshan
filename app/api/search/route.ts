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
    const lowerQ = q.toLowerCase();
    const safeRegex = escapeRegex(q);
    const regex = { $regex: safeRegex, $options: "i" };

    // 1. Check for Parliament chamber matches
    const chamberMatches: any[] = [];
    if (/^(18th\s*)?lok(\s*sabha)?|lower\s*house|sansad/i.test(lowerQ)) {
      chamberMatches.push({
        type: "chamber",
        label: "18th Lok Sabha Directory",
        sub: "Lower House of Parliament • 543 Constituencies",
        href: "/parliament/lok-sabha",
      });
    }
    if (/^rajya(\s*sabha)?|upper\s*house|council\s*of\s*states/i.test(lowerQ)) {
      chamberMatches.push({
        type: "chamber",
        label: "Rajya Sabha Registry",
        sub: "Upper House of Parliament • 245 Members",
        href: "/parliament/rajya-sabha",
      });
    }

    // 2. Fetch database entities
    const [politicians, parties, states] = await Promise.all([
      Politician.find({
        $or: [
          { name: regex },
          { constituency: regex },
          { state: regex },
          { partyName: regex },
        ],
      })
        .select("name slug role partyName state constituency photo")
        .limit(10)
        .lean(),

      Party.find({
        $or: [
          { name: regex },
          { abbr: regex },
          { alliance: regex },
        ],
      })
        .select("name abbr slug logo alliance totalSeats")
        .limit(6)
        .lean(),

      State.find({
        $or: [
          { name: regex },
          { capital: regex },
          { cm: regex },
        ],
      })
        .select("name slug capital rulingParty totalLokSabhaSeats")
        .limit(6)
        .lean(),
    ]);

    // 3. Priority Sorting: Prioritize exact matches and prefix matches
    const politicianItems = politicians.map((p: any) => {
      const isExact = p.name.toLowerCase() === lowerQ;
      const isPrefix = p.name.toLowerCase().startsWith(lowerQ);
      return {
        item: {
          type: "politician" as const,
          label: p.name,
          sub: `${p.role || "Leader"} • ${p.partyName || "Independent"} (${p.constituency || p.state || "India"})`.trim(),
          href: `/politicians/${p.slug}`,
          photo: p.photo,
        },
        priority: isExact ? 100 : isPrefix ? 50 : 10,
      };
    });

    const partyItems = parties.map((p: any) => {
      const isExact = p.name.toLowerCase() === lowerQ || p.abbr?.toLowerCase() === lowerQ;
      const isPrefix = p.name.toLowerCase().startsWith(lowerQ) || p.abbr?.toLowerCase().startsWith(lowerQ);
      return {
        item: {
          type: "party" as const,
          label: `${p.name} ${p.abbr ? `(${p.abbr})` : ""}`.trim(),
          sub: `${p.alliance || "Independent/Regional"} Alliance • ${p.totalSeats || 0} Seats`,
          href: `/parties/${p.slug}`,
          logo: p.logo,
        },
        priority: isExact ? 95 : isPrefix ? 45 : 8,
      };
    });

    const stateItems = states.map((s: any) => {
      const isExact = s.name.toLowerCase() === lowerQ;
      const isPrefix = s.name.toLowerCase().startsWith(lowerQ);
      return {
        item: {
          type: "state" as const,
          label: s.name,
          sub: `State/UT • Capital: ${s.capital || "N/A"}${s.totalLokSabhaSeats ? ` • ${s.totalLokSabhaSeats} LS Seats` : ""}`,
          href: `/states/${s.slug}`,
        },
        priority: isExact ? 90 : isPrefix ? 40 : 6,
      };
    });

    // Combine and sort by relevance priority
    const combinedEntities = [...politicianItems, ...partyItems, ...stateItems]
      .sort((a, b) => b.priority - a.priority)
      .map((entry) => entry.item);

    const items = [...chamberMatches, ...combinedEntities].slice(0, 16);

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 500 });
  }
}
