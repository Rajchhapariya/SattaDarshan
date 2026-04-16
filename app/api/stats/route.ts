
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Politician from "@/models/Politician";
import Party from "@/models/Party";
import State from "@/models/State";

export async function GET() {
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
  return NextResponse.json({ totalPoliticians, totalParties, totalStates, totalMPs, totalMinisters, totalCMs, totalPMs });
}
