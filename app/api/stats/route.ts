import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";

export async function GET() {
  try {
    await connectDB();
    const [totalPoliticians, totalParties, totalStates, totalMPs, totalMinisters, totalCMs, totalPMs] = await Promise.all([
      Politician.countDocuments(),
      Party.countDocuments(),
      State.countDocuments(),
      Politician.countDocuments({ role: "MP" }),
      Politician.countDocuments({ role: "Minister" }),
      Politician.countDocuments({ role: "CM" }),
      Politician.countDocuments({ role: "PM" }),
    ]);
    return NextResponse.json(
      { totalPoliticians, totalParties, totalStates, totalMPs, totalMinisters, totalCMs, totalPMs },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { totalPoliticians: 0, totalParties: 0, totalStates: 0, totalMPs: 0, totalMinisters: 0, totalCMs: 0, totalPMs: 0 },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
