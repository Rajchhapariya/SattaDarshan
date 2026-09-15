import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import State from "@/models/State";

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;
    const cleanSlug = String(slug || "").trim().slice(0, 100);
    if (!cleanSlug) return NextResponse.json({ error: "Invalid state identifier" }, { status: 400 });

    const state = await State.findOne({ slug: cleanSlug }).lean();
    if (!state) return NextResponse.json({ error: "State not found" }, { status: 404 });
    return NextResponse.json(state);
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
