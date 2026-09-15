import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import State from "@/models/State";
import { escapeRegex } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const rawQ = (searchParams.get("q") ?? "").trim().slice(0, 80);

    const filter: any = {};
    if (rawQ) {
      const safeQ = escapeRegex(rawQ);
      const regexObj = { $regex: safeQ, $options: "i" };
      filter.$or = [
        { name: regexObj },
        { slug: regexObj },
      ];
    }

    const states = await State.find(filter)
      .select("slug name capital region rulingParty rulingPartySlug cm cmSlug totalAssemblySeats totalLokSabhaSeats createdAt updatedAt")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(states);
  } catch {
    return NextResponse.json({ error: "Failed to retrieve states" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json(
    { error: "Public mutation is disabled for security" },
    { status: 405 }
  );
}
