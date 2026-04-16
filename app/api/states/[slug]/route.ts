import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import State from "@/models/State";

export async function GET(_: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const slug = params.slug;
  const state = await State.findOne({ slug }).lean();
  if (!state) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(state);
}

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const body = await req.json();
  const slug = params.slug;
  const state = await State.findOneAndUpdate({ slug }, body, { new: true }).lean();
  if (!state) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(state);
}

export async function DELETE(_: NextRequest, { params }: { params: { slug: string } }) {
  await connectDB();
  const slug = params.slug;
  await State.deleteOne({ slug });
  return NextResponse.json({ ok: true });
}
